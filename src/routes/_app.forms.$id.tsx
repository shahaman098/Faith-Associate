import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, Trash2, ExternalLink } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { WEBSITES } from "@/lib/crm-constants";

export const Route = createFileRoute("/_app/forms/$id")({
  component: FormDetail,
});

type Form = {
  id: string;
  slug: string;
  name: string;
  website: string | null;
  headline: string | null;
  description: string | null;
  course_id: string | null;
  success_message: string;
  redirect_url: string | null;
  show_phone: boolean;
  show_country: boolean;
  show_message: boolean;
  require_phone: boolean;
  is_active: boolean;
  submission_count: number;
};

function FormDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [form, setForm] = useState<Form | null>(null);
  const [courses, setCourses] = useState<Array<{ id: string; name: string }>>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void load();
    void supabase
      .from("courses")
      .select("id, name")
      .eq("is_active", true)
      .order("name")
      .then(({ data }) => data && setCourses(data));
  }, [id]);

  async function load() {
    const { data } = await supabase.from("forms").select("*").eq("id", id).maybeSingle();
    if (data) setForm(data as Form);
  }

  function update<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  }

  async function save() {
    if (!form) return;
    setBusy(true);
    const { error } = await supabase
      .from("forms")
      .update({
        name: form.name,
        slug: form.slug,
        website: form.website,
        headline: form.headline,
        description: form.description,
        course_id: form.course_id,
        success_message: form.success_message,
        redirect_url: form.redirect_url,
        show_phone: form.show_phone,
        show_country: form.show_country,
        show_message: form.show_message,
        require_phone: form.require_phone,
        is_active: form.is_active,
      })
      .eq("id", form.id);
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  }

  async function remove() {
    if (!form) return;
    if (!confirm(`Delete form "${form.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("forms").delete().eq("id", form.id);
    if (error) return toast.error(error.message);
    toast.success("Form deleted");
    void navigate({ to: "/forms" });
  }

  if (!form) return <div className="p-10 text-sm text-muted-foreground">Loading…</div>;

  const url = `${window.location.origin}/f/${form.slug}`;
  const embed = `<iframe src="${url}" width="100%" height="700" style="border:0;max-width:640px;" loading="lazy" title="Enquiry form"></iframe>`;

  async function copy(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  }

  return (
    <div>
      <PageHeader
        title={form.name}
        description={`/f/${form.slug}`}
        actions={
          <>
            <Badge variant={form.is_active ? "secondary" : "outline"}>
              {form.is_active ? "Active" : "Off"}
            </Badge>
            <Badge variant="outline">{form.submission_count} submissions</Badge>
          </>
        }
      />
      <div className="grid gap-6 px-6 py-6 md:grid-cols-3 md:px-10 md:py-8">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Form details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => update("name", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input
                    value={form.slug}
                    onChange={(e) => update("slug", e.target.value)}
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Select
                  value={form.website ?? "none"}
                  onValueChange={(v) => update("website", v === "none" ? null : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a website" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— No website —</SelectItem>
                    {WEBSITES.map((w) => (
                      <SelectItem key={w} value={w} className="font-mono">
                        {w}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Source website. All submissions to this form will be tagged with this domain.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Headline</Label>
                <Input
                  value={form.headline ?? ""}
                  onChange={(e) => update("headline", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={form.description ?? ""}
                  onChange={(e) => update("description", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Default course</Label>
                <Select
                  value={form.course_id ?? "none"}
                  onValueChange={(v) => update("course_id", v === "none" ? null : v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific course</SelectItem>
                    {courses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fields</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">Name and email are always required.</p>
              <FieldToggle
                label="Show phone field"
                checked={form.show_phone}
                onChange={(v) => update("show_phone", v)}
              />
              {form.show_phone && (
                <div className="ml-6 flex items-center gap-2">
                  <Checkbox
                    id="reqphone"
                    checked={form.require_phone}
                    onCheckedChange={(v) => update("require_phone", v === true)}
                  />
                  <Label htmlFor="reqphone" className="text-sm font-normal">
                    Require phone
                  </Label>
                </div>
              )}
              <FieldToggle
                label="Show country field"
                checked={form.show_country}
                onChange={(v) => update("show_country", v)}
              />
              <FieldToggle
                label="Show message field"
                checked={form.show_message}
                onChange={(v) => update("show_message", v)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">After submission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Success message</Label>
                <Textarea
                  rows={2}
                  value={form.success_message}
                  onChange={(e) => update("success_message", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Redirect URL (optional)</Label>
                <Input
                  value={form.redirect_url ?? ""}
                  onChange={(e) => update("redirect_url", e.target.value || null)}
                  placeholder="https://example.com/thanks"
                />
                <p className="text-xs text-muted-foreground">
                  If set, visitors are redirected here after submitting instead of seeing the
                  success message.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button onClick={save} disabled={busy}>
              {busy ? "Saving…" : "Save changes"}
            </Button>
            {isAdmin && (
              <Button variant="outline" onClick={remove} className="text-destructive">
                <Trash2 className="h-4 w-4" />
                Delete form
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Form is {form.is_active ? "live" : "off"}</p>
                  <p className="text-xs text-muted-foreground">
                    {form.is_active ? "Submissions accepted" : "Visitors see a 404"}
                  </p>
                </div>
                <Switch checked={form.is_active} onCheckedChange={(v) => update("is_active", v)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Share</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Hosted link
                </Label>
                <div className="flex gap-1">
                  <Input value={url} readOnly className="font-mono text-xs" />
                  <Button size="icon" variant="outline" onClick={() => copy(url, "Link")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" asChild>
                    <a href={url} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Embed code
                </Label>
                <Textarea value={embed} readOnly rows={4} className="font-mono text-xs" />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copy(embed, "Embed code")}
                  className="w-full"
                >
                  <Copy className="h-4 w-4" />
                  Copy embed code
                </Button>
                <p className="text-xs text-muted-foreground">
                  Paste this snippet into any website to embed the form.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function FieldToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-sm font-normal">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
