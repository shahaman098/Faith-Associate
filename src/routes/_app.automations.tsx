import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AUTOMATIONS = [
  {
    key: "intake",
    title: "Enquiry submitted",
    desc: "Acknowledgement + brochure + qualify link, notify staff, create review task",
  },
  {
    key: "qualification_reminder",
    title: "No qualification after 2 days",
    desc: "Reminder. Cap 3 → Dormant",
  },
  { key: "qualification_complete", title: "Qualification submitted", desc: "Auto-advance stage" },
  {
    key: "booking_reminder",
    title: "Booking link sent, no booking after 2 days",
    desc: "Reminder. Cap 3 → Dormant",
  },
  { key: "booking_confirmed", title: "Staff marks booking confirmed", desc: "→ Interview Booked" },
  {
    key: "decision_approved",
    title: "Decision = Approved",
    desc: "→ Awaiting Payment, send payment email",
  },
  { key: "decision_on_hold", title: "Decision = On Hold", desc: "Log reason, follow-up task" },
  { key: "decision_rejected", title: "Decision = Rejected", desc: "Optional rejection email" },
  { key: "decision_more_info", title: "Decision = Need More Info", desc: "Send request email" },
  {
    key: "payment_reminder",
    title: "Payment unpaid 2 days after Sent",
    desc: "Reminder. Cap 3 → Overdue",
  },
  { key: "payment_paid", title: "Payment marked Paid", desc: "→ Enrolled, send welcome email" },
];

export const Route = createFileRoute("/_app/automations")({
  component: () => (
    <div>
      <PageHeader
        title="Automations"
        description="V1 automation rules. Server-scheduled runner coming next."
      />
      <div className="px-6 py-6 md:px-10 space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          {AUTOMATIONS.map((a) => (
            <Card key={a.key}>
              <CardHeader>
                <CardTitle className="text-base">{a.title}</CardTitle>
                <CardDescription>{a.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono">{a.key}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  ),
});
