import Image from "next/image";
import Link from "next/link";

type EditorialHeroProps = {
  eyebrow: string;
  title: string;
  summary: string;
  image: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h9M8.5 3.5 13 8l-4.5 4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

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
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: EditorialHeroProps) {
  return (
    <section className="relative isolate min-h-[560px] overflow-hidden bg-[var(--navy)] text-white lg:min-h-[660px]">
      <Image src={image} alt="" fill priority loading="eager" sizes="100vw" className="object-cover opacity-58" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,14,24,0.96)_0%,rgba(5,14,24,0.86)_42%,rgba(5,14,24,0.28)_78%,rgba(5,14,24,0.18)_100%)]" />
      <div className="section-shell relative flex min-h-[560px] items-end pb-14 pt-44 lg:min-h-[660px] lg:pb-20 lg:pt-52">
        <div className="max-w-4xl">
          <p className="type-eyebrow text-white/62">{eyebrow}</p>
          <h1 className="type-display mt-5 max-w-[16ch] text-[clamp(2.5rem,5.5vw,4.75rem)] text-white">
            {title}
          </h1>
          <p className="type-body mt-6 max-w-2xl text-base text-white/76 sm:text-lg">{summary}</p>
          {(primaryLabel && primaryHref) || (secondaryLabel && secondaryHref) ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {primaryLabel && primaryHref ? (
                <PrimaryCta href={primaryHref} label={primaryLabel} />
              ) : null}
              {secondaryLabel && secondaryHref ? (
                <Link href={secondaryHref} className="btn-secondary border-white text-white hover:bg-white hover:text-[var(--navy)]">
                  {secondaryLabel}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
