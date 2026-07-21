import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/enquire")({
  component: EnquirePage,
  head: () => ({
    meta: [
      { title: "Enquire — Mosque MBA" },
      { name: "description", content: "Submit an enquiry to join Mosque MBA." },
    ],
  }),
});

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  course_id: z.string().uuid().optional().or(z.literal("")),
  interest_type: z.enum(["enquiry", "enrolment", "scholarship", "other"]),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  // honeypot
  company: z.string().max(0, "Bot detected").optional().or(z.literal("")),
});

function EnquirePage() {
  const [courses, setCourses] = useState<Array<{ id: string; name: string }>>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [courseId, setCourseId] = useState<string>("");
  const [interestType, setInterestType] = useState<
    "enquiry" | "enrolment" | "scholarship" | "other"
  >("enquiry");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void supabase
      .from("courses")
      .select("id, name")
      .eq("is_active", true)
      .order("name")
      .then(({ data }) => {
        if (data) setCourses(data);
      });
  }, []);

  const courseOptions = useMemo(() => courses, [courses]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({
      name,
      email,
      phone,
      country,
      course_id: courseId,
      interest_type: interestType,
      message,
      company: honeypot,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Submission failed");
      }
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setBusy(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="font-serif text-3xl">Thank you</CardTitle>
            <CardDescription>
              We've received your enquiry. Our team will be in touch by email shortly with the next
              step — your qualification form.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/enquire" className="text-sm text-primary underline">
              Submit another enquiry
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <p className="font-serif text-4xl tracking-tight text-foreground">Mosque MBA</p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Admissions Enquiry
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Enquire about Mosque MBA</CardTitle>
            <CardDescription>
              Tell us a little about yourself and we'll send you our brochure plus your
              qualification form within one working day.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              {/* honeypot — hidden from humans */}
              <div className="hidden" aria-hidden="true">
                <label>
                  Company
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
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
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="course">Course of interest</Label>
                <Select value={courseId} onValueChange={setCourseId}>
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseOptions.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="interest">Interest type *</Label>
                <Select
                  value={interestType}
                  onValueChange={(v) => setInterestType(v as typeof interestType)}
                >
                  <SelectTrigger id="interest">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enquiry">General enquiry</SelectItem>
                    <SelectItem value="enrolment">Ready to enrol</SelectItem>
                    <SelectItem value="scholarship">Scholarship interest</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us anything that would help us assist you…"
                />
              </div>

              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Submitting…" : "Submit enquiry"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
