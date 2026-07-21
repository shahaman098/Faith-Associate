import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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

export const Route = createFileRoute("/expo/enquire-exhibitor")({
  component: ExhibitorEnquiryForm,
});

const PACKAGE_OPTIONS = ["Standard Stand", "Premium Stand", "Corner Stand", "Sponsorship", "Digital", "Not sure yet"];
const ORG_TYPES = ["Mosque / Islamic Centre", "Charity / NGO", "Business / SME", "Corporate", "Educational Institution", "Government / Public Sector", "Other"];

function ExhibitorEnquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    organisation_type: "",
    package_interest: "",
    stand_size: "",
    sponsorship_interest: "no",
    message: "",
    honeypot: "", // bot trap
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.honeypot) return; // bot detected
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const { error: apiErr } = await supabase.functions.invoke("expo-exhibitor-enquiry", {
        body: {
          name: form.name.trim(),
          email: form.email.toLowerCase().trim(),
          phone: form.phone.trim() || null,
          company: form.company.trim() || null,
          website: form.website.trim() || null,
          organisation_type: form.organisation_type || null,
          package_interest: form.package_interest || null,
          stand_size: form.stand_size.trim() || null,
          sponsorship_interest: form.sponsorship_interest === "yes",
          message: form.message.trim() || null,
          source: "website_form",
        },
      });
      if (apiErr) throw new Error(apiErr.message);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f9fafb] px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="font-serif text-2xl font-medium text-gray-900">Thank you for your enquiry!</h1>
          <p className="mt-3 text-gray-600">
            We've received your exhibitor enquiry for Mosque Expo. A member of our team will be in touch shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] px-4 py-12">
      <div className="mx-auto max-w-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500 text-white font-bold text-xl">
            ME
          </div>
          <h1 className="font-serif text-3xl font-medium text-gray-900">Exhibit at Mosque Expo</h1>
          <p className="mt-2 text-gray-600">Fill in your details and we'll be in touch with package options.</p>
        </div>

        <form onSubmit={submit} className="space-y-5 rounded-2xl bg-white p-8 shadow-sm">
          {/* Honeypot — hidden from real users */}
          <input
            type="text"
            name="website_url"
            value={form.honeypot}
            onChange={(e) => set("honeypot", e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Smith" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@example.com" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+44 7700 000000" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="company">Organisation / Company</Label>
              <Input id="company" value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Acme Mosque Trust" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="website">Website</Label>
              <Input id="website" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://example.com" />
            </div>
            <div className="space-y-1">
              <Label>Organisation Type</Label>
              <Select value={form.organisation_type} onValueChange={(v) => set("organisation_type", v)}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {ORG_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Package Interest</Label>
              <Select value={form.package_interest} onValueChange={(v) => set("package_interest", v)}>
                <SelectTrigger><SelectValue placeholder="Select package" /></SelectTrigger>
                <SelectContent>
                  {PACKAGE_OPTIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="stand_size">Stand Size (if known)</Label>
              <Input id="stand_size" value={form.stand_size} onChange={(e) => set("stand_size", e.target.value)} placeholder="e.g. 3x3m" />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <Label>Sponsorship Interest</Label>
              <Select value={form.sponsorship_interest} onValueChange={(v) => set("sponsorship_interest", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes — interested in sponsorship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 space-y-1">
              <Label htmlFor="message">Message (optional)</Label>
              <Textarea id="message" value={form.message} onChange={(e) => set("message", e.target.value)} rows={4} placeholder="Any questions or additional information…" />
            </div>
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Enquiry"}
          </Button>

          <p className="text-center text-xs text-gray-400">
            We'll never share your details with third parties.
          </p>
        </form>
      </div>
    </div>
  );
}
