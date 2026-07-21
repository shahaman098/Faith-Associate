import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  EXPO_PIPELINE_STAGES,
  EXPO_PAYMENT_STATUSES,
  EXPO_ONBOARDING_STATUSES,
  exhStageTone,
  exhPaymentTone,
} from "@/lib/expo-constants";
import { formatDate } from "@/lib/format";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_expo/expo/exhibitors/")({
  component: ExhibitorsList,
});

type Row = {
  id: string;
  pipeline_stage: string;
  payment_status: string;
  onboarding_status: string;
  early_bird_eligible: boolean;
  early_bird_expires_at: string | null;
  created_at: string;
  contact: { name: string; email: string } | null;
  company: { name: string } | null;
  owner: { email: string } | null;
};

function ExhibitorsList() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("all");
  const [payment, setPayment] = useState("all");
  const [onboarding, setOnboarding] = useState("all");

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("expo_exhibitors")
      .select(
        "id, pipeline_stage, payment_status, onboarding_status, early_bird_eligible, early_bird_expires_at, created_at, contact:contacts(name, email), company:companies(name), owner:users(email)",
      )
      .order("created_at", { ascending: false })
      .limit(500);
    if (data) setRows(data as never);
  }

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (stage !== "all" && r.pipeline_stage !== stage) return false;
      if (payment !== "all" && r.payment_status !== payment) return false;
      if (onboarding !== "all" && r.onboarding_status !== onboarding) return false;
      if (q) {
        const hay =
          `${r.contact?.name ?? ""} ${r.contact?.email ?? ""} ${r.company?.name ?? ""}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [rows, q, stage, payment, onboarding]);

  const now = new Date().toISOString();

  return (
    <div>
      <PageHeader
        title="Exhibitors"
        description="All Mosque Expo exhibitor leads and accounts."
        actions={
          <Button asChild size="sm">
            <Link to="/expo/exhibitors/new">
              <Plus className="h-4 w-4" />
              Add Exhibitor
            </Link>
          </Button>
        }
      />
      <div className="space-y-4 px-6 py-6 md:px-10 md:py-8">
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Search name, email, company…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-xs"
          />
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All stages</SelectItem>
              {EXPO_PIPELINE_STAGES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={payment} onValueChange={setPayment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All payments</SelectItem>
              {EXPO_PAYMENT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={onboarding} onValueChange={setOnboarding}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Onboarding" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All onboarding</SelectItem>
              {EXPO_ONBOARDING_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact / Company</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Onboarding</TableHead>
                <TableHead>Early Bird</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                    No exhibitors match.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((r) => {
                const ebExpired = r.early_bird_expires_at && r.early_bird_expires_at < now;
                const ebExpiringSoon =
                  r.early_bird_eligible &&
                  r.early_bird_expires_at &&
                  !ebExpired &&
                  r.early_bird_expires_at <= new Date(Date.now() + 3 * 86400000).toISOString();
                return (
                  <TableRow key={r.id}>
                    <TableCell>
                      <Link
                        to="/expo/exhibitors/$id"
                        params={{ id: r.id }}
                        className="font-medium hover:underline"
                      >
                        {r.contact?.name ?? "—"}
                      </Link>
                      <p className="text-xs text-muted-foreground">{r.company?.name}</p>
                      <p className="text-xs text-muted-foreground">{r.contact?.email}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={exhStageTone(r.pipeline_stage as never)} className="text-[10px]">
                        {r.pipeline_stage}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={exhPaymentTone(r.payment_status as never)} className="text-[10px]">
                        {r.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.onboarding_status}</TableCell>
                    <TableCell>
                      {r.early_bird_eligible ? (
                        <span
                          className={`text-xs font-medium ${
                            ebExpiringSoon
                              ? "text-orange-600"
                              : ebExpired
                                ? "text-muted-foreground line-through"
                                : "text-emerald-600"
                          }`}
                        >
                          {ebExpired
                            ? "Expired"
                            : ebExpiringSoon
                              ? `Expiring ${formatDate(r.early_bird_expires_at!)}`
                              : `Until ${formatDate(r.early_bird_expires_at!)}`}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {r.owner?.email ?? "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(r.created_at)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
