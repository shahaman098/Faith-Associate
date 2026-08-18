"use client";

import Link from "next/link";
import { startTransition, useEffect, useEffectEvent, useRef, useState } from "react";
import { EditableImage } from "./cms/EditableImage";
import { EditableText } from "./cms/EditableText";
import { useEdit } from "./cms/EditProvider";
import { ArrowIcon } from "./icons";

export type ServiceIcon = "sport" | "security" | "leadership" | "environment";

export type ServiceSlide = {
  title: string;
  image: string;
  href: string;
  icon: ServiceIcon;
};

type ServicesCarouselProps = {
  items: ServiceSlide[];
};

function ServiceIconMark({ type }: { type: ServiceIcon }) {
  const common = {
    viewBox: "0 0 32 32",
    fill: "none",
    "aria-hidden": true as const,
  };

  if (type === "sport") {
    return (
      <svg {...common}>
        <circle cx="11" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="21" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M6.5 22.5c.7-3.2 2.8-5 4.5-5s3.8 1.8 4.5 5M16.5 22.5c.7-3.2 2.8-5 4.5-5s3.8 1.8 4.5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="16" cy="15.5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }

  if (type === "security") {
    return (
      <svg {...common}>
        <path
          d="M16 4.5 25 8v7.4c0 5.4-3.8 9.9-9 11.1-5.2-1.2-9-5.7-9-11.1V8l9-3.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="m12.4 15.8 2.4 2.4 4.8-5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "leadership") {
    return (
      <svg {...common}>
        <path
          d="M7 23V13.5M16 23V8.5M25 23V16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M7 13.5h3.5L16 8.5 25 16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="7" cy="13.5" r="1.6" fill="currentColor" />
        <circle cx="16" cy="8.5" r="1.6" fill="currentColor" />
        <circle cx="25" cy="16" r="1.6" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path
        d="M8 18.5c0-4.2 3.4-7.5 8-7.5s8 3.3 8 7.5c0 4.6-4.2 8.2-8 10.5-3.8-2.3-8-5.9-8-10.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M16 13.5c.9 1.1 1.4 2.3 1.4 3.5 0 1.8-1.4 3.2-1.4 3.2s-1.4-1.4-1.4-3.2c0-1.2.5-2.4 1.4-3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12.5 9.5 16 6l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ServicesCarousel({ items }: ServicesCarouselProps) {
  const { editing } = useEdit();
  const rootRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
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

    startTransition(() => {
      setActiveIndex((current) => (current === nearestIndex ? current : nearestIndex));
    });
  });

  const autoAdvance = useEffectEvent(() => {
    const rail = railRef.current;
    if (!rail) return;

    const cards = Array.from(rail.querySelectorAll<HTMLElement>("[data-service-slide='true']"));
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
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

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
    <div ref={rootRef} className="mt-10 sm:mt-12 lg:mt-14">
      <div
        ref={railRef}
        className="
          -mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-5
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0
          lg:grid-cols-4 lg:gap-6
        "
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
        {items.map((service, index) => {
          const reveal = visible
            ? "translate-y-0 opacity-100"
            : "translate-y-6 opacity-0";

          const cardClassName = `
                group relative isolate flex aspect-[3/4] w-[calc(100vw-2.75rem)] shrink-0 snap-center
                flex-col justify-end overflow-hidden bg-[var(--navy)]
                transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                sm:w-auto sm:shrink sm:snap-none sm:aspect-[4/5]
                lg:aspect-[3/4]
                ${reveal}
                focus-visible:z-10 focus-visible:outline focus-visible:outline-2
                focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--blue)]
              `;

          const cardBody = (
            <>
              <EditableImage
                src={service.image}
                alt={service.title || "Service image"}
                path={`servicesCarousel.items.${index}.image`}
                positionPath={`servicesCarousel.items.${index}.imagePosition`}
                fill
                sizes="(max-width: 640px) 72vw, (max-width: 1024px) 50vw, 25vw"
                defaultPosition="center 22%"
                className="object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(7,19,29,0.08)_0%,rgba(7,19,29,0.2)_38%,rgba(7,19,29,0.82)_72%,rgba(7,19,29,0.96)_100%)] transition duration-500 group-hover:bg-[linear-gradient(180deg,rgba(7,19,29,0.12)_0%,rgba(7,19,29,0.28)_34%,rgba(7,19,29,0.88)_70%,rgba(7,19,29,0.98)_100%)]"
              />

              <div
                className={`relative z-10 flex flex-col gap-4 p-5 sm:gap-5 sm:p-6 lg:p-7 ${
                  editing ? "pointer-events-none" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="icon-tile icon-tile--ghost transition duration-300 group-hover:border-[var(--blue)] group-hover:bg-[var(--blue)]">
                    <ServiceIconMark type={service.icon} />
                  </span>
                  <span className="index-number index-number--on-navy" aria-hidden="true">
                    0{index + 1}
                  </span>
                </div>

                <div>
                  <h3 className="type-title text-[1.3rem] leading-snug text-white sm:text-[1.45rem]">
                    <EditableText value={service.title} path={`servicesCarousel.items.${index}.title`} />
                  </h3>
                  <span className="type-cta mt-3 inline-flex items-center gap-2 text-white/78 transition duration-300 group-hover:text-[var(--blue-light)]">
                    Explore
                    <ArrowIcon className="size-4 transition duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>

              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-[var(--red)] transition duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
            </>
          );

          if (editing) {
            return (
              <div
                key={service.title}
                data-service-slide="true"
                style={{ transitionDelay: visible ? `${index * 80}ms` : "0ms" }}
                className={cardClassName}
              >
                {cardBody}
              </div>
            );
          }

          return (
            <Link
              key={service.title}
              href={service.href}
              data-service-slide="true"
              style={{ transitionDelay: visible ? `${index * 80}ms` : "0ms" }}
              className={cardClassName}
            >
              {cardBody}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
