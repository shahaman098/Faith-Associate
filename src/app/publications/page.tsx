import type { Metadata } from "next";
import Link from "next/link";
import { EditorialHero } from "../components/EditorialHero";
import { PublicationExplorer } from "../components/PublicationExplorer";
import { SiteFooter } from "../components/SiteFooter";
import { ProofCtaBand } from "../components/ProofCtaBand";
import { SiteHeader } from "../components/SiteHeader";
import { ArrowIcon } from "../components/icons";
import { EditableImage } from "../components/cms/EditableImage";
import { EditableText } from "../components/cms/EditableText";
import { publications } from "../data/publications";
import { CmsPage } from "../components/cms/CmsPage";
import { loadCmsPage } from "@/lib/cms/page-helpers";
import { getEntries } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Publications & Toolkits | Faith Associates",
  description:
    "Browse Faith Associates reports, governance toolkits, safeguarding resources, security guidance, award booklets and archived operational guidance.",
};

export default async function PublicationsPage() {
  const { settings, page, preferDraft } = await loadCmsPage("/publications");
  const blocks = page?.blocks as Record<string, unknown> | undefined;
  const hero = blocks?.hero as
    | Partial<{
        eyebrow: string;
        title: string;
        summary: string;
        image: string;
      }>
    | undefined;
  const entries = await getEntries("publication", { preferDraft });
  const catalogue = entries.length ? (entries.map((entry) => ({ slug: entry.slug, ...entry.data })) as typeof publications) : publications;
  const featured = catalogue.find((publication) => publication.slug === "zakat") ?? catalogue[0];
  const recommended = catalogue
    .filter((publication) => !publication.isLegacy && publication.slug !== featured.slug)
    .slice(0, 3);

  return (
    <CmsPage path="/publications" blocks={page?.blocks}>
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader settings={settings} />
      <EditorialHero
        eyebrow={hero?.eyebrow ?? "Ideas & resources"}
        title={hero?.title ?? "Publications built for practical use."}
        summary={hero?.summary ?? "Reports, toolkits and guidance drawn from more than two decades of work with faith institutions and community partners."}
        image={hero?.image ?? "/assets/real/fa-activity-report-2024.png"}
        primaryLabel="Enquire"
        primaryHref="/contact"
        secondaryLabel="Explore the library"
        secondaryHref="#library"
      />

      <section className="band band-soft">
        <div className="section-shell">
          <div className="grid gap-10 lg:grid-cols-[1.55fr_0.8fr] lg:gap-14">
            <Link
              href={`/publications/${featured.slug}`}
              className="group grid overflow-hidden bg-white md:grid-cols-[0.9fr_1.1fr]"
            >
              <div className="media-frame relative min-h-[360px] md:min-h-[520px]">
                <EditableImage
                  src={featured.image}
                  alt=""
                  path="featured.image"
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.025]"
                />
              </div>
              <div className="flex flex-col justify-end p-7 sm:p-9 lg:p-11">
                <p className="type-meta text-[var(--blue)]">
                  <EditableText value="Featured" path="featured.label" /> /{" "}
                  <EditableText value={featured.category} path="featured.category" />
                </p>
                <h2 className="type-display mt-5 text-[clamp(1.75rem,3vw,2.5rem)] text-[var(--ink)]">
                  <EditableText value={featured.title} path="featured.title" />
                </h2>
                <p className="type-body mt-5 text-sm text-[var(--muted)]">
                  <EditableText value={featured.summary ?? ""} path="featured.summary" multiline />
                </p>
                <span className="type-cta mt-7 inline-flex items-center gap-2 text-[var(--blue)]">
                  <EditableText value="Read publication" path="featured.ctaLabel" /> <ArrowIcon />
                </span>
              </div>
            </Link>

            <aside>
              <p className="type-eyebrow text-[var(--blue)]">
                <EditableText value="Recommended" path="recommended.label" />
              </p>
              <div className="mt-5 border-t border-[var(--line)]">
                {recommended.map((publication, index) => (
                  <Link
                    href={`/publications/${publication.slug}`}
                    key={publication.slug}
                    className="group grid grid-cols-[auto_1fr] items-center gap-5 border-b border-[var(--line)] py-6"
                  >
                    <span className="index-number index-number--quiet" aria-hidden="true">0{index + 1}</span>
                    <div>
                      <p className="type-meta text-[var(--muted)]">
                        {publication.format} / {publication.year}
                      </p>
                      <h3 className="type-title mt-2 text-[1.1rem] text-[var(--ink)] transition duration-300 group-hover:text-[var(--blue)]">
                        {publication.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <div id="library" className="scroll-mt-24">
        <PublicationExplorer items={catalogue} />
      </div>

      <ProofCtaBand
        eyebrow="Publications"
        title="Need a guide tailored to your institution?"
        primaryLabel="Request a publication"
        secondaryLabel="See our services"
        secondaryHref="/services"
      />

      <SiteFooter settings={settings} />
    </main>
    </CmsPage>
  );
}
