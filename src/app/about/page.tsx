import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RotatingHeroCopy } from "../components/RotatingHeroCopy";
import { RotatingImageBox } from "../components/RotatingImageBox";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "About Us | Faith Associates",
  description:
    "Learn how Faith Associates builds governance, resilience, leadership and practical standards across faith institutions.",
};

const heroStories = [
  { label: "Our Mission", href: "#mission", active: true },
  { label: "Organisation History", href: "#history" },
  { label: "Our Network", href: "#network" },
  { label: "Partner Trust", href: "#partners" },
];

const heroMessages = [
  {
    eyebrow: "About Faith Associates",
    title: "Two decades of practical faith institution support.",
    body: "Governance, security, leadership and sector partnerships shaped around real community needs.",
    ctaLabel: "Explore our story",
    href: "#mission",
  },
];

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

const scoreBars = [
  { label: "Governance and standards", value: 95 },
  { label: "Security and resilience", value: 92 },
  { label: "Leadership and training", value: 96 },
];

const valueCards = [
  {
    title: "Experience and expertise",
    body: "Two decades of sector-specific consultancy focused on faith institutions, governance and service delivery.",
  },
  {
    title: "Strategic guidance",
    body: "From risk planning to programme design, we help institutions move from uncertainty to clear action.",
  },
  {
    title: "Community focused",
    body: "Our work is grounded in the realities of mosques, madrassahs, charities and local leadership teams.",
  },
  {
    title: "Safeguarding leadership",
    body: "Policies, training and practical implementation support that strengthens everyday safety and accountability.",
  },
  {
    title: "Research and insight",
    body: "We combine field learning, partner perspectives and evidence to shape stronger institutional decisions.",
  },
  {
    title: "Global networks",
    body: "Faith Associates connects leaders, practitioners and sector partners across the UK and internationally.",
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

const footerServices = [
  "Governance and standards",
  "Protective security",
  "Leadership development",
  "Research and safeguarding",
];

const footerLinks = ["About us", "Services", "International", "Contact us"];

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
    src: "/assets/real/security-training-session.jpg",
    alt: "Faith Associates delivering a training session",
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
    aspectClassName: "aspect-[1.08/1]",
  },
  {
    src: "/assets/wp-about/Faith-Associates-2005-2025-scaled-e1750413022356.jpg",
    alt: "Faith Associates 2005 to 2025 collage of programmes, partnerships and community events",
    aspectClassName: "aspect-[1.75/1]",
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

function ValueIcon() {
  return (
    <span className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--line)] text-[var(--ink)]">
      <svg aria-hidden="true" className="size-4" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 3.25 11.75 5v3c0 2.2-1.5 4.1-3.75 4.85C5.75 12.1 4.25 10.2 4.25 8V5L8 3.25Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.3"
        />
      </svg>
    </span>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader />

      <section className="relative isolate min-h-[500px] overflow-hidden bg-[#07131d] text-white sm:min-h-[560px] lg:min-h-[680px] lg:pt-22">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/assets/real/hero-law-society-poster.jpg"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-72"
        >
          <source src="/assets/real/hero-law-society.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,11,20,0.7),rgba(4,11,20,0.32)_44%,rgba(4,11,20,0.54))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_36%,rgba(255,130,31,0.42),transparent_20%),radial-gradient(circle_at_22%_40%,rgba(214,55,144,0.38),transparent_22%),radial-gradient(circle_at_56%_34%,rgba(92,103,255,0.22),transparent_18%),radial-gradient(circle_at_72%_56%,rgba(255,122,52,0.24),transparent_20%),radial-gradient(circle_at_48%_78%,rgba(195,55,210,0.18),transparent_16%)] opacity-72" />
        <div className="absolute inset-y-0 left-0 w-[56%] bg-[linear-gradient(90deg,rgba(4,12,22,0.68),rgba(4,12,22,0.08),transparent)]" />
        <div className="relative z-10 flex min-h-[500px] flex-col justify-between px-5 pb-6 pt-0 sm:min-h-[560px] sm:px-8 lg:min-h-[560px] lg:px-12 lg:pb-7 lg:pt-8 xl:px-16 2xl:px-20">
          <RotatingHeroCopy items={heroMessages} />

          <div className="mt-6 flex items-end justify-between gap-5 border-t border-white/14 pt-3 text-center sm:mt-8 sm:gap-6 sm:pt-4 lg:text-left">
            <div className="grid flex-1 grid-cols-2 gap-3 text-white/54 sm:gap-4 lg:grid-cols-4">
              {heroStories.map((story) => (
                <a
                  key={story.label}
                  href={story.href}
                  className={`group pt-2 text-sm font-bold tracking-[-0.03em] transition hover:text-white sm:pt-3 sm:text-base ${
                    story.active ? "text-white" : ""
                  }`}
                >
                  <span className={`mx-auto mb-2 block h-1 w-16 transition sm:mb-4 sm:w-28 lg:mx-0 lg:w-32 ${
                    story.active ? "bg-[var(--red)]" : "bg-white/10 group-hover:bg-white/30"
                  }`} />
                  {story.label}
                </a>
              ))}
            </div>
            <div className="hidden items-center gap-5 text-sm text-white/72 lg:flex">
              <span>Scroll</span>
              <span className="inline-flex size-11 items-center justify-center rounded-full border border-white/28">
                <svg aria-hidden="true" className="size-5" viewBox="0 0 16 16" fill="none">
                  <path d="m3.5 6 4.5 4.5L12.5 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="mission" className="grid scroll-mt-8 lg:grid-cols-2">
        <div className="relative overflow-hidden bg-[#f4f1eb] px-8 py-16 sm:px-12 lg:px-16 lg:py-24">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden">
            <div className="absolute -right-20 top-[-18%] size-[420px] rounded-full border border-[rgba(7,26,63,0.08)]" />
            <div className="absolute right-28 top-12 size-[260px] rounded-full border border-[rgba(7,26,63,0.07)]" />
          </div>
          <p className="relative text-[11px] font-extrabold uppercase tracking-[0.28em] text-[var(--muted)]">
            Welcome to Faith Associates
          </p>
          <h2 className="relative mt-28 max-w-[12ch] font-sans text-4xl font-semibold leading-tight tracking-[-0.05em] text-[var(--ink)] sm:text-5xl">
            Our focus is on helping faith institutions lead with confidence.
          </h2>
          <div className="relative mt-10 flex flex-wrap gap-4">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#101b27] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[var(--blue)]"
            >
              Let&apos;s develop together <ArrowIcon />
            </Link>
            <Link
              href="/#services"
              className="inline-flex items-center rounded-full border border-[var(--line)] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--ink)] transition hover:border-[var(--ink)]"
            >
              View all services
            </Link>
          </div>
        </div>

        <div className="bg-white px-8 py-16 sm:px-12 lg:px-16 lg:py-24">
          <p className="max-w-xl text-sm leading-8 text-[var(--muted)]">
            Faith Associates was founded in 2004 as a non-theological consultancy serving ethnic minority
            faith-based communities. Our work brings research, training, advice and implementation guidance
            together so institutions can make better decisions under real-world pressure.
          </p>
          <p className="mt-6 max-w-xl text-sm leading-8 text-[var(--muted)]">
            We support mosques, madrassahs, charities and sector partners with governance, safeguarding,
            strategic leadership, protective security and community development. The goal is practical change,
            not abstract theory.
          </p>

          <div className="mt-14 max-w-lg border-t border-[var(--line)] pt-10">
            <h3 className="font-sans text-2xl font-semibold tracking-[-0.04em] text-[var(--ink)]">
              Our mission.
            </h3>
            <p className="mt-5 text-sm leading-8 text-[var(--muted)]">
              We help faith institutions turn complexity into capability by combining specialist knowledge,
              partnership working and grounded sector understanding.
            </p>
          </div>
        </div>
      </section>

      <section id="history" className="scroll-mt-8 bg-[#111b27] text-white">
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
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">{item.year}</p>
                <h3 className="mt-3 font-sans text-lg font-semibold tracking-[-0.03em] text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/58">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#faf8f4] py-20 lg:py-24">
        <div className="section-shell">
          <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="relative min-h-[420px] overflow-hidden bg-[#ebe8df]">
              <Image
                src="/assets/real/about-fa-training-room.png"
                alt="Faith Associates training session"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>

            <div className="max-w-2xl">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[var(--muted)]">
                Why choose Faith Associates
              </p>
              <h2 className="mt-4 max-w-[12ch] font-sans text-4xl font-semibold leading-tight tracking-[-0.05em] text-[var(--ink)] sm:text-5xl">
                We build practical solutions for faith institutions.
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-8 text-[var(--muted)]">
                Our consultancy combines policy understanding, community trust, programme delivery and sector
                experience. That lets us design responses that are credible on paper and workable in practice.
              </p>

              <div className="mt-10 space-y-6">
                {scoreBars.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm font-semibold text-[var(--ink)]">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="mt-3 h-px bg-[rgba(7,26,63,0.14)]">
                      <div className="h-px bg-[var(--ink)]" style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/#contact"
                className="mt-10 inline-flex items-center rounded-full bg-[#101b27] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[var(--blue)]"
              >
                Discover more
              </Link>
            </div>
          </div>

          <div className="mt-16 border-t border-[var(--line)] pt-10">
            <div className="grid gap-x-10 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
              {valueCards.map((item) => (
                <article key={item.title} className="flex gap-4">
                  <ValueIcon />
                  <div>
                    <h3 className="font-sans text-lg font-semibold tracking-[-0.03em] text-[var(--ink)]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[#f1f1ef] py-8">
        <div className="section-shell grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {impactStats.map((item) => (
            <article key={item.label} className="flex items-center gap-4">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-white text-[var(--ink)] shadow-[0_10px_24px_rgba(7,19,29,0.08)]">
                <MiniCheckIcon />
              </span>
              <div>
                <p className="font-sans text-4xl font-semibold leading-none tracking-[-0.05em] text-[var(--ink)]">
                  {item.value}
                </p>
                <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[var(--muted)]">
                  {item.label}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="network" className="scroll-mt-8 overflow-hidden bg-white py-20">
        <div>
          <div className="bg-[linear-gradient(135deg,#121d2a,#0d1823)] px-8 py-12 text-white sm:px-12 lg:px-16">
            <div className="section-shell flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-white/42">
                  The Faith Associates network
                </p>
                <h2 className="mt-4 max-w-[14ch] font-sans text-4xl font-semibold leading-tight tracking-[-0.05em] text-white sm:text-5xl">
                  The people, partners and platforms behind our work.
                </h2>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/#projects"
                  className="inline-flex items-center rounded-full bg-white px-5 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--ink)] transition hover:bg-white/90"
                >
                  View our programmes
                </Link>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/16 px-5 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-white hover:text-[var(--ink)]"
                >
                  Become part of our story <ArrowIcon />
                </Link>
              </div>
            </div>

            <div className="section-shell mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-6 text-xs font-bold text-white/66">
              {[
                "We are always dedicated to our work",
                "Sector specialists with lived understanding",
                "Practical standards you can trust",
                "National and international reach",
              ].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <span className="text-[#7fda9e]">
                    <MiniCheckIcon />
                  </span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="section-shell py-10 sm:py-12">
            <RotatingImageBox images={networkImages} />
          </div>
        </div>
      </section>

      <section id="partners" className="scroll-mt-8 bg-white py-20 lg:py-24">
        <div className="section-shell grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div className="relative min-h-[360px] overflow-hidden bg-[#f3efe8]">
            <Image
              src="/assets/real/law-24.jpg"
              alt="Faith Associates partner gathering"
              fill
              sizes="(max-width: 1024px) 100vw, 34vw"
              className="object-cover"
            />
            <span className="absolute bottom-6 right-6 inline-flex size-14 items-center justify-center rounded-full bg-white/78 text-2xl font-bold text-[var(--ink)] shadow-[0_18px_40px_rgba(7,19,29,0.18)]">
              &ldquo;
            </span>
          </div>

          <div className="pt-3">
            <h2 className="font-sans text-4xl font-semibold tracking-[-0.05em] text-[var(--ink)] sm:text-5xl">
              What our partners say?
            </h2>
            <div className="mt-5 h-1 w-20 bg-[var(--ink)]" />
            <p className="mt-8 max-w-2xl text-lg leading-9 text-[var(--muted)]">
              &ldquo;Faith Associates helped us move from concern to clarity. Their team understood the community
              context, translated risk into practical action and supported our leadership with credible advice.&rdquo;
            </p>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
              UK mosque leadership partner
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white pb-24">
        <div className="section-shell border-t border-[var(--line)] pt-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-sans text-4xl font-semibold tracking-[-0.05em] text-[var(--ink)] sm:text-5xl">
                Clients trust Faith Associates.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[var(--muted)]">
              We support institutions with tailored consultancy, training, platform development and long-term
              partnership across the faith sector.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {trustMarks.map((item) => (
              <div
                key={item}
                className="flex min-h-[78px] items-center justify-center border border-[var(--line)] px-4 text-center text-sm font-bold tracking-[0.04em] text-[var(--muted)]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#eef5fb,#f7fbff_48%,#edf2f6)] py-20">
        <div className="pointer-events-none absolute right-[-12%] top-[-14%] hidden size-[440px] rounded-full border border-white/70 lg:block" />
        <div className="pointer-events-none absolute bottom-[-28%] right-[8%] hidden size-[360px] rounded-full bg-white/55 blur-3xl lg:block" />
        <div className="section-shell relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="max-w-xl">
            <p className="text-sm leading-8 text-[var(--muted)]">
              From local institutional development to national sector platforms, Faith Associates helps communities
              act with greater confidence, structure and purpose.
            </p>
            <Link
              href="/#contact"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#101b27] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[var(--blue)]"
            >
              Let&apos;s develop together <ArrowIcon />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1.05fr_0.95fr] lg:gap-5">
            {archiveImages.map((image, index) => (
              <div
                key={image.src}
                className={`${image.aspectClassName} relative overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_28px_80px_rgba(35,60,84,0.14)] ${index === 0 ? "sm:row-span-2" : ""}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,24,38,0.02),rgba(10,24,38,0.14))]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#101b27] py-16 text-white">
        <div className="section-shell grid gap-10 lg:grid-cols-[1.15fr_0.8fr_0.8fr_1fr]">
          <div>
            <Image
              src="/assets/faith-associates-logo.png"
              alt="Faith Associates"
              width={165}
              height={90}
              className="h-16 w-auto object-contain"
            />
            <p className="mt-5 max-w-md text-sm leading-7 text-white/56">
              We understand that communities need solutions that are principled, practical and deliverable. That is
              where Faith Associates works best.
            </p>
            <div className="mt-8 text-sm leading-7 text-white/54">
              <p className="font-bold text-white/76">Company information</p>
              <p className="mt-3">Founded 2004</p>
              <p>Faith Associates, UK</p>
              <p>Call us: 020 3149 6066</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/34">Our services</p>
            <div className="mt-5 grid gap-3 text-sm text-white/58">
              {footerServices.map((item) => (
                <Link key={item} href="/#services" className="transition hover:text-white">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/34">Quick links</p>
            <div className="mt-5 grid gap-3 text-sm text-white/58">
              {footerLinks.map((item) => (
                <Link
                  key={item}
                  href={item === "About us" ? "/about" : item === "Contact us" ? "/#contact" : `/#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="transition hover:text-white"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/34">Stay connected</p>
            <div className="mt-5 rounded-full border border-white/12 bg-white/6 px-4 py-3 text-sm text-white/44">
              Don&apos;t miss the latest news from us.
            </div>
            <p className="mt-5 text-xs leading-6 text-white/40">
              Please sign up to follow the latest news and events from us, plus receive updates from our work.
            </p>
          </div>
        </div>

        <div className="section-shell mt-12 flex flex-col gap-4 border-t border-white/8 pt-6 text-xs text-white/34 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright © 2026 Faith Associates. All rights reserved.</p>
          <p>Confidentiality & Privacy / Legal Information / Terms of Use</p>
        </div>
      </footer>
    </main>
  );
}
