import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EXPO_PIPELINE_STAGES,
  EXPO_PAYMENT_STATUSES,
  EXPO_ONBOARDING_STATUSES,
  EXPO_DEAL_STATUSES,
  exhStageTone,
  exhPaymentTone,
  exhOnboardingTone,
} from "@/lib/expo-constants";
import { formatDate, formatDistanceToNow } from "@/lib/format";
import { toast } from "sonner";
import { ArrowLeft, CheckSquare, Calendar, FileText, Package } from "lucide-react";

export const Route = createFileRoute("/_expo/expo/exhibitors/$id")({
  component: ExhibitorDetail,
});

type Exhibitor = {
  id: string;
  pipeline_stage: string;
  deal_status: string;
  payment_status: string;
  onboarding_status: string;
  early_bird_eligible: boolean;
  early_bird_expires_at: string | null;
  quoted_price: number | null;
  negotiated_price: number | null;
  invoice_due_date: string | null;
  stand_size: string | null;
  sponsorship_interest: boolean;
  lead_source: string | null;
  decision_notes: string | null;
  reminder_count: number;
  last_reminder_sent_at: string | null;
  booked_meeting_at: string | null;
  created_at: string;
  contact: { id: string; name: string; email: string; phone: string | null } | null;
  company: { id: string; name: string } | null;
  owner: { email: string } | null;
  package_interest: { name: string; standard_price: number | null; early_bird_price: number | null } | null;
};

type Meeting = {
  id: string;
  scheduled_for: string;
  meeting_type: string;
  status: string;
  outcome: string | null;
  notes: string | null;
};

type Invoice = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  invoice_reference: string | null;
  sent_at: string | null;
  due_at: string | null;
  paid_at: string | null;
};

type Checklist = {
  id: string;
  logo_received: boolean;
  banner_received: boolean;
  exhibitor_description_received: boolean;
  power_requirements_received: boolean;
  stand_requirements_received: boolean;
  team_passes_confirmed: boolean;
  final_confirmation_sent: boolean;
  notes: string | null;
  completed_at: string | null;
};

type Activity = {
  id: string;
  type: string;
  body: string | null;
  created_at: string;
  is_system: boolean;
};

function ExhibitorDetail() {
  const { id } = Route.useParams();
  const [exh, setExh] = useState<Exhibitor | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void load();
  }, [id]);

  async function load() {
    const [exhRes, meetRes, invRes, checkRes, actRes] = await Promise.all([
      supabase
        .from("expo_exhibitors")
        .select(
          "id, pipeline_stage, deal_status, payment_status, onboarding_status, early_bird_eligible, early_bird_expires_at, quoted_price, negotiated_price, invoice_due_date, stand_size, sponsorship_interest, lead_source, decision_notes, reminder_count, last_reminder_sent_at, booked_meeting_at, created_at, contact:contacts(id, name, email, phone), company:companies(id, name), owner:users(email), package_interest:expo_packages(name, standard_price, early_bird_price)",
        )
        .eq("id", id)
        .single(),
      supabase
        .from("expo_meetings")
        .select("id, scheduled_for, meeting_type, status, outcome, notes")
        .eq("exhibitor_id", id)
        .order("scheduled_for", { ascending: false }),
      supabase
        .from("expo_invoices")
        .select("id, amount, currency, status, invoice_reference, sent_at, due_at, paid_at")
        .eq("exhibitor_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("expo_onboarding_checklists")
        .select("id, logo_received, banner_received, exhibitor_description_received, power_requirements_received, stand_requirements_received, team_passes_confirmed, final_confirmation_sent, notes, completed_at")
        .eq("exhibitor_id", id)
        .maybeSingle(),
      supabase
        .from("activities")
        .select("id, type, body, created_at, is_system")
        .or(`metadata->>exhibitor_id.eq.${id}`)
        .order("created_at", { ascending: false })
        .limit(30),
    ]);

    if (exhRes.data) setExh(exhRes.data as never);
    if (meetRes.data) setMeetings(meetRes.data as never);
    if (invRes.data) setInvoices(invRes.data as never);
    if (checkRes.data) setChecklist(checkRes.data as never);
    if (actRes.data) setActivities(actRes.data as never);
  }

  async function updateField(field: string, value: string) {
    const { error } = await supabase
      .from("expo_exhibitors")
      .update({ [field]: value })
      .eq("id", id);
    if (error) return toast.error(error.message);
    setExh((prev) => (prev ? { ...prev, [field]: value } : prev));
    toast.success("Updated");
  }

  async function addNote() {
    if (!note.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("activities").insert({
      type: "note_added",
      body: note.trim(),
      metadata: { exhibitor_id: id },
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    setNote("");
    toast.success("Note added");
    void load();
  }

  async function toggleChecklistItem(field: string, current: boolean) {
    if (!checklist) return;
    const { error } = await supabase
      .from("expo_onboarding_checklists")
      .update({ [field]: !current })
      .eq("id", checklist.id);
    if (error) return toast.error(error.message);
    setChecklist((prev) => (prev ? { ...prev, [field]: !current } : prev));
  }

  if (!exh) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  const now = new Date().toISOString();
  const ebExpired = exh.early_bird_expires_at && exh.early_bird_expires_at < now;

  return (
    <div>
      <PageHeader
        title={exh.contact?.name ?? exh.company?.name ?? "Exhibitor"}
        description={exh.company?.name ?? ""}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link to="/expo/exhibitors">
              <ArrowLeft className="h-4 w-4" />
              Back to list
            </Link>
          </Button>
        }
      />

      <div className="space-y-6 px-6 py-6 md:px-10 md:py-8">
        {/* Profile summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              {exh.contact && (
                <Link to="/contacts/$id" params={{ id: exh.contact.id }} className="font-medium hover:underline">
                  {exh.contact.name}
                </Link>
              )}
              <p className="text-muted-foreground">{exh.contact?.email}</p>
              <p className="text-muted-foreground">{exh.contact?.phone ?? "—"}</p>
              {exh.company && (
                <p className="mt-1 font-medium">{exh.company.name}</p>
              )}
              <p className="text-xs text-muted-foreground">Source: {exh.lead_source ?? "—"}</p>
              <p className="text-xs text-muted-foreground">Owner: {exh.owner?.email ?? "—"}</p>
              <p className="text-xs text-muted-foreground">Created: {formatDate(exh.created_at)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Pipeline Stage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant={exhStageTone(exh.pipeline_stage as never)}>{exh.pipeline_stage}</Badge>
              <Select value={exh.pipeline_stage} onValueChange={(v) => updateField("pipeline_stage", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPO_PIPELINE_STAGES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Deal status</p>
                <Select value={exh.deal_status} onValueChange={(v) => updateField("deal_status", v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPO_DEAL_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Pricing & Package</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="text-muted-foreground">Package: {exh.package_interest?.name ?? "—"}</p>
              <p className="text-muted-foreground">Stand size: {exh.stand_size ?? "—"}</p>
              <p className="text-muted-foreground">Sponsorship: {exh.sponsorship_interest ? "Yes" : "No"}</p>
              <p className="text-muted-foreground">Standard price: {exh.package_interest?.standard_price != null ? `£${exh.package_interest.standard_price}` : "—"}</p>
              <p className="text-muted-foreground">Early bird price: {exh.package_interest?.early_bird_price != null ? `£${exh.package_interest.early_bird_price}` : "—"}</p>
              <p className="text-muted-foreground">Quoted: {exh.quoted_price != null ? `£${exh.quoted_price}` : "—"}</p>
              <p className="text-muted-foreground">Negotiated: {exh.negotiated_price != null ? `£${exh.negotiated_price}` : "—"}</p>
              {exh.early_bird_eligible && (
                <p className={`text-xs font-medium mt-1 ${ebExpired ? "text-muted-foreground line-through" : "text-emerald-600"}`}>
                  Early bird {ebExpired ? "expired" : `until ${formatDate(exh.early_bird_expires_at!)}`}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status controls */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4" /> Payment Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant={exhPaymentTone(exh.payment_status as never)}>{exh.payment_status}</Badge>
              <Select value={exh.payment_status} onValueChange={(v) => updateField("payment_status", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPO_PAYMENT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {exh.invoice_due_date && (
                <p className="text-xs text-muted-foreground">Due: {formatDate(exh.invoice_due_date)}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4" /> Onboarding Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant={exhOnboardingTone(exh.onboarding_status as never)}>{exh.onboarding_status}</Badge>
              <Select value={exh.onboarding_status} onValueChange={(v) => updateField("onboarding_status", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPO_ONBOARDING_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Meetings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" /> Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {meetings.length === 0 ? (
              <p className="text-xs text-muted-foreground">No meetings yet.</p>
            ) : (
              <div className="space-y-3">
                {meetings.map((m) => (
                  <div key={m.id} className="rounded-md border border-border p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{formatDate(m.scheduled_for)} — {m.meeting_type}</p>
                      <Badge variant="secondary" className="text-[10px]">{m.status}</Badge>
                    </div>
                    {m.outcome && <p className="mt-1 text-xs text-muted-foreground">Outcome: {m.outcome}</p>}
                    {m.notes && <p className="mt-1 text-xs text-muted-foreground">{m.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" /> Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <p className="text-xs text-muted-foreground">No invoices yet.</p>
            ) : (
              <div className="space-y-3">
                {invoices.map((inv) => (
                  <div key={inv.id} className="rounded-md border border-border p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{inv.invoice_reference ?? inv.id.slice(0, 8)} — {inv.currency} {inv.amount}</p>
                      <Badge variant={inv.status === "Paid" ? "default" : inv.status === "Overdue" ? "destructive" : "secondary"} className="text-[10px]">
                        {inv.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {inv.sent_at && `Sent: ${formatDate(inv.sent_at)}`}
                      {inv.due_at && ` · Due: ${formatDate(inv.due_at)}`}
                      {inv.paid_at && ` · Paid: ${formatDate(inv.paid_at)}`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Onboarding checklist */}
        {checklist && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <CheckSquare className="h-4 w-4" /> Onboarding Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {(
                  [
                    ["logo_received", "Logo received"],
                    ["banner_received", "Banner received"],
                    ["exhibitor_description_received", "Description received"],
                    ["power_requirements_received", "Power requirements"],
                    ["stand_requirements_received", "Stand requirements"],
                    ["team_passes_confirmed", "Team passes confirmed"],
                    ["final_confirmation_sent", "Final confirmation sent"],
                  ] as [keyof Checklist, string][]
                ).map(([field, label]) => (
                  <button
                    key={field}
                    onClick={() => toggleChecklistItem(field, checklist[field] as boolean)}
                    className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                      checklist[field]
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span className={`h-4 w-4 rounded border flex items-center justify-center text-[10px] ${checklist[field] ? "border-emerald-500 bg-emerald-500 text-white" : "border-muted-foreground"}`}>
                      {checklist[field] ? "✓" : ""}
                    </span>
                    {label}
                  </button>
                ))}
              </div>
              {checklist.completed_at && (
                <p className="mt-3 text-xs text-emerald-600 font-medium">Completed: {formatDate(checklist.completed_at)}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Add Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="Add a note…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
            <Button size="sm" onClick={addNote} disabled={saving || !note.trim()}>
              {saving ? "Saving…" : "Add note"}
            </Button>
          </CardContent>
        </Card>

        {/* Decision notes */}
        {exh.decision_notes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Decision Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{exh.decision_notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Activity timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-xs text-muted-foreground">No activity yet.</p>
            ) : (
              <ul className="space-y-3">
                {activities.map((a) => (
                  <li key={a.id} className="flex gap-3 border-b border-border pb-3 last:border-b-0">
                    <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400 mt-1.5" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{a.type.replace(/_/g, " ")}</p>
                      {a.body && <p className="mt-0.5 text-sm">{a.body}</p>}
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{formatDistanceToNow(a.created_at)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
