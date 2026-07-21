import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Reminder runner — invoked by pg_cron every hour.
 *
 * Trigger 2: No qualification after 2 days → reminder, cap 3 → Dormant
 * Trigger 4: Booking link sent, no booking after 2 days → reminder, cap 3 → Dormant
 * Trigger 10: Payment unpaid 2 days after Sent → reminder, cap 3 → Overdue
 *
 * Cap: reminder_count >= 3 falls back to terminal/overdue + manual task.
 * Cooldown: only fire if last_reminder_sent_at is null OR > 2 days ago.
 */

const TWO_DAYS_MS = 2 * 86_400_000;
const REMINDER_CAP = 3;

function twoDaysAgoISO() {
  return new Date(Date.now() - TWO_DAYS_MS).toISOString();
}

type ReminderKind = "qualification_reminder" | "booking_reminder" | "payment_reminder";

async function logRun(
  applicationId: string,
  key: string,
  outcome: string,
  payload?: Record<string, unknown>,
) {
  await supabaseAdmin.from("automation_runs").insert([
    {
      application_id: applicationId,
      automation_key: key,
      outcome,
      payload: (payload ?? null) as never,
    },
  ]);
}

async function recordReminder(
  applicationId: string,
  contactId: string,
  kind: ReminderKind,
  newCount: number,
) {
  await supabaseAdmin
    .from("applications")
    .update({
      reminder_count: newCount,
      last_reminder_sent_at: new Date().toISOString(),
    })
    .eq("id", applicationId);

  await supabaseAdmin.from("activities").insert({
    application_id: applicationId,
    contact_id: contactId,
    type: "reminder_sent",
    body: `${kind.replace(/_/g, " ")} (${newCount}/${REMINDER_CAP})`,
    is_system: true,
  });
}

async function fallbackToDormant(applicationId: string, contactId: string, reason: string) {
  await supabaseAdmin
    .from("applications")
    .update({ pipeline_stage: "dormant" })
    .eq("id", applicationId);

  await supabaseAdmin.from("activities").insert({
    application_id: applicationId,
    contact_id: contactId,
    type: "stage_changed",
    body: `Auto-moved to Dormant — ${reason}`,
    is_system: true,
  });

  await supabaseAdmin.from("tasks").insert({
    application_id: applicationId,
    contact_id: contactId,
    title: `Manual follow-up: ${reason}`,
    description: "Reminder cap reached. Reach out personally before closing.",
  });

  await notifyAllStaff({
    type: "reminder_cap_reached",
    title: "Application moved to Dormant",
    body: reason,
    link: `/applications/${applicationId}`,
  });
}

async function fallbackToOverdue(applicationId: string, contactId: string) {
  await supabaseAdmin
    .from("applications")
    .update({ payment_status: "overdue" })
    .eq("id", applicationId);

  await supabaseAdmin.from("activities").insert({
    application_id: applicationId,
    contact_id: contactId,
    type: "payment_marked",
    body: "Auto-marked Overdue after 3 reminders",
    is_system: true,
  });

  await supabaseAdmin.from("tasks").insert({
    application_id: applicationId,
    contact_id: contactId,
    title: "Manual follow-up: payment overdue",
    description: "Payment reminder cap reached. Personal follow-up required.",
  });

  await notifyAllStaff({
    type: "payment_overdue",
    title: "Payment overdue — manual follow-up",
    body: "Reminder cap reached on a Sent payment.",
    link: `/applications/${applicationId}`,
  });
}

async function notifyAllStaff(n: { type: string; title: string; body: string; link: string }) {
  const { data: staff } = await supabaseAdmin.from("user_roles").select("user_id");
  if (!staff || staff.length === 0) return;
  const seen = new Set<string>();
  const rows = staff
    .filter((s) => {
      if (seen.has(s.user_id)) return false;
      seen.add(s.user_id);
      return true;
    })
    .map((s) => ({ ...n, user_id: s.user_id }));
  if (rows.length > 0) await supabaseAdmin.from("notifications").insert(rows);
}

async function runQualificationReminders(): Promise<{ fired: number; dormant: number }> {
  const cutoff = twoDaysAgoISO();
  // Apps that have a token, no submission, in awaiting_qualification stage,
  // created >2d ago AND (no last reminder OR last reminder >2d ago)
  const { data, error } = await supabaseAdmin
    .from("applications")
    .select("id, contact_id, reminder_count, last_reminder_sent_at, created_at")
    .eq("pipeline_stage", "awaiting_qualification")
    .is("qualification_submitted_at", null)
    .not("qualification_token", "is", null)
    .lte("created_at", cutoff);
  if (error || !data) return { fired: 0, dormant: 0 };

  let fired = 0;
  let dormant = 0;
  for (const a of data) {
    if (a.last_reminder_sent_at && a.last_reminder_sent_at > cutoff) continue;
    if (a.reminder_count >= REMINDER_CAP) {
      await fallbackToDormant(a.id, a.contact_id, "no qualification submitted after 3 reminders");
      await logRun(a.id, "qualification_reminder", "fallback_dormant");
      dormant++;
      continue;
    }
    const next = a.reminder_count + 1;
    await recordReminder(a.id, a.contact_id, "qualification_reminder", next);
    await logRun(a.id, "qualification_reminder", "fired", { attempt: next });
    fired++;
  }
  return { fired, dormant };
}

async function runBookingReminders(): Promise<{ fired: number; dormant: number }> {
  const cutoff = twoDaysAgoISO();
  const { data, error } = await supabaseAdmin
    .from("applications")
    .select("id, contact_id, reminder_count, last_reminder_sent_at, booking_url_sent_at")
    .eq("pipeline_stage", "awaiting_interview_booking")
    .is("booking_confirmed_at", null)
    .not("booking_url_sent_at", "is", null)
    .lte("booking_url_sent_at", cutoff);
  if (error || !data) return { fired: 0, dormant: 0 };

  let fired = 0;
  let dormant = 0;
  for (const a of data) {
    if (a.last_reminder_sent_at && a.last_reminder_sent_at > cutoff) continue;
    if (a.reminder_count >= REMINDER_CAP) {
      await fallbackToDormant(a.id, a.contact_id, "no interview booked after 3 reminders");
      await logRun(a.id, "booking_reminder", "fallback_dormant");
      dormant++;
      continue;
    }
    const next = a.reminder_count + 1;
    await recordReminder(a.id, a.contact_id, "booking_reminder", next);
    await logRun(a.id, "booking_reminder", "fired", { attempt: next });
    fired++;
  }
  return { fired, dormant };
}

async function runPaymentReminders(): Promise<{ fired: number; overdue: number }> {
  const cutoff = twoDaysAgoISO();
  const { data, error } = await supabaseAdmin
    .from("applications")
    .select("id, contact_id, reminder_count, last_reminder_sent_at, payment_sent_at")
    .eq("payment_status", "sent")
    .not("payment_sent_at", "is", null)
    .lte("payment_sent_at", cutoff);
  if (error || !data) return { fired: 0, overdue: 0 };

  let fired = 0;
  let overdue = 0;
  for (const a of data) {
    if (a.last_reminder_sent_at && a.last_reminder_sent_at > cutoff) continue;
    if (a.reminder_count >= REMINDER_CAP) {
      await fallbackToOverdue(a.id, a.contact_id);
      await logRun(a.id, "payment_reminder", "fallback_overdue");
      overdue++;
      continue;
    }
    const next = a.reminder_count + 1;
    await recordReminder(a.id, a.contact_id, "payment_reminder", next);
    await logRun(a.id, "payment_reminder", "fired", { attempt: next });
    fired++;
  }
  return { fired, overdue };
}

export const Route = createFileRoute("/hooks/run-reminders")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const auth = request.headers.get("authorization");
          const expected = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
          if (!auth || !expected || auth !== `Bearer ${expected}`) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          const startedAt = new Date().toISOString();
          const [q, b, p] = await Promise.all([
            runQualificationReminders(),
            runBookingReminders(),
            runPaymentReminders(),
          ]);

          return new Response(
            JSON.stringify({
              ok: true,
              started_at: startedAt,
              finished_at: new Date().toISOString(),
              qualification: q,
              booking: b,
              payment: p,
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        } catch (err) {
          console.warn("run-reminders temporarily disabled", err);
          return new Response(
            JSON.stringify({
              ok: true,
              skipped: true,
              warning:
                "Temporary mode: reminders are disabled until full Supabase server credentials are restored.",
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
