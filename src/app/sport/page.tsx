import type { Metadata } from "next";
import Link from "next/link";
import { EditorialHero } from "../components/EditorialHero";
import { SiteFooter } from "../components/SiteFooter";
import { ProofCtaBand } from "../components/ProofCtaBand";
import { SiteHeader } from "../components/SiteHeader";
import { ArrowIcon } from "../components/icons";
import { CmsPage } from "../components/cms/CmsPage";
import { EditableImage } from "../components/cms/EditableImage";
import { EditableText } from "../components/cms/EditableText";
import { loadCmsPage } from "@/lib/cms/page-helpers";

export const metadata: Metadata = {
  title: "Inclusivity in Sport | Faith Associates",
  description:
    "Faith Associates works with national sporting bodies to create inclusive football and cricket opportunities through faith institutions and communities.",
};

const programmes = [
  {
    title: "Football",
    body: "Recreational opportunities, volunteer pathways and partnerships with England Football, London FA and Middlesex FA.",
    href: "/projects/fattah-cup",
    image: "/assets/inclusivity-sport.png",
  },
  {
    title: "Cricket",
    body: "Accessible activity, activator training and a national inter-madrassah tournament supported by the ECB.",
    href: "/projects/eman-cup",
    image: "/assets/eman-cup.webp",
  },
  {
    title: "Girls’ participation",
    body: "Wildcats centres, coaching support and campaigns designed to widen access for girls and women.",
    href: "/projects/fattah-cup",
    image: "/assets/real/community-impact-training.png",
  },
];

export default async function SportPage() {
  const { settings, page } = await loadCmsPage("/sport");
  const blocks = page?.blocks as Record<string, unknown> | undefined;
  const sportBlocks = blocks as
    | Partial<{
        hero: { eyebrow: string; title: string; summary: string; image: string };
        introEyebrow: string;
        introTitle: string;
        intro: string[];
        programmes: typeof programmes;
        impactEyebrow: string;
        impactTitle: string;
        impact: Array<{ value: string; label: string }>;
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
  const programmesData = sportBlocks?.programmes ?? programmes;
  const impactData = sportBlocks?.impact ?? [
    { value: "150+", label: "new cricket activators trained" },
    { value: "50+", label: "football leaders accredited" },
    { value: "15+", label: "UK cities reached through cricket" },
    { value: "500+", label: "people at the inaugural Fattah Cup" },
  ];
  return (
    <CmsPage path="/sport" blocks={page?.blocks}>
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader settings={settings} />
      <EditorialHero
        eyebrow={hero?.eyebrow ?? "Inclusivity in sport"}
        title={hero?.title ?? "Faith and sport: a force for generational change."}
        summary={hero?.summary ?? "Working with national sporting bodies to take accessible activity, leadership pathways and lasting opportunity into faith institutions."}
        image={hero?.image ?? "/assets/inclusivity-sport.png"}
        primaryLabel="Enquire"
        primaryHref="/contact"
        secondaryLabel="Browse programmes"
        secondaryHref="#programmes"
      />

      <section className="band-tight band-soft">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-16">
          <div>
            <p className="type-eyebrow text-[var(--blue)]">
              <EditableText value={sportBlocks?.introEyebrow ?? "Our approach"} path="introEyebrow" />
            </p>
            <h2 className="type-display mt-4 text-[clamp(1.85rem,3.6vw,2.75rem)] text-[var(--ink)]">
              <EditableText value={sportBlocks?.introTitle ?? "Bring opportunity to the spaces people already trust."} path="introTitle" />
            </h2>
            <div className="rule-red mt-6" />
          </div>
          <div className="space-y-5">
            <p className="type-body text-[var(--muted)] lg:text-[1.05rem]">
              <EditableText
                value={sportBlocks?.intro?.[0] ?? "Faith and sport are two powerful sources of connection. Faith Associates brings them together so children, women, volunteers and emerging leaders can access opportunity through familiar community settings."}
                path="intro.0"
                multiline
              />
            </p>
            <p className="type-body text-[var(--muted)] lg:text-[1.05rem]">
              <EditableText
                value={sportBlocks?.intro?.[1] ?? "Our partnerships with national bodies in football and cricket combine high-quality sporting pathways with an extensive network of faith institutions across the UK."}
                path="intro.1"
                multiline
              />
            </p>
          </div>
        </div>
      </section>

      <section id="programmes" className="band band-white scroll-mt-24">
        <div className="section-shell">
          <h2 className="type-display max-w-[16ch] text-[clamp(1.85rem,3.4vw,2.8rem)] text-[var(--ink)]">
            Sport programmes
          </h2>
          <div className="rule-red mt-6" />
          <div className="mt-9 grid gap-px bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
            {programmesData.map((programme, index) => (
              <article key={programme.title} className="group relative flex flex-col bg-white">
                <div className="media-frame relative aspect-[4/3] w-full overflow-hidden">
                  <EditableImage
                    src={programme.image}
                    alt=""
                    path={`programmes.${index}.image`}
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
                    <h3 className="type-title text-[1.3rem] text-[var(--ink)] transition duration-300 group-hover:text-[var(--blue)]">
                      <Link href={programme.href}>
                        <span className="absolute inset-0" aria-hidden="true" />
                        <EditableText value={programme.title} path={`programmes.${index}.title`} />
                      </Link>
                    </h3>
                    <p className="type-body mt-3 text-[0.95rem] text-[var(--muted)]">
                      <EditableText value={programme.body} path={`programmes.${index}.body`} multiline />
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

      <section className="band band-navy">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <p className="type-eyebrow">
              <EditableText value={sportBlocks?.impactEyebrow ?? "Portfolio impact"} path="impactEyebrow" />
            </p>
            <h2 className="type-display mt-4 text-[clamp(1.85rem,3.6vw,2.75rem)]">
              <EditableText value={sportBlocks?.impactTitle ?? "Participation is only the beginning."} path="impactTitle" />
            </h2>
            <div className="rule-red mt-6" />
          </div>
          <div className="grid gap-px bg-white/14 sm:grid-cols-2">
            {impactData.map((item, index) => (
              <div key={item.label} className="bg-[var(--navy)] p-5 lg:p-6">
                <p className="stat-figure text-[clamp(1.9rem,3.2vw,2.9rem)] text-white">
                  <EditableText value={item.value} path={`impact.${index}.value`} />
                </p>
                <p className="type-body mt-3 text-sm">
                  <EditableText value={item.label} path={`impact.${index}.label`} multiline />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ProofCtaBand
        eyebrow="Partner with us"
        title="Bring a sport programme to your institution."
        primaryLabel="Talk to the team"
        secondaryLabel="See our projects"
        secondaryHref="/projects"
      />

      <SiteFooter settings={settings} />
    </main>
    </CmsPage>
  );
}
