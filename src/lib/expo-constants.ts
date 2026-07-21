// Expo domain constants — separate from MBA/admissions constants

export const EXPO_PIPELINE_STAGES = [
  "New Lead",
  "Contacted",
  "Qualified",
  "Package Sent",
  "Early Bird Offered",
  "Meeting Booked",
  "Meeting Completed",
  "Negotiation",
  "Reserved",
  "Invoice Sent",
  "Paid",
  "Onboarding In Progress",
  "Ready for Expo",
  "Dormant",
  "Closed Lost",
] as const;
export type ExhPipelineStage = (typeof EXPO_PIPELINE_STAGES)[number];

export const EXPO_DEAL_STATUSES = ["Open", "Won", "Lost", "Dormant"] as const;
export type ExhDealStatus = (typeof EXPO_DEAL_STATUSES)[number];

export const EXPO_PAYMENT_STATUSES = [
  "Not Sent",
  "Sent",
  "Partially Paid",
  "Paid",
  "Overdue",
] as const;
export type ExhPaymentStatus = (typeof EXPO_PAYMENT_STATUSES)[number];

export const EXPO_ONBOARDING_STATUSES = [
  "Not Started",
  "Awaiting Assets",
  "Awaiting Requirements",
  "Awaiting Confirmation",
  "Complete",
] as const;
export type ExhOnboardingStatus = (typeof EXPO_ONBOARDING_STATUSES)[number];

export const EXPO_MEETING_STATUSES = [
  "Pending",
  "Booked",
  "Completed",
  "Cancelled",
  "No Show",
] as const;
export type ExpoMeetingStatus = (typeof EXPO_MEETING_STATUSES)[number];

export const EXPO_MEETING_OUTCOMES = [
  "Interested",
  "Needs Internal Approval",
  "Price Concern",
  "Follow Up Later",
  "Not a Fit",
  "Won",
  "Lost",
] as const;
export type ExpoMeetingOutcome = (typeof EXPO_MEETING_OUTCOMES)[number];

export const EXPO_INVOICE_STATUSES = [
  "Draft",
  "Sent",
  "Partially Paid",
  "Paid",
  "Overdue",
  "Cancelled",
] as const;
export type ExpoInvoiceStatus = (typeof EXPO_INVOICE_STATUSES)[number];

export const EXPO_ATTENDEE_STATUSES = [
  "Interested",
  "Registered",
  "Confirmed",
  "Reminder Sent",
  "Checked In",
  "No Show",
  "Cancelled",
  "Post-Event Follow-Up",
] as const;
export type ExpoAttendeeStatus = (typeof EXPO_ATTENDEE_STATUSES)[number];

export const EXPO_EVENT_STATUSES = ["Draft", "Published", "Completed", "Cancelled"] as const;
export type ExpoEventStatus = (typeof EXPO_EVENT_STATUSES)[number];

export const EXPO_PACKAGE_TYPES = [
  "Standard Stand",
  "Premium Stand",
  "Corner Stand",
  "Sponsorship",
  "Digital",
  "Other",
] as const;
export type ExpoPackageType = (typeof EXPO_PACKAGE_TYPES)[number];

// Stage badge colours
export function exhStageTone(
  stage: ExhPipelineStage,
): "default" | "secondary" | "outline" | "destructive" {
  if (stage === "Paid" || stage === "Ready for Expo") return "default";
  if (stage === "Closed Lost") return "destructive";
  if (stage === "Dormant") return "outline";
  return "secondary";
}

export function exhPaymentTone(
  status: ExhPaymentStatus,
): "default" | "secondary" | "outline" | "destructive" {
  if (status === "Paid") return "default";
  if (status === "Overdue") return "destructive";
  if (status === "Partially Paid") return "secondary";
  return "outline";
}

export function exhOnboardingTone(
  status: ExhOnboardingStatus,
): "default" | "secondary" | "outline" {
  if (status === "Complete") return "default";
  if (status === "Not Started") return "outline";
  return "secondary";
}

export function attendeeStatusTone(
  status: ExpoAttendeeStatus,
): "default" | "secondary" | "outline" | "destructive" {
  if (status === "Checked In") return "default";
  if (status === "No Show" || status === "Cancelled") return "destructive";
  if (status === "Confirmed") return "secondary";
  return "outline";
}
