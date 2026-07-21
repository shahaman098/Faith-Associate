import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  PIPELINE_STAGES,
  PIPELINE_STAGE_LABELS,
  WEBSITES,
  type PipelineStage,
} from "@/lib/crm-constants";
import type { DecisionStatus } from "@/lib/crm-constants";
import { DecisionBadge } from "@/components/StageBadge";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/pipeline")({
  component: Pipeline,
});

type Card = {
  id: string;
  pipeline_stage: PipelineStage;
  decision_status: DecisionStatus;
  contact: { name: string; email: string; website: string | null } | null;
  course: { name: string } | null;
  form: { website: string | null } | null;
};

function Pipeline() {
  const [cards, setCards] = useState<Card[]>([]);
  const [website, setWebsite] = useState<string>("all");

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("applications")
      .select(
        "id, pipeline_stage, decision_status, contact:contacts(name, email, website), course:courses(name), form:forms(website)",
      )
      .order("created_at", { ascending: false })
      .limit(500);
    if (data) setCards(data as never);
  }

  async function move(id: string, stage: PipelineStage) {
    const { error } = await supabase
      .from("applications")
      .update({ pipeline_stage: stage })
      .eq("id", id);
    if (error) return toast.error(error.message);
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, pipeline_stage: stage } : c)));
  }

  const websites = useMemo(() => {
    const set = new Set<string>();
    WEBSITES.forEach((w) => set.add(w));
    cards.forEach((c) => {
      const w = c.form?.website ?? c.contact?.website;
      if (w) set.add(w);
    });
    return Array.from(set).sort();
  }, [cards]);

  const visible = cards.filter((c) => {
    if (website === "all") return true;
    const w = c.form?.website ?? c.contact?.website ?? null;
    if (website === "__none__") return !w;
    return w === website;
  });

  return (
    <div>
      <PageHeader
        title="Pipeline"
        description="Drag-free kanban — use the dropdown on each card to move stages."
        actions={
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
        }
      />
      <div className="overflow-x-auto px-6 py-6 md:px-10">
        <div className="flex gap-4" style={{ minWidth: `${PIPELINE_STAGES.length * 280}px` }}>
          {PIPELINE_STAGES.map((s) => {
            const inStage = visible.filter((c) => c.pipeline_stage === s);
            return (
              <div key={s} className="w-[260px] flex-shrink-0 rounded-lg bg-muted/50 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {PIPELINE_STAGE_LABELS[s]}
                  </p>
                  <span className="rounded bg-card px-1.5 py-0.5 text-[10px] font-medium">
                    {inStage.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {inStage.map((c) => {
                    const w = c.form?.website ?? c.contact?.website ?? null;
                    return (
                      <div key={c.id} className="rounded-md border border-border bg-card p-3">
                        <Link
                          to="/applications/$id"
                          params={{ id: c.id }}
                          className="block text-sm font-medium hover:underline"
                        >
                          {c.contact?.name ?? "—"}
                        </Link>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {c.contact?.email}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {c.course?.name ?? "—"}
                        </p>
                        {w && (
                          <Badge variant="secondary" className="mt-1 font-mono text-[9px]">
                            {w}
                          </Badge>
                        )}
                        <div className="mt-2 flex items-center justify-between">
                          <DecisionBadge status={c.decision_status} />
                          <select
                            value={c.pipeline_stage}
                            onChange={(e) => void move(c.id, e.target.value as PipelineStage)}
                            className="rounded border border-input bg-transparent px-1 py-0.5 text-[10px]"
                          >
                            {PIPELINE_STAGES.map((opt) => (
                              <option key={opt} value={opt}>
                                {PIPELINE_STAGE_LABELS[opt]}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                  {inStage.length === 0 && (
                    <p className="py-4 text-center text-[11px] text-muted-foreground">Empty</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
