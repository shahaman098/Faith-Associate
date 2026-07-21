import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPO_INVOICE_STATUSES } from "@/lib/expo-constants";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_expo/expo/invoices")({
  component: ExpoInvoicesPage,
});

type Row = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  invoice_reference: string | null;
  sent_at: string | null;
  due_at: string | null;
  paid_at: string | null;
  reminder_count: number;
  exhibitor_id: string;
  exhibitor: {
    contact: { name: string } | null;
    company: { name: string } | null;
  } | null;
};

function invTone(s: string): "default" | "secondary" | "outline" | "destructive" {
  if (s === "Paid") return "default";
  if (s === "Overdue") return "destructive";
  if (s === "Partially Paid" || s === "Sent") return "secondary";
  return "outline";
}

function ExpoInvoicesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("expo_invoices")
      .select(
        "id, amount, currency, status, invoice_reference, sent_at, due_at, paid_at, reminder_count, exhibitor_id, exhibitor:expo_exhibitors(contact:contacts(name), company:companies(name))",
      )
      .order("created_at", { ascending: false })
      .limit(300);
    if (data) setRows(data as never);
  }

  async function markPaid(id: string) {
    const { error } = await supabase
      .from("expo_invoices")
      .update({ status: "Paid", paid_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return toast.error(error.message);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Paid", paid_at: new Date().toISOString() } : r)));
    toast.success("Marked as paid");
  }

  const visible = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  const now = new Date().toISOString();
  const overdue = rows.filter((r) => r.status === "Overdue" || (r.status === "Sent" && r.due_at && r.due_at < now));

  return (
    <div>
      <PageHeader title="Invoices" description="All Expo exhibitor invoices and payments." />
      <div className="space-y-6 px-6 py-6 md:px-10 md:py-8">
        {overdue.length > 0 && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            ⚠ {overdue.length} overdue invoice{overdue.length > 1 ? "s" : ""} require attention.
          </div>
        )}

        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {EXPO_INVOICE_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exhibitor</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Reminders</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">
                    No invoices.
                  </TableCell>
                </TableRow>
              )}
              {visible.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <Link to="/expo/exhibitors/$id" params={{ id: r.exhibitor_id }} className="font-medium hover:underline">
                      {(r.exhibitor?.contact as { name: string } | null)?.name ?? (r.exhibitor?.company as { name: string } | null)?.name ?? "—"}
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{r.invoice_reference ?? r.id.slice(0, 8)}</TableCell>
                  <TableCell className="font-medium">{r.currency} {r.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={invTone(r.status)} className="text-[10px]">{r.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.sent_at ? formatDate(r.sent_at) : "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.due_at ? formatDate(r.due_at) : "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.paid_at ? formatDate(r.paid_at) : "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.reminder_count}</TableCell>
                  <TableCell>
                    {r.status !== "Paid" && r.status !== "Cancelled" && (
                      <Button size="sm" variant="outline" onClick={() => markPaid(r.id)}>
                        Mark paid
                      </Button>
                    )}
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
