import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EditorialHero } from "../components/EditorialHero";
import { RotatingImageBox } from "../components/RotatingImageBox";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "About Us | Faith Associates",
  description:
    "Learn how Faith Associates builds governance, resilience, leadership and practical standards across faith institutions.",
};

const milestones = [
  {
    year: "Since 2004",
    title: "A purposeful start",
    body: "Faith Associates was established to support ethnic minority faith-based communities with practical, non-theological consultancy.",
  },
  {
    year: "2008 - 2016",
    title: "Standards development",
    body: "Governance, leadership and institutional development programmes expanded across mosques, madrassahs and community organisations.",
  },
  {
    year: "2017 - 2022",
    title: "Security and resilience",
    body: "Training, research, safeguarding and risk guidance strengthened how places of worship respond to evolving threats.",
  },
  {
    year: "2023 - 2026",
    title: "Global partnerships",
    body: "Events, sector networks and flagship platforms connected national work to wider international learning and collaboration.",
  },
];

const coreFocusAreas = [
  "Governance and standards",
  "Security and resilience",
  "Leadership and training",
];

const valueCards = [
  {
    title: "Experience and expertise",
    body: "Two decades of sector-specific consultancy focused on faith institutions, governance and service delivery.",
    icon: "experience" as const,
  },
  {
    title: "Strategic guidance",
    body: "From risk planning to programme design, we help institutions move from uncertainty to clear action.",
    icon: "strategy" as const,
  },
  {
    title: "Community focused",
    body: "Our work is grounded in the realities of mosques, madrassahs, charities and local leadership teams.",
    icon: "community" as const,
  },
  {
    title: "Safeguarding leadership",
    body: "Policies, training and practical implementation support that strengthens everyday safety and accountability.",
    icon: "safeguarding" as const,
  },
  {
    title: "Research and insight",
    body: "We combine field learning, partner perspectives and evidence to shape stronger institutional decisions.",
    icon: "research" as const,
  },
  {
    title: "Global networks",
    body: "Faith Associates connects leaders, practitioners and sector partners across the UK and internationally.",
    icon: "networks" as const,
  },
];

const impactStats = [
  { value: "5000+", label: "mosques supported" },
  { value: "3467+", label: "madrassahs engaged" },
  { value: "20000+", label: "people trained" },
  { value: "20+", label: "years of impact" },
];

const trustMarks = [
  "Beacon Mosque",
  "Mosque Security",
  "Faith Associates Academy",
  "Mosque Expo",
  "MEET",
  "Eco Mosque",
];

const networkImages = [
  {
    src: "/assets/real/fa-20-years-collage.jpg",
    alt: "Faith Associates collage of community programmes and sector events",
  },
  {
    src: "/assets/real/faith-training-speaker.jpg",
    alt: "Faith Associates speaking at a partner event",
  },
  {
    src: "/assets/real/mosque-expo-awards-hall.jpg",
    alt: "Faith Associates event audience and sector gathering",
  },
];

const archiveImages = [
  {
    src: "/assets/wp-about/MG_2346.jpg",
    alt: "Faith Associates audience attending a community leadership presentation",
  },
  {
    src: "/assets/wp-about/Faith-Associates-2005-2025-scaled-e1750413022356.jpg",
    alt: "Faith Associates 2005 to 2025 collage of programmes, partnerships and community events",
  },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-4 shrink-0" viewBox="0 0 16 16" fill="none">
      <path
        d="M4 8h7M8.5 3.5 13 8l-4.5 4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function MiniCheckIcon() {
  return (
    <svg aria-hidden="true" className="size-3.5" viewBox="0 0 16 16" fill="none">
      <path d="m3 8 3 3 7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function ValueIcon({ type }: { type: (typeof valueCards)[number]["icon"] }) {
  const common = {
    className: "size-4",
    viewBox: "0 0 16 16",
    fill: "none" as const,
    "aria-hidden": true as const,
  };

  let mark = (
    <path
      d="M8 3.25 11.75 5v3c0 2.2-1.5 4.1-3.75 4.85C5.75 12.1 4.25 10.2 4.25 8V5L8 3.25Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.3"
    />
  );

  if (type === "experience") {
    mark = (
      <>
        <path d="M4 13V6.5L8 4l4 2.5V13" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M6.5 13v-3h3v3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </>
    );
  } else if (type === "strategy") {
    mark = (
      <>
        <path d="M3.5 11.5 6 9l2.2 2.2L12.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 5H12.5V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  } else if (type === "community") {
    mark = (
      <>
        <circle cx="6" cy="5.5" r="1.6" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="10.5" cy="5.5" r="1.6" stroke="currentColor" strokeWidth="1.3" />
        <path
          d="M3.2 12c.5-1.8 1.8-2.8 2.8-2.8S8.3 10.2 8.8 12M8.5 12c.5-1.8 1.8-2.8 2.8-2.8s2.3 1 2.8 2.8"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </>
    );
  } else if (type === "safeguarding") {
    mark = (
      <>
        <path
          d="M8 2.75 12.25 4.5v3.1c0 2.4-1.7 4.5-4.25 5.3C5.45 12.1 3.75 10 3.75 7.6V4.5L8 2.75Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path d="m6.2 7.6 1.3 1.3 2.4-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </>
    );
  } else if (type === "research") {
    mark = (
      <>
        <circle cx="7" cy="7" r="3.25" stroke="currentColor" strokeWidth="1.3" />
        <path d="m9.4 9.4 3.1 3.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </>
    );
  } else {
    mark = (
      <>
        <circle cx="8" cy="8" r="4.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M3.5 8h9M8 3.5c1.4 1.3 2.1 2.8 2.1 4.5S9.4 11.2 8 12.5C6.6 11.2 5.9 9.7 5.9 8S6.6 4.8 8 3.5Z" stroke="currentColor" strokeWidth="1.3" />
      </>
    );
  }

  return (
    <span className="inline-flex size-9 shrink-0 items-center justify-center border border-[var(--line)] text-[var(--blue)]">
      <svg {...common}>{mark}</svg>
    </span>
  );
}

export default function AboutPage() {
  return (
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader />

      <EditorialHero
        eyebrow="About Faith Associates"
        title="Two decades of practical faith institution support."
        summary="Governance, security, leadership and sector partnerships shaped around real community needs."
        image="/assets/real/hero-law-society-poster.jpg"
        primaryLabel="Explore our story"
        primaryHref="#mission"
        secondaryLabel="Contact the team"
        secondaryHref="/contact"
      />

      <section id="mission" className="grid scroll-mt-8 lg:grid-cols-2">
        <div className="flex flex-col justify-center bg-[var(--soft)] px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20 xl:px-16">
          <div className="max-w-xl">
            <p className="type-eyebrow text-[var(--blue)]">Welcome to Faith Associates</p>
            <h2 className="type-display mt-5 text-[clamp(1.75rem,4vw,2.65rem)] text-[var(--ink)]">
              Our focus is on helping faith institutions lead with confidence.
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Let&apos;s develop together <ArrowIcon />
              </Link>
              <Link
                href="/services"
                className="btn-secondary border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white"
              >
                View all services
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center bg-white px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20 xl:px-16">
          <div className="max-w-xl">
            <p className="type-body text-[var(--muted)]">
              Faith Associates was founded in 2004 as a non-theological consultancy serving ethnic minority
              faith-based communities. Our work brings research, training, advice and implementation guidance
              together so institutions can make better decisions under real-world pressure.
            </p>
            <p className="type-body mt-5 text-[var(--muted)]">
              We support mosques, madrassahs, charities and sector partners with governance, safeguarding,
              strategic leadership, protective security and community development. The goal is practical change,
              not abstract theory.
            </p>

            <div className="mt-10 border-t border-[var(--line)] pt-8">
              <h3 className="type-title text-[1.35rem] text-[var(--ink)] sm:text-[1.5rem]">Our mission.</h3>
              <p className="type-body mt-4 text-[var(--muted)]">
                We help faith institutions turn complexity into capability by combining specialist knowledge,
                partnership working and grounded sector understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="history" className="scroll-mt-8 bg-[var(--navy)] text-white">
        <div className="relative h-[280px] sm:h-[360px] lg:h-[440px]">
          <Image
            src="/assets/real/mosque-expo-awards-hall.jpg"
            alt="Faith Associates event and community gathering"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,13,20,0.1),rgba(8,13,20,0.28))]" />
        </div>

        <div className="section-shell relative px-8 py-10 sm:px-0 lg:py-12">
          <div className="grid gap-10 lg:grid-cols-4 lg:gap-12">
            {milestones.map((item) => (
              <article key={item.title} className="border-t border-white/12 pt-5">
                <p className="type-meta text-white/40">{item.year}</p>
                <h3 className="type-title mt-3 text-[1.05rem] text-white sm:text-[1.15rem]">{item.title}</h3>
                <p className="type-body mt-4 text-sm text-white/58">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--soft)] py-20 lg:py-24">
        <div className="section-shell">
          <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="media-frame relative min-h-[420px]">
              <Image
                src="/assets/real/about-fa-training-room.png"
                alt="Faith Associates training session"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>

            <div className="max-w-2xl">
              <p className="type-eyebrow text-[var(--blue)]">
                Why choose Faith Associates
              </p>
              <h2 className="type-display mt-4 max-w-[32ch] text-[clamp(1.65rem,3.2vw,2.35rem)] text-[var(--ink)]">
                We build practical solutions for faith institutions.
              </h2>
              <p className="type-body mt-6 max-w-xl text-[var(--muted)]">
                Our consultancy combines policy understanding, community trust, programme delivery and sector
                experience. That lets us design responses that are credible on paper and workable in practice.
              </p>

              <div className="mt-10 border-t border-[var(--line)]">
                {coreFocusAreas.map((item, index) => (
                  <div key={item} className="flex items-center gap-5 border-b border-[var(--line)] py-5">
                    <span className="capability-index">0{index + 1}</span>
                    <span className="type-title text-sm text-[var(--ink)]">{item}</span>
                  </div>
                ))}
              </div>

              <Link href="/contact" className="btn-primary mt-10">
                Discover more
              </Link>
            </div>
          </div>

          <div className="mt-16 border-t border-[var(--line)] pt-10">
            <div className="grid gap-x-10 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
              {valueCards.map((item) => (
                <article key={item.title} className="flex gap-4">
                  <ValueIcon type={item.icon} />
                  <div>
                    <h3 className="type-title text-[1.05rem] text-[var(--ink)] sm:text-[1.15rem]">
                      {item.title}
                    </h3>
                    <p className="type-body mt-3 text-sm text-[var(--muted)]">{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--soft)] py-8">
        <div className="section-shell grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {impactStats.map((item) => (
            <article key={item.label} className="flex items-center gap-4">
              <span className="inline-flex size-9 items-center justify-center border border-[var(--line)] bg-white text-[var(--ink)]">
                <MiniCheckIcon />
              </span>
              <div>
                <p className="type-display text-[clamp(1.75rem,3.2vw,2.5rem)] text-[var(--ink)]">
                  {item.value}
                </p>
                <p className="type-meta mt-1 text-[var(--muted)]">
                  {item.label}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="network" className="scroll-mt-8 overflow-hidden bg-white py-20">
        <div>
          <div className="bg-[var(--navy)] py-12 text-white sm:py-14 lg:py-16">
            <div className="section-shell">
              <p className="type-eyebrow text-white/45">
                The Faith Associates network
              </p>
              <h2 className="type-display mt-4 max-w-[18ch] text-[clamp(1.75rem,4.8vw,2.85rem)] text-white">
                The people, partners and platforms behind our work.
              </h2>
              <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <Link
                  href="/projects"
                  className="btn-primary bg-white text-[var(--navy)] hover:bg-[var(--red)] hover:text-white"
                >
                  View our programmes
                </Link>
                <Link
                  href="/contact"
                  className="btn-secondary border-white text-white hover:bg-white hover:text-[var(--navy)]"
                >
                  Become part of our story <ArrowIcon />
                </Link>
              </div>

              <div className="mt-10 grid gap-4 border-t border-white/10 pt-6 type-meta text-white/66 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                {[
                  "We are always dedicated to our work",
                  "Sector specialists with lived understanding",
                  "Practical standards you can trust",
                  "National and international reach",
                ].map((item) => (
                  <span key={item} className="inline-flex items-start gap-2.5">
                    <span className="mt-0.5 shrink-0 text-[#7fda9e]">
                      <MiniCheckIcon />
                    </span>
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="section-shell py-10 sm:py-12">
            <RotatingImageBox images={networkImages} />
          </div>
        </div>
      </section>

      <section id="partners" className="scroll-mt-8 bg-white py-20 lg:py-24">
        <div className="section-shell grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div className="media-frame relative min-h-[360px]">
            <Image
              src="/assets/real/law-24.jpg"
              alt="Faith Associates partner gathering"
              fill
              sizes="(max-width: 1024px) 100vw, 34vw"
              className="object-cover"
            />
            <span className="absolute bottom-6 right-6 inline-flex size-14 items-center justify-center border border-[var(--line)] bg-white/90 type-title text-sm text-[var(--ink)]">
              20+
            </span>
          </div>

          <div className="pt-3">
            <h2 className="type-display text-[clamp(1.75rem,4.8vw,2.85rem)] text-[var(--ink)]">
              Partnership built around context.
            </h2>
            <div className="accent-rule mt-5" />
            <p className="type-body mt-8 max-w-2xl text-lg text-[var(--muted)]">
              Our strongest work is collaborative. We bring sector knowledge and a clear delivery method; partners bring the institutional context, lived experience and relationships that make change sustainable.
            </p>
            <p className="type-body mt-5 max-w-2xl text-sm text-[var(--muted)]">
              That approach has supported long-term relationships across faith institutions, civil society, government, technology, sport and international development.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white pb-24">
        <div className="section-shell border-t border-[var(--line)] pt-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="type-display text-[clamp(1.75rem,4.8vw,2.85rem)] text-[var(--ink)]">
                Clients trust Faith Associates.
              </h2>
            </div>
            <p className="type-body max-w-md text-sm text-[var(--muted)]">
              We support institutions with tailored consultancy, training, platform development and long-term
              partnership across the faith sector.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {trustMarks.map((item) => (
              <div
                key={item}
                className="flex min-h-[78px] items-center justify-center border border-[var(--line)] px-4 text-center type-title text-sm text-[var(--muted)]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--soft)] py-16 lg:py-20">
        <div className="section-shell relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-10">
          <div>
            <p className="type-eyebrow text-[var(--blue)]">Next step</p>
            <h2 className="type-display mt-4 max-w-[14ch] text-[clamp(1.7rem,3.6vw,2.45rem)] text-[var(--ink)]">
              Let&apos;s develop together.
            </h2>
            <p className="type-body mt-5 max-w-[36ch] text-[var(--muted)] lg:text-[1.05rem]">
              From local institutional development to national sector platforms, Faith Associates helps communities
              act with greater confidence, structure and purpose.
            </p>
            <Link href="/contact" className="btn-primary mt-8">
              Start a conversation <ArrowIcon />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {archiveImages.map((image) => (
              <div
                key={image.src}
                className="media-frame relative aspect-[5/6] sm:aspect-[4/5]"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1024px) 45vw, 28vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,24,38,0.02),rgba(10,24,38,0.14))]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
