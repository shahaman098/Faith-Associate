"use client";

import { useEffect, useState } from "react";

export type SectionNavItem = {
  id: string;
  title: string;
};

/**
 * Sticky in-page nav for pages with clusters. Highlights the section in view.
 * Sits below the header, so it uses the same navy chrome to read as one bar.
 */
export function SectionNav({ sections }: { sections: SectionNavItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(sections[0]?.id ?? null);

  useEffect(() => {
    if (sections.length < 2) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [sections]);

  if (sections.length < 2) return null;

  return (
    <nav
      aria-label="On this page"
      className="sticky top-0 z-30 border-y border-[var(--line)] bg-white/96 backdrop-blur"
    >
      <div className="section-shell flex gap-2 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={activeId === section.id ? "true" : undefined}
            className={`type-meta whitespace-nowrap border-b-2 px-3 py-3 transition ${
              activeId === section.id
                ? "border-[var(--red)] text-[var(--ink)]"
                : "border-transparent text-[var(--muted)] hover:border-[var(--line)] hover:text-[var(--blue)]"
            }`}
          >
            {section.title}
          </a>
        ))}
      </div>
    </nav>
  );
}
