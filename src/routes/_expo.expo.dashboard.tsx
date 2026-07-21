import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "@/lib/format";

export const Route = createFileRoute("/_expo/expo/dashboard")({
  component: ExpoDashboard,
});

function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number | string;
  tone?: "default" | "warn" | "good";
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p
        className={`mt-2 font-serif text-3xl ${
          tone === "warn"
            ? "text-destructive"
            : tone === "good"
              ? "text-emerald-600"
              : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

type RecentExhibitor = {
  id: string;
  pipeline_stage: string;
  created_at: string;
  contact: { name: string; email: string } | null;
  company: { name: string } | null;
};

function ExpoDashboard() {
  const [stats, setStats] = useState({
    newLeads: 0,
    earlyBirdExpiring: 0,
    meetingsThisWeek: 0,
    overdueInvoices: 0,
    onboardingBlockers: 0,
    attendees: 0,
    paid: 0,
    readyForExpo: 0,
  });
  const [recent, setRecent] = useState<RecentExhibitor[]>([]);
  const [stageCounts, setStageCounts] = useState<Record<string, number>>({});
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    try {
      const now = new Date().toISOString();
      const weekFromNow = new Date(Date.now() + 7 * 86400000).toISOString();
      const threeDaysFromNow = new Date(Date.now() + 3 * 86400000).toISOString();

      const [exhRes, recentRes, meetRes, invRes, attRes] = await Promise.all([
        supabase.from("expo_exhibitors").select("pipeline_stage, payment_status, onboarding_status, early_bird_eligible, early_bird_expires_at"),
        supabase
          .from("expo_exhibitors")
          .select("id, pipeline_stage, created_at, contact:contacts(name, email), company:companies(name)")
          .order("created_at", { ascending: false })
          .limit(8),
        supabase
          .from("expo_meetings")
          .select("id", { count: "exact", head: true })
          .gte("scheduled_for", now)
          .lte("scheduled_for", weekFromNow),
        supabase
          .from("expo_invoices")
          .select("id", { count: "exact", head: true })
          .eq("status", "Overdue"),
        supabase
          .from("expo_attendees")
          .select("id", { count: "exact", head: true }),
      ]);

      const warnings: string[] = [];

      if (exhRes.data) {
        const counts: Record<string, number> = {};
        let newLeads = 0, earlyBirdExpiring = 0, paid = 0, readyForExpo = 0, onboardingBlockers = 0;
        for (const e of exhRes.data) {
          counts[e.pipeline_stage] = (counts[e.pipeline_stage] ?? 0) + 1;
          if (e.pipeline_stage === "New Lead") newLeads++;
          if (e.pipeline_stage === "Paid") paid++;
          if (e.pipeline_stage === "Ready for Expo") readyForExpo++;
          if (e.pipeline_stage === "Onboarding In Progress") onboardingBlockers++;
          if (
            e.early_bird_eligible &&
            e.early_bird_expires_at &&
            e.early_bird_expires_at <= threeDaysFromNow &&
            e.early_bird_expires_at >= now
          ) earlyBirdExpiring++;
        }
        setStageCounts(counts);
        setStats((s) => ({ ...s, newLeads, earlyBirdExpiring, paid, readyForExpo, onboardingBlockers }));
      } else if (exhRes.error) warnings.push(exhRes.error.message);

      if (recentRes.data) {
        setRecent(
          recentRes.data.map((r) => ({
            id: r.id,
            pipeline_stage: r.pipeline_stage as string,
            created_at: r.created_at as string,
            contact: r.contact && !Array.isArray(r.contact) ? { name: (r.contact as { name: string }).name, email: (r.contact as { email: string }).email } : null,
            company: r.company && !Array.isArray(r.company) ? { name: (r.company as { name: string }).name } : null,
          }))
        );
      }

      setStats((s) => ({
        ...s,
        meetingsThisWeek: meetRes.count ?? 0,
        overdueInvoices: invRes.count ?? 0,
        attendees: attRes.count ?? 0,
      }));

      if (warnings.length) setWarning(warnings.join(" | "));
    } catch (err) {
      setWarning(err instanceof Error ? err.message : "Load failed");
    }
  }

  const STAGE_ORDER = [
    "New Lead", "Contacted", "Qualified", "Package Sent", "Early Bird Offered",
    "Meeting Booked", "Meeting Completed", "Negotiation", "Reserved",
    "Invoice Sent", "Paid", "Onboarding In Progress", "Ready for Expo", "Dormant", "Closed Lost",
  ];
  const total = Object.values(stageCounts).reduce((a, b) => a + b, 0);

  return (
    <div>
      <PageHeader title="Expo Dashboard" description="Mosque Expo operational overview." />
      <div className="space-y-8 px-6 py-6 md:px-10 md:py-8">
        {warning && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            {warning}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="New leads" value={stats.newLeads} />
          <StatCard label="Early bird expiring (3d)" value={stats.earlyBirdExpiring} tone={stats.earlyBirdExpiring > 0 ? "warn" : "default"} />
          <StatCard label="Meetings this week" value={stats.meetingsThisWeek} />
          <StatCard label="Overdue invoices" value={stats.overdueInvoices} tone={stats.overdueInvoices > 0 ? "warn" : "default"} />
          <StatCard label="Paid exhibitors" value={stats.paid} tone="good" />
          <StatCard label="Onboarding in progress" value={stats.onboardingBlockers} />
          <StatCard label="Ready for Expo" value={stats.readyForExpo} tone="good" />
          <StatCard label="Attendees registered" value={stats.attendees} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Exhibitor pipeline</CardTitle>
              <CardDescription>Exhibitors by current stage.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {STAGE_ORDER.map((s) => {
                  const v = stageCounts[s] ?? 0;
                  const pct = total ? Math.max(2, (v / total) * 100) : 0;
                  return (
                    <div key={s} className="flex items-center gap-3">
                      <span className="w-48 text-xs text-muted-foreground">{s}</span>
                      <div className="relative h-6 flex-1 overflow-hidden rounded bg-muted">
                        <div className="absolute inset-y-0 left-0 bg-emerald-500" style={{ width: `${pct}%` }} />
                        <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs font-medium text-foreground">{v}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent exhibitor leads</CardTitle>
              <CardDescription>Latest 8 enquiries.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recent.length === 0 && (
                  <li className="text-xs text-muted-foreground">No exhibitors yet.</li>
                )}
                {recent.map((r) => (
                  <li key={r.id} className="flex items-start justify-between gap-2 border-b border-border pb-2 last:border-b-0">
                    <div className="min-w-0">
                      <Link to="/expo/exhibitors/$id" params={{ id: r.id }} className="block truncate text-sm font-medium hover:underline">
                        {r.contact?.name ?? r.company?.name ?? "—"}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">{r.company?.name}</p>
                      <p className="text-[11px] text-muted-foreground">{formatDistanceToNow(r.created_at)}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0">{r.pipeline_stage}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
