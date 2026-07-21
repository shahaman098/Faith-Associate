import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, ExternalLink, Code2, Globe } from "lucide-react";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import { WEBSITES } from "@/lib/crm-constants";

export const Route = createFileRoute("/_app/forms/")({
  component: FormsList,
});

type FormRow = {
  id: string;
  slug: string;
  name: string;
  website: string | null;
  is_active: boolean;
  submission_count: number;
  created_at: string;
};

const UNASSIGNED_KEY = "__unassigned__";

function FormsList() {
  const [rows, setRows] = useState<FormRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [website, setWebsite] = useState<string>("all");

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("forms")
      .select("id, slug, name, website, is_active, submission_count, created_at")
      .order("website", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (data) setRows(data);
    setLoading(false);
  }

  // Group forms by website. Show every website from the master list,
  // even if it currently has zero forms, plus an "Unassigned" group
  // for forms that have no website set.
  const groups = useMemo(() => {
    const map = new Map<string, FormRow[]>();
    WEBSITES.forEach((w) => map.set(w, []));
    map.set(UNASSIGNED_KEY, []);
    rows.forEach((r) => {
      const key = r.website ?? UNASSIGNED_KEY;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    });
    return map;
  }, [rows]);

  const visibleKeys = useMemo(() => {
    const keys = Array.from(groups.keys());
    if (website === "all") {
      // Hide the "Unassigned" bucket if it's empty to reduce clutter.
      return keys.filter((k) => k !== UNASSIGNED_KEY || (groups.get(k)?.length ?? 0) > 0);
    }
    if (website === UNASSIGNED_KEY) return [UNASSIGNED_KEY];
    return [website];
  }, [groups, website]);

  async function copyEmbed(slug: string) {
    const url = `${window.location.origin}/f/${slug}`;
    const snippet = `<iframe src="${url}" width="100%" height="700" style="border:0;max-width:640px;" loading="lazy" title="Enquiry form"></iframe>`;
    await navigator.clipboard.writeText(snippet);
    toast.success("Embed code copied");
  }

  async function copyLink(slug: string) {
    const url = `${window.location.origin}/f/${slug}`;
    await navigator.clipboard.writeText(url);
    toast.success("Link copied");
  }

  return (
    <div>
      <PageHeader
        title="Forms"
        description="Hosted enquiry forms organised by website. Each submission is tagged with its source domain."
        actions={
          <Button asChild>
            <Link to="/forms/new">
              <Plus className="h-4 w-4" />
              New form
            </Link>
          </Button>
        }
      />
      <div className="space-y-6 px-6 py-6 md:px-10 md:py-8">
        <div className="flex flex-wrap gap-2">
          <Select value={website} onValueChange={setWebsite}>
            <SelectTrigger className="w-[260px]">
              <SelectValue placeholder="Website" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All websites</SelectItem>
              <SelectItem value={UNASSIGNED_KEY}>— Unassigned —</SelectItem>
              {WEBSITES.map((w) => (
                <SelectItem key={w} value={w}>
                  {w}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Loading…
            </CardContent>
          </Card>
        )}

        {!loading &&
          visibleKeys.map((key) => {
            const forms = groups.get(key) ?? [];
            const isUnassigned = key === UNASSIGNED_KEY;
            const totalSubs = forms.reduce((sum, f) => sum + f.submission_count, 0);
            return (
              <Card key={key}>
                <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="font-mono text-sm">
                      {isUnassigned ? "Unassigned" : key}
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px]">
                      {forms.length} form{forms.length === 1 ? "" : "s"}
                    </Badge>
                    {forms.length > 0 && (
                      <Badge variant="secondary" className="text-[10px]">
                        {totalSubs} submission{totalSubs === 1 ? "" : "s"}
                      </Badge>
                    )}
                  </div>
                  {!isUnassigned && (
                    <Button asChild size="sm" variant="outline">
                      <Link to="/forms/new" search={{ website: key } as never}>
                        <Plus className="h-3.5 w-3.5" />
                        Add form
                      </Link>
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="p-0">
                  {forms.length === 0 ? (
                    <div className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
                      No forms yet for this website.{" "}
                      {!isUnassigned && (
                        <Link
                          to="/forms/new"
                          search={{ website: key } as never}
                          className="text-primary hover:underline"
                        >
                          Create one →
                        </Link>
                      )}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Slug</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Submissions</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Share</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {forms.map((f) => (
                          <TableRow key={f.id}>
                            <TableCell className="font-medium">
                              <Link
                                to="/forms/$id"
                                params={{ id: f.id }}
                                className="hover:underline"
                              >
                                {f.name}
                              </Link>
                            </TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              /f/{f.slug}
                            </TableCell>
                            <TableCell>
                              {f.is_active ? (
                                <Badge variant="secondary">Active</Badge>
                              ) : (
                                <Badge variant="outline">Off</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              {f.submission_count}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDate(f.created_at)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyLink(f.slug)}
                                  title="Copy link"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyEmbed(f.slug)}
                                  title="Copy embed code"
                                >
                                  <Code2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
