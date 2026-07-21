"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";

type Publication = {
  id: string;
  category: string;
  type: string;
  date: string;
  title: string;
  image: string;
  href: string;
};

const featuredPublications: Publication[] = [
  {
    id: "zakat-guide",
    category: "Mosque Standards",
    type: "Guide",
    date: "2026",
    title: "Mosque Collecting and Distributing Zakat Locally",
    image: "https://www.faithassociates.co.uk/wp-content/uploads/2026/03/Al-Fuqara-1.png",
    href: "/publications/zakat",
  },
  {
    id: "beacon-vision",
    category: "Vision",
    type: "Plan",
    date: "2020-2050",
    title: "Beacon Mosque Vision 2020-2050",
    image: "https://www.faithassociates.co.uk/wp-content/uploads/2019/12/Beacon-Mosque-Vision-2020-50-page-001.jpg",
    href: "/publications/beacon-mosque-vision-2020-2050",
  },
  {
    id: "beacon-awards-booklet",
    category: "Awards",
    type: "Booklet",
    date: "2025",
    title: "8th British Beacon Mosque Awards 2025 Booklet",
    image: "https://www.faithassociates.co.uk/wp-content/uploads/2026/01/WhatsApp-Image-2025-11-26-at-17.38.01-600x849-1.jpeg",
    href: "/publications/8th-british-beacon-mosque-awards-2025-booklet",
  },
  {
    id: "activity-report",
    category: "Governance",
    type: "Report",
    date: "2024",
    title: "Faith Associates 2024 Activity Report",
    image: "https://www.faithassociates.co.uk/wp-content/uploads/2024/12/Faith-Associates-2024-Report-1.png",
    href: "/publications/faith-associates-2024-activity-report",
  },
];

const publicationTabs = [
  { id: "all", label: "All" },
  { id: "Mosque Standards", label: "Standards" },
  { id: "Vision", label: "Vision" },
  { id: "Awards", label: "Awards" },
  { id: "Governance", label: "Governance" },
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

function PublicationCard({ publication }: { publication: Publication }) {
  return (
    <Link
      id={publication.id}
      href={publication.href}
      className="group flex h-full w-full scroll-mt-28 flex-col"
      aria-label={`Read ${publication.title}`}
    >
      <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-[var(--soft)]">
        <Image
          src={publication.image}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain object-center transition duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="mt-4 flex h-[4.75rem] items-start justify-center text-center sm:mt-5 sm:h-[5.25rem]">
        <h3 className="type-title line-clamp-3 text-[1.05rem] transition duration-300 group-hover:text-[var(--blue)] sm:text-[1.1rem]">
          {publication.title}
        </h3>
      </div>
    </Link>
  );
}

export function FeaturedPublications() {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobileRail, setIsMobileRail] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches,
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const visiblePublications = useMemo(() => {
    if (activeTab === "all") {
      return featuredPublications;
    }

    return featuredPublications.filter((publication) => publication.category === activeTab);
  }, [activeTab]);

  const syncActiveIndex = useEffectEvent(() => {
    const rail = railRef.current;
    if (!rail) return;

    const cards = Array.from(rail.querySelectorAll<HTMLElement>("[data-publication-slide='true']"));
    if (cards.length === 0) return;

    const leadingEdge = rail.scrollLeft;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - leadingEdge);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    startTransition(() => {
      setActiveIndex((current) => (current === nearestIndex ? current : nearestIndex));
    });
  });

  const autoAdvance = useEffectEvent(() => {
    const rail = railRef.current;
    if (!rail) return;

    const cards = Array.from(rail.querySelectorAll<HTMLElement>("[data-publication-slide='true']"));
    if (cards.length <= 1) return;

    const targetIndex = activeIndex >= cards.length - 1 ? 0 : activeIndex + 1;
    rail.scrollTo({
      left: cards[targetIndex].offsetLeft - cards[0].offsetLeft,
      behavior: "smooth",
    });

    startTransition(() => {
      setActiveIndex(targetIndex);
    });
  });

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 639px)");

    const handleReducedMotion = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    const handleMobile = (event: MediaQueryListEvent) => {
      setIsMobileRail(event.matches);
    };

    reducedMotion.addEventListener("change", handleReducedMotion);
    mobileQuery.addEventListener("change", handleMobile);

    return () => {
      reducedMotion.removeEventListener("change", handleReducedMotion);
      mobileQuery.removeEventListener("change", handleMobile);
    };
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    startTransition(() => {
      setActiveIndex(0);
    });
    rail.scrollTo({ left: 0 });
    syncActiveIndex();

    const handleScroll = () => {
      syncActiveIndex();
    };

    rail.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      rail.removeEventListener("scroll", handleScroll);
    };
  }, [visiblePublications.length, activeTab]);

  useEffect(() => {
    if (!isMobileRail || visiblePublications.length <= 1 || isPaused || prefersReducedMotion) {
      return;
    }

    const intervalId = window.setInterval(() => {
      autoAdvance();
    }, 4000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [visiblePublications.length, isMobileRail, isPaused, prefersReducedMotion, activeTab]);

  return (
    <section id="publications" className="border-b border-[var(--line)] bg-white py-12 lg:py-20">
      <div className="section-shell">
        <div className="mb-8 flex flex-col items-center gap-4 text-center md:mb-10">
          <div>
            <p className="type-eyebrow text-[var(--blue)]">Featured publication</p>
            <h2 className="type-display mt-3 text-[clamp(1.85rem,3.6vw,2.75rem)] text-[var(--ink)]">
              Standards, toolkits and reports.
            </h2>
          </div>
          <Link
            href="/publications"
            className="type-cta inline-flex items-center justify-center gap-2 text-[var(--blue)] transition duration-300 hover:text-[var(--blue-dark)]"
          >
            Browse all publications <ArrowIcon />
          </Link>
        </div>

        <div
          className="mb-6 hidden justify-center gap-0 overflow-x-auto border-b border-[var(--line)] sm:flex"
          role="group"
          aria-label="Filter featured publications by category"
        >
          {publicationTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-pressed={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="shrink-0 cursor-pointer border-b-2 border-transparent px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)] transition duration-300 hover:text-[var(--ink)] aria-pressed:border-[var(--blue)] aria-pressed:text-[var(--blue)]"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          ref={railRef}
          id="publication-grid"
          className="-mx-6 flex scroll-mt-24 snap-x snap-mandatory items-stretch gap-3 overflow-x-auto scroll-smooth px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:items-start sm:gap-5 sm:overflow-visible sm:px-0 sm:py-10 sm:snap-none lg:grid-cols-4 lg:gap-6 lg:py-14 [&::-webkit-scrollbar]:hidden"
          onPointerEnter={() => setIsPaused(true)}
          onPointerLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={(event) => {
            const nextFocusedElement = event.relatedTarget;
            if (!(nextFocusedElement instanceof Node) || !railRef.current?.contains(nextFocusedElement)) {
              setIsPaused(false);
            }
          }}
        >
          {visiblePublications.map((publication, index) => (
            <div
              key={publication.id}
              data-publication-slide="true"
              className={`flex h-full w-[calc(100vw-2.75rem)] shrink-0 snap-center sm:block sm:h-auto sm:w-auto sm:flex-none sm:snap-none ${
                index % 2 === 0
                  ? "sm:-translate-y-5 lg:-translate-y-8"
                  : "sm:translate-y-5 lg:translate-y-8"
              }`}
            >
              <PublicationCard publication={publication} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
