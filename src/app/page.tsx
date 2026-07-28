import Link from "next/link";
import { ContactForm } from "./components/ContactForm";
import { FeaturedPublications } from "./components/FeaturedPublications";
import { GuidedSupportSection } from "./components/GuidedSupportSection";
import { NewsUpdatesCarousel } from "./components/NewsUpdatesCarousel";
import { RotatingHeroCopy } from "./components/RotatingHeroCopy";
import { ServicesCarousel, type ServiceSlide } from "./components/ServicesCarousel";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { WhatWeDoCarousel } from "./components/WhatWeDoCarousel";
import { WhoWeAreSection } from "./components/WhoWeAreSection";
import { CmsPage } from "./components/cms/CmsPage";
import { EditableText } from "./components/cms/EditableText";
import { getHomeBlocks } from "@/lib/cms/queries";
import { loadCmsPage } from "@/lib/cms/page-helpers";

const heroStories = [
  { label: "Mosque Security", href: "/projects/mosque-security" },
  { label: "Leadership Development", href: "/projects/faith-associates-academy" },
  { label: "International Networks", href: "/international" },
  { label: "Mosque Expo 2026", href: "/projects/mosque-expo", active: true },
];

const heroMessages = [
  {
    eyebrow: "Faith Associates 2026",
    title: "Raising standards for faith institutions.",
    body: "Practical support for mosques, madrassahs and community leaders.",
    ctaLabel: "Explore our work",
    href: "/projects",
  },
  {
    eyebrow: "Security and resilience",
    title: "Safer mosques. Stronger governance.",
    body: "Training, guidance and standards for places of worship.",
    ctaLabel: "See our services",
    href: "/services",
  },
  {
    eyebrow: "Leadership and networks",
    title: "Developing leaders and community impact.",
    body: "Programmes, partnerships and events that strengthen institutions.",
    ctaLabel: "View programmes",
    href: "/projects",
  },
];

const capabilities = [
  {
    title: "Institutional Development",
    body: "Governance, standards, leadership and practical support for mosques, madrassahs and faith charities.",
    icon: "institution" as const,
  },
  {
    title: "Protective Security",
    body: "Training, risk awareness and incident guidance for places of worship and community institutions.",
    icon: "security" as const,
  },
  {
    title: "Cohesion Programmes",
    body: "Sport, youth engagement and partnership programmes that build cohesion across communities.",
    icon: "cohesion" as const,
  },
  {
    title: "Global Networks",
    body: "International convening, research and knowledge sharing across faith institution leadership networks.",
    icon: "networks" as const,
  },
];

const services: ServiceSlide[] = [
  {
    title: "Inclusivity in Sports",
    image: "/assets/inclusivity-sport.png",
    href: "/sport",
    icon: "sport",
  },
  {
    title: "Security in Places of Worship",
    image: "/assets/real/security-training-session.jpg",
    href: "/projects/mosque-security",
    icon: "security",
  },
  {
    title: "Strategic Leadership Development",
    image: "/assets/real/who-we-are-training.jpg",
    href: "/projects/faith-associates-academy",
    icon: "leadership",
  },
  {
    title: "Environmental Practices",
    image: "/assets/environmental-practices.png",
    href: "/projects/eco-mosque",
    icon: "environment",
  },
];

const news = [
  {
    title: "Mosque Expo 2026 returns, uniting leaders and innovators",
    image: "/assets/real/mosque-expo-2024-hall.jpg",
    meta: "May 7, 2026 / Announcement",
    href: "/news/mosque-expo-2026",
  },
  {
    title: "Strengthening Mosque Resilience with Aston University",
    image: "/assets/real/faith-training-speaker.jpg",
    meta: "June 2, 2025 / Blog",
    href: "/news/mosque-resilience-aston",
  },
  {
    title: "Eco-Mosque Net Zero Conference for mosque leadership",
    image: "/assets/real/eco-mosque-conference.jpg",
    meta: "April 22, 2025 / Sustainability",
    href: "/news/eco-mosque-net-zero",
  },
];

export default async function Home() {
  const { settings, preferDraft } = await loadCmsPage("/");
  const blocks = await getHomeBlocks({ preferDraft });
  const cmsHeroStories = blocks.hero.stories;
  const cmsHeroMessages = blocks.hero.messages;
  const cmsCapabilities = blocks.whatWeDo.capabilities as typeof capabilities;
  const cmsServices = blocks.servicesCarousel.items as ServiceSlide[];
  const cmsNews = blocks.newsCarousel.items;

  return (
    <CmsPage path="/" blocks={blocks}>
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader settings={settings} />

      <section className="relative isolate h-[calc(100svh-76px)] overflow-hidden bg-[var(--navy)] text-white lg:h-[100svh]">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={blocks.hero.poster}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        >
          <source src={blocks.hero.video} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,19,29,0.88)_0%,rgba(7,19,29,0.55)_48%,rgba(7,19,29,0.35)_100%)]" />
        <div className="relative z-10 flex h-full flex-col justify-center px-5 py-0 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <RotatingHeroCopy items={cmsHeroMessages} align="left" layout="immersive" />

          <div className="mt-8 hidden items-end justify-between gap-5 pt-4 text-center sm:mt-10 sm:gap-6 lg:absolute lg:inset-x-12 lg:bottom-8 lg:flex lg:text-left xl:inset-x-16 2xl:inset-x-20">
            <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 text-white/54 lg:grid-cols-4 lg:gap-8">
              {cmsHeroStories.map((story) => (
                <Link
                  key={story.label}
                  href={story.href}
                  className={`group type-title border-t pt-3 text-sm transition duration-300 hover:text-white sm:text-[0.95rem] ${
                    story.active
                      ? "border-[var(--blue-light)] text-white"
                      : "border-white/20 text-white/55 hover:border-white/55"
                  }`}
                >
                  {story.label}
                </Link>
              ))}
            </div>
            <div className="hidden items-center gap-3 text-sm text-white/60 lg:flex">
              <span className="type-meta tracking-[0.18em] text-white/45">Scroll</span>
              <span aria-hidden="true" className="text-white/45">↓</span>
            </div>
          </div>
        </div>
      </section>

      <section id="international" className="bg-white py-12 sm:py-16 lg:py-24">
        <div className="section-shell">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="type-display text-[clamp(1.7rem,3.2vw,2.5rem)] text-[var(--ink)]">
              <EditableText value={blocks.whatWeDo.title} path="whatWeDo.title" />
            </h2>
            <p className="type-body mt-4 text-[var(--muted)] lg:text-[1.05rem]">
              <EditableText value={blocks.whatWeDo.body} path="whatWeDo.body" multiline />
            </p>
          </div>
          <WhatWeDoCarousel items={cmsCapabilities} />
        </div>
      </section>

      <GuidedSupportSection content={blocks.guidedSupport} />

      <WhoWeAreSection content={blocks.whoWeAre} />

      <section id="services" className="bg-white py-12 lg:py-20">
        <div className="section-shell">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <div>
              <p className="type-eyebrow text-[var(--blue)]">What we deliver</p>
              <h2 className="type-display mt-3 text-[clamp(1.85rem,3.6vw,2.75rem)] text-[var(--ink)]">
                <EditableText value={blocks.servicesCarousel.title} path="servicesCarousel.title" />
              </h2>
            </div>
            <p className="type-body max-w-md text-[var(--muted)] lg:text-[1.05rem]">
              <EditableText value={blocks.servicesCarousel.body} path="servicesCarousel.body" multiline />
            </p>
          </div>
          <ServicesCarousel items={cmsServices} />
        </div>
      </section>

      <section id="projects" className="scroll-mt-8 bg-[var(--soft)] py-12 lg:py-20">
        <div className="section-shell">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <div>
              <p className="type-eyebrow text-[var(--blue)]">Latest updates</p>
              <h2 className="type-display mt-3 text-[clamp(1.85rem,3.6vw,2.75rem)] text-[var(--ink)]">
                <EditableText value={blocks.newsCarousel.title} path="newsCarousel.title" />
              </h2>
            </div>
            <Link
              href="/news"
              className="type-cta inline-flex items-center justify-center gap-2 text-[var(--blue)] transition duration-300 hover:text-[var(--blue-dark)]"
            >
              View all news
              <svg aria-hidden="true" className="size-4 shrink-0" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 8h7M8.5 3.5 13 8l-4.5 4.5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                />
              </svg>
            </Link>
          </div>
          <NewsUpdatesCarousel items={cmsNews} />
        </div>
      </section>

      <FeaturedPublications content={blocks.featuredPublications} />

      <section id="contact" className="bg-[var(--soft)] py-12 text-[var(--ink)] lg:py-20">
        <div className="section-shell">
          <div className="grid gap-10 text-center lg:grid-cols-[0.42fr_0.58fr] lg:items-start lg:gap-16 lg:text-left">
            <div>
              <p className="type-eyebrow text-[var(--blue)]">Get in touch</p>
              <h2 className="type-display mt-4 text-[clamp(1.85rem,3.6vw,2.75rem)]">
                Start a conversation.
              </h2>
              <p className="type-body mx-auto mt-4 max-w-md text-[var(--muted)] lg:mx-0 lg:text-[1.05rem]">
                Tell us what your institution needs and the team will come back with the right next step.
              </p>

              <div className="mx-auto mt-8 flex max-w-sm flex-col gap-6 text-sm text-[var(--muted)] sm:max-w-none lg:mx-0">
                <div>
                  <p className="type-meta text-[var(--blue)]">Address</p>
                  <p className="type-body mt-2">
                    41 Baker Street
                    <br />
                    High Wycombe, HP11 2RZ
                  </p>
                </div>
                <div>
                  <p className="type-meta text-[var(--blue)]">Contact</p>
                  <p className="type-body mt-2">
                    <a href="tel:+441494416202" className="font-medium text-[var(--ink)] transition duration-300 hover:text-[var(--blue)]">
                      +44 (0)1494 416202
                    </a>
                  </p>
                  <p className="type-body mt-1 hidden sm:block">Use the form for quotes, partnerships and consultations.</p>
                </div>
              </div>
            </div>

            <div className="w-full max-w-[820px] justify-self-center lg:justify-self-end">
              <div className="border border-[var(--line)] bg-white px-6 py-8 text-center sm:hidden">
                <p className="type-body text-sm text-[var(--muted)]">
                  Ready to talk? Open the contact form for quotes, partnerships and consultations.
                </p>
                <Link href="/contact" className="btn-primary mt-6 w-full">
                  Open contact form
                </Link>
              </div>
              <div className="hidden sm:block">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter settings={settings} />
    </main>
    </CmsPage>
  );
}
