import {
  PIPELINE_STAGE_LABELS,
  DECISION_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  type PipelineStage,
  type DecisionStatus,
  type PaymentStatus,
} from "@/lib/crm-constants";

// Inline colored pill — no shadcn Badge variant needed
function Pill({ label, color }: { label: string; color: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${color}`}>
      {label}
    </span>
  );
}

export function StageBadge({ stage }: { stage: PipelineStage }) {
  const color =
    stage === "enrolled"
      ? "bg-blue-100 text-blue-700"
      : stage === "dormant"
        ? "bg-zinc-100 text-zinc-500"
        : stage === "awaiting_payment"
          ? "bg-amber-100 text-amber-700"
          : stage === "interview_booked" || stage === "interview_completed"
            ? "bg-violet-100 text-violet-700"
            : "bg-slate-100 text-slate-600";
  return <Pill label={PIPELINE_STAGE_LABELS[stage]} color={color} />;
}

export function DecisionBadge({ status }: { status: DecisionStatus }) {
  const color =
    status === "approved"
      ? "bg-emerald-100 text-emerald-700"
      : status === "rejected"
        ? "bg-red-100 text-red-700"
        : status === "on_hold"
          ? "bg-amber-100 text-amber-700"
          : status === "need_more_info"
            ? "bg-orange-100 text-orange-700"
            : "bg-zinc-100 text-zinc-500";
  return <Pill label={DECISION_STATUS_LABELS[status]} color={color} />;
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const color =
    status === "paid"
      ? "bg-emerald-100 text-emerald-700"
      : status === "overdue"
        ? "bg-red-100 text-red-700"
        : status === "sent"
          ? "bg-blue-100 text-blue-700"
          : "bg-zinc-100 text-zinc-500";
  return <Pill label={PAYMENT_STATUS_LABELS[status]} color={color} />;
}
