import Image from "next/image";
import Link from "next/link";
import { FeaturedPublications } from "./components/FeaturedPublications";
import { RotatingHeroCopy } from "./components/RotatingHeroCopy";
import { ServicesCarousel, type ServiceSlide } from "./components/ServicesCarousel";
import { SiteHeader } from "./components/SiteHeader";

const heroStories = [
  { label: "Mosque Security", href: "#services" },
  { label: "Leadership Development", href: "#projects" },
  { label: "International Networks", href: "#international" },
  { label: "Mosque Expo 2026", href: "#projects", active: true },
];

const heroMessages = [
  {
    eyebrow: "Faith Associates 2026",
    title: "Raising standards for faith institutions.",
    body: "Practical support for mosques, madrassahs and community leaders.",
    ctaLabel: "Explore our work",
    href: "#projects",
  },
  {
    eyebrow: "Security and resilience",
    title: "Safer mosques. Stronger governance.",
    body: "Training, guidance and standards for places of worship.",
    ctaLabel: "See our services",
    href: "#services",
  },
  {
    eyebrow: "Leadership and networks",
    title: "Developing leaders and community impact.",
    body: "Programmes, partnerships and events that strengthen institutions.",
    ctaLabel: "View programmes",
    href: "#projects",
  },
];

const capabilities = [
  {
    title: "Institutional Development",
    body: "Governance, standards, leadership and practical support for mosques, madrassahs and faith charities.",
  },
  {
    title: "Protective Security",
    body: "Training, risk awareness and incident guidance for places of worship and community institutions.",
  },
  {
    title: "Cohesion Programmes",
    body: "Sport, youth engagement and partnership programmes that build cohesion across communities.",
  },
  {
    title: "Global Networks",
    body: "International convening, research and knowledge sharing across faith institution leadership networks.",
  },
];

const services: ServiceSlide[] = [
  {
    title: "Security in Places of Worship",
    body: "Risk assessment, training and practical resilience support for mosque and faith institution teams.",
    image: "/assets/real/wolverhampton-security-training.jpg",
    imageClassName: "object-cover",
    imageShellClassName: "bg-[var(--soft)]",
  },
  {
    title: "Strategic Leadership Development",
    body: "Faith Associates Academy and MBA pathways for mosque, madrassah and charity leadership.",
    image: "/assets/real/leadership-development-event.webp",
    imageClassName: "object-contain p-3",
    imageShellClassName: "bg-white",
  },
  {
    title: "Environmental Practices",
    body: "Eco-Mosque work, net-zero conferences and sustainability resources for faith communities.",
    image: "/assets/real/eco-mosque-conference.jpg",
    imageClassName: "object-cover",
    imageShellClassName: "bg-[var(--soft)]",
  },
  {
    title: "Safeguarding and Risk Audits",
    body: "Practical review frameworks, incident planning and safer operating standards for community institutions.",
    image: "/assets/real/risk-22.jpg",
    imageClassName: "object-cover",
    imageShellClassName: "bg-[var(--soft)]",
  },
  {
    title: "Publications and Toolkits",
    body: "Reports, governance resources and practical toolkits that help institutions implement standards properly.",
    image: "/assets/real/fa-activity-report-2024.png",
    imageClassName: "object-contain p-6",
    imageShellClassName: "bg-white",
  },
  {
    title: "Community Cohesion Through Sport",
    body: "Programmes that connect youth, institutions and local partners through inclusive sport and social action.",
    image: "/assets/inclusivity-sport.png",
    imageClassName: "object-contain p-5",
    imageShellClassName: "bg-white",
  },
  {
    title: "International Networks and Partnerships",
    body: "Cross-border convening, awards, research and relationship-building for faith institution leadership networks.",
    image: "/assets/real/beacon-awards-stage.jpg",
    imageClassName: "object-cover",
    imageShellClassName: "bg-[var(--soft)]",
  },
];

const news = [
  {
    title: "Mosque Expo 2026 returns, uniting leaders and innovators",
    image: "/assets/real/mosque-expo-2024-hall.jpg",
    meta: "May 1, 2026 / News",
  },
  {
    title: "Strengthening Mosque Resilience with Aston University",
    image: "/assets/real/faith-training-speaker.jpg",
    meta: "June 2, 2025 / Blog",
  },
  {
    title: "Eco-Mosque Net Zero Conference for mosque leadership",
    image: "/assets/real/eco-mosque-conference.jpg",
    meta: "April 30, 2025 / Blog",
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

function CapabilityIcon({ index }: { index: number }) {
  const paths = [
    "M5 13V6.5L8 3l3 3.5V13M3.5 13h9M7 13V9h2v4",
    "M8 2.75 12.5 5v3.25c0 2.6-1.8 4.85-4.5 5.75-2.7-.9-4.5-3.15-4.5-5.75V5L8 2.75Z",
    "M4 11.5c1.9-2.5 6.1-2.5 8 0M8 8a2.2 2.2 0 1 0 0-4.4A2.2 2.2 0 0 0 8 8Z",
    "M3 8h10M8 3v10M4.6 4.6l6.8 6.8M11.4 4.6l-6.8 6.8",
  ];

  return (
    <svg
      aria-hidden="true"
      className="size-9 text-[var(--blue)]"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d={paths[index]}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}

export default function Home() {
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

          <div className="mt-6 hidden items-end justify-between gap-5 border-t border-white/14 pt-3 text-center sm:mt-8 sm:gap-6 sm:pt-4 lg:flex lg:text-left">
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

      <section id="international" className="bg-[#f4f2ed] pb-8 pt-8 lg:pb-10 lg:pt-12">
        <div className="section-shell">
          <p className="text-center font-[var(--font-poppins)] text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--red)]">What we do</p>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((item, index) => (
              <article key={item.title} className="group flex flex-col items-center text-center lg:items-start lg:text-left">
                <CapabilityIcon index={index} />
                <h3 className="mt-4 font-display text-xl font-bold tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Services - horizontal scroll */}
      <section id="services" className="bg-white py-10 lg:py-12">
        <div className="section-shell">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--red)]">
              Key strategic services
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
              Services for faith institution development
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              Programmes from the existing Faith Associates portfolio, presented with clearer routes for new
              partners and institutions.
            </p>
          </div>
          <ServicesCarousel items={services} />
        </div>
      </section>

      {/* Section 5: Upcoming events */}
      <section id="projects" className="scroll-mt-8 bg-[#f7f6f3] py-10 lg:py-12">
        <div className="section-shell">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--red)]">
              Upcoming events
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.04em]">What&apos;s on next</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              Expos, conferences and briefings from across the Faith Associates network.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {news.map((item) => (
              <article key={item.title} className="group bg-white">
                <div className="relative aspect-[1.35/1] overflow-hidden">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 text-center md:text-left">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{item.meta}</p>
                  <h3 className="mt-4 font-display text-2xl font-bold leading-tight tracking-[-0.03em]">
                    {item.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Latest resources - publications */}
      <FeaturedPublications />

      <section id="contact" className="bg-white py-10 text-[var(--ink)] lg:py-12">
        <div className="section-shell">
          <div className="grid gap-6 border-t border-[var(--line)] pt-6 text-center lg:grid-cols-[0.38fr_0.62fr] lg:items-start lg:text-left">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--red)]">Get in touch</p>
              <h2 className="mt-4 font-display text-4xl font-bold leading-none tracking-[-0.04em] sm:text-5xl">
                Start a conversation.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[var(--muted)] lg:mx-0">
                Tell us what your institution needs and the team will come back with the right next step.
              </p>

              <div className="mt-6 grid gap-5 text-sm leading-7 text-[var(--muted)] sm:grid-cols-2 lg:grid-cols-1">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--red)]">Address</p>
                  <p className="mt-2">
                    Faith Associates, UK
                    <br />
                    Supporting communities worldwide
                  </p>
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--red)]">Contact</p>
                  <p className="mt-2">Use the form for quotes, partnerships and consultations.</p>
                </div>
              </div>
            </div>

            <div className="w-full max-w-[820px] justify-self-center overflow-hidden lg:justify-self-end">
              <iframe
                src="https://zfrmz.eu/kBHoqCaeCvfuvnAoOW06"
                width="100%"
                height="720"
                className="block w-full border-0 bg-transparent"
                title="Contact Us Form"
                aria-label="Contact Us Form"
                scrolling="no"
                allowFullScreen
              >
                Loading...
              </iframe>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#07131d] py-10 text-white lg:py-12">
        <div className="section-shell grid gap-8 text-center lg:grid-cols-[1.1fr_0.7fr_0.7fr_0.8fr] lg:text-left">
          <div className="flex flex-col items-center lg:items-start">
            <Link href="/" aria-label="Faith Associates home" className="inline-flex flex-col">
              <span className="font-[var(--font-poppins)] text-3xl font-semibold leading-none tracking-normal text-white">
                faith
              </span>
              <span className="mt-1 font-[var(--font-poppins)] text-[11px] font-extrabold uppercase leading-none tracking-[0.12em] text-white/78">
                Associates
              </span>
              <span className="mt-3 h-0.5 w-16 bg-[#075FAF]" aria-hidden="true" />
            </Link>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/58">
              A global consultancy empowering communities, building standards and protecting places of worship.
            </p>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/36">Services</p>
            <div className="mt-4 grid justify-items-center gap-3 text-sm text-white/64 lg:justify-items-start">
              <a href="#services" className="transition hover:text-[#6bb6ff]">Security training</a>
              <a href="#services" className="transition hover:text-[#6bb6ff]">Leadership development</a>
              <a href="#services" className="transition hover:text-[#6bb6ff]">Environmental practices</a>
            </div>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/36">Explore</p>
            <div className="mt-4 grid justify-items-center gap-3 text-sm text-white/64 lg:justify-items-start">
              <a href="#services" className="transition hover:text-[#6bb6ff]">Services</a>
              <a href="#international" className="transition hover:text-[#6bb6ff]">International</a>
              <a href="#projects" className="transition hover:text-[#6bb6ff]">Events</a>
            </div>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/36">Next step</p>
            <a
              href="#contact"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#075FAF]/70 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#075FAF] hover:text-white"
            >
              Start a conversation <ArrowIcon />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
