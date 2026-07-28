import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EditorialHero } from "../components/EditorialHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
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
  const blocks = page?.blocks as Record<string, any> | undefined;
  const hero = blocks?.hero;
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
        primaryLabel="Browse updates"
        primaryHref="#updates"
      />
      <section id="updates" className="scroll-mt-6 py-12 lg:py-20">
        <div className="section-shell">
          <div className="grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Link href={`/news/${item.slug}`} key={item.slug} className="group">
                <div className="media-frame relative aspect-[1.3/1]">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="media-zoom object-cover"
                  />
                </div>
                <p className="type-meta mt-5 text-[var(--blue)]">
                  {item.category} / {item.date}
                </p>
                <h2 className="type-title mt-3 text-[1.35rem] text-[var(--ink)] transition duration-300 group-hover:text-[var(--blue)] sm:text-[1.45rem]">
                  {item.title}
                </h2>
                <p className="type-body mt-3 text-sm text-[var(--muted)]">{item.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter settings={settings} />
    </main>
    </CmsPage>
  );
}
