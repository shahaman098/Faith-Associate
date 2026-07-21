import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorialHero } from "../../components/EditorialHero";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { history, team } from "../../data/site-content";

const pages = {
  history: {
    eyebrow: "About us",
    title: "Organisation history",
    summary:
      "Two decades of practical work to improve faith institutions, strengthen leadership and support communities.",
    image: "/assets/wp-about/Faith-Associates-2005-2025-scaled-e1750413022356.jpg",
  },
  clients: {
    eyebrow: "About us",
    title: "Our clients & partners",
    summary: "Relationships across civil society, technology, government, sport and international development.",
    image: "/assets/real/mosque-expo-awards-hall.jpg",
  },
  team: {
    eyebrow: "About us",
    title: "Our team",
    summary:
      "A multidisciplinary network bringing together institutional, programme, regional and technology expertise.",
    image: "/assets/wp-about/MG_2346.jpg",
  },
  approach: {
    eyebrow: "About us",
    title: "Our approach",
    summary: "Culturally informed, evidence-led and focused on improvements that institutions can sustain.",
    image: "/assets/real/about-fa-training-room.png",
  },
  careers: {
    eyebrow: "Work with us",
    title: "Careers",
    summary: "Join work that connects institutional development, leadership and meaningful community impact.",
    image: "/assets/real/leadership-development-event.webp",
  },
  vacancies: {
    eyebrow: "Work with us",
    title: "Vacancies",
    summary: "Roles and opportunities across programmes, research, events, media and technology.",
    image: "/assets/real/leadership-development-event.webp",
  },
} as const;

const clients = [
  {
    name: "United Nations",
    body: "International development and faith-leadership work, including training and support with communities in Africa.",
    logo: "/assets/clients/united-nations.jpg",
  },
  {
    name: "Google.org",
    body: "Support for digital citizenship and youth-focused online-safety programmes.",
    logo: "/assets/clients/google-org.jpg",
  },
  {
    name: "Facebook / Meta",
    body: "Partnership work on the Keeping Muslims Safe Online guide and responsible digital participation.",
    logo: "/assets/clients/facebook-meta.jpg",
  },
  {
    name: "Nordic Safe Cities",
    body: "European collaboration on inclusive, empowered and safer communities across the Nordic region.",
    logo: "/assets/clients/nordic-safe-cities.png",
  },
  {
    name: "Lancashire Council of Mosques",
    body: "Institutional engagement, leadership and community programme partnership.",
    logo: "/assets/clients/lancashire-council-of-mosques.jpg",
  },
  {
    name: "Muslim Peace Forum",
    body: "Dialogue and leadership connections supporting peaceful, resilient communities.",
    logo: "/assets/clients/muslim-peace-forum.jpg",
  },
  {
    name: "X / Twitter",
    body: "Historic digital-leadership roadshows helping faith leaders understand the positive potential of social media.",
    logo: "/assets/clients/twitter-x.jpg",
  },
];

const roles = [
  "Mosque Development & Support Coordinator",
  "Writers and Contributors",
  "Editorial / Writing Intern",
  "Social Media Intern",
  "Administrator",
  "Social Media Content Production Officer",
  "Systems Development & IT Support Graduate",
  "Events Planner / Engagement Officer",
  "Senior Researcher",
];

const approach = [
  {
    title: "Listen before designing",
    body: "We begin with the people closest to the challenge: leaders, staff, volunteers, users and delivery partners.",
  },
  {
    title: "Connect evidence and context",
    body: "Research and standards matter most when interpreted through the realities of faith institutions and communities.",
  },
  {
    title: "Build practical capability",
    body: "Training, tools and implementation support leave teams better equipped to carry the work forward.",
  },
  {
    title: "Strengthen the wider system",
    body: "Networks, partnerships and shared learning turn local progress into sector-level improvement.",
  },
];

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = pages[slug as keyof typeof pages];
  return page ? { title: `${page.title} | Faith Associates`, description: page.summary } : {};
}

export default async function AboutSubpage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = pages[slug as keyof typeof pages];
  if (!page) notFound();

  return (
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader />
      <EditorialHero {...page} />

      {slug === "history" ? (
        <section className="py-12 lg:py-20">
          <div className="section-shell max-w-5xl">
            <div className="border-t border-[var(--line)]">
              {history.map((item, index) => (
                <article
                  key={`${item.year}-${item.title}`}
                  className="grid gap-5 border-b border-[var(--line)] py-8 sm:grid-cols-[0.25fr_0.75fr] sm:py-10"
                >
                  <div>
                    <p className="type-meta text-[var(--blue)]">{item.year}</p>
                    <p className="capability-index mt-2">{String(index + 1).padStart(2, "0")}</p>
                  </div>
                  <div>
                    <h2 className="type-title text-[1.45rem] text-[var(--ink)] sm:text-[1.65rem]">{item.title}</h2>
                    <p className="type-body mt-4 max-w-2xl text-sm text-[var(--muted)]">{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {slug === "clients" ? (
        <section className="py-12 lg:py-20">
          <div className="section-shell">
            <div className="grid md:grid-cols-2 lg:grid-cols-3">
              {clients.map((client, index) => (
                <article
                  key={client.name}
                  className="border-b border-[var(--line)] px-0 py-8 md:px-7 md:first:pl-0 lg:border-r [&:nth-child(3n)]:border-r-0"
                >
                  <p className="capability-index">0{index + 1}</p>
                  <div className="mt-6 flex h-24 items-center justify-start bg-[var(--soft)] px-5">
                    <Image
                      src={client.logo}
                      alt={`${client.name} logo`}
                      width={180}
                      height={72}
                      className="max-h-14 w-auto max-w-[180px] object-contain"
                    />
                  </div>
                  <h2 className="type-title mt-6 text-[1.35rem] text-[var(--ink)]">{client.name}</h2>
                  <p className="type-body mt-4 text-sm text-[var(--muted)]">{client.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {slug === "team" ? (
        <section className="py-12 lg:py-20">
          <div className="section-shell">
            <div className="grid gap-px bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
              {team.map((person, index) => (
                <article key={person.name} className="flex min-h-64 flex-col bg-white p-7 sm:p-9">
                  <p className="capability-index">0{index + 1}</p>
                  {person.image ? (
                    <div className="relative mt-8 aspect-[5/4] w-full overflow-hidden bg-[#f1f1f1]">
                      <Image
                        src={person.image}
                        alt={person.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-[center_20%]"
                      />
                    </div>
                  ) : (
                    <div className="mt-8 flex-1" aria-hidden />
                  )}
                  <div className={person.image ? "mt-6" : "mt-auto pt-12"}>
                    <h2 className="type-title text-[1.35rem] text-[var(--ink)]">{person.name}</h2>
                    <p className="type-body mt-2 text-sm text-[var(--muted)]">{person.role}</p>
                  </div>
                </article>
              ))}
            </div>
            <p className="type-body mt-8 max-w-3xl text-sm text-[var(--muted)]">
              Faith Associates also works through a wider network of specialist associates, trainers,
              programme staff and international partners assembled around each assignment.
            </p>
          </div>
        </section>
      ) : null}

      {slug === "approach" ? (
        <section className="py-12 lg:py-20">
          <div className="section-shell">
            <div className="grid md:grid-cols-2 lg:grid-cols-4">
              {approach.map((item, index) => (
                <article
                  key={item.title}
                  className="border-b border-[var(--line)] py-8 md:px-6 lg:border-r lg:last:border-r-0"
                >
                  <p className="capability-index">0{index + 1}</p>
                  <h2 className="type-title mt-8 text-[1.35rem] text-[var(--ink)]">{item.title}</h2>
                  <p className="type-body mt-4 text-sm text-[var(--muted)]">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {slug === "careers" || slug === "vacancies" ? (
        <section className="py-12 lg:py-20">
          <div className="section-shell grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div>
              <p className="type-eyebrow text-[var(--blue)]">Opportunities</p>
              <h2 className="type-display mt-4 text-[clamp(1.85rem,3.6vw,2.75rem)] text-[var(--ink)]">
                Bring your judgement, curiosity and commitment to community impact.
              </h2>
              <p className="type-body mt-6 text-sm text-[var(--muted)]">
                The roles below are preserved from the existing vacancy archive. Availability should be
                confirmed with the team before applying.
              </p>
              <a
                href="mailto:info@faithassociates.co.uk?subject=Careers%20at%20Faith%20Associates"
                className="btn-primary mt-7"
              >
                Send an expression of interest →
              </a>
            </div>
            <div className="border-t border-[var(--line)]">
              {roles.map((role) => (
                <div
                  key={role}
                  className="flex items-center justify-between gap-5 border-b border-[var(--line)] py-5"
                >
                  <p className="type-title text-[1.05rem] text-[var(--ink)]">{role}</p>
                  <span className="type-meta shrink-0 text-[var(--muted)]">Confirm status</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-[var(--soft)] py-12 lg:py-16">
        <div className="section-shell flex flex-col gap-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <h2 className="type-display text-[clamp(1.65rem,3vw,2.25rem)] text-[var(--ink)]">
            Ready to continue the conversation?
          </h2>
          <Link href="/contact" className="btn-primary self-center sm:self-auto">
            Contact Faith Associates →
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
