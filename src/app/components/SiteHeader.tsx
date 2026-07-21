"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";

const navigation = [
  {
    label: "About",
    href: "/about",
    children: [
      ["Our story", "/about"],
      ["Organisation history", "/about/history"],
      ["Our clients", "/about/clients"],
      ["Our team", "/about/team"],
      ["Our approach", "/about/approach"],
      ["Careers", "/about/careers"],
      ["Vacancies", "/about/vacancies"],
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      ["Mosque services", "/services/mosque-services"],
      ["Madrassah support", "/services/madrassah-support"],
      ["Imam services", "/services/imam-services"],
      ["Strategic services", "/services/strategic-services"],
      ["Safeguarding", "/services/safeguarding"],
      ["Safety", "/services/safety"],
    ],
  },
  {
    label: "Projects",
    href: "/projects",
    children: [
      ["Mosque Expo", "/projects/mosque-expo"],
      ["Beacon Mosque Awards", "/projects/british-beacon-mosque-awards"],
      ["Faith Associates Academy", "/projects/faith-associates-academy"],
      ["Mosque Security", "/projects/mosque-security"],
      ["Fattah Cup", "/projects/fattah-cup"],
      ["Eman Cup", "/projects/eman-cup"],
    ],
  },
  { label: "International", href: "/international" },
  { label: "Publications", href: "/publications" },
  {
    label: "News & events",
    href: "/news",
    children: [
      ["Latest news", "/news"],
      ["Events", "/events"],
    ],
  },
];

const mobileNavigation = [
  { label: "Home", href: "/" },
  ...navigation.filter((item) =>
    ["About", "Services", "Projects"].includes(item.label),
  ),
  ...navigation.filter((item) => item.label === "Publications"),
  ...navigation.filter((item) => item.label === "International"),
  { label: "Contact us", href: "/contact" },
];

function MenuIcon() {
  return (
    <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
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
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ChevronDownIcon({ className = "size-3" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 16 16" fill="none">
      <path
        d="m4 6 4 4 4-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/faith-associates/",
    icon: (
      <svg aria-hidden="true" className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.05c.53-1 1.82-2.05 3.75-2.05 4.01 0 4.75 2.64 4.75 6.07V23h-4v-6.6c0-1.57-.03-3.59-2.19-3.59-2.19 0-2.53 1.71-2.53 3.48V23h-4V8.5z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/faithassociates/",
    icon: (
      <svg aria-hidden="true" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/faithassociates",
    icon: (
      <svg aria-hidden="true" className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2H21.5l-7.5 8.57L22.5 22h-6.57l-5.14-6.71L5.2 22H1.94l8.03-9.17L1.5 2h6.73l4.64 6.16L18.244 2zm-1.15 18h1.81L7.01 3.94H5.07L17.094 20z" />
      </svg>
    ),
  },
];

function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {socialLinks.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          aria-label={item.label}
          className="inline-flex size-7 items-center justify-center rounded-full text-current transition hover:bg-white/10 hover:text-white"
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) {
      setOpenSection(null);
      setSearchQuery("");
      return;
    }
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    closeMenu();
    window.location.href = `/publications?q=${encodeURIComponent(query)}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#eef3f3] text-[var(--ink)] lg:absolute lg:inset-x-0 lg:bg-transparent lg:text-white">
      {/* Mobile utility tabs */}
      <div className="grid grid-cols-3 overflow-hidden rounded-t-[10px] text-white lg:hidden">
        <Link
          href="/#contact"
          className="flex h-9 items-center justify-center bg-[var(--blue-dark)] text-[11px] font-extrabold uppercase tracking-[0.12em]"
        >
          Offices
        </Link>
        <Link
          href="/news"
          className="flex h-9 items-center justify-center bg-[var(--blue)] text-[11px] font-extrabold uppercase tracking-[0.12em]"
        >
          Media
        </Link>
        <Link
          href="/contact"
          className="flex h-9 items-center justify-center bg-[var(--red)] text-[11px] font-extrabold uppercase tracking-[0.12em]"
        >
          Contact
        </Link>
      </div>

      {/* Desktop utility bar */}
      <div className="hidden border-b border-white/10 bg-[#0b1824]/86 text-white backdrop-blur-md lg:block">
        <div className="section-shell flex h-9 items-center justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-white/58">
          <p>Building standards across the globe</p>
          <div className="flex items-center gap-5">
            <SocialLinks />
            <span aria-hidden="true" className="h-3 w-px bg-white/20" />
            <Link href="/news" className="transition hover:text-white">
              Media centre
            </Link>
            <a href="tel:+441494416202" className="transition hover:text-white">
              +44 (0) 1494 416202
            </a>
            <Link href="/contact" className="transition hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>

      <nav ref={navRef} className="border-b border-[rgba(7,26,63,0.12)] lg:border-white/12">
        {/* Mobile branding row */}
        <div className="relative flex h-[72px] items-center justify-between px-4 lg:hidden">
          <button
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className={
              menuOpen
                ? "inline-flex size-11 cursor-pointer items-center justify-center rounded-md border border-[#0b2a4a] text-[#0b2a4a] transition hover:bg-[#0b2a4a] hover:text-white"
                : "inline-flex size-11 cursor-pointer items-center justify-center text-[#0b2a4a] transition hover:text-[var(--red)]"
            }
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <Link href="/" aria-label="Faith Associates home" className="absolute left-1/2 -translate-x-1/2">
            <Image
              src="/assets/faith-associates-logo.png"
              alt="Faith Associates"
              width={150}
              height={82}
              priority
              className="h-11 w-auto object-contain"
            />
          </Link>

          <Link
            href="/contact"
            className="inline-flex border border-[#0b2a4a] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0b2a4a] transition hover:bg-[#0b2a4a] hover:text-white"
          >
            Enquire
          </Link>
        </div>

        {/* Desktop branding row */}
        <div className="section-shell hidden h-[86px] items-center justify-between lg:flex">
          <Link href="/" aria-label="Faith Associates home" className="shrink-0">
            <Image
              src="/assets/faith-associates-logo.png"
              alt="Faith Associates"
              width={165}
              height={90}
              priority
              className="h-14 w-auto object-contain"
            />
          </Link>

          <div className="hidden items-center gap-5 xl:flex 2xl:gap-7">
            {navigation.map((item) => (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 py-8 text-[12px] font-bold text-white/82 transition hover:text-white focus-visible:text-white"
                >
                  {item.label}
                  {item.children ? <ChevronDownIcon /> : null}
                </Link>
                {item.children ? (
                  <div className="invisible absolute left-1/2 top-[72px] w-72 -translate-x-1/2 translate-y-2 border border-white/12 bg-[#0b1824]/98 p-3 opacity-0 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    {item.children.map(([label, href]) => (
                      <Link
                        key={href}
                        href={href}
                        className="flex items-center justify-between border-b border-white/8 px-3 py-3 text-sm font-semibold text-white/68 transition last:border-0 hover:bg-white/6 hover:text-white"
                      >
                        {label}
                        <span aria-hidden="true">↗</span>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/publications"
              aria-label="Search publications"
              className="inline-flex size-10 items-center justify-center text-white/76 transition hover:text-white"
            >
              <SearchIcon />
            </Link>
            <Link
              href="/contact"
              className="inline-flex bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0b1824] transition hover:bg-[var(--red)] hover:text-white"
            >
              Work with us
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex size-11 cursor-pointer items-center justify-center text-white transition hover:text-[var(--red)] xl:hidden"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div
            id="mobile-navigation"
            className="fixed inset-x-0 bottom-0 top-[108px] overflow-y-auto bg-[#eef3f3] px-4 pb-10 pt-5 text-[#0b2a4a] lg:top-[126px] xl:hidden"
          >
            <form onSubmit={handleSearch} className="relative">
              <label htmlFor="mobile-nav-search" className="sr-only">
                Search
              </label>
              <input
                id="mobile-nav-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="I'm looking for..."
                className="h-12 w-full rounded-md border border-[#d7dee4] bg-white px-4 pr-12 text-[15px] text-[#0b2a4a] outline-none placeholder:text-[#8a949e] focus:border-[#0b2a4a]"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-[#5a6672]"
              >
                <SearchIcon />
              </button>
            </form>

            <div className="mt-6 border-t border-[#d5dde4]">
              {mobileNavigation.map((item) => {
                const hasChildren = Boolean(item.children?.length);
                const isOpen = openSection === item.label;

                if (!hasChildren) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className="relative flex items-center justify-center border-b border-[#d5dde4] py-5 text-center text-[17px] font-bold tracking-[-0.01em] text-[#0b2a4a]"
                    >
                      <span>{item.label}</span>
                      <span className="absolute right-1 inline-flex size-8 items-center justify-center text-[#0b2a4a]">
                        <ChevronDownIcon className="size-4" />
                      </span>
                    </Link>
                  );
                }

                return (
                  <div key={item.href} className="border-b border-[#d5dde4]">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenSection(isOpen ? null : item.label)}
                      className="relative flex w-full items-center justify-center py-5 text-center text-[17px] font-bold tracking-[-0.01em] text-[#0b2a4a]"
                    >
                      <span>{item.label}</span>
                      <span className="absolute right-1 inline-flex size-8 items-center justify-center text-[#0b2a4a]">
                        <ChevronDownIcon
                          className={`size-4 transition ${isOpen ? "rotate-180" : ""}`}
                        />
                      </span>
                    </button>
                    {isOpen ? (
                      <div className="pb-4">
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className="block py-2.5 text-center text-sm font-semibold text-[#3d6b7a]"
                        >
                          View all {item.label.toLowerCase()}
                        </Link>
                        {item.children?.map(([label, href]) => (
                          <Link
                            key={href}
                            href={href}
                            onClick={closeMenu}
                            className="block py-2.5 text-center text-sm font-medium text-[#52627d]"
                          >
                            {label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
