import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "../components/ContactForm";
import { EditorialHero } from "../components/EditorialHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Contact | Faith Associates",
  description:
    "Contact Faith Associates about consultancy, training, publications, partnerships and programme delivery.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ publication?: string | string[] }>;
}) {
  const { publication } = await searchParams;
  const requestedPublication = typeof publication === "string" ? publication : undefined;

  return (
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader />
      <EditorialHero
        eyebrow="Contact"
        title="Start with the challenge. We will help find the next step."
        summary="Contact the team about consultancy, training, resources, events or partnership opportunities."
        image="/assets/real/faith-training-speaker.jpg"
      />
      <section className="py-12 lg:py-20">
        <div className="section-shell grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div>
            <p className="type-eyebrow text-[var(--blue)]">Get in touch</p>
            <h2 className="type-display mt-4 text-[clamp(1.85rem,3.6vw,2.75rem)] text-[var(--ink)]">
              Faith Associates
              <br />
              41 Baker Street
              <br />
              High Wycombe
              <br />
              HP11 2RZ
            </h2>
            <div className="type-body mt-9 grid gap-5 border-t border-[var(--line)] pt-7 text-sm text-[var(--muted)]">
              <div>
                <p className="type-meta text-[var(--ink)]">Telephone</p>
                <a
                  href="tel:+441494416202"
                  className="mt-1 inline-block underline decoration-[var(--blue)] underline-offset-4"
                >
                  +44 (0) 1494 416202
                </a>
              </div>
              <div>
                <p className="type-meta text-[var(--ink)]">Email</p>
                <a
                  href="mailto:info@faithassociates.co.uk"
                  className="mt-1 inline-block underline decoration-[var(--blue)] underline-offset-4"
                >
                  info@faithassociates.co.uk
                </a>
              </div>
              <div>
                <p className="type-meta text-[var(--ink)]">Office hours</p>
                <p className="mt-1">9:30–18:00, Monday to Friday</p>
              </div>
            </div>

            {requestedPublication ? (
              <div className="mt-8 border-l-4 border-[var(--blue)] bg-[var(--soft)] px-5 py-5">
                <p className="type-meta text-[var(--blue)]">Publication request</p>
                <p className="type-title mt-2 text-[1.05rem] text-[var(--ink)]">{requestedPublication}</p>
                <p className="type-body mt-2 text-xs text-[var(--muted)]">
                  This title is already included in the message form.
                </p>
              </div>
            ) : (
              <p className="type-body mt-8 text-xs text-[var(--muted)]">
                For publication requests, include the publication title in your message so the team
                can respond quickly.
              </p>
            )}
          </div>

          <ContactForm publicationTitle={requestedPublication} />
        </div>
      </section>
      <section className="bg-[var(--soft)] py-10 lg:py-12">
        <div className="section-shell flex flex-wrap items-center justify-between gap-5 text-sm">
          <p className="type-title text-[1.05rem] text-[var(--ink)]">Looking for a specific service?</p>
          <div className="flex flex-wrap gap-5">
            <Link
              href="/services"
              className="type-cta text-[var(--blue)] transition duration-300 hover:text-[var(--blue-dark)]"
            >
              Browse services
            </Link>
            <Link
              href="/projects"
              className="type-cta text-[var(--blue)] transition duration-300 hover:text-[var(--blue-dark)]"
            >
              View projects
            </Link>
            <Link
              href="/publications"
              className="type-cta text-[var(--blue)] transition duration-300 hover:text-[var(--blue-dark)]"
            >
              Find a publication
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
