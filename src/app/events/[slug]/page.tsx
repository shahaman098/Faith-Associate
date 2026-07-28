import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventDetailPage } from "../../components/EventDetailPage";
import { eventPages, getEvent } from "../../data/events";
import { CmsPage } from "../../components/cms/CmsPage";
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
  const { settings, page, preferDraft } = await loadCmsPage(`/events/${slug}`);
  const entry = await getEntry("event", slug, { preferDraft });
  const event = entry ? ({ slug: entry.slug, ...entry.data } as ReturnType<typeof getEvent>) : getEvent(slug);
  if (!event) notFound();
  return <CmsPage path={`/events/${slug}`} blocks={page?.blocks}><EventDetailPage event={event} settings={settings} /></CmsPage>;
}
