"use client";

import { startTransition, useEffect, useEffectEvent, useRef, useState } from "react";
import { EditableText } from "./cms/EditableText";
import { useEdit } from "./cms/EditProvider";
import { capabilityIcons } from "./icons";

export type CapabilityItem = {
  title: string;
  body: string;
  icon: "institution" | "security" | "cohesion" | "networks";
};

type WhatWeDoCarouselProps = {
  items: CapabilityItem[];
};

const capabilityIconOptions: Array<{ value: CapabilityItem["icon"]; label: string }> = [
  { value: "institution", label: "Institution" },
  { value: "security", label: "Security" },
  { value: "cohesion", label: "Cohesion" },
  { value: "networks", label: "Networks" },
];

function isCapabilityIcon(value: unknown): value is CapabilityItem["icon"] {
  return capabilityIconOptions.some((option) => option.value === value);
}

function CapabilityIcon({ type }: { type: CapabilityItem["icon"] }) {
  const Glyph = capabilityIcons[type] ?? capabilityIcons.institution;
  return <Glyph />;
}

export function WhatWeDoCarousel({ items }: WhatWeDoCarouselProps) {
  const { editing, setPageField } = useEdit();
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
      className="-mx-6 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 sm:snap-none lg:mt-14 lg:grid-cols-4 lg:gap-5 [&::-webkit-scrollbar]:hidden"
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
          key={index}
          data-capability-slide="true"
          className="group flex h-full w-[calc(100vw-2.75rem)] shrink-0 snap-center flex-col border border-[var(--line)] bg-white p-6 text-center transition duration-300 hover:border-[var(--blue)] sm:w-auto sm:shrink sm:snap-none sm:p-8 sm:text-left"
        >
          <div className="flex flex-col items-center gap-3 sm:items-start">
            <span className="icon-tile icon-tile-lg">
              <CapabilityIcon type={isCapabilityIcon(item.icon) ? item.icon : "institution"} />
            </span>
            {editing ? (
              <label className="flex flex-col items-center gap-1 sm:items-start">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                  Icon
                </span>
                <select
                  value={isCapabilityIcon(item.icon) ? item.icon : "institution"}
                  onChange={(event) => {
                    setPageField(`whatWeDo.capabilities.${index}.icon`, event.currentTarget.value);
                  }}
                  className="border border-[var(--line)] bg-white px-3 py-1.5 text-[11px] font-semibold text-[var(--ink)]"
                >
                  {capabilityIconOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <p className="index-number index-number--quiet" aria-hidden="true">0{index + 1}</p>
          </div>
          <h3 className="type-title mt-5 text-[1.3rem] text-[var(--ink)] sm:text-[1.5rem]">
            <EditableText value={item.title} path={`whatWeDo.capabilities.${index}.title`} />
          </h3>
          <p className="type-body mt-3 text-[0.95rem] text-[var(--muted)] sm:mt-4">
            <EditableText value={item.body} path={`whatWeDo.capabilities.${index}.body`} multiline />
          </p>
        </article>
      ))}
    </div>
  );
}
