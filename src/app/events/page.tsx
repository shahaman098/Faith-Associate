import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EditorialHero } from "../components/EditorialHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { eventPages } from "../data/events";
import { CmsPage } from "../components/cms/CmsPage";
import { loadCmsPage } from "@/lib/cms/page-helpers";
import { getEntries } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Events | Faith Associates",
  description:
    "Explore Faith Associates conferences, security briefings and sector gatherings.",
};

export default async function EventsPage() {
  const { settings, page, preferDraft } = await loadCmsPage("/events");
  const blocks = page?.blocks as Record<string, any> | undefined;
  const hero = blocks?.hero;
  const entries = await getEntries("event", { preferDraft });
  const events = entries.length ? (entries.map((entry) => ({ slug: entry.slug, ...entry.data })) as typeof eventPages) : eventPages;
  return (
    <CmsPage path="/events" blocks={page?.blocks}>
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader settings={settings} />
      <EditorialHero
        eyebrow={hero?.eyebrow ?? "Events"}
        title={hero?.title ?? "Events built around practical action."}
        summary={hero?.summary ?? "Current Faith Associates events, conferences and briefings that help leaders, teachers and institutions respond to real operational challenges."}
        image={hero?.image ?? events[0]?.heroImage ?? "/assets/real/mosque-expo-2024-hall.jpg"}
        primaryLabel="Explore the event"
        primaryHref="#events"
      />
      <section id="events" className="scroll-mt-6 py-12 lg:py-20">
        <div className="section-shell">
          <div className="mx-auto max-w-4xl">
            {events.map((event) => (
              <Link
                key={event.slug}
                href={`/events/${event.slug}`}
                className="group grid gap-8 rounded-[2rem] border border-[var(--line)] bg-white p-5 shadow-[0_24px_70px_rgba(8,20,31,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_85px_rgba(8,20,31,0.12)] md:grid-cols-[1.05fr_0.95fr] md:p-7"
              >
                <div className="media-frame relative aspect-[1.08/1] overflow-hidden rounded-[1.35rem]">
                  <Image
                    src={event.posterImage}
                    alt={event.posterAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="media-zoom object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="type-meta text-[var(--blue)]">
                    {event.category} / {event.date}
                  </p>
                  <h2 className="type-title mt-4 text-[1.6rem] text-[var(--ink)] transition duration-300 group-hover:text-[var(--blue)] sm:text-[1.85rem]">
                    {event.title}
                  </h2>
                  <p className="type-body mt-4 text-sm text-[var(--muted)] sm:text-base">
                    {event.cardSummary}
                  </p>
                  <dl className="mt-6 grid gap-4 border-t border-[var(--line)] pt-6 sm:grid-cols-2">
                    <div>
                      <dt className="type-meta text-[var(--blue)]">Location</dt>
                      <dd className="type-body mt-2 text-sm text-[var(--ink)]">{event.location}</dd>
                    </div>
                    <div>
                      <dt className="type-meta text-[var(--blue)]">Time</dt>
                      <dd className="type-body mt-2 text-sm text-[var(--ink)]">{event.time}</dd>
                    </div>
                  </dl>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[var(--soft)] py-12 lg:py-20">
        <div className="section-shell flex flex-col gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div>
            <p className="type-eyebrow text-[var(--blue)]">Bring an event to your network</p>
            <h2 className="type-display mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)] text-[var(--ink)]">
              Talk to our events and programmes team.
            </h2>
          </div>
          <Link href="/contact" className="btn-primary self-center sm:self-auto">
            Start a conversation →
          </Link>
        </div>
      </section>
      <SiteFooter settings={settings} />
    </main>
    </CmsPage>
  );
}
