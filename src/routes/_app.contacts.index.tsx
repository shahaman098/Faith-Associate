import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { WEBSITES } from "@/lib/crm-constants";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_app/contacts/")({
  component: ContactsList,
});

type Row = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  source: string | null;
  website: string | null;
  created_at: string;
};

function ContactsList() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [website, setWebsite] = useState<string>("all");

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("contacts")
      .select("id, name, email, phone, country, source, website, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (data) setRows(data);
  }

  const websites = useMemo(() => {
    const set = new Set<string>();
    WEBSITES.forEach((w) => set.add(w));
    rows.forEach((r) => r.website && set.add(r.website));
    return Array.from(set).sort();
  }, [rows]);

  const filtered = rows.filter((r) => {
    if (website !== "all") {
      if (website === "__none__" ? r.website : r.website !== website) return false;
    }
    if (q) {
      const hay = [r.name, r.email, r.phone, r.country, r.website]
        .map((f) => (f ?? "").toLowerCase())
        .join(" ");
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Contacts"
        description="People who have enquired across all websites."
        actions={
          <Button asChild size="sm" variant="outline">
            <Link to="/contacts/import">
              <Upload className="h-4 w-4" />
              Import CSV
            </Link>
          </Button>
        }
      />
      <div className="space-y-4 px-6 py-6 md:px-10 md:py-8">
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Search by name, email, phone, country, website…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-sm"
          />
          <Select value={website} onValueChange={setWebsite}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Website" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All websites</SelectItem>
              <SelectItem value="__none__">— No website —</SelectItem>
              {websites.map((w) => (
                <SelectItem key={w} value={w}>
                  {w}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    No contacts match.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">
                    <Link to="/contacts/$id" params={{ id: r.id }} className="hover:underline">
                      {r.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.email}</TableCell>
                  <TableCell className="text-muted-foreground">{r.phone ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{r.country ?? "—"}</TableCell>
                  <TableCell>
                    {r.website ? (
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        {r.website}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.source ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(r.created_at)}
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
