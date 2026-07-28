import Image from "next/image";
import Link from "next/link";
import type { EventPageData } from "../data/events";
import { EditorialHero } from "./EditorialHero";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import type { SiteSettingsData } from "@/lib/cms/types";

export function EventDetailPage({ event, settings }: { event: EventPageData; settings?: SiteSettingsData | null }) {
  const facts = [
    { label: "Category", value: event.category },
    { label: "Client", value: event.client },
    { label: "Date", value: event.date },
    { label: "Location", value: event.location },
    { label: "Time", value: event.time },
  ];

  return (
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader settings={settings} />
      <EditorialHero
        eyebrow={event.eyebrow}
        title={event.title}
        summary={event.summary}
        image={event.heroImage}
        primaryLabel="Register on Eventbrite"
        primaryHref={event.registrationUrl}
        secondaryLabel="Back to events"
        secondaryHref="/events"
      />

      <section className="bg-[var(--soft)] py-12 lg:py-20">
        <div className="section-shell">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {facts.map((fact) => (
              <article key={fact.label} className="rounded-[1.5rem] border border-[var(--line)] bg-white px-6 py-5">
                <p className="type-meta text-[var(--blue)]">{fact.label}</p>
                <p className="type-body mt-3 text-sm text-[var(--ink)]">{fact.value}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-20">
        <div className="section-shell grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="type-eyebrow text-[var(--blue)]">Event overview</p>
            <h2 className="type-display mt-4 text-[clamp(1.95rem,3.6vw,2.9rem)] text-[var(--ink)]">
              National guidance that translates into practical local readiness.
            </h2>
            {event.overview.map((paragraph, index) => (
              <p
                key={paragraph}
                className={`type-body text-[var(--muted)] ${index === 0 ? "mt-6" : "mt-5"}`}
              >
                {paragraph}
              </p>
            ))}
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={event.registrationUrl} target="_blank" rel="noreferrer" className="btn-primary">
                Register on Eventbrite
              </a>
              <Link href="/contact" className="btn-secondary">
                Contact the team
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--soft)]">
            <Image
              src={event.posterImage}
              alt={event.posterAlt}
              width={1131}
              height={1600}
              sizes="(max-width: 1024px) 100vw, 44vw"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </section>

      <section className="bg-[var(--navy)] py-12 text-white lg:py-20">
        <div className="section-shell">
          <div className="max-w-3xl">
            <p className="type-eyebrow text-white/55">Conference focus</p>
            <h2 className="type-display mt-4 text-[clamp(1.95rem,3.6vw,2.9rem)]">
              What attendees will cover.
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {event.focusAreas.map((area, index) => (
              <article
                key={area.title}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 px-6 py-7"
              >
                <p className="type-meta text-[var(--blue)]">0{index + 1}</p>
                <h3 className="type-title mt-4 text-[1.25rem] text-white">{area.title}</h3>
                <p className="type-body mt-3 text-sm text-white/72">{area.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter settings={settings} />
    </main>
  );
}
