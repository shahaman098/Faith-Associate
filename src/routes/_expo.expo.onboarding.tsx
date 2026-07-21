import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_expo/expo/onboarding")({
  component: OnboardingPage,
});

type Row = {
  id: string;
  logo_received: boolean;
  banner_received: boolean;
  exhibitor_description_received: boolean;
  power_requirements_received: boolean;
  stand_requirements_received: boolean;
  team_passes_confirmed: boolean;
  final_confirmation_sent: boolean;
  completed_at: string | null;
  exhibitor_id: string;
  exhibitor: {
    pipeline_stage: string;
    contact: { name: string } | null;
    company: { name: string } | null;
  } | null;
};

function checkCount(r: Row): number {
  return [
    r.logo_received,
    r.banner_received,
    r.exhibitor_description_received,
    r.power_requirements_received,
    r.stand_requirements_received,
    r.team_passes_confirmed,
    r.final_confirmation_sent,
  ].filter(Boolean).length;
}

function OnboardingPage() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("expo_onboarding_checklists")
      .select(
        "id, logo_received, banner_received, exhibitor_description_received, power_requirements_received, stand_requirements_received, team_passes_confirmed, final_confirmation_sent, completed_at, exhibitor_id, exhibitor:expo_exhibitors(pipeline_stage, contact:contacts(name), company:companies(name))",
      )
      .order("completed_at", { ascending: true })
      .limit(300);
    if (data) setRows(data as never);
  }

  const inProgress = rows.filter((r) => !r.completed_at);
  const completed = rows.filter((r) => r.completed_at);

  return (
    <div>
      <PageHeader title="Onboarding" description="Exhibitor onboarding checklists and readiness." />
      <div className="space-y-8 px-6 py-6 md:px-10 md:py-8">
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            In Progress ({inProgress.length})
          </h2>
          <div className="rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exhibitor</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Logo</TableHead>
                  <TableHead>Banner</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Power</TableHead>
                  <TableHead>Stand</TableHead>
                  <TableHead>Passes</TableHead>
                  <TableHead>Confirmation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inProgress.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="py-8 text-center text-sm text-muted-foreground">
                      No exhibitors in onboarding.
                    </TableCell>
                  </TableRow>
                )}
                {inProgress.map((r) => {
                  const done = checkCount(r);
                  return (
                    <TableRow key={r.id}>
                      <TableCell>
                        <Link to="/expo/exhibitors/$id" params={{ id: r.exhibitor_id }} className="font-medium hover:underline">
                          {(r.exhibitor?.contact as { name: string } | null)?.name ?? (r.exhibitor?.company as { name: string } | null)?.name ?? "—"}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">{r.exhibitor?.pipeline_stage}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                            <div className="h-full bg-emerald-500" style={{ width: `${(done / 7) * 100}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{done}/7</span>
                        </div>
                      </TableCell>
                      {[r.logo_received, r.banner_received, r.exhibitor_description_received, r.power_requirements_received, r.stand_requirements_received, r.team_passes_confirmed, r.final_confirmation_sent].map((v, i) => (
                        <TableCell key={i}>
                          <span className={v ? "text-emerald-600" : "text-destructive"}>{v ? "✓" : "✗"}</span>
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Ready for Expo ({completed.length})
          </h2>
          <div className="rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exhibitor</TableHead>
                  <TableHead>Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completed.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="py-8 text-center text-sm text-muted-foreground">
                      None completed yet.
                    </TableCell>
                  </TableRow>
                )}
                {completed.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <Link to="/expo/exhibitors/$id" params={{ id: r.exhibitor_id }} className="font-medium hover:underline">
                        {(r.exhibitor?.contact as { name: string } | null)?.name ?? (r.exhibitor?.company as { name: string } | null)?.name ?? "—"}
                      </Link>
                    </TableCell>
                    <TableCell className="text-xs text-emerald-600 font-medium">{formatDate(r.completed_at!)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </div>
  );
}
