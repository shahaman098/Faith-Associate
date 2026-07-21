import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_expo/expo/exhibitors/new")({
  component: NewExhibitorPage,
});

type Event = { id: string; name: string };
type Package = { id: string; name: string; type: string };

function NewExhibitorPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    event_id: "",
    // Contact
    name: "",
    email: "",
    phone: "",
    // Company
    company_name: "",
    website: "",
    organisation_type: "",
    // Exhibitor
    package_interest_id: "",
    stand_size: "",
    sponsorship_interest: false,
    lead_source: "",
    message: "",
  });

  useEffect(() => {
    void loadOptions();
  }, []);

  async function loadOptions() {
    const [evtRes, pkgRes] = await Promise.all([
      supabase.from("expo_events").select("id, name"),
      supabase.from("expo_packages").select("id, name, type").eq("active", true),
    ]);
    if (evtRes.data) setEvents(evtRes.data);
    if (pkgRes.data) setPackages(pkgRes.data);
  }

  function set(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function save() {
    if (!form.name || !form.email) return toast.error("Name and email are required");
    if (!form.event_id) return toast.error("Please select an event");
    setSaving(true);

    try {
      // Upsert contact
      let contactId: string;
      const { data: existing } = await supabase
        .from("contacts")
        .select("id")
        .eq("email", form.email.toLowerCase().trim())
        .maybeSingle();

      if (existing) {
        contactId = existing.id;
      } else {
        const { data: newContact, error: contactErr } = await supabase
          .from("contacts")
          .insert({
            name: form.name.trim(),
            email: form.email.toLowerCase().trim(),
            phone: form.phone || null,
            website: "mosqueexpo.com",
            source: form.lead_source || "manual",
          })
          .select("id")
          .single();
        if (contactErr || !newContact) throw new Error(contactErr?.message ?? "Failed to create contact");
        contactId = newContact.id;
      }

      // Upsert company
      let companyId: string | null = null;
      if (form.company_name.trim()) {
        const { data: existingCo } = await supabase
          .from("companies")
          .select("id")
          .ilike("name", form.company_name.trim())
          .maybeSingle();
        if (existingCo) {
          companyId = existingCo.id;
        } else {
          const { data: newCo, error: coErr } = await supabase
            .from("companies")
            .insert({ name: form.company_name.trim(), website: form.website || null })
            .select("id")
            .single();
          if (coErr || !newCo) throw new Error(coErr?.message ?? "Failed to create company");
          companyId = newCo.id;
        }
      }

      // Create exhibitor
      const { data: exh, error: exhErr } = await supabase
        .from("expo_exhibitors")
        .insert({
          event_id: form.event_id,
          contact_id: contactId,
          company_id: companyId,
          pipeline_stage: "New Lead",
          deal_status: "Open",
          payment_status: "Not Sent",
          onboarding_status: "Not Started",
          package_interest_id: form.package_interest_id || null,
          stand_size: form.stand_size || null,
          sponsorship_interest: form.sponsorship_interest,
          lead_source: form.lead_source || null,
          decision_notes: form.message || null,
          early_bird_eligible: false,
          reminder_count: 0,
        })
        .select("id")
        .single();

      if (exhErr || !exh) throw new Error(exhErr?.message ?? "Failed to create exhibitor");

      // Log activity
      await supabase.from("activities").insert({
        type: "lead_created",
        contact_id: contactId,
        body: `Exhibitor lead created manually for ${form.name}`,
        metadata: { exhibitor_id: exh.id },
        is_system: false,
      });

      toast.success("Exhibitor created");
      void navigate({ to: "/expo/exhibitors/$id", params: { id: exh.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create exhibitor");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="Add Exhibitor" description="Manually create a new exhibitor lead." />
      <div className="px-6 py-6 md:px-10 md:py-8">
        <Card className="max-w-2xl">
          <CardHeader><CardTitle className="text-sm">Exhibitor Details</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-1">
              <Label>Event *</Label>
              <Select value={form.event_id} onValueChange={(v) => set("event_id", v)}>
                <SelectTrigger><SelectValue placeholder="Select event" /></SelectTrigger>
                <SelectContent>
                  {events.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Full Name *</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Smith" />
            </div>
            <div className="space-y-1">
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@example.com" />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+44 7700 000000" />
            </div>
            <div className="space-y-1">
              <Label>Company Name</Label>
              <Input value={form.company_name} onChange={(e) => set("company_name", e.target.value)} placeholder="Acme Ltd" />
            </div>
            <div className="space-y-1">
              <Label>Company Website</Label>
              <Input value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://acme.com" />
            </div>
            <div className="space-y-1">
              <Label>Organisation Type</Label>
              <Input value={form.organisation_type} onChange={(e) => set("organisation_type", e.target.value)} placeholder="Mosque, Charity, Business…" />
            </div>
            <div className="space-y-1">
              <Label>Package Interest</Label>
              <Select value={form.package_interest_id} onValueChange={(v) => set("package_interest_id", v)}>
                <SelectTrigger><SelectValue placeholder="Select package" /></SelectTrigger>
                <SelectContent>
                  {packages.map((p) => <SelectItem key={p.id} value={p.id}>{p.name} ({p.type})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Stand Size</Label>
              <Input value={form.stand_size} onChange={(e) => set("stand_size", e.target.value)} placeholder="3x3, 6x3…" />
            </div>
            <div className="space-y-1">
              <Label>Lead Source</Label>
              <Select value={form.lead_source} onValueChange={(v) => set("lead_source", v)}>
                <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                <SelectContent>
                  {["Website", "Referral", "Cold Outreach", "Social Media", "Previous Exhibitor", "Event", "Manual"].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Sponsorship Interest</Label>
              <Select value={form.sponsorship_interest ? "yes" : "no"} onValueChange={(v) => set("sponsorship_interest", v === "yes")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 space-y-1">
              <Label>Notes / Message</Label>
              <Textarea value={form.message} onChange={(e) => set("message", e.target.value)} rows={3} placeholder="Any additional notes…" />
            </div>
            <div className="sm:col-span-2">
              <Button onClick={save} disabled={saving}>{saving ? "Creating…" : "Create Exhibitor"}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
