"use client";

import { startTransition, useEffect, useEffectEvent, useRef, useState } from "react";

export type CapabilityItem = {
  title: string;
  body: string;
  icon: "institution" | "security" | "cohesion" | "networks";
};

type WhatWeDoCarouselProps = {
  items: CapabilityItem[];
};

function CapabilityIcon({ type }: { type: CapabilityItem["icon"] }) {
  const common = {
    className: "size-7",
    viewBox: "0 0 32 32",
    fill: "none",
    "aria-hidden": true as const,
  };

  if (type === "institution") {
    return (
      <svg {...common}>
        <path d="M6 26h20M8 26V14l8-6 8 6v12" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M13 26v-6h6v6M16 8v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 17.5h2M19 17.5h2M11 21h2M19 21h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "security") {
    return (
      <svg {...common}>
        <path
          d="M16 4.5 25 8.5v7.2c0 5.2-3.7 9.6-9 10.8-5.3-1.2-9-5.6-9-10.8V8.5L16 4.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="m12.2 16.2 2.5 2.5 5.1-5.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "cohesion") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="21" cy="11" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M5.5 24c.8-3.4 3.2-5.2 5.5-5.2s4.7 1.8 5.5 5.2M15.5 24c.8-3.4 3.2-5.2 5.5-5.2s4.7 1.8 5.5 5.2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="16" cy="16" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 16h18M16 7c2.6 2.4 4 5.1 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.1-4-9s1.4-6.6 4-9Z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16" cy="16" r="2" fill="currentColor" />
    </svg>
  );
}

export function WhatWeDoCarousel({ items }: WhatWeDoCarouselProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobileRail, setIsMobileRail] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches,
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const syncActiveIndex = useEffectEvent(() => {
    const rail = railRef.current;
    if (!rail) return;

    const cards = Array.from(rail.querySelectorAll<HTMLElement>("[data-capability-slide='true']"));
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

    const cards = Array.from(rail.querySelectorAll<HTMLElement>("[data-capability-slide='true']"));
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

    syncActiveIndex();

    const handleScroll = () => {
      syncActiveIndex();
    };

    rail.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      rail.removeEventListener("scroll", handleScroll);
    };
  }, [items.length]);

  useEffect(() => {
    if (!isMobileRail || items.length <= 1 || isPaused || prefersReducedMotion) return;

    const intervalId = window.setInterval(() => {
      autoAdvance();
    }, 4000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [items.length, isMobileRail, isPaused, prefersReducedMotion]);

  return (
    <div
      ref={railRef}
      className="-mx-6 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 sm:overflow-visible sm:px-0 sm:pb-0 sm:snap-none lg:mt-14 lg:grid-cols-4 lg:gap-10 [&::-webkit-scrollbar]:hidden"
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
      {items.map((item, index) => (
        <article
          key={item.title}
          data-capability-slide="true"
          className="group flex h-full w-[calc(100vw-2.75rem)] shrink-0 snap-center flex-col text-center sm:w-auto sm:shrink sm:snap-none sm:text-left"
        >
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <span className="inline-flex size-11 items-center justify-center text-[var(--blue)] transition duration-300 group-hover:text-[var(--blue-dark)]">
              <CapabilityIcon type={item.icon} />
            </span>
            <p className="capability-index">0{index + 1}</p>
          </div>
          <h3 className="type-title mt-4 text-[1.25rem] text-[var(--ink)] sm:text-[1.4rem]">{item.title}</h3>
          <p className="type-body mt-3 text-sm text-[var(--muted)] sm:mt-4">{item.body}</p>
        </article>
      ))}
    </div>
  );
}
