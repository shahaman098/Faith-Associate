import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { ZohoFormEmbed } from "../../components/ZohoFormEmbed";
import { CmsEntry } from "../../components/cms/CmsEntry";
import { EditableImage } from "../../components/cms/EditableImage";
import { EditableText } from "../../components/cms/EditableText";
import { getPublication, publications } from "../../data/publications";
import { loadCmsPage } from "@/lib/cms/page-helpers";
import { getEntries, getEntry } from "@/lib/cms/queries";

export function generateStaticParams() {
  return publications.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const publication = getPublication(slug);
  if (!publication) return {};
  return { title: `${publication.title} | Faith Associates`, description: publication.summary };
}

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

export default async function PublicationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { settings, preferDraft } = await loadCmsPage(`/publications/${slug}`);
  const [entry, publicationEntries] = await Promise.all([
    getEntry("publication", slug, { preferDraft }),
    getEntries("publication", { preferDraft }),
  ]);
  const basePublication = getPublication(slug);
  const publication = entry
    ? ({ ...(basePublication ?? {}), slug: entry.slug, ...entry.data } as typeof publications[number])
    : basePublication;
  if (!publication) notFound();
  const { slug: _slug, updated: _updated, ...entryData } = publication;
  void _slug;
  void _updated;

  const catalogue = publicationEntries.length
    ? (publicationEntries.map((item) => ({ slug: item.slug, ...item.data })) as typeof publications)
    : publications;

  const related = catalogue
    .filter((item) => item.slug !== publication.slug && item.category === publication.category)
    .slice(0, 3);

  return (
    <CmsEntry type="publication" slug={slug} data={entryData}>
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader settings={settings} />
      <section className="relative overflow-hidden bg-[var(--navy)] pb-16 pt-40 text-white lg:pb-24 lg:pt-52">
        <div className="section-shell relative grid gap-12 lg:grid-cols-[1.22fr_0.78fr] lg:items-end lg:gap-20">
          <div>
            <Link
              href="/publications"
              className="type-meta text-white/48 transition hover:text-white"
            >
              Publications / <EditableText value={publication.category} path="category" />
            </Link>
            <h1 className="type-display mt-6 max-w-[15ch] text-[clamp(2.5rem,5vw,4.5rem)]">
              <EditableText value={publication.title} path="title" />
            </h1>
            <p className="type-body mt-6 max-w-2xl text-base text-white/72 sm:text-lg">
              <EditableText value={publication.summary ?? ""} path="summary" multiline />
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/12 pt-5 type-meta text-white/44">
              <span><EditableText value={publication.format} path="format" /></span>
              <span><EditableText value={publication.year} path="year" /></span>
              <span><EditableText value={publication.category} path="category" /></span>
            </div>
          </div>
          <div className="media-frame relative mx-auto aspect-[0.72/1] w-full max-w-[380px] bg-white lg:mx-0 lg:justify-self-end">
            <EditableImage
              src={publication.image}
              alt={`${publication.title} cover`}
              path="image"
              fill
              unoptimized
              priority
              sizes="(max-width: 1024px) 80vw, 32vw"
              className="object-contain p-4"
            />
          </div>
        </div>
      </section>

      {publication.isLegacy ? (
        <div className="border-b border-[var(--line)] bg-[var(--soft)]">
          <div className="section-shell flex items-start gap-4 py-5 text-sm leading-6 text-[var(--muted)]">
            <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center bg-[var(--navy)] text-[10px] font-bold text-white">
              !
            </span>
            <p>
              <strong className="text-[var(--ink)]">
                <EditableText value={publication.legacyNoticeTitle} path="legacyNoticeTitle" />
              </strong>{" "}
              <EditableText
                value={publication.legacyNoticeBody}
                path="legacyNoticeBody"
                multiline
              />
            </p>
          </div>
        </div>
      ) : null}

      <section className="py-12 lg:py-20">
        <div className="section-shell grid gap-12 lg:grid-cols-[0.75fr_1.35fr] lg:gap-20">
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <p className="type-eyebrow text-[var(--blue)]">
              <EditableText value={publication.accessEyebrow} path="accessEyebrow" />
            </p>
            {publication.downloadUrl ? (
              <a href={publication.downloadUrl} target="_blank" rel="noreferrer" className="btn-primary mt-5">
                <EditableText value={publication.downloadCtaLabel} path="downloadCtaLabel" /> <ArrowIcon />
              </a>
            ) : publication.zohoFormUrl ? (
              <a href="#request-form" className="btn-primary mt-5">
                <EditableText value={publication.requestCtaLabel} path="requestCtaLabel" /> <ArrowIcon />
              </a>
            ) : (
              <Link
                href={`/contact?publication=${encodeURIComponent(publication.title)}`}
                className="btn-primary mt-5"
              >
                <EditableText value={publication.requestCtaLabel} path="requestCtaLabel" /> <ArrowIcon />
              </Link>
            )}
            <div className="type-body mt-8 border-t border-[var(--line)] pt-6 text-xs text-[var(--muted)]">
              <p><EditableText value={publication.publishedBy} path="publishedBy" /></p>
              <p>
                <EditableText value={publication.resourceTypeLabel} path="resourceTypeLabel" />:{" "}
                <EditableText value={publication.format} path="format" />
              </p>
              <p>
                <EditableText value={publication.catalogueYearLabel} path="catalogueYearLabel" />:{" "}
                <EditableText value={publication.year} path="year" />
              </p>
            </div>
          </aside>

          <article className="max-w-3xl">
            <p className="type-eyebrow text-[var(--blue)]">
              <EditableText value={publication.overviewEyebrow} path="overviewEyebrow" />
            </p>
            <h2 className="type-display mt-5 text-[clamp(1.85rem,3.6vw,2.75rem)] text-[var(--ink)]">
              <EditableText value={publication.overviewTitle} path="overviewTitle" />
            </h2>
            <p className="type-title mt-8 text-[1.25rem] text-[var(--ink)] sm:text-[1.4rem]">
              <EditableText value={publication.summary ?? ""} path="summary" multiline />
            </p>
            <p className="type-body mt-6 text-[var(--muted)]">
              <EditableText
                value={publication.overviewBody}
                path="overviewBody"
                multiline
              />
            </p>

            {publication.zohoFormUrl ? (
              <div id="request-form" className="mt-12 scroll-mt-28 border-t border-[var(--line)] pt-10">
                <p className="type-eyebrow text-[var(--blue)]">
                  <EditableText value={publication.requestEyebrow} path="requestEyebrow" />
                </p>
                <h2 className="type-display mt-5 text-[clamp(1.65rem,3vw,2.25rem)] text-[var(--ink)]">
                  <EditableText value={publication.requestTitle} path="requestTitle" />
                </h2>
                <p className="type-body mt-4 max-w-2xl text-[var(--muted)]">
                  <EditableText
                    value={publication.requestBody}
                    path="requestBody"
                    multiline
                  />
                </p>
                <div className="mt-8">
                  <ZohoFormEmbed
                    src={publication.zohoFormUrl}
                    title={`${publication.title} request form`}
                    height={publication.zohoFormUrl.includes("zfrmz.eu") ? 650 : 700}
                  />
                </div>
              </div>
            ) : null}

            <div className="mt-12 border-y border-[var(--line)] bg-[var(--soft)] px-6 py-8 sm:px-9">
              <p className="type-eyebrow text-[var(--blue)]">
                <EditableText value={publication.usageEyebrow} path="usageEyebrow" />
              </p>
              <ul className="mt-6 grid gap-4 text-sm leading-7 text-[var(--muted)]">
                {publication.usageSteps.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="capability-index">{String(index + 1).padStart(2, "0")}</span>
                    <span>
                      <EditableText value={step} path={`usageSteps.${index}`} multiline />
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <h2 className="type-display mt-12 text-[clamp(1.65rem,3vw,2.25rem)] text-[var(--ink)]">
              <EditableText value={publication.implementationTitle} path="implementationTitle" />
            </h2>
            <p className="type-body mt-5 text-[var(--muted)]">
              <EditableText
                value={publication.implementationBody}
                path="implementationBody"
                multiline
              />
            </p>
            <Link
              href="/contact"
              className="type-cta mt-6 inline-flex items-center gap-3 text-[var(--blue)] transition duration-300 hover:text-[var(--blue-dark)]"
            >
              <EditableText value={publication.implementationCtaLabel} path="implementationCtaLabel" /> <ArrowIcon />
            </Link>
          </article>
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--soft)] py-12 lg:py-20">
        <div className="section-shell">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="type-eyebrow text-[var(--blue)]">
                <EditableText value={publication.relatedEyebrow} path="relatedEyebrow" />
              </p>
              <h2 className="type-display mt-4 text-[clamp(1.75rem,3.2vw,2.5rem)] text-[var(--ink)]">
                <EditableText value={publication.relatedTitle} path="relatedTitle" />
              </h2>
            </div>
            <Link
              href="/publications"
              className="type-cta hidden items-center gap-2 text-[var(--blue)] sm:inline-flex"
            >
              <EditableText value={publication.relatedCtaLabel} path="relatedCtaLabel" /> <ArrowIcon />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <Link href={`/publications/${item.slug}`} key={item.slug} className="group bg-white p-5">
                <div className="media-frame relative aspect-[0.82/1] bg-[var(--soft)]">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain p-4 transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="type-meta mt-5 text-[var(--blue)]">
                  {item.format} / {item.year}
                </p>
                <h3 className="type-title mt-3 text-[1.2rem] text-[var(--ink)] transition duration-300 group-hover:text-[var(--blue)]">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter settings={settings} />
    </main>
    </CmsEntry>
  );
}
