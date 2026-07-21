import Image from "next/image";
import Link from "next/link";
import type { EditorialPageData } from "../data/site-content";
import type { CatalogueLink, ServiceCatalogue } from "../data/service-catalogues";
import { EditorialHero } from "./EditorialHero";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

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

function OfferingCard({ link, index }: { link: CatalogueLink; index: number }) {
  const inner = (
    <>
      {link.image ? (
        <div className="media-frame relative aspect-[1.35/1]">
          <Image
            src={link.image}
            alt=""
            fill
            unoptimized={link.image.startsWith("http")}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="media-zoom object-cover"
          />
          <span className="absolute left-4 top-4 inline-flex size-9 items-center justify-center bg-[var(--navy)] text-[10px] font-semibold tracking-[0.08em] text-white">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      ) : null}
      <div className={link.image ? "mt-5" : ""}>
        <div className="flex items-start justify-between gap-5 border-t border-[var(--line)] pt-4">
          <div>
            <h3 className="type-title text-[1.25rem] text-[var(--ink)] transition duration-300 group-hover:text-[var(--blue)] sm:text-[1.35rem]">
              {link.title}
            </h3>
            {link.summary ? <p className="type-body mt-3 text-sm text-[var(--muted)]">{link.summary}</p> : null}
          </div>
          <span className="mt-1 inline-flex size-9 shrink-0 items-center justify-center border border-[var(--line)] text-[var(--ink)] transition duration-300 group-hover:border-[var(--blue)] group-hover:bg-[var(--blue)] group-hover:text-white">
            <ArrowIcon />
          </span>
        </div>
      </div>
    </>
  );

  if (link.external || link.href.startsWith("http")) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer" className="group block">
        {inner}
      </a>
    );
  }

  return (
    <Link href={link.href} className="group block">
      {inner}
    </Link>
  );
}

function SectionNav({ sections }: { sections: ServiceCatalogue["sections"] }) {
  const withLinks = sections.filter((section) => section.links.length > 0 || section.summary);
  if (withLinks.length < 2) return null;

  return (
    <nav aria-label="Service sections" className="border-b border-[var(--line)] bg-white">
      <div className="section-shell flex gap-6 overflow-x-auto py-4">
        {withLinks.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="type-meta whitespace-nowrap text-[var(--muted)] transition hover:text-[var(--blue)]"
          >
            {section.title}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function ServiceCataloguePage({
  category,
  catalogue,
}: {
  category: EditorialPageData;
  catalogue: ServiceCatalogue;
}) {
  const isSafety = catalogue.variant === "safety";

  return (
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader />
      <EditorialHero
        eyebrow={category.eyebrow}
        title={isSafety ? "Safety experts in faith-based establishments." : category.title}
        summary={category.summary}
        image={category.image}
        primaryLabel="Start a conversation"
        primaryHref="/contact"
        secondaryLabel={isSafety ? "View publications" : "Browse all services"}
        secondaryHref={isSafety ? "/publications" : "/services"}
      />

      <SectionNav sections={catalogue.sections} />

      {(catalogue.intro?.length || catalogue.policyHref) && (
        <section className="bg-[var(--soft)] py-12 lg:py-16">
          <div className="section-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-16">
            <div>
              <p className="type-eyebrow text-[var(--blue)]">Overview</p>
              {category.stat ? (
                <div className="mt-8 border-t border-[var(--line)] pt-6">
                  <p className="type-display text-[clamp(2.5rem,4vw,3.5rem)] text-[var(--ink)]">{category.stat.value}</p>
                  <p className="type-body mt-2 max-w-xs text-sm text-[var(--muted)]">{category.stat.label}</p>
                </div>
              ) : null}
            </div>
            <div>
              {(catalogue.intro ?? category.intro).map((paragraph, index) => (
                <p
                  key={paragraph}
                  className={
                    index === 0
                      ? "type-title text-[1.35rem] leading-snug text-[var(--ink)] sm:text-[1.6rem]"
                      : "type-body mt-5 text-[var(--muted)]"
                  }
                >
                  {paragraph}
                </p>
              ))}
              {catalogue.policyHref ? (
                <a
                  href={catalogue.policyHref}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary mt-8 inline-flex"
                >
                  {catalogue.policyLabel ?? "Read our policy"} <ArrowIcon />
                </a>
              ) : null}
            </div>
          </div>
        </section>
      )}

      {catalogue.sections.map((section, sectionIndex) => {
        const soft = sectionIndex % 2 === 1;
        const hasCards = section.links.some((link) => link.image);

        if (isSafety && section.links.length === 0) {
          return (
            <section key={section.id} id={section.id} className={soft ? "bg-[var(--soft)] py-12 lg:py-16" : "py-12 lg:py-16"}>
              <div className="section-shell grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                <h2 className="type-display text-[clamp(1.75rem,3.2vw,2.5rem)] text-[var(--ink)]">{section.title}</h2>
                {section.summary ? <p className="type-body text-[var(--muted)] lg:text-[1.05rem]">{section.summary}</p> : null}
              </div>
            </section>
          );
        }

        return (
          <section
            key={section.id}
            id={section.id}
            className={soft ? "bg-[var(--soft)] py-12 lg:py-20" : "py-12 lg:py-20"}
          >
            <div className="section-shell">
              <div className="grid gap-4 border-b border-[var(--line)] pb-8 lg:grid-cols-2 lg:items-end">
                <div>
                  <p className="type-eyebrow text-[var(--blue)]">
                    {String(sectionIndex + 1).padStart(2, "0")}
                  </p>
                  <h2 className="type-display mt-3 text-[clamp(1.85rem,3.6vw,2.75rem)] text-[var(--ink)]">
                    {section.title}
                  </h2>
                </div>
                {section.summary ? (
                  <p className="type-body max-w-xl text-sm text-[var(--muted)] lg:justify-self-end lg:text-[1.05rem]">
                    {section.summary}
                  </p>
                ) : null}
              </div>

              {hasCards ? (
                <div className="mt-10 grid gap-y-12 md:grid-cols-2 md:gap-x-7 lg:grid-cols-3">
                  {section.links.map((link, index) => (
                    <OfferingCard key={link.href + link.title} link={link} index={index} />
                  ))}
                </div>
              ) : (
                <div className="mt-8 divide-y divide-[var(--line)]">
                  {section.links.map((link) => (
                    <Link
                      key={link.href + link.title}
                      href={link.href}
                      className="group flex items-center justify-between gap-6 py-5"
                    >
                      <div>
                        <h3 className="type-title text-[1.15rem] text-[var(--ink)] transition group-hover:text-[var(--blue)]">
                          {link.title}
                        </h3>
                        {link.summary ? (
                          <p className="type-body mt-2 max-w-2xl text-sm text-[var(--muted)]">{link.summary}</p>
                        ) : null}
                      </div>
                      <span className="inline-flex size-9 shrink-0 items-center justify-center border border-[var(--line)] transition group-hover:border-[var(--blue)] group-hover:bg-[var(--blue)] group-hover:text-white">
                        <ArrowIcon />
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}

      <section className="border-t border-[var(--line)] bg-[var(--navy)] py-12 text-white lg:py-16">
        <div className="section-shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="type-eyebrow text-white/50">Next step</p>
            <h2 className="type-display mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)]">
              Tell us what your institution needs.
            </h2>
          </div>
          <Link href="/contact" className="btn-primary self-start sm:self-auto">
            Contact the team <ArrowIcon />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
