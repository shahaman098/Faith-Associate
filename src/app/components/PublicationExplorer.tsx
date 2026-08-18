"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Publication, PublicationCategory } from "../data/publications";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h9M8.5 3.5 13 8l-4.5 4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 20 20" fill="none">
      <path
        d="m14.5 14.5 3 3M8.75 15.25a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

type PublicationExplorerProps = {
  items: Publication[];
};

export function PublicationExplorer({ items }: PublicationExplorerProps) {
  const categories = useMemo<Array<"All" | PublicationCategory>>(
    () => [
      "All",
      ...Array.from(
        new Set(items.map((publication) => publication.category)),
      ).sort(),
    ],
    [items],
  );
  const [category, setCategory] = useState<"All" | PublicationCategory>("All");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((publication) => {
      const categoryMatches = category === "All" || publication.category === category;
      const queryMatches =
        !normalizedQuery ||
        `${publication.title} ${publication.summary} ${publication.category} ${publication.year}`
          .toLowerCase()
          .includes(normalizedQuery);
      return categoryMatches && queryMatches;
    });
  }, [category, items, query]);

  return (
    <section className="py-12 lg:py-20">
      <div className="section-shell">
        <div className="sticky top-0 z-20 -mx-3 border-b border-[var(--line)] bg-white/96 px-3 py-4 backdrop-blur lg:top-0">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex gap-0 overflow-x-auto" role="group" aria-label="Filter by publication category">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={category === item}
                  onClick={() => setCategory(item)}
                  className="shrink-0 cursor-pointer border-b-2 border-transparent px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)] transition duration-300 hover:text-[var(--ink)] aria-pressed:border-[var(--blue)] aria-pressed:text-[var(--blue)]"
                >
                  {item}
                </button>
              ))}
            </div>
            <label className="flex h-11 w-full items-center gap-3 border-b border-[var(--line)] px-1 text-[var(--muted)] xl:w-72">
              <span className="sr-only">Search publications</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                placeholder="Search the library"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted)]/70"
              />
              <SearchIcon />
            </label>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between type-meta text-[var(--muted)]">
          <p>
            {visible.length} {visible.length === 1 ? "resource" : "resources"}
          </p>
          {category === "Legacy guidance" ? (
            <p className="text-[var(--blue)]">Archive: verify before operational use</p>
          ) : null}
        </div>

        {visible.length ? (
          <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((publication, index) => (
              <Link href={`/publications/${publication.slug}`} key={publication.slug} className="group block">
                <div className="media-frame relative aspect-[0.82/1] bg-[var(--soft)]">
                  <Image
                    src={publication.image}
                    alt=""
                    fill
                    unoptimized
                    loading={index < 3 ? "eager" : "lazy"}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain object-center transition duration-500 group-hover:scale-[1.025]"
                  />
                  {publication.isLegacy ? (
                    <span className="absolute left-4 top-4 bg-[var(--navy)]/88 px-3 py-1.5 type-meta text-white backdrop-blur">
                      Archived guidance
                    </span>
                  ) : null}
                </div>
                <div className="mt-5 flex items-center justify-between gap-4 type-meta text-[var(--blue)]">
                  <p>{publication.category}</p>
                  <p className="text-[var(--muted)]">
                    {publication.format} / {publication.year}
                  </p>
                </div>
                <h2 className="type-title mt-3 text-[1.35rem] text-[var(--ink)] transition duration-300 group-hover:text-[var(--blue)] sm:text-[1.45rem]">
                  {publication.title}
                </h2>
                <p className="type-body mt-3 line-clamp-3 text-sm text-[var(--muted)]">{publication.summary}</p>
                <span className="type-cta mt-5 inline-flex items-center gap-2 text-[var(--blue)]">
                  View resource <ArrowIcon />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-8 border border-dashed border-[var(--line)] bg-[var(--soft)] px-6 py-20 text-center">
            <h2 className="type-title text-[1.5rem] text-[var(--ink)]">No publications match that search.</h2>
            <button
              type="button"
              onClick={() => {
                setCategory("All");
                setQuery("");
              }}
              className="type-cta mt-5 cursor-pointer text-[var(--blue)] underline underline-offset-4"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
