import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  PIPELINE_STAGES,
  PIPELINE_STAGE_LABELS,
  WEBSITES,
  type PipelineStage,
} from "@/lib/crm-constants";
import { StageBadge, DecisionBadge, PaymentBadge } from "@/components/StageBadge";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_app/applications/")({
  component: ApplicationsList,
});

type Row = {
  id: string;
  pipeline_stage: PipelineStage;
  decision_status: "pending" | "approved" | "on_hold" | "rejected" | "need_more_info";
  payment_status: "not_sent" | "sent" | "paid" | "overdue";
  created_at: string;
  is_possible_duplicate: boolean;
  contact: { name: string; email: string; website: string | null } | null;
  course: { name: string } | null;
  form: { website: string | null } | null;
};

function ApplicationsList() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<PipelineStage | "all">("all");
  const [website, setWebsite] = useState<string>("all");

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("applications")
      .select(
        "id, pipeline_stage, decision_status, payment_status, created_at, is_possible_duplicate, contact:contacts(name, email, website), course:courses(name), form:forms(website)",
      )
      .order("created_at", { ascending: false })
      .limit(500);
    if (data) setRows(data as never);
  }

  const websites = useMemo(() => {
    const set = new Set<string>();
    WEBSITES.forEach((w) => set.add(w));
    rows.forEach((r) => {
      const w = r.form?.website ?? r.contact?.website;
      if (w) set.add(w);
    });
    return Array.from(set).sort();
  }, [rows]);

  const filtered = rows.filter((r) => {
    if (stage !== "all" && r.pipeline_stage !== stage) return false;
    const w = r.form?.website ?? r.contact?.website ?? null;
    if (website !== "all") {
      if (website === "__none__" ? w : w !== website) return false;
    }
    if (q) {
      const hay =
        `${r.contact?.name ?? ""} ${r.contact?.email ?? ""} ${r.course?.name ?? ""} ${w ?? ""}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Applications"
        description="All admissions applications across every website."
      />
      <div className="space-y-4 px-6 py-6 md:px-10 md:py-8">
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Search…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-xs"
          />
          <Select value={stage} onValueChange={(v) => setStage(v as PipelineStage | "all")}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All stages</SelectItem>
              {PIPELINE_STAGES.map((s) => (
                <SelectItem key={s} value={s}>
                  {PIPELINE_STAGE_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={website} onValueChange={setWebsite}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Website" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All websites</SelectItem>
              <SelectItem value="__none__">— No website —</SelectItem>
              {websites.map((w) => (
                <SelectItem key={w} value={w}>
                  {w}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Decision</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    No applications match.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((r) => {
                const w = r.form?.website ?? r.contact?.website ?? null;
                return (
                  <TableRow key={r.id}>
                    <TableCell>
                      <Link
                        to="/applications/$id"
                        params={{ id: r.id }}
                        className="font-medium hover:underline"
                      >
                        {r.contact?.name ?? "—"}
                      </Link>
                      <p className="text-xs text-muted-foreground">{r.contact?.email}</p>
                      {r.is_possible_duplicate && (
                        <span className="mt-1 inline-block rounded bg-warning/20 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-warning-foreground">
                          Possible duplicate
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {r.course?.name ?? "—"}
                    </TableCell>
                    <TableCell>
                      {w ? (
                        <Badge variant="secondary" className="font-mono text-[10px]">
                          {w}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StageBadge stage={r.pipeline_stage} />
                    </TableCell>
                    <TableCell>
                      <DecisionBadge status={r.decision_status} />
                    </TableCell>
                    <TableCell>
                      <PaymentBadge status={r.payment_status} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(r.created_at)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
