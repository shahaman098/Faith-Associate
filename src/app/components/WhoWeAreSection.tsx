"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { HomeBlocks } from "@/lib/cms/types";
import { EditableImage } from "./cms/EditableImage";
import { EditableText } from "./cms/EditableText";

const missionSlides = [
  {
    title: "Our Mission.",
    body: "We help faith institutions turn complexity into capability by combining specialist knowledge, partnership working and grounded sector understanding.",
  },
  {
    title: "Our Approach.",
    body: "We work alongside mosque, madrassah and charity leaders with practical frameworks that strengthen governance, safeguarding, security and community impact.",
  },
  {
    title: "Our Commitment.",
    body: "Since 2004 we have supported institutions with research, training and advice that is culturally informed, operationally useful and built for real-world pressure.",
  },
];

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      className={`size-5 ${direction === "left" ? "rotate-180" : ""}`}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M3 8h9M8.5 3.5 13 8l-4.5 4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function WhoWeAreSection({ content }: { content?: HomeBlocks["whoWeAre"] }) {
  const data = content ?? {
    eyebrow: "Who we are",
    title: "We work with you to raise standards in faith institutions.",
    body: [
      "Faith Associates is a specialist consultancy helping mosques, madrassahs and community organisations overcome critical challenges and seize their greatest opportunities.",
      "Our work is rooted in deep collaboration across a global network of practitioners dedicated to building capable, resilient and trusted faith institutions every day.",
    ],
    image: "/assets/real/who-we-are-roundtable.jpg",
    imageAlt: "Faith Associates roundtable with community leaders at Al Manaar",
    ctaLabel: "More About Us", ctaHref: "/about", statValue: "5000+", statLabel: "Mosques",
    statSublabel: "Supported across communities", slides: missionSlides,
  };
  const [missionIndex, setMissionIndex] = useState(0);
  const mission = data.slides[missionIndex] ?? data.slides[0];

  const moveMission = (direction: -1 | 1) => {
    setMissionIndex((current) => {
      const next = current + direction;
      if (next < 0) return data.slides.length - 1;
      if (next >= data.slides.length) return 0;
      return next;
    });
  };

  return (
    <section id="who-we-are" className="bg-white">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.2fr)_minmax(0,0.92fr)]">
        <div className="relative order-2 aspect-[16/10] overflow-hidden sm:aspect-[5/3] lg:order-none lg:aspect-auto lg:min-h-[680px]">
          <EditableImage
            src={data.image}
            alt={data.imageAlt}
            path="whoWeAre.image"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            quality={90}
            className="object-cover object-center transition duration-700 hover:scale-[1.03]"
            priority
          />
        </div>

        <div className="order-1 flex flex-col justify-center px-6 py-10 text-center sm:px-10 sm:py-14 sm:text-left lg:order-none lg:px-12 lg:py-16 xl:px-16">
          <p className="type-eyebrow text-[var(--blue)]">
            <EditableText value={data.eyebrow} path="whoWeAre.eyebrow" />
          </p>
          <h2 className="type-display mx-auto mt-4 max-w-[18ch] text-[clamp(1.75rem,4.8vw,2.85rem)] text-[var(--ink)] sm:mx-0 sm:mt-5 sm:max-w-[16ch]">
            <EditableText value={data.title} path="whoWeAre.title" />
          </h2>
          <div className="type-body mx-auto mt-4 max-w-[34rem] space-y-3 text-[0.95rem] text-[var(--muted)] sm:mx-0 sm:mt-7 sm:space-y-4 sm:text-[1rem]">
            <EditableText value={data.body[0] ?? ""} path="whoWeAre.body.0" as="p" multiline />
            <EditableText value={data.body[1] ?? ""} path="whoWeAre.body.1" as="p" multiline className="hidden sm:block" />
          </div>
          <Link
            href={data.ctaHref}
            className="btn-secondary mt-7 w-full border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white sm:mt-9 sm:w-fit"
          >
            <EditableText value={data.ctaLabel} path="whoWeAre.ctaLabel" />
          </Link>
        </div>

        <div className="relative order-3 grid bg-[var(--soft)] sm:grid-cols-2 lg:order-none lg:min-h-[680px] lg:grid-cols-1 lg:grid-rows-2">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 hidden h-44 w-44 overflow-hidden opacity-35 sm:block"
          >
            <div className="absolute -right-12 -top-20 size-56 rounded-full border border-[var(--line)]" />
            <div className="absolute -right-4 -top-10 size-40 rounded-full border border-[var(--line)]" />
            <div className="absolute right-8 top-2 size-28 rounded-full border border-[var(--line)]" />
          </div>

          <div className="flex flex-col items-center justify-center px-6 py-8 text-center sm:items-start sm:px-10 sm:py-10 sm:text-left lg:px-10 xl:px-12">
            <p className="type-display text-[2.75rem] text-black sm:text-[clamp(3rem,6vw,4.25rem)]">
              <EditableText value={data.statValue} path="whoWeAre.statValue" />
            </p>
            <EditableText value={data.statLabel} path="whoWeAre.statLabel" as="p" className="type-meta mt-3 text-black sm:mt-4" />
            <p className="type-meta mt-1.5 text-[var(--muted)] sm:mt-2">
              <EditableText value={data.statSublabel} path="whoWeAre.statSublabel" />
            </p>
          </div>

          <div className="flex flex-col justify-between px-6 py-8 text-center sm:px-10 sm:py-10 sm:text-left lg:px-10 lg:py-10 xl:px-12">
            <div>
              <h3 className="type-title text-[1.35rem] text-black sm:text-[1.6rem]">
                <EditableText value={mission.title} path={`whoWeAre.slides.${missionIndex}.title`} />
              </h3>
              <p className="type-body mx-auto mt-3 max-w-[30rem] text-[0.92rem] text-[var(--muted)] sm:mx-0 sm:mt-4 sm:text-[0.95rem]">
                <EditableText value={mission.body} path={`whoWeAre.slides.${missionIndex}.body`} />
              </p>
            </div>

            <div className="mt-5 flex items-center justify-center gap-4 sm:mt-8 sm:justify-start">
              <button
                type="button"
                onClick={() => moveMission(-1)}
                className="inline-flex size-10 cursor-pointer items-center justify-center border border-[var(--line)] text-[var(--ink)] transition duration-300 hover:border-[var(--blue)] hover:text-[var(--blue)]"
                aria-label="Previous mission highlight"
              >
                <ArrowIcon direction="left" />
              </button>
              <button
                type="button"
                onClick={() => moveMission(1)}
                className="inline-flex size-10 cursor-pointer items-center justify-center border border-[var(--line)] text-[var(--ink)] transition duration-300 hover:border-[var(--blue)] hover:text-[var(--blue)]"
                aria-label="Next mission highlight"
              >
                <ArrowIcon direction="right" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
