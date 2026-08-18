import Link from "next/link";
import type { EditorialPageData } from "../data/site-content";
import { EditorialHero } from "./EditorialHero";
import { SectionNav } from "./SectionNav";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { EditableImage } from "./cms/EditableImage";
import { EditableText } from "./cms/EditableText";
import { ArrowIcon } from "./icons";
import type { SiteSettingsData } from "@/lib/cms/types";

export type DirectoryCluster = {
  id: string;
  title: string;
  summary?: string;
  items: EditorialPageData[];
};

type EditorialDirectoryProps = {
  eyebrow: string;
  title: string;
  summary: string;
  image: string;
  introTitle: string;
  introBody: string;
  items: EditorialPageData[];
  basePath: "/services" | "/projects";
  settings?: SiteSettingsData;
  footerCta?: { eyebrow: string; title: string; label: string };
  /** Optional clusters. When present the page gets a sticky in-page nav. */
  clusters?: DirectoryCluster[];
  /** Proof figures for the closing navy band. */
  proof?: { value: string; label: string }[];
};

const defaultProof = [
  { value: "5000+", label: "Mosques supported" },
  { value: "3467+", label: "Madrassahs engaged" },
  { value: "20+", label: "Years of impact" },
];

function DirectoryCard({
  item,
  index,
  basePath,
  pathPrefix,
}: {
  item: EditorialPageData;
  index: number;
  basePath: string;
  pathPrefix: string;
}) {
  return (
    <article className="group relative flex flex-col bg-white">
      <div className="media-frame relative aspect-[4/3] w-full overflow-hidden">
        <EditableImage
          src={item.image}
          alt=""
          path={`${pathPrefix}.${index}.image`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <span className="absolute left-0 top-0 flex size-12 items-center justify-center bg-[var(--navy)] text-[13px] font-semibold tracking-[0.08em] text-white sm:size-14">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-6 lg:p-7">
        <div>
          <p className="type-meta text-[var(--blue)]">
            <EditableText value={item.eyebrow} path={`${pathPrefix}.${index}.eyebrow`} />
          </p>
          <h3 className="type-title mt-3 text-[1.3rem] text-[var(--ink)] transition group-hover:text-[var(--blue)]">
            <Link href={`${basePath}/${item.slug}`}>
              <span className="absolute inset-0" aria-hidden="true" />
              <EditableText value={item.title} path={`${pathPrefix}.${index}.title`} />
            </Link>
          </h3>
          <p className="type-body mt-3 line-clamp-2 text-[0.95rem] text-[var(--muted)]">
            <EditableText value={item.summary} path={`${pathPrefix}.${index}.summary`} multiline />
          </p>
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

/**
 * Template B — category / directory page.
 * Full-bleed hero + two CTAs, sticky in-page nav when there are clusters,
 * numbered photo cards linking straight to the detail page, closing navy proof band.
 */
export function EditorialDirectory({
  eyebrow,
  title,
  summary,
  image,
  introTitle,
  introBody,
  items,
  basePath,
  settings,
  footerCta,
  clusters,
  proof = defaultProof,
}: EditorialDirectoryProps) {
  const cta = footerCta ?? {
    eyebrow: "Work with us",
    title: "Tell us what your institution needs.",
    label: "Start a conversation",
  };
  const hasClusters = Boolean(clusters?.length);

  return (
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader settings={settings} />
      <EditorialHero
        eyebrow={eyebrow}
        title={title}
        summary={summary}
        image={image}
        primaryLabel="Enquire"
        primaryHref="/contact"
        secondaryLabel="Browse below"
        secondaryHref="#directory"
      />

      {hasClusters ? (
        <SectionNav
          sections={(clusters ?? []).map((cluster) => ({ id: cluster.id, title: cluster.title }))}
        />
      ) : null}

      {/* Intro — split, not a lonely centred column */}
      <section className="band-tight band-soft">
        <div className="section-shell grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-16">
          <div>
            <h2 className="type-display max-w-[16ch] text-[clamp(1.85rem,3.4vw,2.8rem)] text-[var(--ink)]">
              <EditableText value={introTitle} path="introTitle" />
            </h2>
            <div className="rule-red mt-6" />
          </div>
          <p className="type-body max-w-[40rem] text-[1.02rem] text-[var(--muted)] lg:text-[1.1rem]">
            <EditableText value={introBody} path="introBody" multiline />
          </p>
        </div>
      </section>

      {hasClusters ? (
        (clusters ?? []).map((cluster, clusterIndex) => (
          <section
            key={cluster.id}
            id={cluster.id}
            className={`band scroll-mt-24 ${clusterIndex % 2 === 0 ? "band-white" : "band-soft"}`}
          >
            <div className="section-shell">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="type-eyebrow text-[var(--blue)]">
                    {String(clusterIndex + 1).padStart(2, "0")} / {String((clusters ?? []).length).padStart(2, "0")}
                  </p>
                  <h2 className="type-display mt-4 max-w-[18ch] text-[clamp(1.7rem,3vw,2.5rem)] text-[var(--ink)]">
                    {cluster.title}
                  </h2>
                </div>
                {cluster.summary ? (
                  <p className="type-body max-w-[32rem] text-[0.98rem] text-[var(--muted)]">
                    {cluster.summary}
                  </p>
                ) : null}
              </div>
              <div className="mt-8 grid gap-px bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
                {cluster.items.map((item, index) => (
                  <DirectoryCard
                    key={item.slug}
                    item={item}
                    index={index}
                    basePath={basePath}
                    pathPrefix={`clusters.${clusterIndex}.items`}
                  />
                ))}
              </div>
            </div>
          </section>
        ))
      ) : (
        <section id="directory" className="band band-white scroll-mt-24">
          <div className="section-shell">
            <div className="grid gap-px bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <DirectoryCard
                  key={item.slug}
                  item={item}
                  index={index}
                  basePath={basePath}
                  pathPrefix="items"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing navy band: proof, then enquire */}
      <section className="band band-navy">
        <div className="section-shell">
          <div className="grid gap-px bg-white/14 sm:grid-cols-3">
            {proof.map((stat) => (
              <div key={stat.label} className="bg-[var(--navy)] px-2 py-6 sm:px-6">
                <p className="stat-figure text-white">{stat.value}</p>
                <p className="type-meta mt-3">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-8 border-t border-white/14 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="type-eyebrow">
                <EditableText value={cta.eyebrow} path="footerCta.eyebrow" />
              </p>
              <h2 className="type-display mt-4 max-w-[16ch] text-[clamp(2rem,3.8vw,3.1rem)] text-white">
                <EditableText value={cta.title} path="footerCta.title" />
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link href="/contact" className="btn-primary w-full sm:w-auto">
                <EditableText value={cta.label} path="footerCta.label" />
                <ArrowIcon />
              </Link>
              <Link
                href={basePath === "/services" ? "/projects" : "/services"}
                className="btn-secondary w-full border-white text-white hover:bg-white hover:text-[var(--navy)] sm:w-auto"
              >
                {basePath === "/services" ? "See our projects" : "See our services"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter settings={settings} />
    </main>
  );
}
