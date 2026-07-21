import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PIPELINE_STAGES, PIPELINE_STAGE_LABELS, type PipelineStage } from "@/lib/crm-constants";

export const Route = createFileRoute("/_app/reports")({
  component: Reports,
});

type RangeKey = "7d" | "30d" | "90d" | "365d" | "all";
const RANGE_LABELS: Record<RangeKey, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "365d": "Last 12 months",
  all: "All time",
};
const RANGE_DAYS: Record<RangeKey, number | null> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "365d": 365,
  all: null,
};

const STAGE_ORDER: Record<PipelineStage, number> = {
  new_enquiry: 0,
  contacted: 1,
  awaiting_qualification: 2,
  qualification_submitted: 3,
  awaiting_interview_booking: 4,
  interview_booked: 5,
  interview_completed: 6,
  awaiting_payment: 7,
  enrolled: 8,
  dormant: 9,
};

type AppRow = {
  id: string;
  created_at: string;
  pipeline_stage: PipelineStage;
  decision_status: string;
  payment_status: string;
  qualification_token: string | null;
  qualification_submitted_at: string | null;
  booking_url_sent_at: string | null;
  booking_confirmed_at: string | null;
  enrolled_at: string | null;
  contact_id: string;
};

type ContactRow = { id: string; source: string | null };
type ActivityRow = { actor_id: string | null; created_at: string; type: string };
type ProfileRow = { user_id: string; display_name: string | null; email: string | null };

function Reports() {
  const [range, setRange] = useState<RangeKey>("90d");
  const [apps, setApps] = useState<AppRow[]>([]);
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  const sinceISO = useMemo(() => {
    const d = RANGE_DAYS[range];
    if (d === null) return null;
    return new Date(Date.now() - d * 86_400_000).toISOString();
  }, [range]);

  useEffect(() => {
    void load();
  }, [sinceISO]);

  async function load() {
    setLoading(true);
    const appsQ = supabase
      .from("applications")
      .select(
        "id, created_at, pipeline_stage, decision_status, payment_status, qualification_token, qualification_submitted_at, booking_url_sent_at, booking_confirmed_at, enrolled_at, contact_id",
      )
      .order("created_at", { ascending: false })
      .limit(1000);
    if (sinceISO) appsQ.gte("created_at", sinceISO);

    const actsQ = supabase
      .from("activities")
      .select("actor_id, created_at, type")
      .not("actor_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(1000);
    if (sinceISO) actsQ.gte("created_at", sinceISO);

    const [a, c, ac, p] = await Promise.all([
      appsQ,
      supabase.from("contacts").select("id, source").limit(1000),
      actsQ,
      supabase.from("profiles").select("user_id, display_name, email").limit(200),
    ]);

    setApps((a.data ?? []) as AppRow[]);
    setContacts((c.data ?? []) as ContactRow[]);
    setActivities((ac.data ?? []) as ActivityRow[]);
    setProfiles((p.data ?? []) as ProfileRow[]);
    setLoading(false);
  }

  const total = apps.length;

  // Volume by day
  const volumeByDay = useMemo(() => {
    const buckets = new Map<string, number>();
    for (const a of apps) {
      const day = a.created_at.slice(0, 10);
      buckets.set(day, (buckets.get(day) ?? 0) + 1);
    }
    return [...buckets.entries()].sort(([x], [y]) => x.localeCompare(y));
  }, [apps]);

  // Source breakdown — join contacts.source via contact_id
  const sourceBreakdown = useMemo(() => {
    const cMap = new Map(contacts.map((c) => [c.id, c.source ?? "unknown"]));
    const counts = new Map<string, number>();
    for (const a of apps) {
      const src = cMap.get(a.contact_id) ?? "unknown";
      counts.set(src, (counts.get(src) ?? 0) + 1);
    }
    return [...counts.entries()].sort((x, y) => y[1] - x[1]);
  }, [apps, contacts]);

  // Conversion rates
  const sentQualify = apps.filter((a) => a.qualification_token !== null).length;
  const submittedQualify = apps.filter((a) => a.qualification_submitted_at !== null).length;
  const qualRate = sentQualify ? submittedQualify / sentQualify : 0;

  const sentBooking = apps.filter((a) => a.booking_url_sent_at !== null).length;
  const confirmedBooking = apps.filter((a) => a.booking_confirmed_at !== null).length;
  const bookingRate = sentBooking ? confirmedBooking / sentBooking : 0;

  const reachedInterviewCompleted = apps.filter(
    (a) => STAGE_ORDER[a.pipeline_stage] >= STAGE_ORDER.interview_completed,
  ).length;
  const approved = apps.filter((a) => a.decision_status === "approved").length;
  const approvalRate = reachedInterviewCompleted ? approved / reachedInterviewCompleted : 0;

  const paid = apps.filter((a) => a.payment_status === "paid").length;
  const paymentRate = approved ? paid / approved : 0;

  const enrolled = apps.filter((a) => a.pipeline_stage === "enrolled").length;
  const enrolmentRate = total ? enrolled / total : 0;

  const dormant = apps.filter((a) => a.pipeline_stage === "dormant").length;
  const dropoffRate = total ? dormant / total : 0;

  // Avg time enquiry → enrolment (ms → days)
  const enrolledRows = apps.filter((a) => a.enrolled_at);
  const avgDays = enrolledRows.length
    ? enrolledRows.reduce(
        (acc, a) => acc + (new Date(a.enrolled_at!).getTime() - new Date(a.created_at).getTime()),
        0,
      ) /
      enrolledRows.length /
      86_400_000
    : 0;

  // Per-staff follow-up activity
  const perStaff = useMemo(() => {
    const counts = new Map<string, number>();
    for (const act of activities) {
      if (!act.actor_id) continue;
      counts.set(act.actor_id, (counts.get(act.actor_id) ?? 0) + 1);
    }
    const pMap = new Map(profiles.map((p) => [p.user_id, p.display_name || p.email || p.user_id]));
    return [...counts.entries()]
      .map(([uid, count]) => ({ name: pMap.get(uid) ?? uid.slice(0, 8), count }))
      .sort((x, y) => y.count - x.count);
  }, [activities, profiles]);

  // Stage distribution for funnel
  const stageCounts = useMemo(() => {
    const c = Object.fromEntries(PIPELINE_STAGES.map((s) => [s, 0])) as Record<
      PipelineStage,
      number
    >;
    for (const a of apps) c[a.pipeline_stage]++;
    return c;
  }, [apps]);

  const maxVolume = Math.max(1, ...volumeByDay.map(([, v]) => v));

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Locked formulas — conversion, source, and pipeline analytics."
        actions={
          <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(RANGE_LABELS) as RangeKey[]).map((k) => (
                <SelectItem key={k} value={k}>
                  {RANGE_LABELS[k]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <div className="space-y-8 px-6 py-6 md:px-10 md:py-8">
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

        {/* Conversion rates */}
        <section>
          <h2 className="mb-3 font-serif text-xl">Conversion rates</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            <RateCard
              label="Qualification"
              num={submittedQualify}
              den={sentQualify}
              rate={qualRate}
            />
            <RateCard
              label="Interview booking"
              num={confirmedBooking}
              den={sentBooking}
              rate={bookingRate}
            />
            <RateCard
              label="Approval"
              num={approved}
              den={reachedInterviewCompleted}
              rate={approvalRate}
            />
            <RateCard label="Payment" num={paid} den={approved} rate={paymentRate} />
            <RateCard label="Enrolment" num={enrolled} den={total} rate={enrolmentRate} />
            <RateCard
              label="Drop-off (Dormant)"
              num={dormant}
              den={total}
              rate={dropoffRate}
              tone="warn"
            />
          </div>
        </section>

        {/* Volume + Avg time */}
        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Enquiry volume</CardTitle>
              <CardDescription>Applications created per day in selected range.</CardDescription>
            </CardHeader>
            <CardContent>
              {volumeByDay.length === 0 ? (
                <p className="text-sm text-muted-foreground">No data in range.</p>
              ) : (
                <div className="flex h-48 items-end gap-1">
                  {volumeByDay.map(([day, v]) => (
                    <div key={day} className="group relative flex-1" title={`${day}: ${v}`}>
                      <div
                        className="rounded-t bg-primary transition-opacity hover:opacity-80"
                        style={{ height: `${(v / maxVolume) * 100}%`, minHeight: "2px" }}
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                <span>{volumeByDay[0]?.[0] ?? ""}</span>
                <span>{volumeByDay[volumeByDay.length - 1]?.[0] ?? ""}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avg time enquiry → enrolment</CardTitle>
              <CardDescription>Mean across enrolled applications.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-serif text-5xl text-foreground">{avgDays.toFixed(1)}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                days · {enrolledRows.length} enrolled
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Source + Stage funnel */}
        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Source breakdown</CardTitle>
              <CardDescription>By contacts.source.</CardDescription>
            </CardHeader>
            <CardContent>
              {sourceBreakdown.length === 0 ? (
                <p className="text-sm text-muted-foreground">No data.</p>
              ) : (
                <div className="space-y-2">
                  {sourceBreakdown.map(([src, count]) => {
                    const pct = total ? (count / total) * 100 : 0;
                    return (
                      <div key={src} className="flex items-center gap-3">
                        <span className="w-32 truncate text-xs">{src}</span>
                        <div className="relative h-5 flex-1 overflow-hidden rounded bg-muted">
                          <div
                            className="absolute inset-y-0 left-0 bg-accent"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-16 text-right text-xs tabular-nums text-muted-foreground">
                          {count} · {pct.toFixed(0)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pipeline distribution</CardTitle>
              <CardDescription>Current stage counts within range.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {PIPELINE_STAGES.map((s) => {
                  const v = stageCounts[s];
                  const pct = total ? (v / total) * 100 : 0;
                  return (
                    <div key={s} className="flex items-center gap-3">
                      <span className="w-44 truncate text-xs text-muted-foreground">
                        {PIPELINE_STAGE_LABELS[s]}
                      </span>
                      <div className="relative h-5 flex-1 overflow-hidden rounded bg-muted">
                        <div
                          className="absolute inset-y-0 left-0 bg-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-xs tabular-nums">{v}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Per-staff activity */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Per-staff follow-up activity</CardTitle>
              <CardDescription>Activities authored by each staff member in range.</CardDescription>
            </CardHeader>
            <CardContent>
              {perStaff.length === 0 ? (
                <p className="text-sm text-muted-foreground">No staff activity in range.</p>
              ) : (
                <div className="space-y-2">
                  {perStaff.map((row) => {
                    const max = perStaff[0]?.count ?? 1;
                    const pct = (row.count / max) * 100;
                    return (
                      <div key={row.name} className="flex items-center gap-3">
                        <span className="w-48 truncate text-sm">{row.name}</span>
                        <div className="relative h-5 flex-1 overflow-hidden rounded bg-muted">
                          <div
                            className="absolute inset-y-0 left-0 bg-primary"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-12 text-right text-xs tabular-nums">{row.count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Formula reference */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Formula reference</CardTitle>
              <CardDescription>Locked V1 definitions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 font-mono text-[11px] text-muted-foreground">
              <p>
                qualification_rate = qualification_submitted_at IS NOT NULL ÷ qualification_token IS
                NOT NULL
              </p>
              <p>
                booking_rate = booking_confirmed_at IS NOT NULL ÷ booking_url_sent_at IS NOT NULL
              </p>
              <p>approval_rate = decision_status='approved' ÷ stage ≥ interview_completed</p>
              <p>payment_rate = payment_status='paid' ÷ decision_status='approved'</p>
              <p>enrolment_rate = stage='enrolled' ÷ total applications</p>
              <p>dropoff_rate = stage='dormant' ÷ total applications</p>
              <p>avg_time = mean(enrolled_at − created_at) for enrolled</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

function RateCard({
  label,
  num,
  den,
  rate,
  tone = "default",
}: {
  label: string;
  num: number;
  den: number;
  rate: number;
  tone?: "default" | "warn";
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p
        className={`mt-2 font-serif text-3xl ${tone === "warn" ? "text-destructive" : "text-foreground"}`}
      >
        {(rate * 100).toFixed(0)}%
      </p>
      <p className="mt-1 text-[11px] text-muted-foreground tabular-nums">
        {num} / {den}
      </p>
    </div>
  );
}
