import Image from "next/image";
import Link from "next/link";
import type { EditorialPageData } from "../data/site-content";
import type { SiteSettingsData } from "@/lib/cms/types";
import { EditorialHero } from "./EditorialHero";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

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

type EditorialDirectoryProps = {
  eyebrow: string;
  title: string;
  summary: string;
  image: string;
  introTitle: string;
  introBody: string;
  items: EditorialPageData[];
  basePath: "/services" | "/projects";
  settings?: SiteSettingsData;
};

export function EditorialDirectory({
  eyebrow,
  title,
  summary,
  image,
  introTitle,
  introBody,
  items,
  basePath,
  settings,
}: EditorialDirectoryProps) {
  return (
    <main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
      <SiteHeader settings={settings} />
      <EditorialHero
        eyebrow={eyebrow}
        title={title}
        summary={summary}
        image={image}
        primaryLabel="Start a conversation"
        primaryHref="/contact"
      />

      <section className="bg-[var(--soft)] py-12 lg:py-20">
        <div className="section-shell grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-16">
          <h2 className="type-display max-w-[14ch] text-[clamp(1.85rem,3.6vw,2.75rem)] text-[var(--ink)]">
            {introTitle}
          </h2>
          <p className="type-body max-w-2xl text-[var(--muted)] lg:text-[1.05rem]">{introBody}</p>
        </div>
      </section>

      <section className="py-12 lg:py-20">
        <div className="section-shell">
          <div className="grid gap-y-12 md:grid-cols-2 md:gap-x-7 lg:grid-cols-3">
            {items.map((item, index) => (
              <Link href={`${basePath}/${item.slug}`} key={item.slug} className="group block">
                <div className="media-frame relative aspect-[1.25/1]">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="media-zoom object-cover"
                  />
                  <span className="absolute left-4 top-4 inline-flex size-9 items-center justify-center bg-[var(--navy)] text-[10px] font-semibold tracking-[0.08em] text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="type-meta mt-5 text-[var(--blue)]">{item.eyebrow}</p>
                <div className="mt-3 flex items-start justify-between gap-5 border-t border-[var(--line)] pt-4">
                  <div>
                    <h2 className="type-title text-[1.35rem] text-[var(--ink)] transition duration-300 group-hover:text-[var(--blue)] sm:text-[1.45rem]">
                      {item.title}
                    </h2>
                    <p className="type-body mt-3 text-sm text-[var(--muted)]">{item.summary}</p>
                  </div>
                  <span className="mt-1 inline-flex size-9 shrink-0 items-center justify-center border border-[var(--line)] text-[var(--ink)] transition duration-300 group-hover:border-[var(--blue)] group-hover:bg-[var(--blue)] group-hover:text-white">
                    <ArrowIcon />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--soft)] py-12 lg:py-20">
        <div className="section-shell flex flex-col gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div>
            <p className="type-eyebrow text-[var(--blue)]">Not sure where to begin?</p>
            <h2 className="type-display mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)] text-[var(--ink)]">
              Tell us what needs to change.
            </h2>
          </div>
          <Link href="/contact" className="btn-primary self-center sm:self-auto">
            Contact the team <ArrowIcon />
          </Link>
        </div>
      </section>
      <SiteFooter settings={settings} />
    </main>
  );
}
