import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { WEBSITES } from "@/lib/crm-constants";

export const Route = createFileRoute("/_app/contacts/import")({
  component: ImportContacts,
});

type ParsedRow = {
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  source: string | null;
  message: string | null;
  _row: number;
  _error?: string;
};

type Course = { id: string; name: string };

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (line: string): string[] => {
    const out: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQuotes) {
        if (c === '"' && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else if (c === '"') {
          inQuotes = false;
        } else {
          cur += c;
        }
      } else {
        if (c === '"') inQuotes = true;
        else if (c === ",") {
          out.push(cur);
          cur = "";
        } else cur += c;
      }
    }
    out.push(cur);
    return out.map((s) => s.trim());
  };

  const headers = parseLine(lines[0]).map((h) => h.toLowerCase().replace(/^\uFEFF/, ""));
  const rows = lines.slice(1).map(parseLine);
  return { headers, rows };
}

function normalize(s: string | undefined | null): string | null {
  if (!s) return null;
  const v = s.trim();
  return v.length === 0 ? null : v;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function ImportContacts() {
  const [csvText, setCsvText] = useState("");
  const [courseId, setCourseId] = useState<string>("none");
  const [website, setWebsite] = useState<string>("none");
  const [createApplications, setCreateApplications] = useState(true);
  const [defaultSource, setDefaultSource] = useState("import");
  const [courses, setCourses] = useState<Course[]>([]);
  const [parsed, setParsed] = useState<ParsedRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{
    inserted: number;
    duplicates: number;
    applications: number;
    errors: string[];
  } | null>(null);

  useEffect(() => {
    void loadCourses();
  }, []);

  async function loadCourses() {
    const { data } = await supabase.from("courses").select("id, name").eq("is_active", true);
    if (data) setCourses(data);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCsvText(String(reader.result ?? ""));
    reader.readAsText(file);
  }

  function handlePreview() {
    setResult(null);
    const { headers, rows } = parseCSV(csvText);
    if (headers.length === 0) {
      toast.error("CSV is empty");
      return;
    }
    const idx = (key: string) => headers.indexOf(key);
    const nameI = idx("name");
    const emailI = idx("email");
    const phoneI = idx("phone");
    const countryI = idx("country");
    const sourceI = idx("source");
    const messageI = idx("message");

    if (nameI === -1 || emailI === -1) {
      toast.error("CSV must include 'name' and 'email' columns");
      return;
    }

    const out: ParsedRow[] = rows.map((r, i) => {
      const name = normalize(r[nameI]) ?? "";
      const email = (normalize(r[emailI]) ?? "").toLowerCase();
      const row: ParsedRow = {
        name,
        email,
        phone: phoneI >= 0 ? normalize(r[phoneI]) : null,
        country: countryI >= 0 ? normalize(r[countryI]) : null,
        source: (sourceI >= 0 ? normalize(r[sourceI]) : null) ?? defaultSource,
        message: messageI >= 0 ? normalize(r[messageI]) : null,
        _row: i + 2,
      };
      if (!name) row._error = "Missing name";
      else if (!email) row._error = "Missing email";
      else if (!isValidEmail(email)) row._error = "Invalid email";
      return row;
    });

    setParsed(out);
    toast.success(`Parsed ${out.length} rows`);
  }

  async function handleImport() {
    const valid = parsed.filter((r) => !r._error);
    if (valid.length === 0) {
      toast.error("No valid rows to import");
      return;
    }
    setImporting(true);
    const errors: string[] = [];
    let inserted = 0;
    let duplicates = 0;
    let applications = 0;

    try {
      // Fetch existing contacts by email (batched)
      const emails = Array.from(new Set(valid.map((r) => r.email)));
      const { data: existing } = await supabase
        .from("contacts")
        .select("id, email")
        .in("email", emails);
      const existingMap = new Map<string, string>();
      existing?.forEach((c) => existingMap.set(c.email.toLowerCase(), c.id));

      // Insert new contacts
      const targetWebsite = website === "none" ? null : website;
      const toInsert = valid
        .filter((r) => !existingMap.has(r.email))
        .map((r) => ({
          name: r.name,
          email: r.email,
          phone: r.phone,
          country: r.country,
          source: r.source,
          website: targetWebsite,
        }));

      if (toInsert.length > 0) {
        // Dedupe within file by email (last wins)
        const dedupedMap = new Map<string, (typeof toInsert)[number]>();
        toInsert.forEach((c) => dedupedMap.set(c.email, c));
        const deduped = Array.from(dedupedMap.values());

        // Insert in chunks of 200
        for (let i = 0; i < deduped.length; i += 200) {
          const chunk = deduped.slice(i, i + 200);
          const { data, error } = await supabase.from("contacts").insert(chunk).select("id, email");
          if (error) {
            errors.push(`Insert batch failed: ${error.message}`);
          } else if (data) {
            inserted += data.length;
            data.forEach((c) => existingMap.set(c.email.toLowerCase(), c.id));
          }
        }
      }
      duplicates = valid.length - inserted;

      // Optionally create applications
      if (createApplications) {
        const targetCourseId = courseId === "none" ? null : courseId;
        const apps = valid
          .map((r) => {
            const cid = existingMap.get(r.email);
            if (!cid) return null;
            return {
              contact_id: cid,
              course_id: targetCourseId,
              message: r.message,
              pipeline_stage: "new_enquiry" as const,
            };
          })
          .filter((a): a is NonNullable<typeof a> => a !== null);

        // Check for existing open applications to avoid duplicates
        const contactIds = Array.from(new Set(apps.map((a) => a.contact_id)));
        const { data: openApps } = await supabase
          .from("applications")
          .select("contact_id, course_id, pipeline_stage")
          .in("contact_id", contactIds)
          .not("pipeline_stage", "in", "(enrolled,dormant)");
        const openSet = new Set(
          openApps?.map((a) => `${a.contact_id}:${a.course_id ?? "null"}`) ?? [],
        );

        const newApps = apps.filter(
          (a) => !openSet.has(`${a.contact_id}:${a.course_id ?? "null"}`),
        );

        for (let i = 0; i < newApps.length; i += 200) {
          const chunk = newApps.slice(i, i + 200);
          const { data, error } = await supabase.from("applications").insert(chunk).select("id");
          if (error) {
            errors.push(`Application batch failed: ${error.message}`);
          } else if (data) {
            applications += data.length;
          }
        }
      }

      setResult({ inserted, duplicates, applications, errors });
      toast.success(`Imported ${inserted} contacts, ${applications} applications`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      errors.push(msg);
      setResult({ inserted, duplicates, applications, errors });
      toast.error(msg);
    } finally {
      setImporting(false);
    }
  }

  async function handleClearImported() {
    const ok = window.confirm(
      "This will delete ALL contacts and their linked applications/activities/tasks/emails. Continue?",
    );
    if (!ok) return;

    setImporting(true);
    try {
      const { data: allContacts, error: cErr } = await supabase.from("contacts").select("id");

      if (cErr) throw cErr;

      const contactIds = allContacts?.map((c) => c.id) ?? [];

      if (contactIds.length === 0) {
        toast.success("No contacts found.");
        return;
      }

      const appIds: string[] = [];
      for (const ids of chunk(contactIds, 200)) {
        const { data: apps, error: aSelErr } = await supabase
          .from("applications")
          .select("id")
          .in("contact_id", ids);
        if (aSelErr) throw aSelErr;
        (apps ?? []).forEach((a) => appIds.push(a.id));
      }

      for (const ids of chunk(contactIds, 200)) {
        const { error } = await supabase.from("activities").delete().in("contact_id", ids);
        if (error) throw error;
      }

      for (const ids of chunk(contactIds, 200)) {
        const { error } = await supabase.from("tasks").delete().in("contact_id", ids);
        if (error) throw error;
      }

      for (const ids of chunk(contactIds, 200)) {
        const { error } = await supabase.from("emails").delete().in("contact_id", ids);
        if (error) throw error;
      }

      for (const ids of chunk(appIds, 200)) {
        const { error } = await supabase.from("activities").delete().in("application_id", ids);
        if (error) throw error;
      }

      for (const ids of chunk(appIds, 200)) {
        const { error } = await supabase.from("tasks").delete().in("application_id", ids);
        if (error) throw error;
      }

      for (const ids of chunk(appIds, 200)) {
        const { error } = await supabase.from("emails").delete().in("application_id", ids);
        if (error) throw error;
      }

      for (const ids of chunk(appIds, 200)) {
        const { error } = await supabase.from("automation_runs").delete().in("application_id", ids);
        if (error) throw error;
      }

      for (const ids of chunk(contactIds, 200)) {
        const { error } = await supabase.from("applications").delete().in("contact_id", ids);
        if (error) throw error;
      }

      for (const ids of chunk(contactIds, 200)) {
        const { error } = await supabase.from("contacts").delete().in("id", ids);
        if (error) throw error;
      }

      setParsed([]);
      setResult(null);
      toast.success(`Deleted ${contactIds.length} contact(s).`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to clear contacts";
      toast.error(msg);
    } finally {
      setImporting(false);
    }
  }

  const validCount = useMemo(() => parsed.filter((r) => !r._error).length, [parsed]);
  const errorCount = parsed.length - validCount;

  return (
    <div>
      <PageHeader
        title="Import Contacts"
        description="Bulk import contacts from a CSV file. Existing contacts (matched by email) are skipped."
      />
      <div className="space-y-6 px-6 py-6 md:px-10 md:py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">1. Upload or paste CSV</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-dashed border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">
                Required columns: <code>name</code>, <code>email</code>
              </p>
              <p className="mt-1">
                Optional: <code>phone</code>, <code>country</code>, <code>source</code>,{" "}
                <code>message</code>
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-accent">
                <Upload className="h-4 w-4" />
                Choose CSV file
                <input
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={handleFile}
                />
              </label>
              <span className="text-xs text-muted-foreground">or paste below</span>
            </div>
            <Textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="name,email,phone,country,source&#10;Jane Doe,jane@example.com,+447700900000,UK,referral"
              className="min-h-[160px] font-mono text-xs"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">2. Options</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Default source (if missing)</Label>
              <input
                value={defaultSource}
                onChange={(e) => setDefaultSource(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>Tag with website</Label>
              <Select value={website} onValueChange={setWebsite}>
                <SelectTrigger>
                  <SelectValue placeholder="No website" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— No website —</SelectItem>
                  {WEBSITES.map((w) => (
                    <SelectItem key={w} value={w}>
                      {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                All imported contacts will be tagged with this website.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Attach applications to course</Label>
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
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <Checkbox
                id="createApps"
                checked={createApplications}
                onCheckedChange={(v) => setCreateApplications(v === true)}
              />
              <Label htmlFor="createApps" className="cursor-pointer text-sm font-normal">
                Also create an application (New Enquiry) per contact — skipped if an open
                application already exists for the same course
              </Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button onClick={handlePreview} variant="outline" disabled={!csvText.trim()}>
            <FileText className="h-4 w-4" />
            Parse & preview
          </Button>
          <Button onClick={handleImport} disabled={validCount === 0 || importing}>
            {importing
              ? "Importing…"
              : `Import ${validCount} contact${validCount === 1 ? "" : "s"}`}
          </Button>
          <Button onClick={handleClearImported} variant="destructive" disabled={importing}>
            Clear all contacts
          </Button>
        </div>

        {parsed.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-base">
                Preview
                <Badge variant="secondary">{validCount} valid</Badge>
                {errorCount > 0 && <Badge variant="destructive">{errorCount} errors</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[420px] overflow-auto rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsed.slice(0, 500).map((r) => (
                      <TableRow key={r._row} className={r._error ? "bg-destructive/5" : ""}>
                        <TableCell className="text-xs text-muted-foreground">{r._row}</TableCell>
                        <TableCell>{r.name || "—"}</TableCell>
                        <TableCell className="text-muted-foreground">{r.email || "—"}</TableCell>
                        <TableCell className="text-muted-foreground">{r.phone ?? "—"}</TableCell>
                        <TableCell className="text-muted-foreground">{r.country ?? "—"}</TableCell>
                        <TableCell className="text-muted-foreground">{r.source ?? "—"}</TableCell>
                        <TableCell>
                          {r._error ? (
                            <span className="inline-flex items-center gap-1 text-xs text-destructive">
                              <AlertCircle className="h-3 w-3" />
                              {r._error}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Ready</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {parsed.length > 500 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Showing first 500 of {parsed.length} rows. All valid rows will be imported.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Import result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                ✅ <strong>{result.inserted}</strong> new contacts created
              </p>
              <p>
                ↩︎ <strong>{result.duplicates}</strong> duplicates skipped (already existed)
              </p>
              <p>
                📋 <strong>{result.applications}</strong> applications created
              </p>
              {result.errors.length > 0 && (
                <div className="mt-3 rounded-md border border-destructive/40 bg-destructive/5 p-3">
                  <p className="font-medium text-destructive">Errors:</p>
                  <ul className="mt-1 list-disc pl-5 text-xs text-destructive">
                    {result.errors.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
