import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPO_ATTENDEE_STATUSES, attendeeStatusTone } from "@/lib/expo-constants";
import { formatDate, formatDistanceToNow } from "@/lib/format";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_expo/expo/attendees/$id")({
  component: AttendeeDetail,
});

type Attendee = {
  id: string;
  status: string;
  source: string | null;
  registration_type: string | null;
  ticket_type: string | null;
  reminder_count: number;
  last_reminder_sent_at: string | null;
  checked_in_at: string | null;
  created_at: string;
  contact: { id: string; name: string; email: string; phone: string | null } | null;
  event: { name: string; event_date_start: string | null; venue_name: string | null } | null;
};

type Activity = {
  id: string;
  type: string;
  body: string | null;
  created_at: string;
};

function AttendeeDetail() {
  const { id } = Route.useParams();
  const [att, setAtt] = useState<Attendee | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void load();
  }, [id]);

  async function load() {
    const [attRes, actRes] = await Promise.all([
      supabase
        .from("expo_attendees")
        .select(
          "id, status, source, registration_type, ticket_type, reminder_count, last_reminder_sent_at, checked_in_at, created_at, contact:contacts(id, name, email, phone), event:expo_events(name, event_date_start, venue_name)",
        )
        .eq("id", id)
        .single(),
      supabase
        .from("activities")
        .select("id, type, body, created_at")
        .or(`metadata->>attendee_id.eq.${id}`)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);
    if (attRes.data) setAtt(attRes.data as never);
    if (actRes.data) setActivities(actRes.data as never);
  }

  async function updateStatus(value: string) {
    const { error } = await supabase
      .from("expo_attendees")
      .update({ status: value })
      .eq("id", id);
    if (error) return toast.error(error.message);
    setAtt((prev) => (prev ? { ...prev, status: value } : prev));
    toast.success("Status updated");
  }

  async function addNote() {
    if (!note.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("activities").insert({
      type: "note_added",
      body: note.trim(),
      metadata: { attendee_id: id },
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    setNote("");
    toast.success("Note added");
    void load();
  }

  if (!att) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={att.contact?.name ?? "Attendee"}
        description={att.event?.name ?? ""}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link to="/expo/attendees">
              <ArrowLeft className="h-4 w-4" />
              Back to list
            </Link>
          </Button>
        }
      />
      <div className="space-y-6 px-6 py-6 md:px-10 md:py-8">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-sm">Profile</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
              {att.contact && (
                <Link to="/contacts/$id" params={{ id: att.contact.id }} className="font-medium hover:underline">
                  {att.contact.name}
                </Link>
              )}
              <p className="text-muted-foreground">{att.contact?.email}</p>
              <p className="text-muted-foreground">{att.contact?.phone ?? "—"}</p>
              <p className="text-xs text-muted-foreground mt-2">Source: {att.source ?? "—"}</p>
              <p className="text-xs text-muted-foreground">Ticket: {att.ticket_type ?? "—"}</p>
              <p className="text-xs text-muted-foreground">Registration: {att.registration_type ?? "—"}</p>
              <p className="text-xs text-muted-foreground">Reminders sent: {att.reminder_count}</p>
              {att.checked_in_at && (
                <p className="text-xs text-emerald-600 font-medium">Checked in: {formatDate(att.checked_in_at)}</p>
              )}
              <p className="text-xs text-muted-foreground">Registered: {formatDate(att.created_at)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Event</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium">{att.event?.name ?? "—"}</p>
              {att.event?.event_date_start && (
                <p className="text-muted-foreground">{formatDate(att.event.event_date_start)}</p>
              )}
              <p className="text-muted-foreground">{att.event?.venue_name ?? "—"}</p>
              <div className="mt-3 space-y-2">
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant={attendeeStatusTone(att.status as never)}>{att.status}</Badge>
                <Select value={att.status} onValueChange={updateStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPO_ATTENDEE_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-sm">Add Note</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Textarea placeholder="Add a note…" value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
            <Button size="sm" onClick={addNote} disabled={saving || !note.trim()}>
              {saving ? "Saving…" : "Add note"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Activity Timeline</CardTitle></CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-xs text-muted-foreground">No activity yet.</p>
            ) : (
              <ul className="space-y-3">
                {activities.map((a) => (
                  <li key={a.id} className="flex gap-3 border-b border-border pb-3 last:border-b-0">
                    <div className="h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400 mt-1.5" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{a.type.replace(/_/g, " ")}</p>
                      {a.body && <p className="mt-0.5 text-sm">{a.body}</p>}
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{formatDistanceToNow(a.created_at)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
