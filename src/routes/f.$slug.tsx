import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/f/$slug")({
  component: HostedForm,
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("forms")
      .select(
        "id, slug, name, headline, description, success_message, redirect_url, show_phone, show_country, show_message, require_phone, is_active",
      )
      .eq("slug", params.slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error || !data) throw notFound();
    return { form: data };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <p className="font-serif text-4xl">Form not found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          This form is no longer available. Please contact us if you need assistance.
        </p>
      </div>
    </div>
  ),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.form.headline ?? loaderData?.form.name ?? "Enquire" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

const baseSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().max(40).optional(),
  country: z.string().trim().max(80).optional(),
  message: z.string().trim().max(2000).optional(),
  company: z.string().max(0).optional(),
});

function HostedForm() {
  const { form } = Route.useLoaderData();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Auto-resize support for iframe parents
  useEffect(() => {
    if (window.parent === window) return;
    const send = () => {
      window.parent.postMessage(
        { type: "mosquemba-form-resize", height: document.documentElement.scrollHeight },
        "*",
      );
    };
    send();
    const ro = new ResizeObserver(send);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [submitted]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = baseSchema.safeParse({
      name,
      email,
      phone,
      country,
      message,
      company: honeypot,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (form.require_phone && !phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, form_id: form.id, interest_type: "enquiry" }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Submission failed");
      }
      if (form.redirect_url) {
        if (window.top) {
          window.top.location.href = form.redirect_url;
        } else {
          window.location.href = form.redirect_url;
        }
        return;
      }
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[400px] bg-background px-4 py-10">
        <div className="mx-auto max-w-xl rounded-lg border border-border bg-card p-8 text-center">
          <p className="font-serif text-2xl text-foreground">Thank you</p>
          <p className="mt-3 text-sm text-muted-foreground">{form.success_message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[400px] bg-background px-4 py-8">
      <div className="mx-auto max-w-xl">
        {(form.headline || form.description) && (
          <div className="mb-6">
            {form.headline && (
              <h1 className="font-serif text-2xl tracking-tight text-foreground">
                {form.headline}
              </h1>
            )}
            {form.description && (
              <p className="mt-2 text-sm text-muted-foreground">{form.description}</p>
            )}
          </div>
        )}
        <form onSubmit={submit} className="space-y-4 rounded-lg border border-border bg-card p-6">
          <div className="hidden" aria-hidden="true">
            <input
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Full name *</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {form.show_phone && (
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone {form.require_phone && "*"}</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          )}
          {form.show_country && (
            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>
          )}
          {form.show_message && (
            <div className="space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          )}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Submitting…" : "Submit"}
          </Button>
        </form>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">Powered by Mosque MBA</p>
      </div>
    </div>
  );
}
