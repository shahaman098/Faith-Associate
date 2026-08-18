"use client";

import Link from "next/link";
import { startTransition, useEffect, useEffectEvent, useRef, useState } from "react";
import { EditableImage } from "./cms/EditableImage";
import { EditableText } from "./cms/EditableText";
import { useEdit } from "./cms/EditProvider";

export type NewsUpdateItem = {
  title: string;
  image: string;
  meta: string;
  href: string;
};

type NewsUpdatesCarouselProps = {
  items: NewsUpdateItem[];
};

export function NewsUpdatesCarousel({ items }: NewsUpdatesCarouselProps) {
  const { editing } = useEdit();
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobileRail, setIsMobileRail] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches,
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const syncActiveIndex = useEffectEvent(() => {
    const rail = railRef.current;
    if (!rail) return;

    const cards = Array.from(rail.querySelectorAll<HTMLElement>("[data-news-slide='true']"));
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

    const cards = Array.from(rail.querySelectorAll<HTMLElement>("[data-news-slide='true']"));
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
    const mobileQuery = window.matchMedia("(max-width: 767px)");

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
      className="-mx-6 mt-8 flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto scroll-smooth px-5 pb-1 [scrollbar-width:none] md:mx-0 md:mt-10 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        const nextFocusedElement = event.relatedTarget;
        if (!(nextFocusedElement instanceof Node) || !railRef.current?.contains(nextFocusedElement)) {
          setIsPaused(false);
        }
      }}
    >
      {items.map((item, index) => {
        const body = (
          <>
            <div className="media-frame relative aspect-[16/10]">
              <EditableImage
                src={item.image}
                alt={item.title || "News image"}
                path={`newsCarousel.items.${index}.image`}
                positionPath={`newsCarousel.items.${index}.imagePosition`}
                fill
                sizes="(max-width: 768px) 85vw, 33vw"
                className="media-zoom object-cover"
              />
            </div>
            <div className={`flex flex-1 flex-col pt-5 text-left ${editing ? "pointer-events-none" : ""}`}>
              <p className="type-meta text-[var(--blue)]">
                <EditableText value={item.meta} path={`newsCarousel.items.${index}.meta`} />
              </p>
              <h3 className="type-title mt-2.5 text-[1.125rem] text-[var(--ink)] transition duration-300 group-hover:text-[var(--blue)] md:text-[1.2rem]">
                <EditableText value={item.title} path={`newsCarousel.items.${index}.title`} />
              </h3>
            </div>
          </>
        );

        if (editing) {
          return (
            <div
              key={item.title}
              data-news-slide="true"
              className="group flex min-h-full w-[calc(100vw-2.75rem)] shrink-0 snap-center flex-col md:min-w-0 md:w-auto md:shrink md:snap-none"
            >
              {body}
            </div>
          );
        }

        return (
          <Link
            key={item.title}
            href={item.href}
            data-news-slide="true"
            className="group flex min-h-full w-[calc(100vw-2.75rem)] shrink-0 snap-center flex-col md:min-w-0 md:w-auto md:shrink md:snap-none"
          >
            {body}
          </Link>
        );
      })}
    </div>
  );
}
