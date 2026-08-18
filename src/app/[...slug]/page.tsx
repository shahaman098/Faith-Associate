import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialHero } from "../components/EditorialHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { CmsPage } from "../components/cms/CmsPage";
import { EditableText } from "../components/cms/EditableText";
import { loadCmsPage } from "@/lib/cms/page-helpers";

type GenericBlocks = {
  hero?: {
    eyebrow?: string;
    title?: string;
    summary?: string;
    image?: string;
  };
  intro?: {
    eyebrow?: string;
    title?: string;
    body?: string;
  };
  sections?: Array<{
    title?: string;
    body?: string;
  }>;
};

function normalizePath(slug: string[]) {
  return `/${slug.join("/")}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = normalizePath(slug);
  const { page } = await loadCmsPage(path);
  const blocks = (page?.blocks ?? {}) as GenericBlocks;
  const hero = blocks.hero;

  if (!page) return {};

  return {
    title: page.title ?? hero?.title ?? "Faith Associates",
    description: hero?.summary ?? blocks.intro?.body ?? "Faith Associates content page.",
  };
}

export default async function GenericCmsRoute({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = normalizePath(slug);
  const { settings, page } = await loadCmsPage(path);

  if (!page) notFound();

  const blocks = (page.blocks ?? {}) as GenericBlocks;
  const hero = blocks.hero ?? {};
  const intro = blocks.intro ?? {};
  const sections = blocks.sections ?? [];

  return (
    <CmsPage path={path} blocks={page.blocks}>
      <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
        <SiteHeader settings={settings} />
        <EditorialHero
          eyebrow={hero.eyebrow ?? "New page"}
          title={hero.title ?? page.title ?? "Untitled page"}
          summary={hero.summary ?? "Add a summary for this page."}
          image={hero.image ?? "/assets/real/faith-training-speaker.jpg"}
        />

        <section className="py-12 lg:py-20">
          <div className="section-shell max-w-4xl">
            <p className="type-eyebrow text-[var(--blue)]">
              <EditableText value={intro.eyebrow ?? "Overview"} path="intro.eyebrow" />
            </p>
            <h2 className="type-display mt-5 text-[clamp(1.85rem,3.6vw,2.75rem)] text-[var(--ink)]">
              <EditableText value={intro.title ?? "Shape this page in the CMS."} path="intro.title" />
            </h2>
            <p className="type-body mt-6 text-[var(--muted)] lg:text-[1.05rem]">
              <EditableText
                value={intro.body ?? "Use the inline editor to replace this starter content with your own copy."}
                path="intro.body"
                multiline
              />
            </p>

            <div className="mt-12 grid gap-8">
              {sections.map((section, index) => (
                <section key={index} className="border-t border-[var(--line)] pt-8">
                  <h3 className="type-title text-[1.35rem] text-[var(--ink)]">
                    <EditableText
                      value={section.title ?? `Section ${index + 1}`}
                      path={`sections.${index}.title`}
                    />
                  </h3>
                  <p className="type-body mt-4 text-[var(--muted)]">
                    <EditableText
                      value={section.body ?? "Add section copy here."}
                      path={`sections.${index}.body`}
                      multiline
                    />
                  </p>
                </section>
              ))}
            </div>
          </div>
        </section>

        <SiteFooter settings={settings} />
      </main>
    </CmsPage>
  );
}
