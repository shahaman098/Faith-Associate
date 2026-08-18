import Link from "next/link";
import type { EditorialPageData } from "../data/site-content";
import type { Publication } from "../data/publications";
import { EditorialHero } from "./EditorialHero";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { ZohoFormEmbed } from "./ZohoFormEmbed";
import { EditableImage } from "./cms/EditableImage";
import { EditableText } from "./cms/EditableText";
import { ArrowIcon, CertificateIcon, CheckIcon } from "./icons";
import type { SiteSettingsData } from "@/lib/cms/types";

export type RelatedItem = {
  title: string;
  href: string;
  summary?: string;
  image?: string;
};

/**
 * Template C — course / service / project / editorial detail page.
 *
 * Hero (photo, eyebrow, title, promise, chips, CTA) -> sticky "At a glance" rail
 * beside the full body -> numbered agenda -> navy outcomes band -> framed booking
 * panel -> related items in the same family.
 */
export function EditorialDetailPage({
  data,
  relatedPublications,
  relatedItems = [],
  relatedLabel = "Related services",
  settings,
}: {
  data: EditorialPageData;
  relatedPublications: Publication[];
  relatedItems?: RelatedItem[];
  relatedLabel?: string;
  settings?: SiteSettingsData | null;
}) {
  const related = relatedPublications
    .filter((publication) => {
      const words = `${data.title} ${data.summary}`
        .toLowerCase()
        .split(/\W+/)
        .filter((word) => word.length > 5);
      const haystack = `${publication.title} ${publication.category}`.toLowerCase();
      return words.some((word) => haystack.includes(word));
    })
    .slice(0, 3);
  const fallbackRelated = related.length === 3 ? related : relatedPublications.slice(0, 3);

  const hasBooking = Boolean(data.zohoFormUrl);
  const primaryHref = hasBooking ? "#booking-form" : (data.externalUrl ?? "/contact");
  const primaryLabel = data.ctaLabel ?? (hasBooking ? "Book / enquire" : "Start a conversation");

  // Chips only ever show published facts. A course with no published price says so.
  const chips = [
    data.duration,
    data.cost,
    ...(data.chips ?? []),
    data.certificate ? "Certificate on completion" : undefined,
  ].filter((chip): chip is string => Boolean(chip));

  // Where a page has no authored facts, derive them from what the record actually
  // states. Nothing here is inferred beyond the data — no invented price or duration.
  const derivedFacts: { label: string; value: string }[] = [
    { label: "Service type", value: data.eyebrow },
    {
      label: "Next step",
      value: hasBooking ? "Book or enquire online" : "Talk to the team",
    },
  ];
  if (data.ctaLabel && data.externalUrl) {
    derivedFacts.push({ label: "Related site", value: data.ctaLabel });
  }
  const quickFacts = data.quickFacts?.length ? data.quickFacts : derivedFacts;
  const agenda = data.agenda ?? [];
  const materials = data.materials ?? [];
  const audience = data.audience ?? [];
  const benefits = data.benefits ?? [];

  return (
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader settings={settings} />
      <EditorialHero
        eyebrow={data.eyebrow}
        title={data.title}
        summary={data.summary}
        image={data.image}
        imagePath="image"
        eyebrowPath="eyebrow"
        titlePath="title"
        summaryPath="summary"
        chips={chips}
        primaryLabel={primaryLabel}
        primaryHref={primaryHref}
        secondaryLabel="All services"
        secondaryHref="/services"
        tertiaryLabel={data.secondaryCtaLabel}
        tertiaryHref={data.secondaryCtaHref}
      />

      {/* Body: sticky "At a glance" rail + full copy */}
      <section className="band band-white">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-start lg:gap-16">
          <div className="sticky-rail">
            <div className="border border-[var(--line)] bg-[var(--soft)]">
              <div className="border-b border-[var(--line)] px-6 py-4">
                <p className="type-eyebrow text-[var(--blue)]">At a glance</p>
              </div>
              <dl className="divide-y divide-[var(--line)]">
                {quickFacts.map((fact, index) => (
                  <div key={fact.label} className="px-6 py-4">
                    <dt className="type-meta text-[var(--muted)]">
                      <EditableText value={fact.label} path={`quickFacts.${index}.label`} />
                    </dt>
                    <dd className="type-title mt-1.5 text-[1.05rem] text-[var(--ink)]">
                      <EditableText value={fact.value} path={`quickFacts.${index}.value`} multiline />
                    </dd>
                  </div>
                ))}
                {data.stat ? (
                  <div className="px-6 py-5">
                    <p className="stat-figure text-[clamp(2rem,3vw,2.75rem)] text-[var(--blue)]">
                      <EditableText value={data.stat.value} path="stat.value" />
                    </p>
                    <p className="type-body mt-2 text-sm text-[var(--muted)]">
                      <EditableText value={data.stat.label} path="stat.label" multiline />
                    </p>
                  </div>
                ) : null}
              </dl>

              {data.certificate ? (
                <div className="flex items-start gap-4 border-t border-[var(--line)] bg-white px-6 py-5">
                  <span className="icon-tile">
                    <CertificateIcon />
                  </span>
                  <p className="type-body text-sm text-[var(--muted)]">
                    <EditableText value={data.certificate} path="certificate" multiline />
                  </p>
                </div>
              ) : null}

              <div className="border-t border-[var(--line)] p-6">
                <a href={primaryHref} className="btn-primary w-full">
                  {primaryLabel} <ArrowIcon />
                </a>
              </div>
            </div>

            {audience.length ? (
              <div className="mt-6 border border-[var(--line)] p-6">
                <p className="type-eyebrow text-[var(--blue)]">Who it is for</p>
                <ul className="mt-5 grid gap-3">
                  {audience.map((item, index) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center bg-[var(--blue)] text-white">
                        <CheckIcon className="size-4" />
                      </span>
                      <span className="type-body text-[0.95rem] text-[var(--ink)]">
                        <EditableText value={item} path={`audience.${index}`} multiline />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div>
            <p className="type-eyebrow text-[var(--blue)]">
              <EditableText value="The opportunity" path="opportunityEyebrow" />
            </p>
            <div className="rule-red mt-5" />
            <div className="mt-7">
              {data.intro.map((paragraph, index) => (
                <div
                  key={`${index}-${paragraph}`}
                  className={
                    index === 0
                      ? "type-title text-[1.35rem] leading-snug text-[var(--ink)] sm:text-[1.7rem]"
                      : "type-body mt-6 text-[1.02rem] text-[var(--muted)]"
                  }
                >
                  <EditableText value={paragraph} path={`intro.${index}`} multiline />
                </div>
              ))}
            </div>

            {/* Agenda / training content as a real numbered list */}
            {agenda.length ? (
              <div className="mt-12 border-t border-[var(--line)] pt-10">
                <h2 className="type-display text-[clamp(1.6rem,2.8vw,2.25rem)] text-[var(--ink)]">
                  <EditableText
                    value={data.agendaTitle ?? "Training content"}
                    path="agendaTitle"
                  />
                </h2>
                <ol className="mt-7 divide-y divide-[var(--line)] border-y border-[var(--line)]">
                  {agenda.map((item, index) => (
                    <li key={item.title} className="flex gap-5 py-5 sm:gap-7">
                      <span className="index-number index-number--quiet w-14 shrink-0 sm:w-16" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <h3 className="type-title text-[1.1rem] text-[var(--ink)] sm:text-[1.2rem]">
                          <EditableText value={item.title} path={`agenda.${index}.title`} />
                        </h3>
                        {item.body ? (
                          <p className="type-body mt-2 text-[0.98rem] text-[var(--muted)]">
                            <EditableText value={item.body} path={`agenda.${index}.body`} multiline />
                          </p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            {/* Materials delegates take away */}
            {materials.length ? (
              <div className="mt-12">
                <h2 className="type-display text-[clamp(1.6rem,2.8vw,2.25rem)] text-[var(--ink)]">
                  <EditableText
                    value={data.materialsTitle ?? "Materials included"}
                    path="materialsTitle"
                  />
                </h2>
                <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {materials.map((item, index) => (
                    <li key={item} className="flex items-start gap-3 border-b border-[var(--line)] pb-3">
                      <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center bg-[var(--soft-strong)] text-[var(--blue)]">
                        <CheckIcon className="size-4" />
                      </span>
                      <span className="type-body text-[0.95rem] text-[var(--ink)]">
                        <EditableText value={item} path={`materials.${index}`} multiline />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* How we help — dense numbered cluster */}
      {data.highlights.length ? (
        <section className="band band-soft band-rule">
          <div className="section-shell">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
              <div>
                <p className="type-eyebrow text-[var(--blue)]">
                  <EditableText value="What this covers" path="howWeHelpEyebrow" />
                </p>
                <h2 className="type-display mt-4 max-w-[14ch] text-[clamp(1.85rem,3.4vw,2.8rem)] text-[var(--ink)]">
                  <EditableText
                    value="Practical modules with visible outcomes."
                    path="howWeHelpTitle"
                  />
                </h2>
                <div className="rule-red mt-6" />
              </div>
              <p className="type-body max-w-[38rem] text-[1.02rem] text-[var(--muted)]">
                <EditableText
                  value="Every engagement begins with context. We adapt the scope, delivery and level of support to the organisation, its people and the outcome required."
                  path="howWeHelpBody"
                  multiline
                />
              </p>
            </div>

            <div className="mt-10 grid gap-px bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
              {data.highlights.map((highlight, index) => (
                <article key={highlight.title} className="group bg-white p-6 lg:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <span className="icon-tile">
                      <CheckIcon />
                    </span>
                    <span className="index-number index-number--quiet" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="type-title mt-5 text-[1.2rem] text-[var(--ink)]">
                    <EditableText value={highlight.title} path={`highlights.${index}.title`} />
                  </h3>
                  <p className="type-body mt-3 text-[0.95rem] text-[var(--muted)]">
                    <EditableText value={highlight.body} path={`highlights.${index}.body`} multiline />
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Benefits, where the source page names them */}
      {benefits.length ? (
        <section className="band band-white">
          <div className="section-shell">
            <h2 className="type-display max-w-[16ch] text-[clamp(1.85rem,3.4vw,2.8rem)] text-[var(--ink)]">
              <EditableText value="Benefits" path="benefitsTitle" />
            </h2>
            <div className="rule-red mt-6" />
            <div className="mt-9 grid gap-px bg-[var(--line)] md:grid-cols-3">
              {benefits.map((benefit, index) => (
                <article key={benefit.title} className="bg-white p-6 lg:p-8">
                  <span className="index-number index-number--quiet" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="type-title mt-4 text-[1.2rem] text-[var(--ink)]">
                    <EditableText value={benefit.title} path={`benefits.${index}.title`} />
                  </h3>
                  <p className="type-body mt-3 text-[0.95rem] text-[var(--muted)]">
                    <EditableText value={benefit.body} path={`benefits.${index}.body`} multiline />
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Outcomes — dense navy band with photography */}
      {data.outcomes.length ? (
        <section className="relative isolate overflow-hidden bg-[var(--navy)] text-white">
          <div className="absolute inset-y-0 right-0 hidden w-[42%] lg:block">
            <EditableImage
              src={data.image}
              alt=""
              path="image"
              fill
              sizes="42vw"
              className="object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--navy)_0%,rgba(11,24,36,0.72)_45%,rgba(11,24,36,0.35)_100%)]" />
          </div>
          <div className="section-shell relative z-10 band">
            <div className="lg:max-w-[62%]">
              <p className="type-eyebrow text-[var(--blue-light)]">
                <EditableText value="What you leave with" path="outcomesEyebrow" />
              </p>
              <h2 className="type-display mt-4 max-w-[15ch] text-[clamp(2rem,3.8vw,3.1rem)] text-white">
                <EditableText value="Outcomes you can evidence." path="outcomesTitle" />
              </h2>
              <div className="rule-red mt-6" />
              <ol className="mt-9 grid gap-px bg-white/14 sm:grid-cols-2">
                {data.outcomes.map((outcome, index) => (
                  <li key={outcome} className="flex items-start gap-4 bg-[var(--navy)] p-5 lg:p-6">
                    <span className="index-number index-number--on-navy" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="type-title pt-1 text-[1.05rem] text-white lg:text-[1.15rem]">
                      <EditableText value={outcome} path={`outcomes.${index}`} multiline />
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      ) : null}

      {/* Closing pull-quote where the source page has one */}
      {data.quote ? (
        <section className="band-tight band-soft border-y border-[var(--line)]">
          <div className="section-shell max-w-[60rem]">
            <blockquote className="type-title text-[clamp(1.3rem,2.4vw,1.9rem)] leading-snug text-[var(--ink)]">
              <EditableText value={data.quote.text} path="quote.text" multiline />
            </blockquote>
            {data.quote.attribution ? (
              <p className="type-meta mt-5 text-[var(--blue)]">
                <EditableText value={data.quote.attribution} path="quote.attribution" />
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Booking / enquiry — always in a framed panel, never a bare iframe */}
      <section id="booking-form" className="band band-soft scroll-mt-28">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.4fr_0.6fr] lg:items-start lg:gap-14">
          <div>
            <p className="type-eyebrow text-[var(--blue)]">
              {hasBooking ? "Book or enquire" : "Talk to the team"}
            </p>
            <h2 className="type-display mt-4 max-w-[14ch] text-[clamp(1.85rem,3.4vw,2.8rem)] text-[var(--ink)]">
              <EditableText value="Ready to discuss delivery?" path="bookingTitle" />
            </h2>
            <div className="rule-red mt-6" />
            <p className="type-body mt-6 max-w-[32rem] text-[1.02rem] text-[var(--muted)]">
              <EditableText
                value="Register your details and the Faith Associates team will confirm suitability, format, dates and next steps."
                path="bookingBody"
                multiline
              />
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-secondary w-full border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white sm:w-auto">
                Contact the team
              </Link>
              {data.externalUrl ? (
                <a
                  href={data.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary w-full border-[var(--blue)] text-[var(--blue)] hover:bg-[var(--blue)] hover:text-white sm:w-auto"
                >
                  {data.ctaLabel ?? "Visit site"} <ArrowIcon />
                </a>
              ) : null}
            </div>
          </div>

          <div className="panel-frame w-full">
            <div className="panel-frame__head">
              <p className="type-eyebrow text-[var(--blue)]">
                {hasBooking ? "Booking form" : "Enquiry"}
              </p>
              <p className="type-title mt-2 text-[1.2rem] text-[var(--ink)]">{data.title}</p>
            </div>
            {hasBooking ? (
              <>
                <ZohoFormEmbed src={data.zohoFormUrl as string} title={`${data.title} booking form`} height={760} />
                <p className="border-t border-[var(--line)] px-6 py-4 text-sm text-[var(--muted)]">
                  Form not loading?{" "}
                  <a
                    href={data.zohoFormUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[var(--blue)] underline underline-offset-4"
                  >
                    Open the booking form in a new tab
                  </a>
                  .
                </p>
              </>
            ) : (
              <div className="panel-frame__body">
                <p className="type-body text-[var(--muted)]">
                  Tell us about your institution, the dates you have in mind and how many people need
                  to attend. We will come back with availability and a quote.
                </p>
                <Link href="/contact" className="btn-primary mt-6 w-full sm:w-auto">
                  Send an enquiry <ArrowIcon />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related items in the same family */}
      {relatedItems.length ? (
        <section className="band band-white band-rule">
          <div className="section-shell">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="type-display max-w-[16ch] text-[clamp(1.7rem,3vw,2.4rem)] text-[var(--ink)]">
                {relatedLabel}
              </h2>
              <Link href="/services" className="type-cta inline-flex items-center gap-2 text-[var(--blue)]">
                All services <ArrowIcon />
              </Link>
            </div>
            <div className="mt-8 grid gap-px bg-[var(--line)] md:grid-cols-3">
              {relatedItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col justify-between gap-6 bg-white p-6 transition lg:p-7"
                >
                  <div>
                    <span className="index-number index-number--quiet" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="type-title mt-4 text-[1.15rem] text-[var(--ink)] transition group-hover:text-[var(--blue)]">
                      {item.title}
                    </h3>
                    {item.summary ? (
                      <p className="type-body mt-3 text-[0.95rem] text-[var(--muted)]">{item.summary}</p>
                    ) : null}
                  </div>
                  <span
                    aria-hidden="true"
                    className="inline-flex size-10 items-center justify-center bg-[var(--soft)] text-[var(--blue)] transition group-hover:bg-[var(--red)] group-hover:text-white"
                  >
                    <ArrowIcon />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Related publications */}
      {fallbackRelated.length ? (
        <section className="band band-soft">
          <div className="section-shell">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="type-display max-w-[16ch] text-[clamp(1.7rem,3vw,2.4rem)] text-[var(--ink)]">
                Related thinking
              </h2>
              <Link href="/publications" className="type-cta inline-flex items-center gap-2 text-[var(--blue)]">
                All publications <ArrowIcon />
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {fallbackRelated.map((publication) => (
                <Link
                  key={publication.slug}
                  href={`/publications/${publication.slug}`}
                  className="group flex flex-col border border-[var(--line)] bg-white transition hover:border-[var(--blue)]"
                >
                  <div className="media-frame relative aspect-[16/10] w-full overflow-hidden">
                    <EditableImage
                      src={publication.image}
                      alt=""
                      path={`relatedPublications.${publication.slug}.image`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <p className="type-meta text-[var(--blue)]">{publication.category}</p>
                      <h3 className="type-title mt-3 text-[1.1rem] text-[var(--ink)] transition group-hover:text-[var(--blue)]">
                        {publication.title}
                      </h3>
                    </div>
                    <span
                      aria-hidden="true"
                      className="mt-6 inline-flex size-10 items-center justify-center bg-[var(--soft)] text-[var(--blue)] transition group-hover:bg-[var(--red)] group-hover:text-white"
                    >
                      <ArrowIcon />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <SiteFooter settings={settings} />
    </main>
  );
}
