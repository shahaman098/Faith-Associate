import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "./components/ContactForm";
import { FeaturedPublications } from "./components/FeaturedPublications";
import { GuidedSupportSection } from "./components/GuidedSupportSection";
import { NewsUpdatesCarousel } from "./components/NewsUpdatesCarousel";
import { RotatingHeroCopy } from "./components/RotatingHeroCopy";
import { ServicesCarousel, type ServiceSlide } from "./components/ServicesCarousel";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { WhatWeDoCarousel, type CapabilityItem } from "./components/WhatWeDoCarousel";
import { WhoWeAreSection } from "./components/WhoWeAreSection";
import { CmsPage } from "./components/cms/CmsPage";
import { ArrowIcon } from "./components/icons";
import { EditableHeroMedia } from "./components/cms/EditableHeroMedia";
import { EditableText } from "./components/cms/EditableText";
import type { HomeBlocks } from "@/lib/cms/types";
import { getHomeBlocks } from "@/lib/cms/queries";
import { loadCmsPage } from "@/lib/cms/page-helpers";

export default async function Home() {
  const { settings, preferDraft } = await loadCmsPage("/");
  const blocks = await getHomeBlocks({ preferDraft });
  const cmsHeroStories = blocks.hero.stories;
  const cmsHeroMessages = blocks.hero.messages;
  const cmsCapabilities = blocks.whatWeDo.capabilities.map((item) => ({
    ...item,
    icon:
      item.icon === "institution" ||
      item.icon === "security" ||
      item.icon === "cohesion" ||
      item.icon === "networks"
        ? item.icon
        : "institution",
  })) as CapabilityItem[];
  const cmsServices = blocks.servicesCarousel.items as ServiceSlide[];
  const cmsNews = blocks.newsCarousel.items as HomeBlocks["newsCarousel"]["items"];

  return (
    <CmsPage path="/" blocks={blocks}>
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader settings={settings} />

      <section className="relative isolate h-[calc(100svh-76px)] overflow-hidden bg-[var(--navy)] text-white lg:h-[100svh]">
        <EditableHeroMedia video={blocks.hero.video} poster={blocks.hero.poster} />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(115deg,rgba(7,19,29,0.88)_0%,rgba(7,19,29,0.55)_48%,rgba(7,19,29,0.35)_100%)]" />
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

      <section id="international" className="band band-white">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-16">
            <div>
              <p className="type-eyebrow text-[var(--blue)]">What we do</p>
              <h2 className="type-display mt-4 max-w-[16ch] text-[clamp(1.9rem,3.6vw,3rem)] text-[var(--ink)]">
                <EditableText value={blocks.whatWeDo.title} path="whatWeDo.title" />
              </h2>
              <div className="rule-red mt-6" />
            </div>
            <p className="type-body max-w-[40rem] text-[1.02rem] text-[var(--muted)] lg:text-[1.12rem]">
              <EditableText value={blocks.whatWeDo.body} path="whatWeDo.body" multiline />
            </p>
          </div>
          <WhatWeDoCarousel items={cmsCapabilities} />
        </div>
      </section>

      <section className="bg-[#020b19] py-10 text-white sm:py-12 lg:py-14">
        <div className="section-shell">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)]">
            <div>
              <p className="type-eyebrow text-[#00d1c2]">Interest registration open</p>
              <h2 className="type-display mt-3 max-w-2xl text-[clamp(2.25rem,4vw,3.625rem)] uppercase text-white">
                Mosque &amp; Madrassah Hackathon
              </h2>
              <p className="type-body mt-5 max-w-2xl text-[1.05rem] text-white/85">
                A three-day build bringing teams together to shape practical digital tools for mosques, madrassahs,
                Islamic charities, scholars, and community institutions.
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <span className="border border-[#00d1c2]/60 bg-[#00d1c2]/10 px-3 py-2 text-sm font-bold uppercase">
                  27-29 November
                </span>
                <span className="border border-[#00d1c2]/60 bg-[#00d1c2]/10 px-3 py-2 text-sm font-bold uppercase">
                  London
                </span>
              </div>
              <ul className="mt-6 grid gap-2.5 text-[0.95rem] text-white/85">
                <li className="border-l-[3px] border-[#00d1c2] pl-3">
                  <strong className="text-white">Day 1:</strong> Kickoff
                </li>
                <li className="border-l-[3px] border-[#00d1c2] pl-3">
                  <strong className="text-white">Day 2:</strong> Build &amp; Mentor Sessions
                </li>
                <li className="border-l-[3px] border-[#00d1c2] pl-3">
                  <strong className="text-white">Day 3:</strong> Demo Day &amp; Awards
                </li>
              </ul>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <a
                  href="https://luma.com/bgovi683"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center bg-[#00d1c2] px-5 py-3 text-sm font-bold uppercase text-[#001423] transition duration-300 hover:bg-white"
                >
                  Register interest
                </a>
                <a
                  href="https://mosqueexpo.com/hackathon/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-cta text-white underline underline-offset-4 transition duration-300 hover:text-[#00d1c2]"
                >
                  View hackathon page
                </a>
              </div>
            </div>

            <a
              href="https://luma.com/bgovi683"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Register interest for Mosque and Madrassah Hackathon"
              className="block border border-white/20 bg-white/5 p-2.5 transition duration-300 hover:border-[#00d1c2]"
            >
              <Image
                src="/assets/mosque-madrassah-hackathon-official-banner.png"
                alt="Mosque and Madrassah Hackathon official banner, 27 to 29 November in London"
                width={560}
                height={560}
                className="h-auto w-full"
              />
            </a>
          </div>
        </div>
      </section>

      <GuidedSupportSection content={blocks.guidedSupport} />

      <WhoWeAreSection content={blocks.whoWeAre} />

      <section id="services" className="band band-white band-rule">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-16">
            <div>
              <p className="type-eyebrow text-[var(--blue)]">Key strategic services</p>
              <h2 className="type-display mt-4 max-w-[16ch] text-[clamp(1.9rem,3.6vw,3rem)] text-[var(--ink)]">
                <EditableText value={blocks.servicesCarousel.title} path="servicesCarousel.title" />
              </h2>
              <div className="rule-red mt-6" />
            </div>
            <div className="max-w-[40rem]">
              <p className="type-body text-[1.02rem] text-[var(--muted)] lg:text-[1.12rem]">
                <EditableText value={blocks.servicesCarousel.body} path="servicesCarousel.body" multiline />
              </p>
              <Link href="/services" className="btn-primary mt-6 w-full sm:w-auto">
                Browse all services <ArrowIcon />
              </Link>
            </div>
          </div>
          <ServicesCarousel items={cmsServices} />
        </div>
      </section>

      <section id="projects" className="band band-soft scroll-mt-8">
        <div className="section-shell">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
            <div>
              <p className="type-eyebrow text-[var(--blue)]">News &amp; events</p>
              <h2 className="type-display mt-4 max-w-[18ch] text-[clamp(1.9rem,3.6vw,3rem)] text-[var(--ink)]">
                <EditableText value={blocks.newsCarousel.title} path="newsCarousel.title" />
              </h2>
              <div className="rule-red mt-6" />
            </div>
            <Link
              href="/news"
              className="type-cta inline-flex shrink-0 items-center gap-2 text-[var(--blue)] transition duration-300 hover:text-[var(--blue-dark)]"
            >
              View all news <ArrowIcon />
            </Link>
          </div>
          <NewsUpdatesCarousel items={cmsNews} />
        </div>
      </section>

      <FeaturedPublications content={blocks.featuredPublications} />

      {/* Dark closing band: proof + a real job (contact the team) */}
      <section id="contact" className="band band-navy">
        <div className="section-shell">
          <div className="grid gap-10 lg:grid-cols-[0.48fr_0.52fr] lg:items-start lg:gap-16">
            <div>
              <p className="type-eyebrow">Get in touch</p>
              <h2 className="type-display mt-4 max-w-[14ch] text-[clamp(2.1rem,4.4vw,3.5rem)] text-white">
                Start a conversation.
              </h2>
              <div className="rule-red mt-6" />
              <p className="type-body mt-6 max-w-[34rem] text-[1.05rem]">
                Tell us what your institution needs and the team will come back with the right next
                step.
              </p>

              <div className="mt-10 grid gap-px bg-white/12 sm:grid-cols-2">
                <div className="bg-[var(--navy)] py-5 pr-5 sm:px-5">
                  <p className="type-meta">Address</p>
                  <p className="type-body mt-2 text-[1rem]">
                    41 Baker Street
                    <br />
                    High Wycombe, HP11 2RZ
                  </p>
                </div>
                <div className="bg-[var(--navy)] py-5 pr-5 sm:px-5">
                  <p className="type-meta">Contact</p>
                  <p className="mt-2">
                    <a
                      href="tel:+441494416202"
                      className="type-title text-[1.15rem] text-white transition duration-300 hover:text-[var(--blue-light)]"
                    >
                      +44 (0)1494 416202
                    </a>
                  </p>
                  <p className="type-body mt-1 text-[0.95rem]">
                    Quotes, partnerships and consultations.
                  </p>
                </div>
              </div>

              <Link href="/contact" className="btn-secondary mt-8 w-full text-white hover:bg-white hover:text-[var(--navy)] sm:w-auto">
                Full contact details <ArrowIcon />
              </Link>
            </div>

            <div className="panel-frame w-full">
              <div className="panel-frame__head">
                <p className="type-eyebrow text-[var(--blue-light)]">Enquiry form</p>
                <p className="type-title mt-2 text-[1.25rem] text-white">
                  Tell us about your institution
                </p>
              </div>
              <div className="panel-frame__body bg-white text-[var(--ink)]">
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
