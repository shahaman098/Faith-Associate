import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXPO_PACKAGE_TYPES } from "@/lib/expo-constants";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_expo/expo/packages")({
  component: PackagesPage,
});

type Package = {
  id: string;
  name: string;
  type: string;
  description: string | null;
  standard_price: number | null;
  early_bird_price: number | null;
  capacity: number | null;
  active: boolean;
  created_at: string;
  event: { name: string } | null;
};

type Event = { id: string; name: string };

function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    event_id: "",
    name: "",
    type: "Standard Stand",
    description: "",
    standard_price: "",
    early_bird_price: "",
    capacity: "",
  });

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const [pkgRes, evtRes] = await Promise.all([
      supabase
        .from("expo_packages")
        .select("id, name, type, description, standard_price, early_bird_price, capacity, active, created_at, event:expo_events(name)")
        .order("created_at", { ascending: false }),
      supabase.from("expo_events").select("id, name").eq("status", "Published"),
    ]);
    if (pkgRes.data) setPackages(pkgRes.data as never);
    if (evtRes.data) setEvents(evtRes.data as never);
  }

  async function save() {
    if (!form.name || !form.event_id) return toast.error("Name and event are required");
    setSaving(true);
    const { error } = await supabase.from("expo_packages").insert({
      event_id: form.event_id,
      name: form.name,
      type: form.type,
      description: form.description || null,
      standard_price: form.standard_price ? Number(form.standard_price) : null,
      early_bird_price: form.early_bird_price ? Number(form.early_bird_price) : null,
      capacity: form.capacity ? Number(form.capacity) : null,
      active: true,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Package created");
    setShowForm(false);
    setForm({ event_id: "", name: "", type: "Standard Stand", description: "", standard_price: "", early_bird_price: "", capacity: "" });
    void load();
  }

  async function toggleActive(id: string, current: boolean) {
    const { error } = await supabase.from("expo_packages").update({ active: !current }).eq("id", id);
    if (error) return toast.error(error.message);
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, active: !current } : p)));
  }

  return (
    <div>
      <PageHeader
        title="Packages"
        description="Expo stand and sponsorship packages."
        actions={
          <Button size="sm" onClick={() => setShowForm((v) => !v)}>
            <Plus className="h-4 w-4" />
            {showForm ? "Cancel" : "New Package"}
          </Button>
        }
      />
      <div className="space-y-6 px-6 py-6 md:px-10 md:py-8">
        {showForm && (
          <Card>
            <CardHeader><CardTitle className="text-sm">New Package</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Event</Label>
                <Select value={form.event_id} onValueChange={(v) => setForm((f) => ({ ...f, event_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select event" /></SelectTrigger>
                  <SelectContent>
                    {events.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. 3x3 Standard Stand" />
              </div>
              <div className="space-y-1">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {EXPO_PACKAGE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Standard Price (£)</Label>
                <Input type="number" value={form.standard_price} onChange={(e) => setForm((f) => ({ ...f, standard_price: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Early Bird Price (£)</Label>
                <Input type="number" value={form.early_bird_price} onChange={(e) => setForm((f) => ({ ...f, early_bird_price: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label>Capacity</Label>
                <Input type="number" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} />
              </div>
              <div className="sm:col-span-2">
                <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Create Package"}</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((p) => (
            <Card key={p.id} className={p.active ? "" : "opacity-60"}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm">{p.name}</CardTitle>
                  <Badge variant={p.active ? "default" : "outline"} className="text-[10px]">
                    {p.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{p.event?.name}</p>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p className="text-muted-foreground">Type: {p.type}</p>
                {p.standard_price != null && <p className="font-medium">Standard: £{p.standard_price}</p>}
                {p.early_bird_price != null && <p className="text-emerald-600 font-medium">Early bird: £{p.early_bird_price}</p>}
                {p.capacity != null && <p className="text-muted-foreground">Capacity: {p.capacity}</p>}
                {p.description && <p className="text-xs text-muted-foreground mt-1">{p.description}</p>}
                <p className="text-xs text-muted-foreground">Created: {formatDate(p.created_at)}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => toggleActive(p.id, p.active)}
                >
                  {p.active ? "Deactivate" : "Activate"}
                </Button>
              </CardContent>
            </Card>
          ))}
          {packages.length === 0 && (
            <p className="col-span-3 py-10 text-center text-sm text-muted-foreground">No packages yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
