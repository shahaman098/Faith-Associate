import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PIPELINE_STAGES, PIPELINE_STAGE_LABELS, type PipelineStage } from "@/lib/crm-constants";
import { StageBadge } from "@/components/StageBadge";
import { formatDistanceToNow } from "@/lib/format";
import { Users, CreditCard, GraduationCap, Moon, AlertTriangle, Calendar, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

type Counts = Record<PipelineStage, number>;

function isPipelineStage(value: unknown): value is PipelineStage {
  return typeof value === "string" && PIPELINE_STAGES.includes(value as PipelineStage);
}

function Dashboard() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [recent, setRecent] = useState<
    Array<{
      id: string;
      pipeline_stage: PipelineStage;
      created_at: string;
      contact: { name: string; email: string } | null;
    }>
  >([]);
  const [overdueTasks, setOverdueTasks] = useState(0);
  const [interviewsThisWeek, setInterviewsThisWeek] = useState(0);
  const [loadWarning, setLoadWarning] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    try {
      setLoadWarning(null);

      const today = new Date().toISOString().slice(0, 10);
      const weekFromNow = new Date(Date.now() + 7 * 86400000).toISOString();

      const [appsRes, recentRes, overdueRes, interviewRes] = await Promise.all([
        supabase.from("applications").select("pipeline_stage"),
        supabase
          .from("applications")
          .select("id, pipeline_stage, created_at, contact:contacts(name, email)")
          .order("created_at", { ascending: false })
          .limit(8),
        supabase
          .from("tasks")
          .select("id", { count: "exact", head: true })
          .is("completed_at", null)
          .lt("due_date", today),
        supabase
          .from("applications")
          .select("id", { count: "exact", head: true })
          .gte("scheduled_for", new Date().toISOString())
          .lte("scheduled_for", weekFromNow),
      ]);

      const warnings: string[] = [];

      if (appsRes.error) {
        warnings.push(`pipeline: ${appsRes.error.message}`);
      } else if (appsRes.data) {
        const c: Counts = Object.fromEntries(PIPELINE_STAGES.map((s) => [s, 0])) as Counts;
        for (const a of appsRes.data) {
          if (isPipelineStage(a.pipeline_stage)) c[a.pipeline_stage] += 1;
        }
        setCounts(c);
      }

      if (recentRes.error) {
        warnings.push(`recent: ${recentRes.error.message}`);
      } else if (recentRes.data) {
        const normalized = recentRes.data
          .filter((r) => isPipelineStage(r.pipeline_stage) && !!r.created_at)
          .map((r) => ({
            id: r.id,
            pipeline_stage: r.pipeline_stage,
            created_at: r.created_at,
            contact:
              r.contact && !Array.isArray(r.contact)
                ? { name: r.contact.name ?? "", email: r.contact.email ?? "" }
                : null,
          }));
        setRecent(normalized);
      }

      if (overdueRes.error) {
        warnings.push(`tasks: ${overdueRes.error.message}`);
      }
      setOverdueTasks(overdueRes.count ?? 0);

      if (interviewRes.error) {
        warnings.push(`interviews: ${interviewRes.error.message}`);
      }
      setInterviewsThisWeek(interviewRes.count ?? 0);

      if (warnings.length > 0) {
        setLoadWarning(`Some dashboard metrics could not be loaded (${warnings.join(" | ")}).`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setLoadWarning(`Dashboard load failed: ${message}`);
    }
  }

  const total = counts ? Object.values(counts).reduce((a, b) => a + b, 0) : 0;
  const newE = counts?.new_enquiry ?? 0;
  const enrolled = counts?.enrolled ?? 0;
  const dormant = counts?.dormant ?? 0;
  const awaitingPayment = counts?.awaiting_payment ?? 0;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Operational overview of your admissions pipeline."
      />
      <div className="space-y-6 px-6 py-6 md:px-8">
        {loadWarning && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {loadWarning}
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Stat label="New enquiries" value={newE} icon={Users} />
          <Stat label="Awaiting payment" value={awaitingPayment} icon={CreditCard} accent="amber" />
          <Stat label="Enrolled" value={enrolled} icon={GraduationCap} accent="blue" />
          <Stat label="Dormant" value={dormant} icon={Moon} />
          <Stat label="Total applications" value={total} icon={ClipboardList} />
          <Stat label="Overdue tasks" value={overdueTasks} icon={AlertTriangle} accent={overdueTasks > 0 ? "red" : undefined} />
          <Stat label="Interviews this week" value={interviewsThisWeek} icon={Calendar} accent="violet" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pipeline funnel */}
          <Card className="lg:col-span-2 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Pipeline funnel</CardTitle>
              <CardDescription>Applications by current stage.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {PIPELINE_STAGES.map((s) => {
                  const v = counts?.[s] ?? 0;
                  const pct = total ? Math.max(2, (v / total) * 100) : 0;
                  return (
                    <div key={s} className="flex items-center gap-3">
                      <span className="w-52 shrink-0 text-xs text-muted-foreground">
                        {PIPELINE_STAGE_LABELS[s]}
                      </span>
                      <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-primary/80 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-end pr-2.5 text-[11px] font-semibold text-foreground">
                          {v}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent enquiries */}
          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Recent enquiries</CardTitle>
              <CardDescription>Latest 8 applications.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-0">
                {recent.length === 0 && (
                  <li className="text-sm text-muted-foreground">No enquiries yet.</li>
                )}
                {recent.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-start justify-between gap-2 border-b border-border py-2.5 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <Link
                        to="/applications/$id"
                        params={{ id: r.id }}
                        className="block truncate text-sm font-medium hover:text-primary"
                      >
                        {r.contact?.name ?? "—"}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">{r.contact?.email}</p>
                      <p className="text-[11px] text-muted-foreground/70">
                        {formatDistanceToNow(r.created_at)}
                      </p>
                    </div>
                    <StageBadge stage={r.pipeline_stage} />
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

function Stat({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof Users;
  accent?: "amber" | "blue" | "red" | "violet";
}) {
  const iconColor =
    accent === "amber" ? "text-amber-500 bg-amber-50" :
    accent === "blue"  ? "text-blue-500 bg-blue-50" :
    accent === "red"   ? "text-red-500 bg-red-50" :
    accent === "violet"? "text-violet-500 bg-violet-50" :
                         "text-muted-foreground bg-muted";
  const valueColor =
    accent === "red" ? "text-destructive" :
    accent === "blue" ? "text-blue-600" :
    accent === "amber" ? "text-amber-600" :
    accent === "violet" ? "text-violet-600" :
    "text-foreground";

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-none">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${iconColor}`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <p className={`mt-3 text-2xl font-bold tabular-nums ${valueColor}`}>{value}</p>
    </div>
  );
}
