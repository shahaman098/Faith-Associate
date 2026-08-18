"use client";

import Link from "next/link";
import type { HomeBlocks } from "@/lib/cms/types";
import { EditableImage } from "./cms/EditableImage";
import { EditableText } from "./cms/EditableText";
import { useEdit } from "./cms/EditProvider";
import { ArrowIcon, capabilityIcons, type CapabilityIconName } from "./icons";
import { guidedSupportContent, guidedSupportTopics as topics } from "../data/guided-support";

type Topic = HomeBlocks["guidedSupport"]["topics"][number];

function topicHref(topic: Topic) {
  return topic.href ?? topic.destinations[0]?.href ?? "/services";
}

function TopicIcon({ name }: { name?: string }) {
  const Glyph = capabilityIcons[(name ?? "institution") as CapabilityIconName] ?? capabilityIcons.institution;
  return <Glyph />;
}

export function GuidedSupportSection({ content }: { content?: HomeBlocks["guidedSupport"] }) {
  const { editing } = useEdit();
  const data = content ?? guidedSupportContent;
  const activeTopics = data.topics?.length ? data.topics : topics;

  return (
    <section className="band band-soft">
      <div className="section-shell grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-start lg:gap-14">
        <div className="lg:sticky-rail">
          <p className="type-eyebrow text-[var(--blue)]">Guided support</p>
          <h2 className="type-display mt-4 max-w-[18ch] text-[clamp(1.9rem,3.4vw,2.9rem)] text-[var(--ink)]">
            <EditableText value={data.title} path="guidedSupport.title" />
          </h2>
          <div className="rule-red mt-5" />
          <p className="type-body mt-5 max-w-[34rem] text-[1.02rem] text-[var(--muted)]">
            <EditableText value={data.body} path="guidedSupport.body" multiline />
          </p>

          <div className="media-frame relative mt-8 aspect-[5/3] w-full overflow-hidden lg:aspect-[4/3]">
            <EditableImage
              src={data.image}
              alt="Faith Associates trainer delivering a community workshop"
              path="guidedSupport.image"
              positionPath="guidedSupport.imagePosition"
              fill
              sizes="(max-width: 1024px) 100vw, 420px"
              quality={90}
              defaultPosition="62% 50%"
              className="object-cover"
            />
          </div>

          <Link href="/services" className="btn-primary mt-8 w-full sm:w-auto">
            Browse all services <ArrowIcon />
          </Link>
        </div>

        <div className="grid gap-px bg-[var(--line)] sm:grid-cols-2">
          {activeTopics.map((topic, index) => {
            const href = topicHref(topic);
            return (
              <article key={topic.label} className="group relative bg-white p-6 lg:p-7">
                <div className="flex items-start justify-between gap-4">
                  <span className="icon-tile">
                    <TopicIcon name={topic.icon} />
                  </span>
                  <span className="index-number index-number--quiet" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="type-title mt-5 text-[1.2rem] text-[var(--ink)]">
                  {editing ? (
                    <EditableText
                      value={topic.label}
                      path={`guidedSupport.topics.${index}.label`}
                    />
                  ) : (
                    <Link href={href} className="transition group-hover:text-[var(--blue)]">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {topic.label}
                    </Link>
                  )}
                </h3>

                {topic.summary ? (
                  <p className="type-body mt-2.5 text-[0.95rem] text-[var(--muted)]">
                    <EditableText
                      value={topic.summary}
                      path={`guidedSupport.topics.${index}.summary`}
                      multiline
                    />
                  </p>
                ) : null}

                {topic.destinations.length ? (
                  <div className="relative z-10 mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-[var(--line)] pt-4">
                    {topic.destinations.map((destination) => (
                      <Link
                        key={destination.href}
                        href={destination.href}
                        className="type-meta text-[var(--blue)] underline-offset-4 transition hover:underline"
                      >
                        {destination.label}
                      </Link>
                    ))}
                  </div>
                ) : null}

                <span
                  aria-hidden="true"
                  className="mt-5 inline-flex size-9 items-center justify-center bg-[var(--soft)] text-[var(--blue)] transition group-hover:bg-[var(--red)] group-hover:text-white"
                >
                  <ArrowIcon />
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
