import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import { Plus, Pencil, X } from "lucide-react";

export const Route = createFileRoute("/_expo/expo/templates")({
  component: ExpoTemplatesPage,
});

type Template = {
  id: string;
  name: string;
  subject: string | null;
  body: string;
  website: string | null;
  created_at: string;
};

function ExpoTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editing, setEditing] = useState<Template | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", subject: "", body: "" });

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("email_templates")
      .select("id, name, subject, body, website, created_at")
      .eq("website", "mosqueexpo.com")
      .order("created_at", { ascending: false });
    if (data) setTemplates(data as never);
  }

  async function saveNew() {
    if (!form.name || !form.body) return toast.error("Name and body are required");
    setSaving(true);
    const { error } = await supabase.from("email_templates").insert({
      name: form.name,
      subject: form.subject || null,
      body: form.body,
      website: "mosqueexpo.com",
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Template created");
    setShowNew(false);
    setForm({ name: "", subject: "", body: "" });
    void load();
  }

  async function saveEdit() {
    if (!editing) return;
    setSaving(true);
    const { error } = await supabase
      .from("email_templates")
      .update({ name: editing.name, subject: editing.subject, body: editing.body })
      .eq("id", editing.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Template saved");
    setEditing(null);
    void load();
  }

  return (
    <div>
      <PageHeader
        title="Email Templates"
        description="Mosque Expo email templates with variable support."
        actions={
          <Button size="sm" onClick={() => { setShowNew((v) => !v); setEditing(null); }}>
            <Plus className="h-4 w-4" />
            {showNew ? "Cancel" : "New Template"}
          </Button>
        }
      />
      <div className="space-y-6 px-6 py-6 md:px-10 md:py-8">
        <p className="text-xs text-muted-foreground">
          Available variables: <code className="rounded bg-muted px-1">{"{{name}}"}</code>{" "}
          <code className="rounded bg-muted px-1">{"{{company}}"}</code>{" "}
          <code className="rounded bg-muted px-1">{"{{package}}"}</code>{" "}
          <code className="rounded bg-muted px-1">{"{{early_bird_deadline}}"}</code>{" "}
          <code className="rounded bg-muted px-1">{"{{invoice_amount}}"}</code>{" "}
          <code className="rounded bg-muted px-1">{"{{event_date}}"}</code>{" "}
          <code className="rounded bg-muted px-1">{"{{venue}}"}</code>
        </p>

        {showNew && (
          <Card>
            <CardHeader><CardTitle className="text-sm">New Template</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Early Bird Offer" />
              </div>
              <div className="space-y-1">
                <Label>Subject</Label>
                <Input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} placeholder="Email subject line" />
              </div>
              <div className="space-y-1">
                <Label>Body</Label>
                <Textarea value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} rows={8} placeholder="Email body…" />
              </div>
              <Button onClick={saveNew} disabled={saving}>{saving ? "Saving…" : "Create"}</Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          {templates.map((t) => (
            <Card key={t.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm">{t.name}</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => { setEditing(t); setShowNew(false); }}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {t.subject && <p className="text-xs text-muted-foreground">Subject: {t.subject}</p>}
                <p className="text-xs text-muted-foreground">Created: {formatDate(t.created_at)}</p>
              </CardHeader>
              {editing?.id === t.id ? (
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <Label>Name</Label>
                    <Input value={editing.name} onChange={(e) => setEditing((prev) => prev ? { ...prev, name: e.target.value } : prev)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Subject</Label>
                    <Input value={editing.subject ?? ""} onChange={(e) => setEditing((prev) => prev ? { ...prev, subject: e.target.value } : prev)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Body</Label>
                    <Textarea value={editing.body} onChange={(e) => setEditing((prev) => prev ? { ...prev, body: e.target.value } : prev)} rows={8} />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveEdit} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditing(null)}><X className="h-3 w-3" /></Button>
                  </div>
                </CardContent>
              ) : (
                <CardContent>
                  <pre className="max-h-32 overflow-y-auto whitespace-pre-wrap text-xs text-muted-foreground">{t.body}</pre>
                </CardContent>
              )}
            </Card>
          ))}
          {templates.length === 0 && !showNew && (
            <p className="col-span-2 py-10 text-center text-sm text-muted-foreground">No templates yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
