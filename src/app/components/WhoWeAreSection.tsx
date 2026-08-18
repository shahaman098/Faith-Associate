"use client";

import Link from "next/link";
import { useState } from "react";
import type { HomeBlocks } from "@/lib/cms/types";
import { EditableImage } from "./cms/EditableImage";
import { EditableText } from "./cms/EditableText";
import { ArrowIcon } from "./icons";

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

const defaultStats = [
  { value: "5000+", label: "Mosques supported" },
  { value: "3467+", label: "Madrassahs engaged" },
  { value: "20+", label: "Years of impact" },
];

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
    ctaLabel: "More about us",
    ctaHref: "/about",
    secondaryCtaLabel: "Our history since 2004",
    secondaryCtaHref: "/about/history",
    statValue: "5000+",
    statLabel: "Mosques",
    statSublabel: "Supported across communities",
    stats: defaultStats,
    slides: missionSlides,
  };
  const stats = data.stats?.length
    ? data.stats
    : [{ value: data.statValue, label: data.statLabel }, ...defaultStats.slice(1)];
  const slides = data.slides?.length ? data.slides : missionSlides;

  const [missionIndex, setMissionIndex] = useState(0);
  const mission = slides[missionIndex] ?? slides[0];

  const moveMission = (direction: -1 | 1) => {
    setMissionIndex((current) => {
      const next = current + direction;
      if (next < 0) return slides.length - 1;
      if (next >= slides.length) return 0;
      return next;
    });
  };

  return (
    <section id="who-we-are" className="bg-white">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
        {/* Photography column */}
        <div className="relative order-2 min-h-[380px] overflow-hidden sm:min-h-[460px] lg:order-none lg:min-h-[720px]">
          <EditableImage
            src={data.image}
            alt={data.imageAlt}
            path="whoWeAre.image"
            positionPath="whoWeAre.imagePosition"
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            quality={90}
            defaultPosition="50% 42%"
            className="object-cover"
            priority
          />
          {/* Proof strip sits over the photograph so the band never reads as decorative */}
          <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 gap-px bg-[rgba(255,255,255,0.16)]">
            {stats.map((stat, index) => (
              <div key={stat.label} className="bg-[var(--navy)]/92 px-4 py-5 backdrop-blur-sm sm:px-6 sm:py-7">
                <p className="stat-figure text-[clamp(1.6rem,2.6vw,2.5rem)] text-white">
                  <EditableText value={stat.value} path={`whoWeAre.stats.${index}.value`} />
                </p>
                <p className="type-meta mt-2 text-[10px] leading-tight text-[var(--blue-light)] sm:text-[11px]">
                  <EditableText value={stat.label} path={`whoWeAre.stats.${index}.label`} />
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Copy + mission column */}
        <div className="order-1 flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-16 lg:order-none lg:px-14 lg:py-20 xl:px-20">
          <p className="type-eyebrow text-[var(--blue)]">
            <EditableText value={data.eyebrow} path="whoWeAre.eyebrow" />
          </p>
          <h2 className="type-display mt-4 max-w-[17ch] text-[clamp(1.9rem,3.6vw,3.1rem)] text-[var(--ink)]">
            <EditableText value={data.title} path="whoWeAre.title" />
          </h2>
          <div className="rule-red mt-6" />

          <div className="type-body mt-6 max-w-[38rem] space-y-4 text-[1rem] text-[var(--muted)] sm:text-[1.05rem]">
            <EditableText value={data.body[0] ?? ""} path="whoWeAre.body.0" as="p" multiline />
            <EditableText value={data.body[1] ?? ""} path="whoWeAre.body.1" as="p" multiline />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={data.ctaHref} className="btn-primary w-full sm:w-auto">
              <EditableText value={data.ctaLabel} path="whoWeAre.ctaLabel" />
              <ArrowIcon />
            </Link>
            <Link
              href={data.secondaryCtaHref ?? "/about/history"}
              className="btn-secondary w-full border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white sm:w-auto"
            >
              <EditableText
                value={data.secondaryCtaLabel ?? "Our history since 2004"}
                path="whoWeAre.secondaryCtaLabel"
              />
            </Link>
          </div>

          {/* Mission / approach / commitment */}
          <div className="mt-10 border-t border-[var(--line)] pt-8 lg:mt-12">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <h3 className="type-title text-[1.4rem] text-[var(--ink)] sm:text-[1.65rem]">
                  <EditableText value={mission.title} path={`whoWeAre.slides.${missionIndex}.title`} />
                </h3>
                <p className="type-body mt-3 max-w-[36rem] text-[0.98rem] text-[var(--muted)]">
                  <EditableText value={mission.body} path={`whoWeAre.slides.${missionIndex}.body`} multiline />
                </p>
              </div>
              <span className="index-number index-number--quiet shrink-0" aria-hidden="true">
                {String(missionIndex + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => moveMission(-1)}
                className="inline-flex size-11 cursor-pointer items-center justify-center border border-[var(--line)] text-[var(--ink)] transition duration-300 hover:border-[var(--blue)] hover:bg-[var(--blue)] hover:text-white"
                aria-label="Previous mission highlight"
              >
                <ArrowIcon className="size-5 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => moveMission(1)}
                className="inline-flex size-11 cursor-pointer items-center justify-center border border-[var(--line)] text-[var(--ink)] transition duration-300 hover:border-[var(--blue)] hover:bg-[var(--blue)] hover:text-white"
                aria-label="Next mission highlight"
              >
                <ArrowIcon className="size-5" />
              </button>
              <span className="type-meta ml-2 text-[var(--muted)]">
                {missionIndex + 1} / {slides.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
