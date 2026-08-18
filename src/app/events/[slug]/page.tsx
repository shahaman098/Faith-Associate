import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventDetailPage } from "../../components/EventDetailPage";
import { CmsEntry } from "../../components/cms/CmsEntry";
import { eventPages, getEvent } from "../../data/events";
import { loadCmsPage } from "@/lib/cms/page-helpers";
import { getEntry } from "@/lib/cms/queries";

export function generateStaticParams() {
  return eventPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return {};
  return {
    title: `${event.title} | Faith Associates`,
    description: event.summary,
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { settings, preferDraft } = await loadCmsPage(`/events/${slug}`);
  const entry = await getEntry("event", slug, { preferDraft });
  const event = entry ? ({ slug: entry.slug, ...entry.data } as ReturnType<typeof getEvent>) : getEvent(slug);
  if (!event) notFound();
  const entryData = entry?.data ?? {
    eyebrow: event.eyebrow,
    title: event.title,
    summary: event.summary,
    category: event.category,
    client: event.client,
    date: event.date,
    location: event.location,
    time: event.time,
    heroImage: event.heroImage,
    posterImage: event.posterImage,
    posterAlt: event.posterAlt,
    registrationUrl: event.registrationUrl,
    overview: event.overview,
    focusAreas: event.focusAreas,
  };
  return <CmsEntry type="event" slug={slug} data={entryData}><EventDetailPage event={event} settings={settings} /></CmsEntry>;
}
