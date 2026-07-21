import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/qualify/$token")({
  component: QualifyPage,
});

const schema = z.object({
  background: z.string().trim().min(20, "Please give us a bit more detail").max(2000),
  experience: z.string().trim().max(2000).optional().or(z.literal("")),
  motivation: z.string().trim().min(20).max(2000),
  availability: z.string().trim().max(500).optional().or(z.literal("")),
});

type State = "loading" | "ready" | "submitted" | "invalid";

function QualifyPage() {
  const { token } = useParams({ from: "/qualify/$token" });
  const [state, setState] = useState<State>("loading");
  const [contactName, setContactName] = useState("");
  const [appId, setAppId] = useState("");
  const [contactId, setContactId] = useState("");
  const [background, setBackground] = useState("");
  const [experience, setExperience] = useState("");
  const [motivation, setMotivation] = useState("");
  const [availability, setAvailability] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void verify();
  }, [token]);

  async function verify() {
    const { data } = await supabase
      .from("applications")
      .select(
        "id, contact_id, qualification_token_expires_at, qualification_submitted_at, contact:contacts(name)",
      )
      .eq("qualification_token", token)
      .maybeSingle();
    if (!data) return setState("invalid");
    if (data.qualification_submitted_at) return setState("invalid");
    if (
      data.qualification_token_expires_at &&
      new Date(data.qualification_token_expires_at) < new Date()
    ) {
      return setState("invalid");
    }
    setAppId(data.id);
    setContactId(data.contact_id);
    setContactName((data.contact as never as { name: string } | null)?.name ?? "");
    setState("ready");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ background, experience, motivation, availability });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase
        .from("applications")
        .update({
          qualification_data: parsed.data,
          qualification_submitted_at: new Date().toISOString(),
          qualification_token: null,
          pipeline_stage: "qualification_submitted",
        })
        .eq("id", appId);
      if (error) throw error;
      await supabase.from("activities").insert({
        application_id: appId,
        contact_id: contactId,
        type: "qualification_submitted",
        body: "Submitted via qualification form",
        is_system: true,
      });
      setState("submitted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setBusy(false);
    }
  }

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (state === "invalid") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Link unavailable</CardTitle>
            <CardDescription>
              This qualification link has expired or already been used. Please contact the Mosque
              MBA admissions team and we'll send you a new one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/enquire" className="text-sm text-primary underline">
              Submit a new enquiry
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === "submitted") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Thank you</CardTitle>
            <CardDescription>
              Your qualification form has been received. Our team will be in touch shortly with the
              next step — booking your admissions interview.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <p className="font-serif text-4xl tracking-tight text-foreground">Qualification</p>
          <p className="mt-1 text-sm text-muted-foreground">For {contactName}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Tell us about you</CardTitle>
            <CardDescription>
              These answers help our admissions team prepare for your interview.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="bg">Your background *</Label>
                <Textarea
                  id="bg"
                  rows={4}
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="exp">Relevant experience</Label>
                <Textarea
                  id="exp"
                  rows={3}
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mot">Why Mosque MBA? *</Label>
                <Textarea
                  id="mot"
                  rows={4}
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="av">Availability</Label>
                <Input
                  id="av"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="e.g. weekday evenings"
                />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Submitting…" : "Submit qualification"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
