import Link from "next/link";
import type { EditorialPageData } from "../data/site-content";
import type { CatalogueLink, CatalogueSection, ServiceCatalogue } from "../data/service-catalogues";
import { EditorialHero } from "./EditorialHero";
import { SectionNav } from "./SectionNav";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { EditableImage } from "./cms/EditableImage";
import { EditableText } from "./cms/EditableText";
import { ArrowIcon, CheckIcon, TrainingIcon } from "./icons";
import type { SiteSettingsData } from "@/lib/cms/types";

const proofStats = [
  { value: "5000+", label: "Mosques supported" },
  { value: "3467+", label: "Madrassahs engaged" },
  { value: "20+", label: "Years of impact" },
];

function CardLink({
  link,
  children,
  className,
}: {
  link: CatalogueLink;
  children: React.ReactNode;
  className?: string;
}) {
  if (link.external || link.href.startsWith("http")) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={link.href} className={className}>
      {children}
    </Link>
  );
}

/** Photo card — used when the offering has artwork. */
function OfferingCard({
  link,
  index,
  sectionIndex,
}: {
  link: CatalogueLink;
  index: number;
  sectionIndex: number;
}) {
  const path = `catalogue.sections.${sectionIndex}.links.${index}`;
  return (
    <article className="group relative flex flex-col bg-white">
      {link.image ? (
        <div className="media-frame relative aspect-[4/3] w-full overflow-hidden">
          <EditableImage
            src={link.image}
            alt=""
            path={`${path}.image`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
          <span className="absolute left-0 top-0 flex size-12 items-center justify-center bg-[var(--navy)] text-[13px] font-semibold tracking-[0.08em] text-white sm:size-14">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      ) : null}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <h3 className="type-title text-[1.2rem] text-[var(--ink)] transition group-hover:text-[var(--blue)]">
            <CardLink link={link}>
              <span className="absolute inset-0" aria-hidden="true" />
              <EditableText value={link.title} path={`${path}.title`} />
            </CardLink>
          </h3>
          {link.summary ? (
            <p className="type-body mt-3 text-[0.95rem] text-[var(--muted)]">
              <EditableText value={link.summary} path={`${path}.summary`} multiline />
            </p>
          ) : null}
        </div>
        <span
          aria-hidden="true"
          className="mt-6 inline-flex size-11 items-center justify-center bg-[var(--soft)] text-[var(--blue)] transition group-hover:bg-[var(--red)] group-hover:text-white"
        >
          <ArrowIcon />
        </span>
      </div>
    </article>
  );
}

/** Dense list row — used when the offering has no artwork. */
function DirectoryRow({
  link,
  index,
  sectionIndex,
}: {
  link: CatalogueLink;
  index: number;
  sectionIndex: number;
}) {
  const path = `catalogue.sections.${sectionIndex}.links.${index}`;
  return (
    <article className="group relative flex items-start gap-5 bg-white p-6">
      <span className="icon-tile">
        <TrainingIcon />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="type-title text-[1.1rem] text-[var(--ink)] transition group-hover:text-[var(--blue)]">
          <CardLink link={link}>
            <span className="absolute inset-0" aria-hidden="true" />
            <EditableText value={link.title} path={`${path}.title`} />
          </CardLink>
        </h3>
        {link.summary ? (
          <p className="type-body mt-2 text-[0.92rem] text-[var(--muted)]">
            <EditableText value={link.summary} path={`${path}.summary`} multiline />
          </p>
        ) : null}
      </div>
      <span
        aria-hidden="true"
        className="mt-1 inline-flex size-9 shrink-0 items-center justify-center bg-[var(--soft)] text-[var(--blue)] transition group-hover:bg-[var(--red)] group-hover:text-white"
      >
        <ArrowIcon />
      </span>
    </article>
  );
}

function SectionHead({
  section,
  sectionIndex,
  total,
}: {
  section: CatalogueSection;
  sectionIndex: number;
  total: number;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
      <div className="min-w-0">
        <p className="type-eyebrow text-[var(--blue)]">
          {String(sectionIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <h2 className="type-display mt-4 max-w-[18ch] text-[clamp(1.7rem,3vw,2.5rem)] text-[var(--ink)]">
          <EditableText value={section.title} path={`catalogue.sections.${sectionIndex}.title`} />
        </h2>
        <div className="rule-red mt-5" />
      </div>
      {section.summary ? (
        <p className="type-body max-w-[34rem] text-[1rem] text-[var(--muted)]">
          <EditableText
            value={section.summary}
            path={`catalogue.sections.${sectionIndex}.summary`}
            multiline
          />
        </p>
      ) : null}
    </div>
  );
}

/**
 * Service category page — dense catalogue of the offerings in one family.
 * One visual system for every category; the old glassmorphic directory variant
 * has been retired in favour of the shared sharp-editorial treatment.
 */
export function ServiceCataloguePage({
  category,
  catalogue,
  settings,
}: {
  category: EditorialPageData;
  catalogue: ServiceCatalogue;
  settings?: SiteSettingsData | null;
}) {
  const sections = catalogue.sections ?? [];
  const navSections = sections
    .filter((section) => section.links.length || section.body?.length || section.bullets?.length)
    .map((section) => ({ id: section.id, title: section.title }));
  const introParagraphs = catalogue.intro ?? category.intro;

  return (
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader settings={settings} />

      <EditorialHero
        eyebrow={category.eyebrow}
        title={category.title}
        summary={category.summary}
        image={category.image}
        imagePath="image"
        eyebrowPath="eyebrow"
        titlePath="title"
        summaryPath="summary"
        primaryLabel="Enquire"
        primaryHref="/contact"
        secondaryLabel="Browse below"
        secondaryHref={`#${sections[0]?.id ?? "catalogue"}`}
      />

      <SectionNav sections={navSections} />

      {/* Overview */}
      {introParagraphs.length || catalogue.policyHref ? (
        <section className="band-tight band-soft">
          <div className="section-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-16">
            <div>
              <p className="type-eyebrow text-[var(--blue)]">
                <EditableText value="Overview" path="overviewEyebrow" />
              </p>
              {category.stat ? (
                <div className="mt-7 border-t border-[var(--line)] pt-6">
                  <p className="stat-figure text-[var(--blue)]">
                    <EditableText value={category.stat.value} path="stat.value" />
                  </p>
                  <p className="type-body mt-3 max-w-xs text-sm text-[var(--muted)]">
                    <EditableText value={category.stat.label} path="stat.label" multiline />
                  </p>
                </div>
              ) : null}
            </div>
            <div>
              {introParagraphs.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={
                    index === 0
                      ? "type-title text-[1.35rem] leading-snug text-[var(--ink)] sm:text-[1.65rem]"
                      : "type-body mt-5 text-[1.02rem] text-[var(--muted)]"
                  }
                >
                  <EditableText
                    value={paragraph}
                    path={catalogue.intro ? `catalogue.intro.${index}` : `intro.${index}`}
                    multiline
                  />
                </p>
              ))}
              {catalogue.policyHref ? (
                <a
                  href={catalogue.policyHref}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary mt-8 inline-flex border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white"
                >
                  <EditableText
                    value={catalogue.policyLabel ?? "Read our policy"}
                    path="catalogue.policyLabel"
                  />{" "}
                  <ArrowIcon />
                </a>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {sections.map((section, sectionIndex) => {
        const soft = sectionIndex % 2 === 1;
        const hasCards = section.links.some((link) => link.image);
        const hasBody = Boolean(section.body?.length);
        const hasBullets = Boolean(section.bullets?.length);

        return (
          <section
            key={section.id}
            id={section.id}
            className={`band scroll-mt-24 ${soft ? "band-soft" : "band-white"}`}
          >
            <div className="section-shell">
              <SectionHead section={section} sectionIndex={sectionIndex} total={sections.length} />

              {hasBody || hasBullets || section.image ? (
                <div className="mt-9 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
                  <div>
                    {(section.body ?? []).map((paragraph, index) => (
                      <p
                        key={paragraph}
                        className={
                          index === 0
                            ? "type-body text-[1.08rem] text-[var(--ink)]"
                            : "type-body mt-4 text-[1.02rem] text-[var(--muted)]"
                        }
                      >
                        <EditableText
                          value={paragraph}
                          path={`catalogue.sections.${sectionIndex}.body.${index}`}
                          multiline
                        />
                      </p>
                    ))}

                    {hasBullets ? (
                      <ul className="mt-7 grid gap-px bg-[var(--line)]">
                        {(section.bullets ?? []).map((bullet, index) => (
                          <li
                            key={bullet}
                            className={`flex items-start gap-4 p-4 ${soft ? "bg-[var(--soft)]" : "bg-white"}`}
                          >
                            <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center bg-[var(--blue)] text-white">
                              <CheckIcon className="size-4" />
                            </span>
                            <span className="type-body text-[0.98rem] text-[var(--ink)]">
                              <EditableText
                                value={bullet}
                                path={`catalogue.sections.${sectionIndex}.bullets.${index}`}
                                multiline
                              />
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {section.ctaLabel && section.ctaHref ? (
                      <Link href={section.ctaHref} className="btn-primary mt-8 w-full sm:w-auto">
                        {section.ctaLabel} <ArrowIcon />
                      </Link>
                    ) : null}
                  </div>

                  {section.image ? (
                    <div className="media-frame relative aspect-[4/3] w-full overflow-hidden">
                      <EditableImage
                        src={section.image}
                        alt=""
                        path={`catalogue.sections.${sectionIndex}.image`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 45vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                </div>
              ) : null}

              {section.links.length ? (
                <div
                  className={`mt-9 grid gap-px bg-[var(--line)] ${
                    hasCards ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"
                  }`}
                >
                  {section.links.map((link, index) =>
                    hasCards ? (
                      <OfferingCard
                        key={link.href + link.title}
                        link={link}
                        index={index}
                        sectionIndex={sectionIndex}
                      />
                    ) : (
                      <DirectoryRow
                        key={link.href + link.title}
                        link={link}
                        index={index}
                        sectionIndex={sectionIndex}
                      />
                    ),
                  )}
                </div>
              ) : null}
            </div>
          </section>
        );
      })}

      {catalogue.quote ? (
        <section className="band-tight band-soft border-y border-[var(--line)]">
          <div className="section-shell max-w-[62rem]">
            <blockquote className="type-title text-[clamp(1.3rem,2.4vw,1.9rem)] leading-snug text-[var(--ink)]">
              <EditableText value={catalogue.quote.text} path="catalogue.quote.text" multiline />
            </blockquote>
            {catalogue.quote.attribution ? (
              <p className="type-meta mt-5 text-[var(--blue)]">
                <EditableText
                  value={catalogue.quote.attribution}
                  path="catalogue.quote.attribution"
                />
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Outcomes as a dense navy band */}
      {category.outcomes.length ? (
        <section className="band band-navy">
          <div className="section-shell">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="type-eyebrow">What changes</p>
                <h2 className="type-display mt-4 max-w-[15ch] text-[clamp(2rem,3.6vw,3rem)] text-white">
                  Outcomes you can evidence.
                </h2>
                <div className="rule-red mt-6" />
              </div>
              <div className="grid gap-px bg-white/14 sm:grid-cols-3 lg:justify-self-end">
                {proofStats.map((stat) => (
                  <div key={stat.label} className="bg-[var(--navy)] px-2 py-5 sm:px-5">
                    <p className="stat-figure text-[clamp(1.6rem,2.6vw,2.4rem)] text-white">
                      {stat.value}
                    </p>
                    <p className="type-meta mt-2 text-[10px] leading-tight sm:text-[11px]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <ol className="mt-11 grid gap-px bg-white/14 sm:grid-cols-2">
              {category.outcomes.map((outcome, index) => (
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

            <div className="mt-12 grid gap-8 border-t border-white/14 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <h2 className="type-display max-w-[16ch] text-[clamp(1.85rem,3.4vw,2.8rem)] text-white">
                Tell us what your institution needs.
              </h2>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link href="/contact" className="btn-primary w-full sm:w-auto">
                  Start a conversation <ArrowIcon />
                </Link>
                <Link
                  href="/services"
                  className="btn-secondary w-full border-white text-white hover:bg-white hover:text-[var(--navy)] sm:w-auto"
                >
                  All services
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <SiteFooter settings={settings} />
    </main>
  );
}
