import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialDetailPage } from "../../components/EditorialDetailPage";
import { ServiceCataloguePage } from "../../components/ServiceCataloguePage";
import { getServiceCatalogue, serviceOfferings } from "../../data/service-catalogues";
import { getService, services } from "../../data/site-content";

export function generateStaticParams() {
  const categorySlugs = services.map(({ slug }) => ({ slug }));
  const offeringSlugs = serviceOfferings.map(({ slug }) => ({ slug }));
  const seen = new Set<string>();
  return [...categorySlugs, ...offeringSlugs].filter(({ slug }) => {
    if (seen.has(slug)) return false;
    seen.add(slug);
    return true;
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return { title: `${service.title} | Faith Associates`, description: service.summary };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const catalogue = getServiceCatalogue(slug);
  if (catalogue) {
    return <ServiceCataloguePage category={service} catalogue={catalogue} />;
  }

  return <EditorialDetailPage data={service} />;
}
