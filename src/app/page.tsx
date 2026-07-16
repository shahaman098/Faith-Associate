import Image from "next/image";
import { FeaturedPublications } from "./components/FeaturedPublications";
import { RotatingHeroCopy } from "./components/RotatingHeroCopy";
import { ServicesCarousel, type ServiceSlide } from "./components/ServicesCarousel";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/#services" },
  { label: "Publication", href: "/#publications" },
  { label: "International", href: "/#international" },
  { label: "Contact us", href: "/#contact" },
];

const utilityLinksLeft = ["Offices", "Media Centre", "Contact us"];

const utilityLinksRight = ["Global | English", "Saved Items"];

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

const guidanceTopics = [
  { label: "Governance & Standards", href: "#about" },
  { label: "Mosque Security", href: "#services" },
  { label: "Leadership Development", href: "#projects" },
  { label: "Madrassah Support", href: "#projects" },
  { label: "Inclusivity in Sport", href: "#sport" },
  { label: "International Networks", href: "#international" },
  { label: "Publications & Toolkits", href: "#publications" },
  { label: "Mosque Expo", href: "#projects" },
  { label: "Beacon Awards", href: "#publications" },
  { label: "Contact & Consultation", href: "#contact" },
  { label: "Safeguarding", href: "#services" },
  { label: "Research", href: "#publications" },
  { label: "Risk Assessment", href: "#services" },
  { label: "Conference Planning", href: "#projects" },
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

const platformLogos = [
  {
    name: "Mosque Security",
    image: "/assets/real/platform-mosque-security.png",
    imageClassName: "object-contain p-4",
    shellClassName: "bg-white",
  },
  {
    name: "Beacon Mosque",
    image: "/assets/real/platform-beacon-mosque.png",
    imageClassName: "object-contain p-5",
    shellClassName: "bg-[#07131d]",
  },
  {
    name: "Faith Associates Academy",
    image: "/assets/real/platform-fa-academy.png",
    imageClassName: "object-contain p-5",
    shellClassName: "bg-[#d13239]",
  },
  {
    name: "Mosque & Madrassah Expo 2026",
    image: "/assets/real/platform-mosque-madrassah-expo.png",
    imageClassName: "object-contain p-5",
    shellClassName: "bg-white",
  },
  {
    name: "Enhancing Faith Institutions",
    image: "/assets/real/platform-efi.png",
    imageClassName: "object-contain p-5",
    shellClassName: "bg-[#07131d]",
  },
  {
    name: "MEET",
    image: "/assets/real/platform-meet.png",
    imageClassName: "object-contain p-4",
    shellClassName: "bg-white",
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

function MenuIcon() {
  return (
    <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 20 20" fill="none">
      <path
        d="m14.5 14.5 3 3M8.75 15.25a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 20 20" fill="none">
      <path
        d="M6.25 3.25h7.5a1 1 0 0 1 1 1v12l-4.75-2.85-4.75 2.85v-12a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm0 0c1.7 1.8 2.6 4.1 2.6 6.5S9.7 12.2 8 14.5M8 1.5C6.3 3.3 5.4 5.6 5.4 8S6.3 12.2 8 14.5M1.9 5.75h12.2M1.9 10.25h12.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.35"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" className="size-3.5" viewBox="0 0 16 16" fill="none">
      <path d="m4 6 4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[var(--ink)]">
      <header className="absolute inset-x-0 top-0 z-50 text-white">
        <div className="section-shell border-b border-white/10">
          <div className="hidden h-9 items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-white/62 lg:flex">
            <div className="flex items-center gap-8">
              {utilityLinksLeft.map((item) => (
                <a key={item} href={item === "Contact us" ? "/#contact" : "#"} className="inline-flex items-center gap-1 transition hover:text-white">
                  {item}
                  {item === "Offices" ? <ChevronDownIcon /> : null}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="inline-flex items-center gap-2 transition hover:text-white">
                <GlobeIcon />
                {utilityLinksRight[0]}
                <ChevronDownIcon />
              </a>
              <a href="#" className="inline-flex items-center gap-1 transition hover:text-white">
                {utilityLinksRight[1]}
                <ChevronDownIcon />
              </a>
            </div>
          </div>
          <nav className="flex h-20 items-center justify-between border-t border-white/10">
            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label="Open navigation"
                className="inline-flex items-center justify-center text-white/88 transition hover:text-white"
              >
                <MenuIcon />
              </button>
              <a href="#" className="flex items-center" aria-label="Faith Associates home">
                <Image
                  src="/assets/faith-associates-logo.png"
                  alt="Faith Associates"
                  width={165}
                  height={90}
                  priority
                  className="h-14 w-auto object-contain"
                />
              </a>
            </div>
            <div className="hidden items-center gap-8 text-[13px] font-bold text-white/82 xl:flex">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} className="inline-flex items-center gap-1 transition hover:text-white">
                  {item.label}
                  {item.label === "Services" || item.label === "International" ? <ChevronDownIcon /> : null}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-5 text-sm font-bold text-white/88">
              <a href="#projects" className="hidden transition hover:text-white sm:inline-flex">
                Explore
              </a>
              <button type="button" aria-label="Search" className="inline-flex transition hover:text-white">
                <SearchIcon />
              </button>
              <button type="button" aria-label="Saved items" className="hidden transition hover:text-white sm:inline-flex">
                <BookmarkIcon />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <section className="relative isolate min-h-[760px] overflow-hidden bg-[#07131d] pt-24 text-white lg:h-screen lg:min-h-[820px] lg:pt-26">
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
        <div className="relative z-10 flex min-h-[700px] flex-col justify-between px-5 pb-10 pt-10 sm:px-8 lg:min-h-[calc(100vh-6.5rem)] lg:px-12 lg:pb-8 lg:pt-10 xl:px-16 2xl:px-20">
          <RotatingHeroCopy items={heroMessages} />

          <div className="mt-12 flex items-end justify-between gap-8 border-t border-white/14 pt-5">
            <div className="grid flex-1 gap-4 text-white/54 sm:grid-cols-2 lg:grid-cols-4">
              {heroStories.map((story) => (
                <a
                  key={story.label}
                  href={story.href}
                  className={`group pt-3 text-base font-bold tracking-[-0.03em] transition hover:text-white ${
                    story.active ? "text-white" : ""
                  }`}
                >
                  <span className={`mb-4 block h-1 w-28 transition lg:w-32 ${
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

      {/* Section 2: Who we are and what we do */}
      <section id="about" className="bg-[#f4f2ed] py-16 lg:py-20">
        <div className="section-shell grid gap-8 lg:grid-cols-[0.92fr_1.02fr_0.56fr] lg:items-start xl:gap-10">
          <div className="overflow-hidden rounded-[22px] bg-white/70 shadow-[0_18px_40px_rgba(7,19,29,0.06)] lg:mt-16 lg:-mr-2">
            <div className="relative aspect-[1.08/1]">
              <Image
                src="/assets/real/about-fa-training-room.png"
                alt="Faith Associates training session with a speaker addressing a room"
                fill
                sizes="(max-width: 1024px) 100vw, 38vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="max-w-[38rem]">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--red)]">
              Who we are
            </p>
            <h2 className="mt-4 max-w-[10ch] font-display text-4xl font-bold leading-[0.95] tracking-[-0.05em] sm:text-5xl">
              We work with you to make standards practical.
            </h2>
            <p className="mt-6 text-base leading-8 text-[var(--muted)]">
              Faith Associates was set up in 2004 as a non-theological consultancy to meet the needs of ethnic
              minority faith-based communities. Our work brings research, training, advice and guidance together in
              a culturally sensitive, multidisciplinary way.
            </p>
            <p className="mt-5 text-base leading-8 text-[var(--muted)]">
              The focus is practical: stronger governance, safer places of worship, better leadership development
              and clearer standards for communities serving people every week.
            </p>
            <a
              href="#services"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[var(--blue)]"
            >
              Our services <ArrowIcon />
            </a>
          </div>
          <div className="border-l border-[var(--line)] pl-6 lg:mt-16 xl:pl-8">
            <div className="font-display text-6xl font-bold tracking-[-0.06em] text-[var(--ink)]">20</div>
            <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--red)]">
              Years serving communities
            </p>
            <p className="mt-6 text-sm leading-7 text-[var(--muted)]">
              From local mosque support to international networks, Faith Associates has built programmes that help
              institutions raise standards and respond to changing risks.
            </p>
          </div>
        </div>

        <div id="international" className="section-shell mt-14 scroll-mt-8 border-t border-[var(--line)] pt-12">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--red)]">What we do</p>
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((item, index) => (
              <article key={item.title} className="group">
                <CapabilityIcon index={index} />
                <h3 className="mt-6 font-display text-xl font-bold tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: How can we be of service */}
      <section id="contact" className="bg-white py-20 text-[var(--ink)] lg:py-24">
        <div className="section-shell">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--red)]">
            How can we be of service
          </p>
          <h2 className="mt-4 max-w-3xl font-sans text-4xl font-semibold leading-tight tracking-[-0.04em] text-[var(--ink)] sm:text-5xl">
            Tell us what your institution needs to strengthen.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-9 text-[var(--muted)]">
            Choose a focus area and jump to the most relevant Faith Associates support, programmes and resources.
          </p>

          <div className="mt-10 flex items-baseline gap-3">
            <p className="text-[28px] font-bold tracking-[-0.04em] text-[var(--ink)]">1. What do you need support with?</p>
            <p className="text-sm font-medium text-[var(--muted)]">Faith Associates routes</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            {guidanceTopics.map((topic) => (
              <a
                key={topic.label}
                href={topic.href}
                className="inline-flex items-center rounded-full border border-[var(--line)] bg-white px-6 py-3 text-base font-bold text-[var(--red)] transition hover:border-[var(--red)] hover:bg-[var(--red)] hover:text-white"
              >
                {topic.label}
              </a>
            ))}
          </div>
        </div>

        <div className="section-shell mt-16 border-t border-[var(--line)] pt-12">
          <div className="grid gap-10 pb-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="max-w-4xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--red)]">Get in touch</p>
              <h3 className="mt-4 max-w-[11ch] font-display text-4xl font-bold leading-[0.98] tracking-[-0.04em] sm:text-5xl">
                You need the right direction for your institution. We will help you do that.
              </h3>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="border-t border-[var(--line)] pt-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--red)]/85">Address</p>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  Faith Associates, UK
                  <br />
                  Supporting communities worldwide
                </p>
              </div>
              <div className="border-t border-[var(--line)] pt-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--red)]/85">Contact</p>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  Use the embedded Zoho form for quotes, partnerships and consultations.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.34fr_0.66fr] lg:items-start">
            <div className="overflow-hidden rounded-[30px] border border-[var(--line)] bg-[#ebe6dc] shadow-[0_18px_48px_rgba(7,19,29,0.08)]">
              <div className="p-8 sm:p-10">
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--red)]/80">Start a conversation</p>
                <h3 className="mt-4 font-display text-3xl font-bold leading-tight tracking-[-0.04em] text-[var(--ink)] sm:text-4xl">
                  Contact Faith Associates
                </h3>
                <p className="mt-5 text-sm leading-8 text-[var(--muted)]">
                  Tell us what your institution needs, where you are stuck, or what programme you want to develop.
                  The team will review your enquiry and come back with the right next step.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {["Quotes", "Partnerships", "Consultations", "Projects"].map((item) => (
                    <span
                      key={item}
                      className="inline-flex rounded-full border border-[rgba(7,26,63,0.12)] bg-white/70 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--ink)]/72"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-[var(--line)] bg-white/45 px-8 py-6 sm:px-10">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--red)]/80">Best for</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                      Governance support, safeguarding, training, research and strategic enquiries.
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--red)]/80">Response</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                      Use the form and include enough context for the team to route your enquiry properly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--red)]">Enquiry form</p>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                    Have a question, suggestion, or need support? Fill in the form below and the team will get back to you.
                  </p>
                </div>
                <p className="max-w-xs text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
                  Include your institution, request type and preferred next step.
                </p>
              </div>
              <div className="overflow-hidden rounded-[30px] border border-[rgba(7,26,63,0.12)] bg-[#dbe4f0] p-[1px] shadow-[0_22px_60px_rgba(7,19,29,0.10)]">
                <iframe
                  src="https://zfrmz.eu/kBHoqCaeCvfuvnAoOW06"
                  width="100%"
                  height="640"
                  className="block w-full border-0 bg-white"
                  title="Contact Us Form"
                  aria-label="Contact Us Form"
                  allowFullScreen
                >
                  Loading...
                </iframe>
              </div>
            </div>
          </div>
        </div>

        <div className="section-shell mt-16 border-t border-[var(--line)] pt-12 text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--red)]">
            Faith Associates platforms
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {platformLogos.map((logo) => (
              <div
                key={logo.name}
                className={`relative min-h-[122px] overflow-hidden border border-[var(--line)] ${logo.shellClassName}`}
              >
                <Image
                  src={logo.image}
                  alt={logo.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 16vw"
                  className={logo.imageClassName}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Services - horizontal scroll */}
      <section id="services" className="bg-white py-20 lg:py-28">
        <div className="section-shell">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--red)]">
              Key strategic services
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
              Services for faith institution development
            </h2>
            <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
              Programmes from the existing Faith Associates portfolio, presented with clearer routes for new
              partners and institutions.
            </p>
          </div>
          <ServicesCarousel items={services} />
        </div>
      </section>

      {/* Section 5: Upcoming events */}
      <section id="projects" className="scroll-mt-8 bg-[#f7f6f3] py-20">
        <div className="section-shell">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--red)]">
              Upcoming events
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.04em]">What&apos;s on next</h2>
            <p className="mt-5 text-sm leading-7 text-[var(--muted)]">
              Expos, conferences and briefings from across the Faith Associates network.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
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
                <div className="p-7">
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

      <footer className="bg-[#07131d] py-16 text-white">
        <div className="section-shell grid gap-10 lg:grid-cols-[1.1fr_0.7fr_0.7fr_0.8fr]">
          <div>
            <Image
              src="/assets/faith-associates-logo.png"
              alt="Faith Associates"
              width={165}
              height={90}
              className="h-16 w-auto object-contain"
            />
            <p className="mt-5 max-w-md text-sm leading-7 text-white/58">
              A global consultancy empowering communities, building standards and protecting places of worship.
            </p>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/36">Services</p>
            <div className="mt-5 grid gap-3 text-sm text-white/64">
              <a href="#services">Security training</a>
              <a href="#services">Leadership development</a>
              <a href="#services">Environmental practices</a>
            </div>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/36">Explore</p>
            <div className="mt-5 grid gap-3 text-sm text-white/64">
              <a href="#services">Services</a>
              <a href="#international">International</a>
              <a href="#projects">Events</a>
            </div>
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/36">Next step</p>
            <a
              href="#contact"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-extrabold transition hover:bg-white hover:text-[var(--ink)]"
            >
              Start a conversation <ArrowIcon />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
