"use client";

import { startTransition, useEffect, useState } from "react";

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

export function RotatingHeroCopy({ items }: { items: HeroMessage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;

    const intervalId = window.setInterval(() => {
      startTransition(() => {
        setActiveIndex((currentIndex) => (currentIndex + 1) % items.length);
      });
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [items.length]);

  const activeItem = items[activeIndex];

  return (
    <div aria-live="polite" className="mx-auto max-w-[660px] pt-8 text-center sm:pt-12 lg:mx-0 lg:pt-24 lg:text-left">
      <p className="text-xs font-extrabold tracking-[0.02em] text-white/88 sm:text-sm">{activeItem.eyebrow}</p>
      <h1 className="mx-auto mt-4 max-w-[12ch] font-sans text-4xl font-semibold leading-none tracking-[-0.05em] text-white sm:mt-5 sm:text-6xl lg:mx-0 lg:text-[64px] xl:text-[70px] 2xl:text-[76px]">
        {activeItem.title}
      </h1>
      <p className="mx-auto mt-4 max-w-[580px] text-sm leading-6 text-white/82 sm:mt-6 sm:text-base sm:leading-7 lg:mx-0 lg:text-[17px]">{activeItem.body}</p>
      <a
        href={activeItem.href}
        className="mt-5 inline-flex items-center justify-center gap-3 text-xs font-extrabold uppercase tracking-[0.08em] text-white transition hover:text-[var(--gold)] sm:mt-8 sm:text-sm lg:justify-start"
      >
        {activeItem.ctaLabel}
        <span className="inline-flex h-px w-8 bg-white/70 sm:w-12" />
        <ArrowIcon />
      </a>
    </div>
  );
}
