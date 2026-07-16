"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Publication = {
  id: string;
  category: string;
  type: string;
  date: string;
  title: string;
  image: string;
  imageClassName: string;
};

const featuredPublications: Publication[] = [
  {
    id: "activity-report",
    category: "Governance",
    type: "Report",
    date: "2024",
    title: "Faith Associates 2024 Activity Report",
    image: "/assets/real/fa-activity-report-2024.png",
    imageClassName: "object-cover",
  },
  {
    id: "zakat-guide",
    category: "Mosque Standards",
    type: "Guide",
    date: "2026",
    title: "Mosque Collecting and Distributing Zakat Locally",
    image: "/assets/real/faith-training-speaker.jpg",
    imageClassName: "object-cover",
  },
  {
    id: "beacon-awards-booklet",
    category: "Leadership Development",
    type: "Booklet",
    date: "2025",
    title: "8th British Beacon Mosque Awards 2025 Booklet",
    image: "/assets/real/beacon-awards-2025-booklet.jpg",
    imageClassName: "object-contain bg-white p-4",
  },
  {
    id: "security-toolkit",
    category: "Protective Security",
    type: "Toolkit",
    date: "2026",
    title: "Security in Places of Worship",
    image: "/assets/real/security-training-session.jpg",
    imageClassName: "object-cover",
  },
  {
    id: "eco-mosque",
    category: "Environmental Practice",
    type: "Research",
    date: "2025",
    title: "Eco-Mosque Net Zero Conference Resources",
    image: "/assets/real/eco-mosque-conference.jpg",
    imageClassName: "object-cover",
  },
  {
    id: "beacon-vision",
    category: "Public Sector",
    type: "Vision",
    date: "2020-2050",
    title: "Beacon Mosque Vision 2020-2050",
    image: "/assets/real/mosque-expo-awards-hall.jpg",
    imageClassName: "object-cover",
  },
  {
    id: "mosque-expo",
    category: "Community Programmes",
    type: "Briefing",
    date: "2026",
    title: "Mosque Expo 2026 Partner Briefing",
    image: "/assets/real/mosque-expo-2024-hall.jpg",
    imageClassName: "object-cover",
  },
  {
    id: "sport-inclusion",
    category: "Youth & Sport",
    type: "Update",
    date: "2026",
    title: "Inclusivity in Sport Programme Update",
    image: "/assets/eman-cup.webp",
    imageClassName: "object-cover",
  },
];

const publicationTabs = [
  { id: "all", label: "All" },
  { id: "Governance", label: "Governance" },
  { id: "Mosque Standards", label: "Standards" },
  { id: "Leadership Development", label: "Leadership" },
  { id: "Protective Security", label: "Security" },
  { id: "Environmental Practice", label: "Environment" },
  { id: "Public Sector", label: "Public Sector" },
  { id: "Community Programmes", label: "Programmes" },
  { id: "Youth & Sport", label: "Youth & Sport" },
];

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

function toColumns(publications: Publication[]) {
  if (publications.length === featuredPublications.length) {
    return [
      [publications[0], publications[4]],
      [publications[1], publications[5]],
      [publications[2], publications[6]],
      [publications[3], publications[7]],
    ];
  }

  return publications.reduce<Publication[][]>(
    (columns, publication, index) => {
      columns[index % columns.length].push(publication);
      return columns;
    },
    [[], [], [], []],
  );
}

export function FeaturedPublications() {
  const [activeTab, setActiveTab] = useState("all");

  const visiblePublications = useMemo(() => {
    if (activeTab === "all") {
      return featuredPublications;
    }

    return featuredPublications.filter((publication) => publication.category === activeTab);
  }, [activeTab]);

  const columns = useMemo(() => toColumns(visiblePublications), [visiblePublications]);

  return (
    <section id="publications" className="bg-white py-20 lg:py-28">
      <div className="section-shell">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[var(--red)]">
              Featured publication
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.04em]">
              Standards, toolkits and reports.
            </h2>
          </div>
          <a href="#contact" className="inline-flex items-center gap-2 text-sm font-extrabold">
            Request a publication <ArrowIcon />
          </a>
        </div>
        <div
          className="mb-8 flex gap-2 overflow-x-auto border-b border-[var(--line)] pb-3"
          role="tablist"
          aria-label="Publication categories"
        >
          {publicationTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="shrink-0 cursor-pointer rounded-full border border-[var(--line)] bg-white px-4 py-2 text-xs font-extrabold text-[var(--muted)] transition hover:border-[var(--ink)] hover:text-[var(--ink)] aria-selected:border-[var(--ink)] aria-selected:bg-[var(--ink)] aria-selected:text-white"
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div id="publication-grid" className="grid scroll-mt-24 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-start">
          {columns.map((column, columnIndex) => (
            <div
              key={`${activeTab}-${columnIndex}`}
              className={`grid gap-4 ${activeTab === "all" && (columnIndex === 0 || columnIndex === 2) ? "lg:pt-14" : ""}`}
            >
              {column.map((publication) => (
                <article
                  id={publication.id}
                  key={publication.title}
                  className="group relative min-h-[360px] scroll-mt-28 overflow-hidden bg-[var(--soft)] sm:min-h-[390px]"
                >
                  <Image
                    src={publication.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className={`${publication.imageClassName} transition duration-500 group-hover:scale-105`}
                  />
                  <div className="absolute left-4 top-4 max-w-[calc(100%-2rem)] rounded-md border border-white bg-[#07131d]/46 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-white backdrop-blur-sm">
                    {publication.category}
                  </div>
                  <div className="absolute inset-x-4 bottom-4 rounded-xl bg-white/78 p-4 text-[var(--ink)] shadow-[0_20px_55px_rgba(7,19,29,0.22)] backdrop-blur-md">
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[var(--ink)]/78">
                      {publication.type} <span className="ml-1 font-bold">{publication.date}</span>
                    </p>
                    <h3 className="mt-2 font-display text-xl font-bold leading-tight tracking-[-0.03em]">
                      {publication.title}
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
