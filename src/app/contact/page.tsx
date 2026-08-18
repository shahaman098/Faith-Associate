import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "../components/ContactForm";
import { EditorialHero } from "../components/EditorialHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { CmsPage } from "../components/cms/CmsPage";
import { EditableText } from "../components/cms/EditableText";
import { loadCmsPage } from "@/lib/cms/page-helpers";

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
  const { settings, page } = await loadCmsPage("/contact");
  const blocks = page?.blocks as Record<string, unknown> | undefined;
  const contactBlocks = blocks as
    | Partial<{
        hero: { eyebrow: string; title: string; summary: string; image: string };
        addressLines: string[];
        telephone: string;
        email: string;
        hours: string;
        publicationHint: string;
        linksTitle: string;
        links: string[][];
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

  return (
    <CmsPage path="/contact" blocks={page?.blocks}>
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader settings={settings} />
      <EditorialHero
        eyebrow={hero?.eyebrow ?? "Contact"}
        title={hero?.title ?? "Start with the challenge. We will help find the next step."}
        summary={hero?.summary ?? "Contact the team about consultancy, training, resources, events or partnership opportunities."}
        image={hero?.image ?? "/assets/real/faith-training-speaker.jpg"}
        primaryLabel="Send an enquiry"
        primaryHref="#enquiry-form"
        secondaryLabel="Browse services"
        secondaryHref="/services"
      />
      <section id="enquiry-form" className="band band-white scroll-mt-24">
        <div className="section-shell grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div>
            <p className="type-eyebrow text-[var(--blue)]">
              <EditableText value="Get in touch" path="contactLabel" />
            </p>
            <h2 className="type-display mt-4 text-[clamp(1.85rem,3.6vw,2.75rem)] text-[var(--ink)]">
              <EditableText value={contactBlocks?.addressLines?.[0] ?? "Faith Associates"} path="addressLines.0" />
              <br />
              <EditableText value={contactBlocks?.addressLines?.[1] ?? "41 Baker Street"} path="addressLines.1" />
              <br />
              <EditableText value={contactBlocks?.addressLines?.[2] ?? "High Wycombe"} path="addressLines.2" />
              <br />
              <EditableText value={contactBlocks?.addressLines?.[3] ?? "HP11 2RZ"} path="addressLines.3" />
            </h2>
            <div className="rule-red mt-6" />
            <div className="type-body mt-9 grid gap-6 border-t border-[var(--line)] pt-7 text-[0.95rem] text-[var(--muted)]">
              <div>
                <p className="type-meta text-[var(--blue)]">Telephone</p>
                <a
                  href={`tel:${(contactBlocks?.telephone ?? "+44 (0) 1494 416202").replace(/[^\d+]/g, "")}`}
                  className="type-title mt-1.5 inline-block text-[1.15rem] text-[var(--ink)] transition hover:text-[var(--blue)]"
                >
                  <EditableText value={contactBlocks?.telephone ?? "+44 (0) 1494 416202"} path="telephone" />
                </a>
              </div>
              <div>
                <p className="type-meta text-[var(--blue)]">Email</p>
                <a
                  href={`mailto:${contactBlocks?.email ?? "info@faithassociates.co.uk"}`}
                  className="type-title mt-1.5 inline-block text-[1.15rem] text-[var(--ink)] transition hover:text-[var(--blue)]"
                >
                  <EditableText value={contactBlocks?.email ?? "info@faithassociates.co.uk"} path="email" />
                </a>
              </div>
              <div>
                <p className="type-meta text-[var(--blue)]">Office hours</p>
                <p className="mt-1">
                  <EditableText value={contactBlocks?.hours ?? "9:30–18:00, Monday to Friday"} path="hours" />
                </p>
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
                <EditableText
                  value={contactBlocks?.publicationHint ?? "For publication requests, include the publication title in your message so the team can respond quickly."}
                  path="publicationHint"
                  multiline
                />
              </p>
            )}
          </div>

          <div className="panel-frame w-full">
            <div className="panel-frame__head">
              <p className="type-eyebrow text-[var(--blue)]">Enquiry form</p>
              <p className="type-title mt-2 text-[1.25rem] text-[var(--ink)]">
                Tell us about your institution
              </p>
            </div>
            <div className="panel-frame__body">
              <ContactForm publicationTitle={requestedPublication} />
            </div>
          </div>
        </div>
      </section>
      <section className="band-tight band-soft">
        <div className="section-shell flex flex-wrap items-center justify-between gap-5 text-sm">
          <p className="type-title text-[1.25rem] text-[var(--ink)]">
            <EditableText value="Looking for a specific service?" path="linksTitle" />
          </p>
          <div className="flex flex-wrap gap-5">
            <Link
              href="/services"
              className="type-cta inline-flex items-center gap-2 text-[var(--blue)] transition duration-300 hover:text-[var(--blue-dark)]"
            >
              <EditableText value={contactBlocks?.links?.[0]?.[0] ?? "Browse services"} path="links.0.0" />
            </Link>
            <Link
              href="/projects"
              className="type-cta inline-flex items-center gap-2 text-[var(--blue)] transition duration-300 hover:text-[var(--blue-dark)]"
            >
              <EditableText value={contactBlocks?.links?.[1]?.[0] ?? "View projects"} path="links.1.0" />
            </Link>
            <Link
              href="/publications"
              className="type-cta inline-flex items-center gap-2 text-[var(--blue)] transition duration-300 hover:text-[var(--blue-dark)]"
            >
              <EditableText value={contactBlocks?.links?.[2]?.[0] ?? "Find a publication"} path="links.2.0" />
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter settings={settings} />
    </main>
    </CmsPage>
  );
}
