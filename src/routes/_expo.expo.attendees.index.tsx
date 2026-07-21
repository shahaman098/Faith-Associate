import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { EXPO_ATTENDEE_STATUSES, attendeeStatusTone } from "@/lib/expo-constants";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_expo/expo/attendees/")({
  component: AttendeesList,
});

type Row = {
  id: string;
  status: string;
  source: string | null;
  registration_type: string | null;
  ticket_type: string | null;
  created_at: string;
  contact: { name: string; email: string } | null;
  event: { name: string } | null;
};

function AttendeesList() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("expo_attendees")
      .select(
        "id, status, source, registration_type, ticket_type, created_at, contact:contacts(name, email), event:expo_events(name)",
      )
      .order("created_at", { ascending: false })
      .limit(500);
    if (data) setRows(data as never);
  }

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (q) {
        const hay = `${r.contact?.name ?? ""} ${r.contact?.email ?? ""} ${r.event?.name ?? ""}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [rows, q, status]);

  return (
    <div>
      <PageHeader title="Attendees" description="All Mosque Expo attendee registrations." />
      <div className="space-y-4 px-6 py-6 md:px-10 md:py-8">
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Search name, email, event…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-xs"
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {EXPO_ATTENDEE_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ticket Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Registered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    No attendees match.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <Link to="/expo/attendees/$id" params={{ id: r.id }} className="font-medium hover:underline">
                      {r.contact?.name ?? "—"}
                    </Link>
                    <p className="text-xs text-muted-foreground">{r.contact?.email}</p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.event?.name ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={attendeeStatusTone(r.status as never)} className="text-[10px]">
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.ticket_type ?? "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.source ?? "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(r.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
