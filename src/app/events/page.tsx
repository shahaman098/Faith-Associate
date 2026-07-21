import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EditorialHero } from "../components/EditorialHero";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Events | Faith Associates",
  description:
    "Explore Faith Associates conferences, leadership events, sport programmes and sector gatherings.",
};

const events = [
  {
    status: "Flagship event",
    date: "2026",
    title: "Mosque Expo 2026",
    body: "A national gathering of mosque leaders, innovators and sector partners focused on the 21st-century mosque.",
    image: "/assets/mosque-expo-2026.png",
    href: "/projects/mosque-expo",
  },
  {
    status: "Annual awards",
    date: "2026",
    title: "British Beacon Mosque Awards",
    body: "Celebrating the institutions, leaders and volunteers setting an outstanding standard of service.",
    image: "/assets/beacon-awards-2026.png",
    href: "/projects/british-beacon-mosque-awards",
  },
  {
    status: "Leadership learning",
    date: "Ongoing",
    title: "Faith Associates Academy",
    body: "Accredited programmes for trustees, managers and leaders serving religious institutions.",
    image: "/assets/faith-academy.png",
    href: "/projects/faith-associates-academy",
  },
];

export default function EventsPage() {
  return (
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader />
      <EditorialHero
        eyebrow="Events"
        title="Gatherings that turn learning into momentum."
        summary="Conferences, awards, training and sector events that connect leaders with practical ideas and trusted partners."
        image="/assets/real/mosque-expo-awards-hall.jpg"
        primaryLabel="Explore events"
        primaryHref="#events"
      />
      <section id="events" className="scroll-mt-6 py-12 lg:py-20">
        <div className="section-shell">
          <div className="grid gap-7 md:grid-cols-3">
            {events.map((event) => (
              <Link key={event.title} href={event.href} className="group">
                <div className="media-frame relative aspect-[1.12/1]">
                  <Image
                    src={event.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="media-zoom object-cover"
                  />
                </div>
                <p className="type-meta mt-5 text-[var(--blue)]">
                  {event.status} / {event.date}
                </p>
                <h2 className="type-title mt-3 text-[1.35rem] text-[var(--ink)] transition duration-300 group-hover:text-[var(--blue)]">
                  {event.title}
                </h2>
                <p className="type-body mt-3 text-sm text-[var(--muted)]">{event.body}</p>
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
      <SiteFooter />
    </main>
  );
}
