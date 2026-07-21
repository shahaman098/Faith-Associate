import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AppUpdate = Database["public"]["Tables"]["applications"]["Update"];
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StageBadge, DecisionBadge, PaymentBadge } from "@/components/StageBadge";
import {
  PIPELINE_STAGES,
  PIPELINE_STAGE_LABELS,
  DECISION_STATUSES,
  DECISION_STATUS_LABELS,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_LABELS,
  type PipelineStage,
  type DecisionStatus,
  type PaymentStatus,
} from "@/lib/crm-constants";
import { useAuth } from "@/lib/auth-context";
import { formatDateTime, formatDate } from "@/lib/format";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/_app/applications/$id")({
  component: AppDetail,
});

type App = {
  id: string;
  contact_id: string;
  pipeline_stage: PipelineStage;
  decision_status: DecisionStatus;
  payment_status: PaymentStatus;
  message: string | null;
  qualification_token: string | null;
  qualification_token_expires_at: string | null;
  qualification_submitted_at: string | null;
  booking_url: string | null;
  booking_url_sent_at: string | null;
  booking_confirmed_at: string | null;
  scheduled_for: string | null;
  decision_reason: string | null;
  payment_amount: number | null;
  payment_paid_at: string | null;
  reminder_count: number;
  is_possible_duplicate: boolean;
  enrolled_at: string | null;
  created_at: string;
  contact: { id: string; name: string; email: string; phone: string | null } | null;
  course: { id: string; name: string } | null;
};

function AppDetail() {
  const { id } = useParams({ from: "/_app/applications/$id" });
  const { user, canSetDecision, canMarkPaid } = useAuth();
  const [app, setApp] = useState<App | null>(null);
  const [activities, setActivities] = useState<
    Array<{
      id: string;
      type: string;
      body: string | null;
      created_at: string;
      is_system: boolean;
    }>
  >([]);
  const [note, setNote] = useState("");
  const [bookingUrl, setBookingUrl] = useState("");
  const [decisionReason, setDecisionReason] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  useEffect(() => {
    void load();
  }, [id]);

  async function load() {
    const [a, act] = await Promise.all([
      supabase
        .from("applications")
        .select("*, contact:contacts(id, name, email, phone), course:courses(id, name)")
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("activities")
        .select("id, type, body, created_at, is_system")
        .eq("application_id", id)
        .order("created_at", { ascending: false })
        .limit(100),
    ]);
    if (a.data) {
      setApp(a.data as never);
      setBookingUrl((a.data as never as App).booking_url ?? "");
      setDecisionReason((a.data as never as App).decision_reason ?? "");
      setPaymentAmount(((a.data as never as App).payment_amount ?? "").toString());
    }
    if (act.data) setActivities(act.data);
  }

  async function logActivity(type: string, body?: string) {
    if (!user || !app) return;
    await supabase.from("activities").insert({
      application_id: app.id,
      contact_id: app.contact_id,
      type: type as never,
      body: body ?? null,
      actor_id: user.id,
    });
  }

  async function setStage(s: PipelineStage) {
    if (!app) return;
    const patch: AppUpdate = { pipeline_stage: s };
    if (s === "enrolled") patch.enrolled_at = new Date().toISOString();
    const { error } = await supabase.from("applications").update(patch).eq("id", app.id);
    if (error) return toast.error(error.message);
    await logActivity("stage_changed", `Stage → ${PIPELINE_STAGE_LABELS[s]}`);
    toast.success("Stage updated");
    void load();
  }

  async function setDecision(d: DecisionStatus) {
    if (!app) return;
    const patch: AppUpdate = { decision_status: d, decision_reason: decisionReason };
    if (d === "approved") patch.pipeline_stage = "awaiting_payment";
    const { error } = await supabase.from("applications").update(patch).eq("id", app.id);
    if (error) return toast.error(error.message);
    await logActivity(
      "decision_set",
      `Decision: ${DECISION_STATUS_LABELS[d]}${decisionReason ? ` — ${decisionReason}` : ""}`,
    );
    toast.success("Decision set");
    void load();
  }

  async function setPayment(p: PaymentStatus) {
    if (!app) return;
    const patch: AppUpdate = { payment_status: p };
    if (paymentAmount) patch.payment_amount = Number(paymentAmount);
    if (p === "sent") patch.payment_sent_at = new Date().toISOString();
    if (p === "paid") {
      patch.payment_paid_at = new Date().toISOString();
      patch.pipeline_stage = "enrolled";
      patch.enrolled_at = new Date().toISOString();
    }
    const { error } = await supabase.from("applications").update(patch).eq("id", app.id);
    if (error) return toast.error(error.message);
    await logActivity("payment_marked", `Payment → ${PAYMENT_STATUS_LABELS[p]}`);
    toast.success("Payment updated");
    void load();
  }

  async function saveBookingUrl() {
    if (!app) return;
    const { error } = await supabase
      .from("applications")
      .update({
        booking_url: bookingUrl || null,
        booking_url_sent_at: bookingUrl ? new Date().toISOString() : null,
        pipeline_stage:
          app.pipeline_stage === "qualification_submitted"
            ? "awaiting_interview_booking"
            : app.pipeline_stage,
      })
      .eq("id", app.id);
    if (error) return toast.error(error.message);
    await logActivity("note", `Booking link sent: ${bookingUrl}`);
    toast.success("Booking link saved");
    void load();
  }

  async function confirmBooking() {
    if (!app) return;
    const { error } = await supabase
      .from("applications")
      .update({
        booking_confirmed_at: new Date().toISOString(),
        pipeline_stage: "interview_booked",
      })
      .eq("id", app.id);
    if (error) return toast.error(error.message);
    await logActivity("booking_confirmed", "Booking confirmed by staff");
    toast.success("Booking confirmed");
    void load();
  }

  async function markQualificationComplete() {
    if (!app) return;
    const { error } = await supabase
      .from("applications")
      .update({
        qualification_submitted_at: new Date().toISOString(),
        pipeline_stage: "qualification_submitted",
      })
      .eq("id", app.id);
    if (error) return toast.error(error.message);
    await logActivity("qualification_submitted", "Marked complete by staff");
    toast.success("Qualification marked complete");
    void load();
  }

  async function addNote() {
    if (!note.trim() || !user || !app) return;
    const { error } = await supabase.from("activities").insert({
      application_id: app.id,
      contact_id: app.contact_id,
      type: "note",
      body: note.trim(),
      actor_id: user.id,
    });
    if (error) return toast.error(error.message);
    setNote("");
    void load();
  }

  if (!app) return <div className="p-10 text-sm text-muted-foreground">Loading…</div>;

  const qualifyLink = app.qualification_token
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/qualify/${app.qualification_token}`
    : null;

  return (
    <div>
      <PageHeader
        title={app.contact?.name ?? "Application"}
        description={`${app.course?.name ?? "—"} · ${app.contact?.email ?? ""}`}
        actions={
          <Link to="/contacts/$id" params={{ id: app.contact_id }}>
            <Button variant="outline" size="sm">
              View contact
            </Button>
          </Link>
        }
      />
      <div className="grid gap-6 px-6 py-6 md:px-10 md:py-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {app.is_possible_duplicate && (
            <div className="rounded-md border border-warning bg-warning/10 px-4 py-3 text-sm">
              ⚠ This application was flagged as a possible duplicate of an existing open
              application. Review before proceeding.
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Pipeline stage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <StageBadge stage={app.pipeline_stage} />
                <Select
                  value={app.pipeline_stage}
                  onValueChange={(v) => setStage(v as PipelineStage)}
                >
                  <SelectTrigger className="w-[260px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PIPELINE_STAGES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {PIPELINE_STAGE_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Qualification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Submitted: </span>
                {app.qualification_submitted_at
                  ? formatDateTime(app.qualification_submitted_at)
                  : "—"}
              </div>
              {qualifyLink && !app.qualification_submitted_at && (
                <div className="flex items-center gap-2">
                  <Input readOnly value={qualifyLink} className="font-mono text-xs" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      void navigator.clipboard.writeText(qualifyLink);
                      toast.success("Copied");
                    }}
                  >
                    Copy
                  </Button>
                </div>
              )}
              {!app.qualification_submitted_at && (
                <Button size="sm" variant="secondary" onClick={markQualificationComplete}>
                  Mark complete manually
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interview booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-1.5">
                <Label htmlFor="bu">Booking URL (Calendly etc.)</Label>
                <div className="flex gap-2">
                  <Input
                    id="bu"
                    value={bookingUrl}
                    onChange={(e) => setBookingUrl(e.target.value)}
                    placeholder="https://calendly.com/…"
                  />
                  <Button size="sm" onClick={saveBookingUrl}>
                    Send / save
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Sent: </span>
                  {app.booking_url_sent_at ? formatDateTime(app.booking_url_sent_at) : "—"}
                </div>
                <div>
                  <span className="text-muted-foreground">Confirmed: </span>
                  {app.booking_confirmed_at ? formatDateTime(app.booking_confirmed_at) : "—"}
                </div>
              </div>
              {!app.booking_confirmed_at && app.booking_url_sent_at && (
                <Button size="sm" variant="secondary" onClick={confirmBooking}>
                  Mark booking confirmed
                </Button>
              )}
              {app.booking_url && (
                <a
                  href={app.booking_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary underline"
                >
                  Open booking link <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Decision</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <DecisionBadge status={app.decision_status} />
                {!canSetDecision && (
                  <span className="text-xs text-muted-foreground">
                    Only Reviewer/Admin can change decisions.
                  </span>
                )}
              </div>
              {canSetDecision && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="dr">Reason / notes</Label>
                    <Textarea
                      id="dr"
                      value={decisionReason}
                      onChange={(e) => setDecisionReason(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {DECISION_STATUSES.map((d) => (
                      <Button
                        key={d}
                        size="sm"
                        variant={d === app.decision_status ? "default" : "outline"}
                        onClick={() => setDecision(d)}
                      >
                        {DECISION_STATUS_LABELS[d]}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <PaymentBadge status={app.payment_status} />
                <Input
                  type="number"
                  className="w-32"
                  placeholder="Amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
              {!canMarkPaid && (
                <p className="text-xs text-muted-foreground">
                  Only Reviewer/Admin can mark payment as Paid.
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {PAYMENT_STATUSES.map((p) => {
                  const restricted = p === "paid" && !canMarkPaid;
                  return (
                    <Button
                      key={p}
                      size="sm"
                      variant={p === app.payment_status ? "default" : "outline"}
                      disabled={restricted}
                      onClick={() => setPayment(p)}
                    >
                      {PAYMENT_STATUS_LABELS[p]}
                    </Button>
                  );
                })}
              </div>
              {app.payment_paid_at && (
                <p className="text-xs text-muted-foreground">
                  Paid {formatDateTime(app.payment_paid_at)}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Internal note about this application…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
              <Button size="sm" onClick={addNote} disabled={!note.trim()}>
                Save note
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length === 0 && (
                <p className="text-sm text-muted-foreground">No activity yet.</p>
              )}
              <ul className="space-y-3">
                {activities.map((act) => (
                  <li key={act.id} className="border-l-2 border-primary/30 pl-3">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {act.type.replaceAll("_", " ")} {act.is_system ? "· system" : ""} ·{" "}
                      {formatDateTime(act.created_at)}
                    </p>
                    {act.body && <p className="mt-0.5 text-sm">{act.body}</p>}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Field label="Course" value={app.course?.name} />
              <Field label="Contact" value={app.contact?.name} />
              <Field label="Email" value={app.contact?.email} />
              <Field label="Phone" value={app.contact?.phone} />
              <Field label="Created" value={formatDate(app.created_at)} />
              <Field label="Reminder count" value={app.reminder_count.toString()} />
              {app.message && (
                <div className="border-t border-border pt-2">
                  <p className="text-muted-foreground">Original message</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm">{app.message}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{value ?? "—"}</span>
    </div>
  );
}
