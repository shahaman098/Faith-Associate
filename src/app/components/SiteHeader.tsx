"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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

function MenuIcon() {
  return (
    <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" fill="none">
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

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    document.body.style.overflow = "hidden";

    const handlePointerDown = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="relative z-50 bg-[#eef5f6] text-[var(--ink)] lg:absolute lg:inset-x-0 lg:top-0 lg:bg-transparent lg:text-white">
      <div className="grid h-10 grid-cols-3 text-[10px] font-extrabold uppercase tracking-[0.08em] text-white lg:hidden">
        <a href="#" className="flex items-center justify-center bg-[#245362]">
          Offices
        </a>
        <a href="#" className="flex items-center justify-center bg-[#3e8491]">
          Media
        </a>
        <Link href="/#contact" className="flex items-center justify-center bg-[var(--red)]">
          Contact
        </Link>
      </div>
      <div className="section-shell border-b border-[rgba(7,26,63,0.12)] lg:border-white/10">
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
        <nav ref={navRef} className="relative grid h-[76px] grid-cols-[1fr_auto_1fr] items-center lg:flex lg:h-20 lg:justify-between lg:border-t lg:border-white/10">
          <div className="flex items-center justify-start">
            <button
              type="button"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
              className="flex size-11 cursor-pointer items-center justify-center text-[var(--ink)] transition hover:text-[var(--red)] xl:hidden lg:text-white/88 lg:hover:text-white"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            {menuOpen ? (
              <div className="absolute left-[-14px] right-[-14px] top-[76px] bg-[#eef5f6] px-5 pb-5 pt-4 text-center text-[var(--ink)] shadow-[0_16px_40px_rgba(7,26,63,0.14)] sm:left-[-20px] sm:right-auto sm:w-[22rem] lg:left-5 lg:top-16 lg:border lg:border-white/14 lg:bg-[#07131d]/96 lg:p-4 lg:text-left lg:text-white lg:backdrop-blur-md">
                <label className="mb-4 flex h-11 items-center gap-3 bg-white px-4 text-sm font-semibold text-[var(--muted)] lg:hidden">
                  <input
                    type="search"
                    placeholder="I'm looking for..."
                    className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[var(--muted)]/70"
                  />
                  <SearchIcon />
                </label>
                <div className="grid text-base font-extrabold text-[#245362] lg:gap-1 lg:text-sm lg:text-white/86">
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="relative flex items-center justify-center border-b border-[#3e8491]/70 py-2.5 transition hover:text-[var(--red)] lg:justify-between lg:border-0 lg:px-2 lg:py-3 lg:text-white/86 lg:hover:text-white"
                    >
                      <span>{item.label}</span>
                      <span className="absolute right-0 lg:static">
                        <ChevronDownIcon />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <a href="#" className="flex items-center justify-center" aria-label="Faith Associates home">
            <Image
              src="/assets/faith-associates-logo.png"
              alt="Faith Associates"
              width={165}
              height={90}
              priority
              className="h-12 w-auto object-contain sm:h-14"
            />
          </a>
          <div className="hidden items-center gap-8 text-[13px] font-bold text-white/82 xl:flex">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="inline-flex items-center gap-1 transition hover:text-white">
                {item.label}
                {item.label === "Services" || item.label === "International" ? <ChevronDownIcon /> : null}
              </a>
            ))}
          </div>
          <div className="flex items-center justify-end gap-3 text-sm font-bold text-[var(--ink)] sm:gap-5 lg:text-white/88">
            <a href="#projects" className="hidden transition hover:text-[var(--red)] sm:inline-flex lg:hover:text-white">
              Explore
            </a>
            <a
              href="#contact"
              className="inline-flex rounded-full border border-[#3e8491] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.04em] text-[#245362] transition hover:bg-[#3e8491] hover:text-white sm:px-5 lg:hidden"
            >
              Enquire
            </a>
            <button type="button" aria-label="Search" className="hidden transition hover:text-white lg:inline-flex">
              <SearchIcon />
            </button>
            <button type="button" aria-label="Saved items" className="hidden transition hover:text-white lg:inline-flex">
              <BookmarkIcon />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
