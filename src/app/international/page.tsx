import type { Metadata } from "next";
import Link from "next/link";
import { EditorialHero } from "../components/EditorialHero";
import { InternationalPresenceSection } from "../components/InternationalPresenceSection";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "International | Faith Associates",
  description:
    "Faith Associates works with communities and international organisations across Europe, Africa, the Middle East, North America and Australasia.",
};

export default function InternationalPage() {
  return (
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader />
      <EditorialHero
        eyebrow="International"
        title="Connected leadership across five continents."
        summary="Sustainable partnerships, institutional development and knowledge exchange shaped with communities—not simply delivered to them."
        image="/assets/real/beacon-awards-stage.jpg"
        primaryLabel="Discuss a partnership"
        primaryHref="/contact"
      />

      <section className="border-b border-[var(--line)] bg-[var(--soft)] py-14 lg:py-20">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <p className="type-eyebrow text-[var(--blue)]">Global portfolio</p>
            <h2 className="type-display mt-4 text-[clamp(1.85rem,3.6vw,2.75rem)] text-[var(--ink)]">
              International reach, grounded local relationships.
            </h2>
          </div>
          <div className="space-y-5 text-[1.05rem] leading-8 text-[var(--muted)]">
            <p>
              Faith Associates collaborates with communities and international organisations across
              Europe, the Middle East, Africa, North America, Australia and the UK.
            </p>
            <p>
              Our work addresses shared challenges in governance, protective security, leadership and
              inclusion while respecting the realities of each place and partnership.
            </p>
          </div>
        </div>
      </section>

      <InternationalPresenceSection />

      <section className="bg-[var(--navy)] py-16 text-white lg:py-24">
        <div className="section-shell grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
          <div>
            <p className="type-eyebrow text-white/45">Work with us</p>
            <h2 className="type-display mt-5 max-w-[14ch] text-[clamp(1.85rem,3.6vw,2.75rem)]">
              Bring community insight into international action.
            </h2>
          </div>
          <div>
            <p className="type-body text-base text-white/62">
              We support research, training, network development and programme delivery with public
              bodies, international organisations and civil-society partners.
            </p>
            <Link href="/contact" className="btn-primary mt-7 bg-white text-[var(--navy)] hover:bg-[var(--red)] hover:text-white">
              Start a conversation →
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
