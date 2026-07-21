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
import { EXPO_MEETING_STATUSES, EXPO_MEETING_OUTCOMES } from "@/lib/expo-constants";
import { formatDate } from "@/lib/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_expo/expo/meetings")({
  component: ExpoMeetingsPage,
});

type Row = {
  id: string;
  scheduled_for: string;
  meeting_type: string;
  status: string;
  outcome: string | null;
  notes: string | null;
  follow_up_due_at: string | null;
  exhibitor_id: string;
  exhibitor: {
    contact: { name: string } | null;
    company: { name: string } | null;
  } | null;
};

function statusTone(s: string): "default" | "secondary" | "outline" | "destructive" {
  if (s === "Completed") return "default";
  if (s === "Cancelled" || s === "No Show") return "destructive";
  if (s === "Booked") return "secondary";
  return "outline";
}

function ExpoMeetingsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("expo_meetings")
      .select(
        "id, scheduled_for, meeting_type, status, outcome, notes, follow_up_due_at, exhibitor_id, exhibitor:expo_exhibitors(contact:contacts(name), company:companies(name))",
      )
      .order("scheduled_for", { ascending: false })
      .limit(300);
    if (data) setRows(data as never);
  }

  async function updateOutcome(id: string, outcome: string) {
    const { error } = await supabase.from("expo_meetings").update({ outcome, status: "Completed" }).eq("id", id);
    if (error) return toast.error(error.message);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, outcome, status: "Completed" } : r)));
    toast.success("Outcome saved");
  }

  const visible = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  const now = new Date().toISOString();
  const needsOutcome = rows.filter(
    (r) => r.status === "Booked" && r.scheduled_for < now && !r.outcome,
  );

  return (
    <div>
      <PageHeader title="Meetings" description="All Expo exhibitor meetings." />
      <div className="space-y-6 px-6 py-6 md:px-10 md:py-8">
        {needsOutcome.length > 0 && (
          <div className="rounded-md border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
            ⚠ {needsOutcome.length} meeting{needsOutcome.length > 1 ? "s" : ""} past scheduled time with no outcome logged.
          </div>
        )}

        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {EXPO_MEETING_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exhibitor</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Follow-up due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    No meetings.
                  </TableCell>
                </TableRow>
              )}
              {visible.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <Link to="/expo/exhibitors/$id" params={{ id: r.exhibitor_id }} className="font-medium hover:underline">
                      {(r.exhibitor?.contact as { name: string } | null)?.name ?? (r.exhibitor?.company as { name: string } | null)?.name ?? "—"}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(r.scheduled_for)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.meeting_type}</TableCell>
                  <TableCell>
                    <Badge variant={statusTone(r.status)} className="text-[10px]">{r.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {r.outcome ? (
                      <span className="text-xs text-muted-foreground">{r.outcome}</span>
                    ) : r.status === "Booked" && r.scheduled_for < now ? (
                      <Select onValueChange={(v) => updateOutcome(r.id, v)}>
                        <SelectTrigger className="h-7 w-[160px] text-xs">
                          <SelectValue placeholder="Log outcome…" />
                        </SelectTrigger>
                        <SelectContent>
                          {EXPO_MEETING_OUTCOMES.map((o) => (
                            <SelectItem key={o} value={o}>{o}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {r.follow_up_due_at ? formatDate(r.follow_up_due_at) : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
