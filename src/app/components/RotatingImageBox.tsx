"use client";

import Image from "next/image";
import { startTransition, useEffect, useEffectEvent, useState } from "react";

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

  const advanceSlide = useEffectEvent(() => {
    startTransition(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % images.length);
    });
  });

  useEffect(() => {
    if (images.length < 2) return;

    const intervalId = window.setInterval(() => {
      advanceSlide();
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [images.length, intervalMs]);

  return (
    <div className="relative mx-auto w-full max-w-[1080px] overflow-hidden rounded-[28px] border border-[#d5cec1] bg-[#d9d4ca] shadow-[0_24px_60px_rgba(7,19,29,0.18)] aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/8.8]">
      <Image
        key={images[activeIndex].src}
        src={images[activeIndex].src}
        alt={images[activeIndex].alt}
        fill
        sizes="(max-width: 1200px) 100vw, 1080px"
        className="object-cover"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0d1823]/28 to-transparent" />

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {images.map((image, index) => (
          <span
            key={image.src}
            aria-hidden="true"
            className={`h-2.5 rounded-full transition-all ${
              index === activeIndex ? "w-8 bg-white" : "w-2.5 bg-white/45"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
