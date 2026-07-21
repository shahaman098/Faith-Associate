import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { EXPO_EVENT_STATUSES } from "@/lib/expo-constants";
import { formatDate } from "@/lib/format";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_expo/expo/admin")({
  component: ExpoAdminPage,
});

type ExpoEvent = {
  id: string;
  name: string;
  slug: string;
  event_date_start: string | null;
  event_date_end: string | null;
  venue_name: string | null;
  early_bird_deadline: string | null;
  status: string;
  created_at: string;
};

type AuditLog = {
  id: string;
  action: string;
  table_name: string | null;
  record_id: string | null;
  actor_id: string | null;
  created_at: string;
};

function ExpoAdminPage() {
  const { isAdmin, loading, authError } = useAuth();
  const [events, setEvents] = useState<ExpoEvent[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    event_date_start: "",
    event_date_end: "",
    venue_name: "",
    early_bird_deadline: "",
    status: "Draft",
  });

  useEffect(() => {
    if (!loading && isAdmin) void load();
  }, [loading, isAdmin]);

  async function load() {
    const [evtRes, auditRes] = await Promise.all([
      supabase.from("expo_events").select("id, name, slug, event_date_start, event_date_end, venue_name, early_bird_deadline, status, created_at").order("created_at", { ascending: false }),
      supabase.from("audit_logs").select("id, action, table_name, record_id, actor_id, created_at").order("created_at", { ascending: false }).limit(50),
    ]);
    if (evtRes.data) setEvents(evtRes.data as never);
    if (auditRes.data) setAuditLogs(auditRes.data as never);
  }

  async function saveEvent() {
    if (!isAdmin) return toast.error("Admins only");
    if (!form.name || !form.slug) return toast.error("Name and slug are required");
    setSaving(true);
    const { error } = await supabase.from("expo_events").insert({
      name: form.name,
      slug: form.slug,
      event_date_start: form.event_date_start || null,
      event_date_end: form.event_date_end || null,
      venue_name: form.venue_name || null,
      early_bird_deadline: form.early_bird_deadline || null,
      status: form.status,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Event created");
    setShowEventForm(false);
    setForm({ name: "", slug: "", event_date_start: "", event_date_end: "", venue_name: "", early_bird_deadline: "", status: "Draft" });
    void load();
  }

  async function updateEventStatus(id: string, status: string) {
    if (!isAdmin) return toast.error("Admins only");
    const { error } = await supabase.from("expo_events").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    toast.success("Status updated");
  }

  if (loading) return <div className="p-10 text-sm text-muted-foreground">Loading…</div>;
  if (!isAdmin) {
    return (
      <div>
        <PageHeader title="Admin" description="Expo events, settings, and audit log." />
        <div className="px-6 py-6 md:px-10">
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              Admins only.
            </CardContent>
          </Card>
          {authError ? <p className="mt-3 text-xs text-destructive">{authError}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Admin" description="Expo events, settings, and audit log." />
      <div className="space-y-8 px-6 py-6 md:px-10 md:py-8">

        {/* Events */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Events</h2>
            <Button size="sm" onClick={() => setShowEventForm((v) => !v)}>
              <Plus className="h-4 w-4" />
              {showEventForm ? "Cancel" : "New Event"}
            </Button>
          </div>

          {showEventForm && (
            <Card className="mb-4">
              <CardHeader><CardTitle className="text-sm">New Expo Event</CardTitle></CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Mosque Expo 2025" />
                </div>
                <div className="space-y-1">
                  <Label>Slug</Label>
                  <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="mosque-expo-2025" />
                </div>
                <div className="space-y-1">
                  <Label>Start Date</Label>
                  <Input type="date" value={form.event_date_start} onChange={(e) => setForm((f) => ({ ...f, event_date_start: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label>End Date</Label>
                  <Input type="date" value={form.event_date_end} onChange={(e) => setForm((f) => ({ ...f, event_date_end: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label>Venue</Label>
                  <Input value={form.venue_name} onChange={(e) => setForm((f) => ({ ...f, venue_name: e.target.value }))} placeholder="ExCeL London" />
                </div>
                <div className="space-y-1">
                  <Label>Early Bird Deadline</Label>
                  <Input type="date" value={form.early_bird_deadline} onChange={(e) => setForm((f) => ({ ...f, early_bird_deadline: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {EXPO_EVENT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={saveEvent} disabled={saving}>{saving ? "Saving…" : "Create Event"}</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Early Bird</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No events yet.</TableCell>
                  </TableRow>
                )}
                {events.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{e.slug}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {e.event_date_start ? formatDate(e.event_date_start) : "—"}
                      {e.event_date_end ? ` → ${formatDate(e.event_date_end)}` : ""}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{e.venue_name ?? "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{e.early_bird_deadline ? formatDate(e.early_bird_deadline) : "—"}</TableCell>
                    <TableCell>
                      <Select value={e.status} onValueChange={(v) => updateEventStatus(e.id, v)}>
                        <SelectTrigger className="h-7 w-[120px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {EXPO_EVENT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Audit log */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Audit Log (last 50)</h2>
          <div className="rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Record</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">No audit logs.</TableCell>
                  </TableRow>
                )}
                {auditLogs.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-[10px]">{l.action}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{l.table_name ?? "—"}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{l.record_id?.slice(0, 8) ?? "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(l.created_at)}</TableCell>
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
