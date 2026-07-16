"use client";

import Image from "next/image";
import { startTransition, useEffect, useEffectEvent, useRef, useState } from "react";

export type ServiceSlide = {
  title: string;
  body: string;
  image: string;
  imageClassName: string;
  imageShellClassName: string;
};

type ServicesCarouselProps = {
  items: ServiceSlide[];
};

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      className={`size-4 shrink-0 ${direction === "left" ? "rotate-180" : ""}`}
      viewBox="0 0 16 16"
      fill="none"
    >
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

export function ServicesCarousel({ items }: ServicesCarouselProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [controls, setControls] = useState({
    canPrev: false,
    canNext: items.length > 1,
  });

  const syncRailState = useEffectEvent(() => {
    const rail = railRef.current;
    if (!rail) return;

    const cards = Array.from(rail.querySelectorAll<HTMLElement>("[data-service-slide='true']"));
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

    const maxScrollLeft = rail.scrollWidth - rail.clientWidth - 2;
    const nextControls = {
      canPrev: rail.scrollLeft > 8,
      canNext: rail.scrollLeft < maxScrollLeft,
    };

    startTransition(() => {
      setActiveIndex((currentIndex) => (currentIndex === nearestIndex ? currentIndex : nearestIndex));
      setControls((currentControls) =>
        currentControls.canPrev === nextControls.canPrev && currentControls.canNext === nextControls.canNext
          ? currentControls
          : nextControls
      );
    });
  });

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    syncRailState();

    const handleScroll = () => {
      syncRailState();
    };

    const handleResize = () => {
      syncRailState();
    };

    rail.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      rail.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [items.length]);

  const moveToSlide = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;

    const cards = Array.from(rail.querySelectorAll<HTMLElement>("[data-service-slide='true']"));
    if (cards.length === 0) return;

    const targetIndex = Math.max(0, Math.min(cards.length - 1, activeIndex + direction));
    cards[targetIndex].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });

    startTransition(() => {
      setActiveIndex(targetIndex);
    });
  };

  return (
    <div className="mt-12">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--muted)]">
          Slide to explore additional services
        </p>
        <div className="flex items-center gap-3">
          <p className="min-w-12 text-right text-sm font-bold text-[var(--muted)]">
            {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => moveToSlide(-1)}
              disabled={!controls.canPrev}
              className="inline-flex size-12 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--ink)] transition hover:border-[var(--red)] hover:text-[var(--red)] disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Show previous service"
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={() => moveToSlide(1)}
              disabled={!controls.canNext}
              className="inline-flex size-12 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--ink)] transition hover:border-[var(--red)] hover:text-[var(--red)] disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Show next service"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={railRef}
        className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((service) => (
          <article
            key={service.title}
            data-service-slide="true"
            className="group min-w-[88%] snap-start border border-[var(--line)] bg-white sm:min-w-[calc(50%-0.75rem)] xl:min-w-[calc((100%-3rem)/3)]"
          >
            <div className={`relative aspect-[1.18/1] overflow-hidden ${service.imageShellClassName}`}>
              <Image
                src={service.image}
                alt=""
                fill
                sizes="(max-width: 640px) 88vw, (max-width: 1279px) 50vw, 33vw"
                className={`${service.imageClassName} transition duration-500 group-hover:scale-105`}
              />
            </div>
            <div className="p-7">
              <h3 className="font-display text-2xl font-bold tracking-[-0.03em] text-[var(--ink)]">{service.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{service.body}</p>
              <a href="#contact" className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-[var(--ink)]">
                Discuss this service
                <ArrowIcon direction="right" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
