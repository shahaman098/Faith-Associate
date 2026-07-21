export const PIPELINE_STAGES = [
  "new_enquiry",
  "contacted",
  "awaiting_qualification",
  "qualification_submitted",
  "awaiting_interview_booking",
  "interview_booked",
  "interview_completed",
  "awaiting_payment",
  "enrolled",
  "dormant",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export const PIPELINE_STAGE_LABELS: Record<PipelineStage, string> = {
  new_enquiry: "New Enquiry",
  contacted: "Contacted",
  awaiting_qualification: "Awaiting Qualification",
  qualification_submitted: "Qualification Submitted",
  awaiting_interview_booking: "Awaiting Interview Booking",
  interview_booked: "Interview Booked",
  interview_completed: "Interview Completed",
  awaiting_payment: "Awaiting Payment",
  enrolled: "Enrolled",
  dormant: "Dormant",
};

export const TERMINAL_STAGES: PipelineStage[] = ["enrolled", "dormant"];

export const DECISION_STATUSES = [
  "pending",
  "approved",
  "on_hold",
  "rejected",
  "need_more_info",
] as const;
export type DecisionStatus = (typeof DECISION_STATUSES)[number];
export const DECISION_STATUS_LABELS: Record<DecisionStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  on_hold: "On Hold",
  rejected: "Rejected",
  need_more_info: "Need More Info",
};

export const PAYMENT_STATUSES = ["not_sent", "sent", "paid", "overdue"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  not_sent: "Not Sent",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
};

export const WEBSITES = [
  "mosqueexpo.com",
  "cricketforpeace.com",
  "profabusin.org",
  "imamsonline.com",
  "faithassociates.co.uk",
  "mosque.mba",
  "soarproject.eu",
  "mosquesecurity.com",
  "ecomosque.com",
  "meetprogramme.eu",
  "madrassah.co.uk",
  "efiorg.eu",
  "beaconmosque.com",
] as const;

export function stageBadgeTone(stage: PipelineStage): "default" | "secondary" | "outline" {
  if (stage === "enrolled") return "default";
  if (stage === "dormant") return "outline";
  return "secondary";
}
