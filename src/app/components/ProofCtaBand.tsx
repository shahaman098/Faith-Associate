import Link from "next/link";
import { ArrowIcon } from "./icons";

const defaultProof = [
  { value: "5000+", label: "Mosques supported" },
  { value: "3467+", label: "Madrassahs engaged" },
  { value: "20+", label: "Years of impact" },
];

/**
 * Closing navy band shared by every directory page: proof first, then a real
 * next step. Dark sections always carry a job, never decorative grey.
 */
export function ProofCtaBand({
  eyebrow = "Work with us",
  title = "Tell us what your institution needs.",
  primaryLabel = "Start a conversation",
  primaryHref = "/contact",
  secondaryLabel,
  secondaryHref,
  proof = defaultProof,
}: {
  eyebrow?: string;
  title?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  proof?: { value: string; label: string }[];
}) {
  return (
    <section className="band band-navy">
      <div className="section-shell">
        <div className="grid gap-px bg-white/14 sm:grid-cols-3">
          {proof.map((stat) => (
            <div key={stat.label} className="bg-[var(--navy)] px-2 py-6 sm:px-6">
              <p className="stat-figure text-[clamp(1.9rem,3.2vw,3rem)] text-white">{stat.value}</p>
              <p className="type-meta mt-3 text-[10px] leading-tight sm:text-[11px]">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 border-t border-white/14 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="type-eyebrow">{eyebrow}</p>
            <h2 className="type-display mt-4 max-w-[16ch] text-[clamp(2rem,3.8vw,3.1rem)] text-white">
              {title}
            </h2>
            <div className="rule-red mt-6" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link href={primaryHref} className="btn-primary w-full sm:w-auto">
              {primaryLabel} <ArrowIcon />
            </Link>
            {secondaryLabel && secondaryHref ? (
              <Link
                href={secondaryHref}
                className="btn-secondary w-full border-white text-white hover:bg-white hover:text-[var(--navy)] sm:w-auto"
              >
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
