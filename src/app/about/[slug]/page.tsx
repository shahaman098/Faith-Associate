import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorialHero } from "../../components/EditorialHero";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { EditableImage } from "../../components/cms/EditableImage";
import { EditableText } from "../../components/cms/EditableText";
import { history, team } from "../../data/site-content";
import { CmsPage } from "../../components/cms/CmsPage";
import { loadCmsPage } from "@/lib/cms/page-helpers";
import { getEntries } from "@/lib/cms/queries";

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

/**
 * Our approach — built only from published Faith Associates material: the About
 * page mission statement, the UN SDG commitment and the organisation history.
 * The legacy WordPress /about-us/our-approach/ page carries unedited theme demo
 * content ("Consulting WP") and is deliberately not carried over.
 */
const approach = [
  {
    title: "Non-theological and culturally sensitive",
    body: "Faith Associates was set up in 2004 as a non-theological consultancy. We work in a culturally sensitive, multidisciplinary way, so recommendations fit the institution as it actually operates.",
  },
  {
    title: "Research, training, advice and guidance",
    body: "Our four working methods. Each engagement combines them differently, but the aim is the same: support and influence the challenges faced by faith-based communities.",
  },
  {
    title: "Governance, strategy and communication",
    body: "A key area of focus is developing institutional governance, improving strategic choices and developing effective communication strategies.",
  },
  {
    title: "Greater inclusion and wider participation",
    body: "Our work has focused on the greater inclusion of all members of faith-based communities, and on increasing the confidence and skills of women and young people.",
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
  const fallbackPage = pages[slug as keyof typeof pages];
  if (!fallbackPage) notFound();
  const { settings, page: cmsPage, preferDraft } = await loadCmsPage(`/about/${slug}`);
  const blocks = cmsPage?.blocks as Record<string, unknown> | undefined;
  const hero = blocks?.hero as Partial<typeof fallbackPage> | undefined;
  const page = { ...fallbackPage, ...(hero ?? {}) };
  const [historyEntries, teamEntries, clientEntries, roleEntries] = await Promise.all([
    getEntries("history_item", { preferDraft }),
    getEntries("team_member", { preferDraft }),
    getEntries("client", { preferDraft }),
    getEntries("vacancy_role", { preferDraft }),
  ]);
  const cmsHistory = historyEntries.length ? (historyEntries.map((entry) => entry.data) as typeof history) : history;
  const cmsTeam = teamEntries.length ? (teamEntries.map((entry) => entry.data) as typeof team) : team;
  const cmsClients = clientEntries.length ? (clientEntries.map((entry) => entry.data) as typeof clients) : clients;
  const cmsRoles = roleEntries.length ? roleEntries.map((entry) => String(entry.data.title ?? entry.slug)) : roles;
  const historyItems = (blocks?.items as typeof history | undefined) ?? cmsHistory;
  const clientItems = (blocks?.items as typeof clients | undefined) ?? cmsClients;
  const teamItems = (blocks?.items as typeof team | undefined) ?? cmsTeam;
  const approachItems = (blocks?.items as typeof approach | undefined) ?? approach;
  const roleItems = (blocks?.roles as string[] | undefined) ?? cmsRoles;

  return (
    <CmsPage path={`/about/${slug}`} blocks={cmsPage?.blocks}>
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader settings={settings} />
      <EditorialHero {...page} />

      {slug === "history" ? (
        <section className="band band-white">
          <div className="section-shell max-w-5xl">
            <div className="border-t border-[var(--line)]">
              {historyItems.map((item, index) => (
                <article
                  key={`${item.year}-${item.title}`}
                  className="grid gap-5 border-b border-[var(--line)] py-8 sm:grid-cols-[0.22fr_0.78fr] sm:gap-10 sm:py-10"
                >
                  <div>
                    <p className="index-number">
                      <EditableText value={item.year} path={`items.${index}.year`} />
                    </p>
                    <p className="capability-index mt-2">{String(index + 1).padStart(2, "0")}</p>
                  </div>
                  <div>
                    <h2 className="type-title text-[1.45rem] text-[var(--ink)] sm:text-[1.65rem]">
                      <EditableText value={item.title} path={`items.${index}.title`} />
                    </h2>
                    <p className="type-body mt-4 max-w-2xl text-sm text-[var(--muted)]">
                      <EditableText value={item.body} path={`items.${index}.body`} multiline />
                    </p>
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
              {clientItems.map((client, index) => (
                <article
                  key={client.name}
                  className="border-b border-[var(--line)] px-0 py-8 md:px-7 md:first:pl-0 lg:border-r [&:nth-child(3n)]:border-r-0"
                >
                  <p className="capability-index">0{index + 1}</p>
                  <div className="mt-6 flex h-24 items-center justify-start bg-[var(--soft)] px-5">
                    <EditableImage
                      src={client.logo}
                      alt={`${client.name} logo`}
                      path={`items.${index}.logo`}
                      width={180}
                      height={72}
                      className="max-h-14 w-auto max-w-[180px] object-contain"
                    />
                  </div>
                  <h2 className="type-title mt-6 text-[1.35rem] text-[var(--ink)]">
                    <EditableText value={client.name} path={`items.${index}.name`} />
                  </h2>
                  <p className="type-body mt-4 text-sm text-[var(--muted)]">
                    <EditableText value={client.body} path={`items.${index}.body`} multiline />
                  </p>
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
              {teamItems.map((person, index) => (
                <article key={person.name} className="flex min-h-64 flex-col bg-white p-7 sm:p-9">
                  <p className="capability-index">0{index + 1}</p>
                  {person.image ? (
                    <div className="relative mt-8 aspect-[5/4] w-full overflow-hidden bg-[#f1f1f1]">
                      <EditableImage
                        src={person.image}
                        alt={person.name}
                        path={`items.${index}.image`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-[center_20%]"
                      />
                    </div>
                  ) : (
                    <div className="mt-8 flex-1" aria-hidden />
                  )}
                  <div className={person.image ? "mt-6" : "mt-auto pt-12"}>
                    <h2 className="type-title text-[1.35rem] text-[var(--ink)]">
                      <EditableText value={person.name} path={`items.${index}.name`} />
                    </h2>
                    <p className="type-body mt-2 text-sm text-[var(--muted)]">
                      <EditableText value={person.role} path={`items.${index}.role`} />
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <p className="type-body mt-8 max-w-3xl text-sm text-[var(--muted)]">
              <EditableText
                value={String(blocks?.intro ?? "Faith Associates also works through a wider network of specialist associates, trainers, programme staff and international partners assembled around each assignment.")}
                path="intro"
                multiline
              />
            </p>
          </div>
        </section>
      ) : null}

      {slug === "approach" ? (
        <>
          <section className="band-tight band-soft">
            <div className="section-shell grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-16">
              <div>
                <h2 className="type-display max-w-[16ch] text-[clamp(1.85rem,3.4vw,2.8rem)] text-[var(--ink)]">
                  <EditableText
                    value="How we work with faith institutions."
                    path="approachTitle"
                  />
                </h2>
                <div className="rule-red mt-6" />
              </div>
              <p className="type-body max-w-[40rem] text-[1.02rem] text-[var(--muted)] lg:text-[1.1rem]">
                <EditableText
                  value="Working with agencies concerned with business, education and government at local, regional, national and international levels has enabled us to identify the misconceptions that face faith-based communities and to work towards challenging these."
                  path="approachIntro"
                  multiline
                />
              </p>
            </div>
          </section>

          <section className="band band-white">
            <div className="section-shell">
              <div className="grid gap-px bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
                {approachItems.map((item, index) => (
                  <article key={item.title} className="bg-white p-6 lg:p-8">
                    <p className="index-number index-number--quiet" aria-hidden="true">
                      0{index + 1}
                    </p>
                    <h2 className="type-title mt-5 text-[1.25rem] text-[var(--ink)]">
                      <EditableText value={item.title} path={`items.${index}.title`} />
                    </h2>
                    <p className="type-body mt-3 text-[0.95rem] text-[var(--muted)]">
                      <EditableText value={item.body} path={`items.${index}.body`} multiline />
                    </p>
                  </article>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="/about/history" className="btn-secondary border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white">
                  Twenty years of delivery
                </Link>
                <Link href="/services" className="btn-secondary border-[var(--blue)] text-[var(--blue)] hover:bg-[var(--blue)] hover:text-white">
                  How this shows up in our services
                </Link>
              </div>
            </div>
          </section>
        </>
      ) : null}

      {slug === "careers" || slug === "vacancies" ? (
        <section className="py-12 lg:py-20">
          <div className="section-shell grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div>
              <p className="type-eyebrow text-[var(--blue)]">
                <EditableText value="Opportunities" path="sectionEyebrow" />
              </p>
              <h2 className="type-display mt-4 text-[clamp(1.85rem,3.6vw,2.75rem)] text-[var(--ink)]">
                <EditableText
                  value={String(blocks?.heading ?? "Bring your judgement, curiosity and commitment to community impact.")}
                  path="heading"
                  multiline
                />
              </h2>
              <p className="type-body mt-6 text-sm text-[var(--muted)]">
                <EditableText
                  value={String(blocks?.intro ?? "The roles below are preserved from the existing vacancy archive. Availability should be confirmed with the team before applying.")}
                  path="intro"
                  multiline
                />
              </p>
              <a
                href="mailto:info@faithassociates.co.uk?subject=Careers%20at%20Faith%20Associates"
                className="btn-primary mt-7"
              >
                <EditableText value="Send an expression of interest" path="ctaLabel" /> →
              </a>
            </div>
            <div className="border-t border-[var(--line)]">
              {roleItems.map((role, index) => (
                <div
                  key={role}
                  className="flex items-center justify-between gap-5 border-b border-[var(--line)] py-5"
                >
                  <p className="type-title text-[1.05rem] text-[var(--ink)]">
                    <EditableText value={role} path={`roles.${index}`} />
                  </p>
                  <span className="type-meta shrink-0 text-[var(--muted)]">
                    <EditableText value="Confirm status" path="statusLabel" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-[var(--soft)] py-12 lg:py-16">
        <div className="section-shell flex flex-col gap-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <h2 className="type-display text-[clamp(1.65rem,3vw,2.25rem)] text-[var(--ink)]">
            <EditableText value="Ready to continue the conversation?" path="footerCta.title" />
          </h2>
          <Link href="/contact" className="btn-primary self-center sm:self-auto">
            <EditableText value="Contact Faith Associates" path="footerCta.label" /> →
          </Link>
        </div>
      </section>
      <SiteFooter settings={settings} />
    </main>
    </CmsPage>
  );
}
