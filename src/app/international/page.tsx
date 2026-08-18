import type { Metadata } from "next";
import Link from "next/link";
import { EditorialHero } from "../components/EditorialHero";
import { InternationalPresenceSection } from "../components/InternationalPresenceSection";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { CmsPage } from "../components/cms/CmsPage";
import { EditableText } from "../components/cms/EditableText";
import { loadCmsPage } from "@/lib/cms/page-helpers";
import { getEntries } from "@/lib/cms/queries";
import type { InternationalRegion } from "../components/InternationalMap";

export const metadata: Metadata = {
  title: "International | Faith Associates",
  description:
    "Faith Associates works with communities and international organisations across Europe, Africa, the Middle East, North America and Australasia.",
};

export default async function InternationalPage() {
  const { settings, page, preferDraft } = await loadCmsPage("/international");
  const blocks = page?.blocks as Record<string, unknown> | undefined;
  const internationalBlocks = blocks as
    | Partial<{
        hero: { eyebrow: string; title: string; summary: string; image: string };
        introTitle: string;
        intro: string[];
        cta: { eyebrow: string; title: string; body: string; label: string; href: string };
        regions: InternationalRegion[];
      }>
    | undefined;
  const hero = blocks?.hero as
    | Partial<{
        eyebrow: string;
        title: string;
        summary: string;
        image: string;
      }>
    | undefined;
  const regions = (await getEntries("region", { preferDraft })).map((entry) => ({ id: entry.slug, ...entry.data })) as InternationalRegion[];
  const visibleRegions =
    internationalBlocks?.regions?.length
      ? internationalBlocks.regions
      : regions.length
        ? regions
        : undefined;
  const ctaHref = internationalBlocks?.cta?.href ?? "/contact";
  return (
    <CmsPage path="/international" blocks={page?.blocks}>
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader settings={settings} />
      <EditorialHero
        eyebrow={hero?.eyebrow ?? "International"}
        title={hero?.title ?? "Connected leadership across five continents."}
        summary={hero?.summary ?? "Sustainable partnerships, institutional development and knowledge exchange shaped with communities—not simply delivered to them."}
        image={hero?.image ?? "/assets/real/beacon-awards-stage.jpg"}
        imagePath="hero.image"
        eyebrowPath="hero.eyebrow"
        titlePath="hero.title"
        summaryPath="hero.summary"
        primaryLabel="Enquire"
        primaryHref="/contact"
        secondaryLabel="Explore regions"
        secondaryHref="#regions"
      />

      <section className="band-tight band-soft border-b border-[var(--line)]">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-16">
          <div>
            <p className="type-eyebrow text-[var(--blue)]">
              <EditableText value="Global portfolio" path="introEyebrow" />
            </p>
            <h2 className="type-display mt-4 text-[clamp(1.85rem,3.6vw,2.75rem)] text-[var(--ink)]">
              <EditableText value={internationalBlocks?.introTitle ?? "International reach, grounded local relationships."} path="introTitle" />
            </h2>
            <div className="rule-red mt-6" />
          </div>
          <div className="space-y-5 text-[1.05rem] leading-8 text-[var(--muted)]">
            <p>
              <EditableText
                value={internationalBlocks?.intro?.[0] ?? "Faith Associates collaborates with communities and international organisations across Europe, the Middle East, Africa, North America, Australia and the UK."}
                path="intro.0"
                multiline
              />
            </p>
            <p>
              <EditableText
                value={internationalBlocks?.intro?.[1] ?? "Our work addresses shared challenges in governance, protective security, leadership and inclusion while respecting the realities of each place and partnership."}
                path="intro.1"
                multiline
              />
            </p>
          </div>
        </div>
      </section>

      <InternationalPresenceSection regions={visibleRegions} />

      <section className="band band-navy">
        <div className="section-shell grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
          <div>
            <p className="type-eyebrow">
              <EditableText value={internationalBlocks?.cta?.eyebrow ?? "Work with us"} path="cta.eyebrow" />
            </p>
            <h2 className="type-display mt-5 max-w-[14ch] text-[clamp(1.85rem,3.6vw,2.75rem)]">
              <EditableText value={internationalBlocks?.cta?.title ?? "Bring community insight into international action."} path="cta.title" />
            </h2>
            <div className="rule-red mt-6" />
            <div className="mt-10 grid gap-px bg-white/14 sm:grid-cols-3">
              {[
                { value: "5000+", label: "Mosques supported" },
                { value: "3467+", label: "Madrassahs engaged" },
                { value: "20+", label: "Years of impact" },
              ].map((stat) => (
                <div key={stat.label} className="bg-[var(--navy)] px-2 py-5 sm:px-5">
                  <p className="stat-figure text-[clamp(1.7rem,2.8vw,2.6rem)] text-white">{stat.value}</p>
                  <p className="type-meta mt-2 text-[10px] leading-tight sm:text-[11px]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="type-body text-[1.05rem]">
              <EditableText
                value={internationalBlocks?.cta?.body ?? "We support research, training, network development and programme delivery with public bodies, international organisations and civil-society partners."}
                path="cta.body"
                multiline
              />
            </p>
            <Link href={ctaHref} className="btn-primary mt-8 w-full sm:w-auto">
              <EditableText value={internationalBlocks?.cta?.label ?? "Start a conversation"} path="cta.label" />
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter settings={settings} />
    </main>
    </CmsPage>
  );
}
