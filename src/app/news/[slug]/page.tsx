import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { newsItems } from "../../data/site-content";
import { CmsEntry } from "../../components/cms/CmsEntry";
import { EditableImage } from "../../components/cms/EditableImage";
import { EditableText } from "../../components/cms/EditableText";
import { loadCmsPage } from "@/lib/cms/page-helpers";
import { getEntry } from "@/lib/cms/queries";

export function generateStaticParams() {
  return newsItems.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = newsItems.find((entry) => entry.slug === slug);
  return item ? { title: `${item.title} | Faith Associates`, description: item.summary } : {};
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { settings, preferDraft } = await loadCmsPage(`/news/${slug}`);
  const entry = await getEntry("news", slug, { preferDraft });
  const item = entry ? ({ slug: entry.slug, ...entry.data } as typeof newsItems[number]) : newsItems.find((entry) => entry.slug === slug);
  if (!item) notFound();
  const entryData = {
    date: item.date,
    category: item.category,
    title: item.title,
    summary: item.summary,
    image: item.image,
    body: item.body,
  };

  return (
    <CmsEntry type="news" slug={slug} data={entryData}>
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader settings={settings} />
      <section className="relative min-h-[580px] overflow-hidden bg-[var(--navy)] pt-40 text-white lg:pt-52">
        <EditableImage
          src={item.image}
          alt=""
          path="image"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,14,24,.96),rgba(5,14,24,.52),rgba(5,14,24,.2))]" />
        <div className="section-shell relative pb-16">
          <p className="type-meta text-white/52">
            <EditableText value={item.category} path="category" /> / <EditableText value={item.date} path="date" />
          </p>
          <h1 className="type-display mt-6 max-w-[15ch] text-[clamp(2.5rem,5.2vw,4.5rem)]">
            <EditableText value={item.title} path="title" />
          </h1>
          <p className="type-body mt-6 max-w-2xl text-lg text-white/72">
            <EditableText value={item.summary} path="summary" multiline />
          </p>
        </div>
      </section>
      <section className="py-12 lg:py-20">
        <article className="section-shell max-w-4xl">
          <p className="type-title text-[1.35rem] text-[var(--ink)] sm:text-[1.5rem]">
            <EditableText value={item.summary} path="summary" multiline />
          </p>
          {item.body.map((paragraph, index) => (
            <p
              key={`${index}-${paragraph}`}
              className={`type-body text-[var(--muted)] ${index === 0 ? "mt-8" : "mt-6"}`}
            >
              <EditableText value={paragraph} path={`body.${index}`} multiline />
            </p>
          ))}
          <p className="type-body mt-6 text-[var(--muted)]">
            <EditableText
              value="For programme details, partnership opportunities or media enquiries, contact the Faith Associates team."
              path="contactBody"
              multiline
            />
          </p>
          <Link href="/contact" className="btn-primary mt-8">
            <EditableText value="Contact the team" path="contactLabel" /> →
          </Link>
        </article>
      </section>
      <SiteFooter settings={settings} />
    </main>
    </CmsEntry>
  );
}
