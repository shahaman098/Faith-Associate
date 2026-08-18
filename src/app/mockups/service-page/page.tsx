import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { serviceOfferings } from "../../data/service-catalogues";
import { getSiteSettings } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Service page mockup | Faith Associates",
  robots: { index: false, follow: false },
};

const quickFacts = [
  ["Format", "In-person masterclass"],
  ["Audience", "Trustees, managers, staff and volunteers"],
  ["Outcome", "Practical governance toolkit"],
  ["Next step", "Book or enquire"],
];

const audience = [
  "Mosque trustees and committee members",
  "Islamic centre managers and administrators",
  "Madrassah leads and safeguarding officers",
  "Volunteers stepping into governance roles",
];

const relatedServices = [
  {
    title: "2 Day Mosque Management & Governance",
    href: "/services/2-day-mosque-management-governance-master-class-training",
  },
  {
    title: "Safer Recruitment Training",
    href: "/services/safer-recruitment-training",
  },
  {
    title: "Mosque Election Management",
    href: "/services/mosque-election-management",
  },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h9M8.5 3.5 13 8l-4.5 4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 20 20" fill="none">
      <path
        d="m4.5 10.5 3.4 3.4 7.6-8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default async function ServicePageMockup() {
  const settings = await getSiteSettings();
  const service = serviceOfferings.find(
    (item) => item.slug === "1-day-mosque-management-governance-master-class-training",
  );

  if (!service) notFound();

  return (
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader settings={settings} />

      <section className="relative overflow-hidden bg-[var(--navy)] text-white">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(135deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="section-shell relative grid gap-10 pb-12 pt-32 lg:grid-cols-[1.02fr_0.98fr] lg:items-end lg:pb-16 lg:pt-44">
          <div className="max-w-3xl">
            <p className="type-eyebrow text-[var(--blue-light)]">Approval mockup / service detail</p>
            <h1 className="type-display mt-5 text-[clamp(2.45rem,6vw,5.2rem)]">
              {service.title}
            </h1>
            <p className="type-body mt-6 max-w-2xl text-[1.05rem] text-white/76 lg:text-[1.18rem]">
              {service.summary}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#booking-form" className="btn-primary">
                Book / enquire <ArrowIcon />
              </a>
              <Link href="/services" className="btn-secondary text-white hover:bg-white hover:text-[var(--navy)]">
                Browse services
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden border border-white/16 bg-white/8">
              <Image
                src={service.image}
                alt=""
                fill
                unoptimized
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(11,24,36,0.48))]" />
            </div>
            <div className="grid border border-t-0 border-white/16 bg-white text-[var(--ink)] sm:grid-cols-2">
              {quickFacts.map(([label, value]) => (
                <div key={label} className="border-b border-[var(--line)] px-5 py-4 odd:sm:border-r">
                  <p className="type-meta text-[var(--blue)]">{label}</p>
                  <p className="type-title mt-1 text-[1rem]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--soft)] py-10">
        <div className="section-shell grid gap-4 md:grid-cols-3">
          {relatedServices.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between gap-5 border border-[var(--line)] bg-white p-5 transition duration-300 hover:border-[var(--blue)]"
            >
              <span className="type-title text-[1.05rem] transition group-hover:text-[var(--blue)]">
                {item.title}
              </span>
              <span className="inline-flex size-10 shrink-0 items-center justify-center bg-[var(--blue)] text-white transition group-hover:bg-[var(--navy)]">
                <ArrowIcon />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="type-eyebrow text-[var(--blue)]">The opportunity</p>
            <h2 className="type-display mt-4 text-[clamp(1.9rem,3.8vw,3.25rem)]">
              Less empty space, clearer value, faster action.
            </h2>
          </div>
          <div className="grid gap-5">
            {service.intro.map((paragraph, index) => (
              <p
                key={paragraph}
                className={
                  index === 0
                    ? "type-title text-[1.45rem] text-[var(--ink)] lg:text-[1.75rem]"
                    : "type-body text-[var(--muted)]"
                }
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-white py-12 lg:py-16">
        <div className="section-shell">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p className="type-eyebrow text-[var(--blue)]">What this covers</p>
              <h2 className="type-display mt-4 text-[clamp(1.85rem,3.4vw,2.8rem)]">
                Practical modules with visible outcomes.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {service.highlights.map((highlight, index) => (
                <article key={highlight.title} className="border border-[var(--line)] bg-[var(--soft)] p-6">
                  <div className="flex items-center justify-between gap-5">
                    <p className="capability-index">{String(index + 1).padStart(2, "0")}</p>
                    <span className="inline-flex size-12 items-center justify-center bg-[var(--blue)] text-white">
                      <CheckIcon />
                    </span>
                  </div>
                  <h3 className="type-title mt-5 text-[1.25rem]">{highlight.title}</h3>
                  <p className="type-body mt-3 text-sm text-[var(--muted)]">{highlight.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--navy)] py-12 text-white lg:py-16">
        <div className="section-shell grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="type-eyebrow text-white/50">Who it is for</p>
            <h2 className="type-display mt-4 text-[clamp(1.85rem,3.4vw,2.8rem)]">
              Built around the people running the institution.
            </h2>
            <div className="mt-8 grid gap-3">
              {audience.map((item) => (
                <div key={item} className="flex items-center gap-3 border-t border-white/14 pt-3">
                  <span className="inline-flex size-7 items-center justify-center bg-white text-[var(--blue)]">
                    <CheckIcon />
                  </span>
                  <p className="type-body text-white/78">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-white/14 bg-white/[0.04] p-6 lg:p-8">
            <p className="type-eyebrow text-[var(--blue-light)]">What you leave with</p>
            <div className="mt-6 grid gap-4">
              {service.outcomes.map((outcome) => (
                <p key={outcome} className="type-title border-b border-white/12 pb-4 text-[1.15rem] text-white/88">
                  {outcome}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="booking-form" className="scroll-mt-28 bg-[var(--soft)] py-12 lg:py-16">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <p className="type-eyebrow text-[var(--blue)]">Book or enquire</p>
            <h2 className="type-display mt-4 text-[clamp(1.85rem,3.4vw,2.8rem)]">
              Stronger final CTA, not a buried form.
            </h2>
            <p className="type-body mt-4 max-w-xl text-[var(--muted)]">
              The live template would keep the Zoho embed here, but with tighter spacing, clearer context and a stronger enquiry panel.
            </p>
          </div>
          <div className="border border-[var(--line)] bg-white p-6">
            <p className="type-title text-[1.35rem]">Ready to discuss delivery?</p>
            <p className="type-body mt-3 text-[var(--muted)]">
              Register your details and the Faith Associates team will confirm suitability, format and next steps.
            </p>
            <Link href="/contact" className="btn-primary mt-6">
              Contact the team <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter settings={settings} />
    </main>
  );
}
