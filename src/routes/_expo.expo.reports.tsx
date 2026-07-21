import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const Route = createFileRoute("/_expo/expo/reports")({
  component: ExpoReportsPage,
});

type Metrics = {
  totalExhibitors: number;
  qualifiedExhibitors: number;
  exhibitorsWithMeeting: number;
  exhibitorsSentInvoice: number;
  paidExhibitors: number;
  earlyBirdOffered: number;
  earlyBirdPaid: number;
  onboardingComplete: number;
  totalAttendees: number;
  confirmedAttendees: number;
  checkedInAttendees: number;
  stageBreakdown: Record<string, number>;
  sourceBreakdown: Record<string, number>;
};

function pct(num: number, den: number): string {
  if (!den) return "—";
  return `${Math.round((num / den) * 100)}%`;
}

function MetricRow({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2 last:border-b-0">
      <div>
        <p className="text-sm">{label}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
      <p className="font-serif text-xl font-medium">{value}</p>
    </div>
  );
}

function ExpoReportsPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    const [exhRes, attRes] = await Promise.all([
      supabase.from("expo_exhibitors").select("pipeline_stage, payment_status, onboarding_status, early_bird_eligible, lead_source"),
      supabase.from("expo_attendees").select("status, source"),
    ]);

    const exh = exhRes.data ?? [];
    const att = attRes.data ?? [];

    const stageBreakdown: Record<string, number> = {};
    const sourceBreakdown: Record<string, number> = {};

    let qualified = 0, withMeeting = 0, sentInvoice = 0, paid = 0, ebOffered = 0, ebPaid = 0, onboardingComplete = 0;

    const qualifiedStages = ["Qualified", "Package Sent", "Early Bird Offered", "Meeting Booked", "Meeting Completed", "Negotiation", "Reserved", "Invoice Sent", "Paid", "Onboarding In Progress", "Ready for Expo"];
    const invoicedStages = ["Invoice Sent", "Paid", "Onboarding In Progress", "Ready for Expo"];
    const meetingStages = ["Meeting Booked", "Meeting Completed", "Negotiation", "Reserved", "Invoice Sent", "Paid", "Onboarding In Progress", "Ready for Expo"];

    for (const e of exh) {
      stageBreakdown[e.pipeline_stage] = (stageBreakdown[e.pipeline_stage] ?? 0) + 1;
      if (e.lead_source) sourceBreakdown[e.lead_source] = (sourceBreakdown[e.lead_source] ?? 0) + 1;
      if (qualifiedStages.includes(e.pipeline_stage)) qualified++;
      if (meetingStages.includes(e.pipeline_stage)) withMeeting++;
      if (invoicedStages.includes(e.pipeline_stage)) sentInvoice++;
      if (e.pipeline_stage === "Paid" || e.pipeline_stage === "Onboarding In Progress" || e.pipeline_stage === "Ready for Expo") paid++;
      if (e.early_bird_eligible) ebOffered++;
      if (e.early_bird_eligible && (e.pipeline_stage === "Paid" || e.pipeline_stage === "Onboarding In Progress" || e.pipeline_stage === "Ready for Expo")) ebPaid++;
      if (e.onboarding_status === "Complete") onboardingComplete++;
    }

    let confirmed = 0, checkedIn = 0;
    for (const a of att) {
      if (a.status === "Confirmed" || a.status === "Checked In") confirmed++;
      if (a.status === "Checked In") checkedIn++;
    }

    setMetrics({
      totalExhibitors: exh.length,
      qualifiedExhibitors: qualified,
      exhibitorsWithMeeting: withMeeting,
      exhibitorsSentInvoice: sentInvoice,
      paidExhibitors: paid,
      earlyBirdOffered: ebOffered,
      earlyBirdPaid: ebPaid,
      onboardingComplete,
      totalAttendees: att.length,
      confirmedAttendees: confirmed,
      checkedInAttendees: checkedIn,
      stageBreakdown,
      sourceBreakdown,
    });
    setLoading(false);
  }

  if (loading || !metrics) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading reports…</p>
      </div>
    );
  }

  const STAGE_ORDER = [
    "New Lead", "Contacted", "Qualified", "Package Sent", "Early Bird Offered",
    "Meeting Booked", "Meeting Completed", "Negotiation", "Reserved",
    "Invoice Sent", "Paid", "Onboarding In Progress", "Ready for Expo", "Dormant", "Closed Lost",
  ];

  return (
    <div>
      <PageHeader title="Reports" description="Mosque Expo conversion metrics and analytics." />
      <div className="space-y-8 px-6 py-6 md:px-10 md:py-8">

        {/* Exhibitor conversion */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Exhibitor Conversion Funnel</CardTitle>
              <CardDescription>Key conversion rates across the pipeline.</CardDescription>
            </CardHeader>
            <CardContent>
              <MetricRow label="Total exhibitor leads" value={metrics.totalExhibitors} />
              <MetricRow label="Qualified" value={metrics.qualifiedExhibitors} sub={`${pct(metrics.qualifiedExhibitors, metrics.totalExhibitors)} of total`} />
              <MetricRow label="Meeting booking rate" value={pct(metrics.exhibitorsWithMeeting, metrics.qualifiedExhibitors)} sub="Exhibitors with meeting ÷ qualified" />
              <MetricRow label="Package conversion" value={pct(metrics.exhibitorsSentInvoice, metrics.qualifiedExhibitors)} sub="Invoice sent or beyond ÷ qualified" />
              <MetricRow label="Invoice-to-paid conversion" value={pct(metrics.paidExhibitors, metrics.exhibitorsSentInvoice)} sub="Paid ÷ invoice sent" />
              <MetricRow label="Early bird conversion" value={pct(metrics.earlyBirdPaid, metrics.earlyBirdOffered)} sub="Paid early bird ÷ offered early bird" />
              <MetricRow label="Onboarding completion rate" value={pct(metrics.onboardingComplete, metrics.paidExhibitors)} sub="Complete ÷ paid" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendee Metrics</CardTitle>
              <CardDescription>Registration and check-in rates.</CardDescription>
            </CardHeader>
            <CardContent>
              <MetricRow label="Total registrations" value={metrics.totalAttendees} />
              <MetricRow label="Confirmed attendees" value={metrics.confirmedAttendees} sub={pct(metrics.confirmedAttendees, metrics.totalAttendees)} />
              <MetricRow label="Check-in rate" value={pct(metrics.checkedInAttendees, metrics.confirmedAttendees)} sub="Checked in ÷ confirmed" />
            </CardContent>
          </Card>
        </div>

        {/* Stage breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Exhibitor Stage Breakdown</CardTitle>
            <CardDescription>Count of exhibitors at each pipeline stage.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {STAGE_ORDER.map((s) => {
                const v = metrics.stageBreakdown[s] ?? 0;
                const pctVal = metrics.totalExhibitors ? Math.max(2, (v / metrics.totalExhibitors) * 100) : 0;
                return (
                  <div key={s} className="flex items-center gap-3">
                    <span className="w-48 text-xs text-muted-foreground">{s}</span>
                    <div className="relative h-6 flex-1 overflow-hidden rounded bg-muted">
                      <div className="absolute inset-y-0 left-0 bg-emerald-500" style={{ width: `${pctVal}%` }} />
                      <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-medium">{v}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Source breakdown */}
        {Object.keys(metrics.sourceBreakdown).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Lead Source Breakdown</CardTitle>
              <CardDescription>Where exhibitor leads are coming from.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(metrics.sourceBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([source, count]) => (
                    <div key={source} className="flex items-center justify-between border-b border-border py-1.5 last:border-b-0">
                      <span className="text-sm">{source}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
