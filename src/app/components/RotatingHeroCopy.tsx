"use client";

import { startTransition, useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type HeroMessage = {
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  href: string;
};

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

export function RotatingHeroCopy({
  items,
  align = "left",
  layout = "standard",
}: {
  items: HeroMessage[];
  align?: "left" | "center";
  layout?: "standard" | "immersive";
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (items.length < 2 || paused || prefersReducedMotion) return;

    const intervalId = window.setInterval(() => {
      startTransition(() => {
        setActiveIndex((currentIndex) => (currentIndex + 1) % items.length);
      });
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [items.length, paused, prefersReducedMotion]);

  const activeItem = items[activeIndex];
  const isCentered = align === "center";
  const isImmersive = layout === "immersive";
  const wrapperClassName = isCentered
    ? "mx-auto max-w-[700px] text-center pt-0"
    : isImmersive
      ? "mx-auto max-w-[700px] text-center pt-0 lg:mx-0 lg:text-left"
      : "mx-auto max-w-[700px] text-center pt-10 sm:pt-12 lg:mx-0 lg:pt-24 lg:text-left";
  const contentAlignClassName = isCentered
    ? "mx-auto"
    : isImmersive
      ? "mx-auto lg:mx-0"
      : "mx-auto lg:mx-0";
  const ctaAlignClassName = isCentered
    ? "justify-center"
    : isImmersive
      ? "justify-center lg:justify-start"
      : "justify-start";
  const pauseAlignClassName = isCentered
    ? "mx-auto"
    : isImmersive
      ? "mx-auto lg:mx-0"
      : "mx-0";

  return (
    <div className={wrapperClassName}>
      <p className="type-eyebrow text-[var(--blue-light)]">{activeItem.eyebrow}</p>
      <h1
        className={`type-display mt-4 max-w-[14ch] text-[clamp(2.15rem,5.6vw,4.25rem)] text-white sm:mt-5 ${contentAlignClassName}`}
      >
        {activeItem.title}
      </h1>
      <p
        className={`type-body mt-5 max-w-[28rem] text-[1rem] text-white/78 sm:mt-6 sm:text-[1.1rem] ${contentAlignClassName}`}
      >
        {activeItem.body}
      </p>
      <a
        href={activeItem.href}
        className={`type-cta mt-8 inline-flex items-center gap-3 border-b border-white/40 pb-1 text-white transition duration-300 hover:border-[var(--blue-light)] hover:text-[var(--blue-light)] sm:mt-10 ${ctaAlignClassName}`}
      >
        {activeItem.ctaLabel}
        <ArrowIcon />
      </a>
      {items.length > 1 && !prefersReducedMotion ? (
        <button
          type="button"
          onClick={() => setPaused((isPaused) => !isPaused)}
          className={`type-meta mt-6 block cursor-pointer text-white/40 transition duration-300 hover:text-white/70 ${pauseAlignClassName}`}
        >
          {paused ? "Resume" : "Pause"}
        </button>
      ) : null}
    </div>
  );
}
