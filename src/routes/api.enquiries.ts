import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendMassEmail } from "@/lib/mass-email";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  course_id: z.string().uuid().optional().or(z.literal("")),
  form_id: z.string().uuid().optional().or(z.literal("")),
  interest_type: z.enum(["enquiry", "enrolment", "scholarship", "other"]).optional(),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  company: z.string().max(0).optional().or(z.literal("")),
});

const TERMINAL = ["enrolled", "dormant"] as const;

type LocalContact = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  source: string;
  website: string | null;
};

type LocalApplication = {
  id: string;
  contact_id: string;
  course_id: string | null;
  pipeline_stage: string;
  message: string | null;
  qualification_token: string;
  qualification_token_expires_at: string;
  is_possible_duplicate: boolean;
};

const LOCAL_CONTACTS = new Map<string, LocalContact>();
const LOCAL_APPLICATIONS: LocalApplication[] = [];

// Naive in-memory rate limiting per IP (best-effort; resets on cold start)
const RATE_LIMIT = new Map<string, { count: number; reset: number }>();
const LIMIT = 5;
const WINDOW_MS = 60_000;

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = RATE_LIMIT.get(ip);
  if (!entry || entry.reset < now) {
    RATE_LIMIT.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > LIMIT;
}

function token() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

function localId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function enquiryEmailContent(args: {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  interestType: string;
  message?: string;
  sourceLabel: string;
  applicationId: string;
}) {
  const safeName = escapeHtml(args.name);
  const safeEmail = escapeHtml(args.email);
  const safePhone = escapeHtml(args.phone || "-");
  const safeCountry = escapeHtml(args.country || "-");
  const safeInterest = escapeHtml(args.interestType);
  const safeSource = escapeHtml(args.sourceLabel);
  const safeMessage = escapeHtml(args.message || "-");

  return {
    subject: `New enquiry: ${args.name} (${args.interestType})`,
    text: [
      `New enquiry received`,
      ``,
      `Name: ${args.name}`,
      `Email: ${args.email}`,
      `Phone: ${args.phone || "-"}`,
      `Country: ${args.country || "-"}`,
      `Interest type: ${args.interestType}`,
      `Source: ${args.sourceLabel}`,
      `Application ID: ${args.applicationId}`,
      `Message: ${args.message || "-"}`,
    ].join("\n"),
    html: `
      <h2>New enquiry received</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Phone:</strong> ${safePhone}</p>
      <p><strong>Country:</strong> ${safeCountry}</p>
      <p><strong>Interest type:</strong> ${safeInterest}</p>
      <p><strong>Source:</strong> ${safeSource}</p>
      <p><strong>Application ID:</strong> ${args.applicationId}</p>
      <p><strong>Message:</strong><br/>${safeMessage}</p>
    `.trim(),
  };
}

export const Route = createFileRoute("/api/enquiries")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }),

      POST: async ({ request }) => {
        const corsHeaders = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        };

        const ip =
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          request.headers.get("cf-connecting-ip") ??
          "unknown";

        if (rateLimited(ip)) {
          return new Response(JSON.stringify({ error: "Too many requests" }), {
            status: 429,
            headers: corsHeaders,
          });
        }

        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers: corsHeaders,
          });
        }

        const parsed = schema.safeParse(raw);
        if (!parsed.success) {
          return new Response(
            JSON.stringify({ error: "Validation failed", details: parsed.error.issues }),
            { status: 400, headers: corsHeaders },
          );
        }

        // Honeypot triggered -> fake success
        if (parsed.data.company && parsed.data.company.length > 0) {
          return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
        }

        const data = parsed.data;
        const email = data.email.toLowerCase();
        const interestType = data.interest_type ?? "enquiry";

        try {
          // Resolve form (if provided) to get default course + source label + website
          let formRecord: {
            id: string;
            name: string;
            course_id: string | null;
            website: string | null;
          } | null = null;
          let sourceLabel = "public_enquiry";
          let website: string | null = null;
          if (data.form_id) {
            const { data: f } = await supabaseAdmin
              .from("forms")
              .select("id, name, course_id, is_active, website")
              .eq("id", data.form_id)
              .maybeSingle();
            if (f && f.is_active) {
              formRecord = { id: f.id, name: f.name, course_id: f.course_id, website: f.website };
              sourceLabel = `form:${f.name}`;
              website = f.website;
            }
          }
          const courseId = data.course_id || formRecord?.course_id || null;

          // Find or create contact
          const { data: existingContact } = await supabaseAdmin
            .from("contacts")
            .select("id")
            .eq("email", email)
            .maybeSingle();

          let contactId: string;
          if (existingContact) {
            contactId = existingContact.id;
            await supabaseAdmin
              .from("contacts")
              .update({
                name: data.name,
                phone: data.phone || null,
                country: data.country || null,
                ...(website ? { website } : {}),
              })
              .eq("id", contactId);
          } else {
            const { data: newContact, error: cErr } = await supabaseAdmin
              .from("contacts")
              .insert({
                name: data.name,
                email,
                phone: data.phone || null,
                country: data.country || null,
                source: sourceLabel,
                website,
              })
              .select("id")
              .single();
            if (cErr || !newContact) {
              throw cErr ?? new Error("Could not create contact");
            }
            contactId = newContact.id;
          }

          // Deterministic dedupe: open application for same course?
          let isPossibleDuplicate = false;
          if (courseId) {
            const { data: openApps } = await supabaseAdmin
              .from("applications")
              .select("id")
              .eq("contact_id", contactId)
              .eq("course_id", courseId)
              .not("pipeline_stage", "in", `(${TERMINAL.map((t) => `"${t}"`).join(",")})`);
            if (openApps && openApps.length > 0) {
              isPossibleDuplicate = true;
              await supabaseAdmin
                .from("applications")
                .update({ is_possible_duplicate: true })
                .eq("id", openApps[0].id);
              await supabaseAdmin.from("activities").insert({
                application_id: openApps[0].id,
                contact_id: contactId,
                type: "repeat_enquiry",
                body: `Repeat enquiry received via ${sourceLabel}: ${interestType}${data.message ? ` — ${data.message}` : ""}`,
                is_system: true,
              });
              if (formRecord) {
                const { data: cur } = await supabaseAdmin
                  .from("forms")
                  .select("submission_count")
                  .eq("id", formRecord.id)
                  .maybeSingle();
                await supabaseAdmin
                  .from("forms")
                  .update({ submission_count: (cur?.submission_count ?? 0) + 1 })
                  .eq("id", formRecord.id);
              }
              return new Response(JSON.stringify({ ok: true, duplicate: true }), {
                status: 200,
                headers: corsHeaders,
              });
            }
          }

          const qualToken = token();
          const expiry = new Date(Date.now() + 30 * 86400_000).toISOString();
          const { data: newApp, error: aErr } = await supabaseAdmin
            .from("applications")
            .insert({
              contact_id: contactId,
              course_id: courseId,
              form_id: formRecord?.id ?? null,
              pipeline_stage: "new_enquiry",
              message: data.message || null,
              qualification_token: qualToken,
              qualification_token_expires_at: expiry,
              is_possible_duplicate: isPossibleDuplicate,
            })
            .select("id")
            .single();
          if (aErr || !newApp) {
            throw aErr ?? new Error("Could not create application");
          }

          await supabaseAdmin.from("activities").insert({
            application_id: newApp.id,
            contact_id: contactId,
            type: "enquiry_received",
            body: `New enquiry via ${sourceLabel} (${interestType})${data.message ? `: ${data.message}` : ""}`,
            is_system: true,
          });

          if (formRecord) {
            const { data: cur } = await supabaseAdmin
              .from("forms")
              .select("submission_count")
              .eq("id", formRecord.id)
              .maybeSingle();
            await supabaseAdmin
              .from("forms")
              .update({ submission_count: (cur?.submission_count ?? 0) + 1 })
              .eq("id", formRecord.id);
          }

          const { data: staff } = await supabaseAdmin.from("user_roles").select("user_id");
          if (staff) {
            const seen = new Set<string>();
            const rows = staff
              .filter((s) => {
                if (seen.has(s.user_id)) return false;
                seen.add(s.user_id);
                return true;
              })
              .map((s) => ({
                user_id: s.user_id,
                type: "new_enquiry",
                title: "New enquiry received",
                body: `${data.name} — ${interestType}`,
                link: `/applications/${newApp.id}`,
              }));
            if (rows.length > 0) await supabaseAdmin.from("notifications").insert(rows);
          }

          const mail = enquiryEmailContent({
            name: data.name,
            email,
            phone: data.phone,
            country: data.country,
            interestType,
            message: data.message,
            sourceLabel,
            applicationId: newApp.id,
          });
          const emailResult = await sendMassEmail(mail);
          if (emailResult.failed > 0) {
            console.warn("Mass email partially failed", {
              applicationId: newApp.id,
              sent: emailResult.sent,
              failed: emailResult.failed,
            });
          }

          return new Response(JSON.stringify({ ok: true, application_id: newApp.id }), {
            status: 201,
            headers: corsHeaders,
          });
        } catch (err) {
          const sourceLabel = data.form_id ? "form:temporary" : "public_enquiry";
          const courseId = data.course_id || null;

          const existingLocal = LOCAL_CONTACTS.get(email);
          const localContact: LocalContact = existingLocal ?? {
            id: localId("lc"),
            name: data.name,
            email,
            phone: data.phone || null,
            country: data.country || null,
            source: sourceLabel,
            website: null,
          };
          localContact.name = data.name;
          localContact.phone = data.phone || null;
          localContact.country = data.country || null;
          LOCAL_CONTACTS.set(email, localContact);

          if (courseId) {
            const dup = LOCAL_APPLICATIONS.find(
              (a) =>
                a.contact_id === localContact.id &&
                a.course_id === courseId &&
                !TERMINAL.includes(a.pipeline_stage as (typeof TERMINAL)[number]),
            );
            if (dup) {
              dup.is_possible_duplicate = true;
              console.warn("Using local fallback store for enquiry duplicate", err);
              return new Response(JSON.stringify({ ok: true, duplicate: true, fallback: true }), {
                status: 200,
                headers: corsHeaders,
              });
            }
          }

          const localAppId = localId("la");
          LOCAL_APPLICATIONS.push({
            id: localAppId,
            contact_id: localContact.id,
            course_id: courseId,
            pipeline_stage: "new_enquiry",
            message: data.message || null,
            qualification_token: token(),
            qualification_token_expires_at: new Date(Date.now() + 30 * 86400_000).toISOString(),
            is_possible_duplicate: false,
          });

          console.warn("Using local fallback store for enquiry submission", err);
          return new Response(
            JSON.stringify({
              ok: true,
              application_id: localAppId,
              fallback: true,
              warning:
                "Stored in temporary local database. Reconnect Supabase service key to persist to real DB.",
            }),
            { status: 201, headers: corsHeaders },
          );
        }
      },
    },
  },
});
