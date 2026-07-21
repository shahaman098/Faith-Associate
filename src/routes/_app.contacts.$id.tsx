import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StageBadge } from "@/components/StageBadge";
import { useAuth } from "@/lib/auth-context";
import { formatDateTime, formatDate } from "@/lib/format";
import type { PipelineStage } from "@/lib/crm-constants";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/contacts/$id")({
  component: ContactDetail,
});

function ContactDetail() {
  const { id } = useParams({ from: "/_app/contacts/$id" });
  const { user } = useAuth();
  const [contact, setContact] = useState<{
    id: string;
    name: string;
    email: string;
    phone: string | null;
    country: string | null;
    source: string | null;
    created_at: string;
  } | null>(null);
  const [apps, setApps] = useState<
    Array<{
      id: string;
      pipeline_stage: PipelineStage;
      created_at: string;
      course: { name: string } | null;
    }>
  >([]);
  const [activities, setActivities] = useState<
    Array<{
      id: string;
      type: string;
      body: string | null;
      created_at: string;
      is_system: boolean;
    }>
  >([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    void load();
  }, [id]);

  async function load() {
    const [c, a, act] = await Promise.all([
      supabase.from("contacts").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("applications")
        .select("id, pipeline_stage, created_at, course:courses(name)")
        .eq("contact_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("activities")
        .select("id, type, body, created_at, is_system")
        .eq("contact_id", id)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);
    if (c.data) setContact(c.data);
    if (a.data) setApps(a.data as never);
    if (act.data) setActivities(act.data);
  }

  async function addNote() {
    if (!note.trim() || !user) return;
    const { error } = await supabase.from("activities").insert({
      contact_id: id,
      type: "note",
      body: note.trim(),
      actor_id: user.id,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setNote("");
    void load();
  }

  if (!contact) {
    return <div className="p-10 text-sm text-muted-foreground">Loading…</div>;
  }

  return (
    <div>
      <PageHeader
        title={contact.name}
        description={`${contact.email}${contact.phone ? ` · ${contact.phone}` : ""}`}
      />
      <div className="grid gap-6 px-6 py-6 md:px-10 md:py-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {apps.length === 0 && (
                <p className="text-sm text-muted-foreground">No applications.</p>
              )}
              <ul className="space-y-2">
                {apps.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2"
                  >
                    <div>
                      <Link
                        to="/applications/$id"
                        params={{ id: a.id }}
                        className="text-sm font-medium hover:underline"
                      >
                        {a.course?.name ?? "—"}
                      </Link>
                      <p className="text-xs text-muted-foreground">{formatDate(a.created_at)}</p>
                    </div>
                    <StageBadge stage={a.pipeline_stage} />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Add an internal note about this contact…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
              <Button size="sm" onClick={addNote} disabled={!note.trim()}>
                Save note
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length === 0 && (
                <p className="text-sm text-muted-foreground">No activity yet.</p>
              )}
              <ul className="space-y-3">
                {activities.map((act) => (
                  <li key={act.id} className="border-l-2 border-primary/30 pl-3">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {act.type.replaceAll("_", " ")} · {formatDateTime(act.created_at)}
                    </p>
                    {act.body && <p className="mt-0.5 text-sm">{act.body}</p>}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Field label="Email" value={contact.email} />
              <Field label="Phone" value={contact.phone} />
              <Field label="Country" value={contact.country} />
              <Field label="Source" value={contact.source} />
              <Field label="Created" value={formatDate(contact.created_at)} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{value ?? "—"}</span>
    </div>
  );
}
