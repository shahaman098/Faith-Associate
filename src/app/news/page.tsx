import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EditorialHero } from "../components/EditorialHero";
import { SiteFooter } from "../components/SiteFooter";
import { ProofCtaBand } from "../components/ProofCtaBand";
import { SiteHeader } from "../components/SiteHeader";
import { ArrowIcon } from "../components/icons";
import { newsItems } from "../data/site-content";
import { CmsPage } from "../components/cms/CmsPage";
import { loadCmsPage } from "@/lib/cms/page-helpers";
import { getEntries } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "News & Events | Faith Associates",
  description: "Latest news, events, programme updates and announcements from Faith Associates.",
};

export default async function NewsPage() {
  const { settings, page, preferDraft } = await loadCmsPage("/news");
  const blocks = page?.blocks as Record<string, unknown> | undefined;
  const hero = blocks?.hero as
    | Partial<{
        eyebrow: string;
        title: string;
        summary: string;
        image: string;
      }>
    | undefined;
  const entries = await getEntries("news", { preferDraft });
  const items = entries.length ? (entries.map((entry) => ({ slug: entry.slug, ...entry.data })) as typeof newsItems) : newsItems;
  return (
    <CmsPage path="/news" blocks={page?.blocks}>
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader settings={settings} />
      <EditorialHero
        eyebrow={hero?.eyebrow ?? "News & events"}
        title={hero?.title ?? "What we are learning, building and convening."}
        summary={hero?.summary ?? "Updates from Faith Associates programmes, partnerships, events and publications."}
        image={hero?.image ?? "/assets/real/mosque-expo-2024-hall.jpg"}
        primaryLabel="Enquire"
        primaryHref="/contact"
        secondaryLabel="Browse updates"
        secondaryHref="#updates"
      />
      <section className="band-tight band-soft">
        <div className="section-shell grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-16">
          <div>
            <h2 className="type-display max-w-[16ch] text-[clamp(1.85rem,3.4vw,2.8rem)] text-[var(--ink)]">
              Programme updates, partnerships and announcements.
            </h2>
            <div className="rule-red mt-6" />
          </div>
          <p className="type-body max-w-[40rem] text-[1.02rem] text-[var(--muted)] lg:text-[1.1rem]">
            News from across the Faith Associates programme — training delivery, standards work,
            partnerships and the events that bring institutions together. For dated listings see the
            <Link href="/events" className="ml-1 font-semibold text-[var(--blue)] underline underline-offset-4">
              events programme
            </Link>
            .
          </p>
        </div>
      </section>

      <section id="updates" className="band band-white scroll-mt-24">
        <div className="section-shell">
          <div className="grid gap-px bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <article key={item.slug} className="group relative flex flex-col bg-white">
                <div className="media-frame relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="media-zoom object-cover"
                  />
                  <span className="absolute left-0 top-0 flex size-12 items-center justify-center bg-[var(--navy)] text-[13px] font-semibold tracking-[0.08em] text-white sm:size-14">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <p className="type-meta text-[var(--blue)]">
                      {item.category} / {item.date}
                    </p>
                    <h2 className="type-title mt-3 text-[1.25rem] text-[var(--ink)] transition duration-300 group-hover:text-[var(--blue)]">
                      <Link href={`/news/${item.slug}`}>
                        <span className="absolute inset-0" aria-hidden="true" />
                        {item.title}
                      </Link>
                    </h2>
                    <p className="type-body mt-3 line-clamp-2 text-[0.95rem] text-[var(--muted)]">
                      {item.summary}
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
            ))}
          </div>
        </div>
      </section>

      <ProofCtaBand
        eyebrow="News & events"
        title="Want to hear about the next event?"
        primaryLabel="Contact the team"
        secondaryLabel="See upcoming events"
        secondaryHref="/events"
      />
      <SiteFooter settings={settings} />
    </main>
    </CmsPage>
  );
}
