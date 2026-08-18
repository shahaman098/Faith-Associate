import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EditorialHero } from "../components/EditorialHero";
import { SiteFooter } from "../components/SiteFooter";
import { ProofCtaBand } from "../components/ProofCtaBand";
import { SiteHeader } from "../components/SiteHeader";
import { ArrowIcon, CalendarIcon } from "../components/icons";
import { EditableText } from "../components/cms/EditableText";
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
  const blocks = page?.blocks as Record<string, unknown> | undefined;
  const eventBlocks = blocks as
    | Partial<{
        hero: { eyebrow: string; title: string; summary: string; image: string };
        cta: { eyebrow: string; title: string; label: string };
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
        primaryLabel="Enquire"
        primaryHref="/contact"
        secondaryLabel="See the programme"
        secondaryHref="#events"
      />
      <section id="events" className="band band-white scroll-mt-24">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-16">
            <div>
              <p className="type-eyebrow text-[var(--blue)]">
                <EditableText value="Event schedule" path="eventsLabel" />
              </p>
              <h2 className="type-display mt-4 max-w-[16ch] text-[clamp(1.85rem,3.4vw,2.8rem)] text-[var(--ink)]">
                What is coming up.
              </h2>
              <div className="rule-red mt-6" />
            </div>
            <p className="type-body max-w-[40rem] text-[1.02rem] text-[var(--muted)] lg:text-[1.1rem]">
              Conferences, briefings and convenings that bring mosque leaders, teachers, statutory
              partners and specialists into the same room to work on live operational problems.
            </p>
          </div>

          <div className="mt-10 grid gap-px bg-[var(--line)]">
            {events.map((event, index) => (
              <article
                key={event.slug}
                className="group relative grid gap-8 bg-white p-6 md:grid-cols-[0.85fr_1.15fr] md:p-8 lg:gap-12"
              >
                <div className="media-frame relative aspect-[1.08/1] w-full overflow-hidden">
                  <Image
                    src={event.posterImage}
                    alt={event.posterAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="media-zoom object-cover"
                  />
                  <span className="absolute left-0 top-0 flex size-12 items-center justify-center bg-[var(--navy)] text-[13px] font-semibold tracking-[0.08em] text-white sm:size-14">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-4">
                    <span className="icon-tile">
                      <CalendarIcon />
                    </span>
                    <p className="type-meta text-[var(--blue)]">
                      {event.category} / {event.date}
                    </p>
                  </div>
                  <h3 className="type-title mt-5 text-[1.6rem] text-[var(--ink)] transition duration-300 group-hover:text-[var(--blue)] sm:text-[2rem]">
                    <Link href={`/events/${event.slug}`}>
                      <span className="absolute inset-0" aria-hidden="true" />
                      {event.title}
                    </Link>
                  </h3>
                  <p className="type-body mt-4 max-w-[42rem] text-[1rem] text-[var(--muted)]">
                    {event.cardSummary}
                  </p>

                  <div className="chip-row mt-7">
                    <span className="chip">{event.location}</span>
                    <span className="chip">{event.time}</span>
                    <span className="chip chip--accent">Registration open</span>
                  </div>

                  <span className="type-cta relative z-10 mt-8 inline-flex items-center gap-2 text-[var(--blue)]">
                    View the event <ArrowIcon />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ProofCtaBand
        eyebrow={eventBlocks?.cta?.eyebrow ?? "Bring an event to your network"}
        title={eventBlocks?.cta?.title ?? "Talk to our events and programmes team."}
        primaryLabel={eventBlocks?.cta?.label ?? "Start a conversation"}
        secondaryLabel="Latest news"
        secondaryHref="/news"
      />

      <SiteFooter settings={settings} />
    </main>
    </CmsPage>
  );
}
