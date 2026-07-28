import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EditorialHero } from "../components/EditorialHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { CmsPage } from "../components/cms/CmsPage";
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
  const blocks = page?.blocks as Record<string, any> | undefined;
  const hero = blocks?.hero;
  return (
    <CmsPage path="/sport" blocks={page?.blocks}>
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader settings={settings} />
      <EditorialHero
        eyebrow={hero?.eyebrow ?? "Inclusivity in sport"}
        title={hero?.title ?? "Faith and sport: a force for generational change."}
        summary={hero?.summary ?? "Working with national sporting bodies to take accessible activity, leadership pathways and lasting opportunity into faith institutions."}
        image={hero?.image ?? "/assets/inclusivity-sport.png"}
        primaryLabel="Explore sport programmes"
        primaryHref="#programmes"
        secondaryLabel="Partner with us"
        secondaryHref="/contact"
      />

      <section className="bg-[var(--soft)] py-12 lg:py-20">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <p className="type-eyebrow text-[var(--blue)]">Our approach</p>
            <h2 className="type-display mt-4 text-[clamp(1.85rem,3.6vw,2.75rem)] text-[var(--ink)]">
              Bring opportunity to the spaces people already trust.
            </h2>
          </div>
          <div className="space-y-5">
            <p className="type-body text-[var(--muted)] lg:text-[1.05rem]">
              Faith and sport are two powerful sources of connection. Faith Associates brings them
              together so children, women, volunteers and emerging leaders can access opportunity
              through familiar community settings.
            </p>
            <p className="type-body text-[var(--muted)] lg:text-[1.05rem]">
              Our partnerships with national bodies in football and cricket combine high-quality
              sporting pathways with an extensive network of faith institutions across the UK.
            </p>
          </div>
        </div>
      </section>

      <section id="programmes" className="scroll-mt-6 py-12 lg:py-20">
        <div className="section-shell">
          <div className="grid gap-7 md:grid-cols-3">
            {programmes.map((programme) => (
              <Link href={programme.href} key={programme.title} className="group">
                <div className="media-frame relative aspect-[1.12/1]">
                  <Image
                    src={programme.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="media-zoom object-cover"
                  />
                </div>
                <div className="border-t border-[var(--line)] pt-5">
                  <h2 className="type-title text-[1.35rem] text-[var(--ink)] transition duration-300 group-hover:text-[var(--blue)]">
                    {programme.title}
                  </h2>
                  <p className="type-body mt-3 text-sm text-[var(--muted)]">{programme.body}</p>
                  <span className="type-cta mt-5 inline-flex text-[var(--blue)]">Explore programme →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--navy)] py-12 text-white lg:py-20">
        <div className="section-shell grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          <div>
            <p className="type-eyebrow text-white/45">Portfolio impact</p>
            <h2 className="type-display mt-4 text-[clamp(1.85rem,3.6vw,2.75rem)]">
              Participation is only the beginning.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ["150+", "new cricket activators trained"],
              ["50+", "football leaders accredited"],
              ["15+", "UK cities reached through cricket"],
              ["500+", "people at the inaugural Fattah Cup"],
            ].map(([value, label]) => (
              <div key={label} className="border-t border-white/14 pt-5">
                <p className="type-display text-[2.25rem]">{value}</p>
                <p className="type-body mt-2 text-sm text-white/55">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter settings={settings} />
    </main>
    </CmsPage>
  );
}
