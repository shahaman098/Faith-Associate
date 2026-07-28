import Image from "next/image";
import Link from "next/link";
import type { EditorialPageData } from "../data/site-content";
import { publications } from "../data/publications";
import { EditorialHero } from "./EditorialHero";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { ZohoFormEmbed } from "./ZohoFormEmbed";
import type { SiteSettingsData } from "@/lib/cms/types";

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

export function EditorialDetailPage({ data, settings }: { data: EditorialPageData; settings?: SiteSettingsData | null }) {
  const related = publications
    .filter((publication) => {
      const words = `${data.title} ${data.summary}`
        .toLowerCase()
        .split(/\W+/)
        .filter((word) => word.length > 5);
      const haystack = `${publication.title} ${publication.category}`.toLowerCase();
      return words.some((word) => haystack.includes(word));
    })
    .slice(0, 3);
  const fallbackRelated = related.length === 3 ? related : publications.slice(0, 3);
  const primaryHref = data.zohoFormUrl ? "#booking-form" : (data.externalUrl ?? "/contact");
  const primaryLabel =
    data.ctaLabel ?? (data.zohoFormUrl ? "Book / enquire" : "Start a conversation");

  return (
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader settings={settings} />
      <EditorialHero
        eyebrow={data.eyebrow}
        title={data.title}
        summary={data.summary}
        image={data.image}
        primaryLabel={primaryLabel}
        primaryHref={primaryHref}
        secondaryLabel="View publications"
        secondaryHref="/publications"
      />

      <section className="bg-[var(--soft)] py-12 lg:py-20">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div>
            <p className="type-eyebrow text-[var(--blue)]">The opportunity</p>
            {data.stat ? (
              <div className="mt-8 border-t border-[var(--line)] pt-6">
                <p className="type-display text-[clamp(2.5rem,4vw,3.5rem)] text-[var(--ink)]">{data.stat.value}</p>
                <p className="type-body mt-2 max-w-xs text-sm text-[var(--muted)]">{data.stat.label}</p>
              </div>
            ) : null}
          </div>
          <div>
            {data.intro.map((paragraph, index) => (
              <p
                key={paragraph}
                className={
                  index === 0
                    ? "type-title text-[1.45rem] leading-snug text-[var(--ink)] sm:text-[1.75rem]"
                    : "type-body mt-6 text-[var(--muted)]"
                }
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-20">
        <div className="section-shell">
          <div className="grid gap-6 border-b border-[var(--line)] pb-10 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="type-eyebrow text-[var(--blue)]">How we help</p>
              <h2 className="type-display mt-4 max-w-[13ch] text-[clamp(1.85rem,3.6vw,2.75rem)] text-[var(--ink)]">
                Focused support, built around the institution.
              </h2>
            </div>
            <p className="type-body max-w-xl text-sm text-[var(--muted)] lg:justify-self-end lg:text-[1.05rem]">
              Every engagement begins with context. We adapt the scope, delivery and level of support
              to the organisation, its people and the outcome required.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4">
            {data.highlights.map((highlight, index) => (
              <article
                key={highlight.title}
                className="border-b border-[var(--line)] py-8 md:px-6 md:first:pl-0 lg:border-b-0 lg:border-r lg:last:border-r-0 lg:last:pr-0"
              >
                <p className="capability-index">0{index + 1}</p>
                <h3 className="type-title mt-6 text-[1.2rem] text-[var(--ink)]">{highlight.title}</h3>
                <p className="type-body mt-3 text-sm text-[var(--muted)]">{highlight.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[var(--navy)] text-white">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[380px] lg:min-h-[560px]">
            <Image src={data.image} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(11,24,36,0.24))]" />
          </div>
          <div className="flex items-center px-7 py-14 sm:px-12 lg:px-16 lg:py-20 xl:px-24">
            <div className="max-w-xl">
              <p className="type-eyebrow text-white/50">What changes</p>
              <h2 className="type-display mt-5 text-[clamp(1.85rem,3.6vw,2.75rem)]">
                From intention to confident delivery.
              </h2>
              <div className="mt-8 grid gap-4">
                {data.outcomes.map((outcome) => (
                  <div
                    key={outcome}
                    className="flex items-start gap-4 border-t border-white/12 pt-4 text-sm leading-7 text-white/72"
                  >
                    <span className="mt-2 size-1.5 shrink-0 bg-[var(--blue)]" />
                    <p className="type-body text-white/72">{outcome}</p>
                  </div>
                ))}
              </div>
              {data.zohoFormUrl ? (
                <a href="#booking-form" className="btn-primary mt-8">
                  Book / enquire <ArrowIcon />
                </a>
              ) : (
                <Link href="/contact" className="btn-primary mt-8">
                  Discuss your needs <ArrowIcon />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {data.zohoFormUrl ? (
        <section id="booking-form" className="scroll-mt-28 bg-[var(--soft)] py-12 lg:py-20">
          <div className="section-shell">
            <div className="max-w-3xl">
              <p className="type-eyebrow text-[var(--blue)]">Book or enquire</p>
              <h2 className="type-display mt-4 text-[clamp(1.85rem,3.6vw,2.75rem)] text-[var(--ink)]">
                Complete the form below.
              </h2>
              <p className="type-body mt-4 text-[var(--muted)]">
                Register your details with Faith Associates for this service. A member of the team will
                follow up with next steps.
              </p>
            </div>
            <div className="mt-8 overflow-hidden border border-[var(--line)] bg-white">
              <ZohoFormEmbed src={data.zohoFormUrl} title={`${data.title} booking form`} height={720} />
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-white py-12 lg:py-20">
        <div className="section-shell">
          <div className="flex flex-col gap-5 border-b border-[var(--line)] pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="type-eyebrow text-[var(--blue)]">Related thinking</p>
              <h2 className="type-display mt-4 text-[clamp(1.85rem,3.6vw,2.75rem)] text-[var(--ink)]">
                Useful resources
              </h2>
            </div>
            <Link
              href="/publications"
              className="type-cta inline-flex items-center gap-2 text-[var(--blue)] transition duration-300 hover:text-[var(--blue-dark)]"
            >
              View all publications <ArrowIcon />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {fallbackRelated.map((publication) => (
              <Link href={`/publications/${publication.slug}`} key={publication.slug} className="group">
                <div className="media-frame relative aspect-[0.82/1] bg-[var(--soft)]">
                  <Image
                    src={publication.image}
                    alt=""
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-4 transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="type-meta mt-5 text-[var(--blue)]">
                  {publication.category} / {publication.format}
                </p>
                <h3 className="type-title mt-3 text-[1.2rem] text-[var(--ink)] transition duration-300 group-hover:text-[var(--blue)]">
                  {publication.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter settings={settings} />
    </main>
  );
}
