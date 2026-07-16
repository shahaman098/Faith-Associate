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
    <div aria-live="polite" className="max-w-[660px] pt-20 sm:pt-24 lg:pt-24">
      <p className="text-sm font-extrabold tracking-[0.02em] text-white/88">{activeItem.eyebrow}</p>
      <h1 className="mt-5 max-w-[11ch] font-sans text-5xl font-semibold leading-[0.98] tracking-[-0.05em] text-white sm:text-6xl lg:text-[64px] xl:text-[70px] 2xl:text-[76px]">
        {activeItem.title}
      </h1>
      <p className="mt-6 max-w-[580px] text-base leading-7 text-white/82 lg:text-[17px]">{activeItem.body}</p>
      <a
        href={activeItem.href}
        className="mt-8 inline-flex items-center gap-3 text-sm font-extrabold uppercase tracking-[0.08em] text-white transition hover:text-[var(--gold)]"
      >
        {activeItem.ctaLabel}
        <span className="inline-flex h-px w-12 bg-white/70" />
        <ArrowIcon />
      </a>
    </div>
  );
}
