"use client";

import Image from "next/image";
import { startTransition, useEffect, useEffectEvent, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type RotatingImage = {
  src: string;
  alt: string;
};

type RotatingImageBoxProps = {
  images: RotatingImage[];
  intervalMs?: number;
};

export function RotatingImageBox({
  images,
  intervalMs = 4200,
}: RotatingImageBoxProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const advanceSlide = useEffectEvent(() => {
    startTransition(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % images.length);
    });
  });

  useEffect(() => {
    if (images.length < 2 || paused || prefersReducedMotion) return;

    const intervalId = window.setInterval(() => {
      advanceSlide();
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [images.length, intervalMs, paused, prefersReducedMotion]);

  return (
    <div className="media-frame relative mx-auto aspect-[16/10] w-full max-w-[1080px] sm:aspect-[16/9] lg:aspect-[16/8.8]">
      <Image
        key={images[activeIndex].src}
        src={images[activeIndex].src}
        alt={images[activeIndex].alt}
        fill
        sizes="(max-width: 1200px) 100vw, 1080px"
        className="object-cover"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--navy)]/28 to-transparent" />

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 bg-[var(--navy)]/55 px-3 py-2 backdrop-blur">
        {images.map((image, index) => (
          <button
            type="button"
            key={image.src}
            aria-label={`Show image ${index + 1} of ${images.length}`}
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 cursor-pointer transition-all ${
              index === activeIndex ? "w-8 bg-white" : "w-2.5 bg-white/45"
            }`}
          />
        ))}
        {!prefersReducedMotion ? (
          <button
            type="button"
            onClick={() => setPaused((isPaused) => !isPaused)}
            className="type-meta ml-1 cursor-pointer text-white"
          >
            {paused ? "Play" : "Pause"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
