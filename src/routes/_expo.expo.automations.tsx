import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_expo/expo/automations")({
  component: ExpoAutomationsPage,
});

const EXPO_AUTOMATIONS = [
  { key: "new_exhibitor_enquiry", label: "New Exhibitor Enquiry", description: "Creates contact, company, exhibitor record, assigns owner, sends acknowledgement, creates follow-up task." },
  { key: "early_bird_offer", label: "Early Bird Offer", description: "Sends early bird offer, sets expiry, creates reminder before expiry, sends expiry-soon email." },
  { key: "no_response_followup", label: "No-Response Follow-up", description: "Day 2: follow-up email. Day 5: owner task. Day 7: urgency email. Day 14: mark Dormant." },
  { key: "meeting_booking", label: "Meeting Booking", description: "Tracks booking link sent, reminds if no booking after 2 days, creates meeting record when booked." },
  { key: "post_meeting", label: "Post-Meeting Actions", description: "Routes based on outcome: package summary, negotiation task, snooze, or close lost." },
  { key: "invoice_payment", label: "Invoice & Payment", description: "Sets due date, sends payment instructions, reminds before/on/after due date, escalates if overdue." },
  { key: "onboarding", label: "Onboarding Pack", description: "Sends onboarding pack when paid, creates checklist, requests assets, reminds for missing items." },
  { key: "new_attendee", label: "New Attendee Registration", description: "Creates/links contact, sends confirmation, sends save-the-date." },
  { key: "pre_event_reminders", label: "Pre-Event Reminders", description: "7 days before, 2 days before, morning of event." },
  { key: "post_event_followup", label: "Post-Event Follow-up", description: "Thank-you email, feedback request, interest segmentation." },
];

type AutomationRun = {
  id: string;
  automation_key: string;
  status: string;
  error: string | null;
  created_at: string;
};

function ExpoAutomationsPage() {
  const [runs, setRuns] = useState<AutomationRun[]>([]);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    const { data } = await supabase
      .from("automation_runs")
      .select("id, automation_key, status, error, created_at")
      .like("automation_key", "expo_%")
      .order("created_at", { ascending: false })
      .limit(100);
    if (data) setRuns(data as never);
  }

  const runsByKey: Record<string, AutomationRun[]> = {};
  for (const r of runs) {
    if (!runsByKey[r.automation_key]) runsByKey[r.automation_key] = [];
    runsByKey[r.automation_key].push(r);
  }

  return (
    <div>
      <PageHeader title="Automations" description="Expo automation status and recent run logs." />
      <div className="space-y-6 px-6 py-6 md:px-10 md:py-8">
        <div className="grid gap-4 lg:grid-cols-2">
          {EXPO_AUTOMATIONS.map((a) => {
            const keyRuns = runsByKey[`expo_${a.key}`] ?? [];
            const lastRun = keyRuns[0];
            const failures = keyRuns.filter((r) => r.status === "error").length;
            return (
              <Card key={a.key}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm">{a.label}</CardTitle>
                    <Badge variant={failures > 0 ? "destructive" : "default"} className="text-[10px]">
                      {failures > 0 ? `${failures} error${failures > 1 ? "s" : ""}` : "OK"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{a.description}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {lastRun ? (
                    <div className="rounded-md bg-muted px-3 py-2 text-xs">
                      <p className="text-muted-foreground">Last run: {formatDistanceToNow(lastRun.created_at)}</p>
                      <p className={lastRun.status === "error" ? "text-destructive" : "text-emerald-600"}>
                        Status: {lastRun.status}
                      </p>
                      {lastRun.error && <p className="mt-1 text-destructive">{lastRun.error}</p>}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No runs yet.</p>
                  )}
                  {keyRuns.length > 1 && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        View last {Math.min(keyRuns.length, 5)} runs
                      </summary>
                      <ul className="mt-2 space-y-1">
                        {keyRuns.slice(0, 5).map((r) => (
                          <li key={r.id} className="flex items-center justify-between gap-2 rounded bg-muted px-2 py-1">
                            <span className="text-muted-foreground">{formatDate(r.created_at)}</span>
                            <Badge variant={r.status === "error" ? "destructive" : "outline"} className="text-[9px]">
                              {r.status}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
