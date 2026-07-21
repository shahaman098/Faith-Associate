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

export const Route = createFileRoute("/expo/register")({
  component: AttendeeRegistrationForm,
});

const TICKET_TYPES = ["General Admission", "VIP", "Trade", "Speaker", "Press", "Volunteer"];
const ROLES = ["Mosque Trustee / Committee", "Imam / Scholar", "Business Owner", "Charity Worker", "Student", "General Public", "Other"];

function AttendeeRegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    organisation: "",
    role: "",
    ticket_type: "General Admission",
    message: "",
    honeypot: "",
  });

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.honeypot) return;
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
      const { error: apiErr } = await supabase.functions.invoke("expo-attendee-register", {
        body: {
          name: form.name.trim(),
          email: form.email.toLowerCase().trim(),
          phone: form.phone.trim() || null,
          organisation: form.organisation.trim() || null,
          role: form.role || null,
          ticket_type: form.ticket_type,
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
          <h1 className="font-serif text-2xl font-medium text-gray-900">You're registered!</h1>
          <p className="mt-3 text-gray-600">
            Thank you for registering for Mosque Expo. We'll send you a confirmation email shortly with all the details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] px-4 py-12">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500 text-white font-bold text-xl">
            ME
          </div>
          <h1 className="font-serif text-3xl font-medium text-gray-900">Register for Mosque Expo</h1>
          <p className="mt-2 text-gray-600">Secure your place at the UK's premier Muslim trade and community expo.</p>
        </div>

        <form onSubmit={submit} className="space-y-5 rounded-2xl bg-white p-8 shadow-sm">
          {/* Honeypot */}
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
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+44 7700 000000" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="organisation">Organisation (optional)</Label>
              <Input id="organisation" value={form.organisation} onChange={(e) => set("organisation", e.target.value)} placeholder="Your mosque or organisation" />
            </div>
            <div className="space-y-1">
              <Label>Your Role</Label>
              <Select value={form.role} onValueChange={(v) => set("role", v)}>
                <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Ticket Type</Label>
              <Select value={form.ticket_type} onValueChange={(v) => set("ticket_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TICKET_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 space-y-1">
              <Label htmlFor="message">Message (optional)</Label>
              <Textarea id="message" value={form.message} onChange={(e) => set("message", e.target.value)} rows={3} placeholder="Anything you'd like us to know…" />
            </div>
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={submitting}>
            {submitting ? "Registering…" : "Register Now"}
          </Button>

          <p className="text-center text-xs text-gray-400">
            We'll never share your details with third parties.
          </p>
        </form>
      </div>
    </div>
  );
}
