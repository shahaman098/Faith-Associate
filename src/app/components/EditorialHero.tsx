"use client";

import Link from "next/link";
import { EditableImage } from "./cms/EditableImage";
import { EditableText } from "./cms/EditableText";
import { ArrowIcon } from "./icons";

type EditorialHeroProps = {
  eyebrow: string;
  title: string;
  summary: string;
  image: string;
  imagePath?: string;
  eyebrowPath?: string;
  titlePath?: string;
  summaryPath?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  /** Metadata chips under the summary — duration, cost, status. */
  chips?: string[];
  /** Optional third link, e.g. an outbound partner site. */
  tertiaryLabel?: string;
  tertiaryHref?: string;
};

function PrimaryCta({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const className = "btn-primary";
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {label} <ArrowIcon />
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {label} <ArrowIcon />
    </Link>
  );
}

export function EditorialHero({
  eyebrow,
  title,
  summary,
  image,
  imagePath = "hero.image",
  eyebrowPath = "hero.eyebrow",
  titlePath = "hero.title",
  summaryPath = "hero.summary",
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  chips,
  tertiaryLabel,
  tertiaryHref,
}: EditorialHeroProps) {
  return (
    <section className="relative isolate min-h-[560px] overflow-hidden bg-[var(--navy)] text-white lg:min-h-[660px]">
      <EditableImage
        src={image}
        alt=""
        path={imagePath}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-58"
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(5,14,24,0.96)_0%,rgba(5,14,24,0.86)_42%,rgba(5,14,24,0.28)_78%,rgba(5,14,24,0.18)_100%)]" />
      <div className="section-shell relative z-10 flex min-h-[560px] items-end pb-14 pt-44 lg:min-h-[660px] lg:pb-20 lg:pt-52">
        <div className="max-w-4xl">
          <p className="type-eyebrow text-white/62">
            <EditableText value={eyebrow} path={eyebrowPath} />
          </p>
          <h1 className="type-display mt-5 max-w-[16ch] text-[clamp(2.5rem,5.5vw,4.75rem)] text-white">
            <EditableText value={title} path={titlePath} />
          </h1>
          <p className="type-body mt-6 max-w-2xl text-base text-white/80 sm:text-lg">
            <EditableText value={summary} path={summaryPath} multiline />
          </p>
          {chips?.length ? (
            <div className="chip-row mt-7">
              {chips.map((chip) => (
                <span key={chip} className="chip chip--on-navy">
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
          {(primaryLabel && primaryHref) || (secondaryLabel && secondaryHref) || (tertiaryLabel && tertiaryHref) ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {primaryLabel && primaryHref ? (
                <PrimaryCta href={primaryHref} label={primaryLabel} />
              ) : null}
              {secondaryLabel && secondaryHref ? (
                <Link
                  href={secondaryHref}
                  className="btn-secondary border-white text-white hover:bg-white hover:text-[var(--navy)]"
                >
                  {secondaryLabel}
                </Link>
              ) : null}
              {tertiaryLabel && tertiaryHref ? (
                <a
                  href={tertiaryHref}
                  target={tertiaryHref.startsWith("http") ? "_blank" : undefined}
                  rel={tertiaryHref.startsWith("http") ? "noreferrer" : undefined}
                  className="btn-secondary border-white/45 text-white hover:bg-white hover:text-[var(--navy)]"
                >
                  {tertiaryLabel}
                  <ArrowIcon />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
