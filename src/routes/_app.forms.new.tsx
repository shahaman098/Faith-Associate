import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { WEBSITES } from "@/lib/crm-constants";

export const Route = createFileRoute("/_app/forms/new")({
  validateSearch: (search: Record<string, unknown>) => ({
    website: typeof search.website === "string" ? search.website : "",
  }),
  component: NewForm,
});

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function NewForm() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [website, setWebsite] = useState(search.website || "");
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("none");
  const [courses, setCourses] = useState<Array<{ id: string; name: string }>>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void supabase
      .from("courses")
      .select("id, name")
      .eq("is_active", true)
      .order("name")
      .then(({ data }) => data && setCourses(data));
  }, []);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  async function save() {
    if (!name.trim() || !slug.trim()) {
      toast.error("Name and slug are required");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase
      .from("forms")
      .insert({
        name: name.trim(),
        slug: slug.trim(),
        website: website.trim() || null,
        headline: headline.trim() || null,
        description: description.trim() || null,
        course_id: courseId === "none" ? null : courseId,
      })
      .select("id")
      .single();
    setBusy(false);
    if (error) {
      toast.error(error.message.includes("unique") ? "Slug already in use" : error.message);
      return;
    }
    toast.success("Form created");
    void navigate({ to: "/forms/$id", params: { id: data.id } });
  }

  return (
    <div>
      <PageHeader title="New form" description="Create a new enquiry form for your websites." />
      <div className="px-6 py-6 md:px-10 md:py-8">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="text-base">Form details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Homepage Enquiry"
              />
              <p className="text-xs text-muted-foreground">
                Internal name. Used as the source tag for submissions.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL slug *</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">/f/</span>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                  className="font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Select
                value={website || "none"}
                onValueChange={(v) => setWebsite(v === "none" ? "" : v)}
              >
                <SelectTrigger id="website">
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
                The website this form lives on. Submissions are tagged with this domain so you can
                segment contacts by source.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="headline">Headline (shown to visitors)</Label>
              <Input
                id="headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Enquire about Mosque MBA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short blurb shown above the form."
              />
            </div>
            <div className="space-y-2">
              <Label>Default course</Label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="No specific course" />
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
              <p className="text-xs text-muted-foreground">
                Submissions to this form will be attached to this course.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={save} disabled={busy}>
                {busy ? "Creating…" : "Create form"}
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: "/forms" })}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
