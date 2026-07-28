import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialDetailPage } from "../../components/EditorialDetailPage";
import { ServiceCataloguePage } from "../../components/ServiceCataloguePage";
import { getServiceCatalogue, serviceOfferings } from "../../data/service-catalogues";
import { getService, services } from "../../data/site-content";
import { CmsPage } from "../../components/cms/CmsPage";
import { loadCmsPage } from "@/lib/cms/page-helpers";
import { getEntry } from "@/lib/cms/queries";

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
  const { settings, page, preferDraft } = await loadCmsPage(`/services/${slug}`);
  const serviceEntry =
    (await getEntry("service", slug, { preferDraft })) ??
    (await getEntry("service_offering", slug, { preferDraft }));
  const service = serviceEntry ? ({ slug: serviceEntry.slug, ...serviceEntry.data } as typeof services[number]) : getService(slug);
  if (!service) notFound();

  const catalogueEntry = await getEntry("service_catalogue", slug, { preferDraft });
  const catalogue = catalogueEntry ? (catalogueEntry.data as ReturnType<typeof getServiceCatalogue>) : getServiceCatalogue(slug);
  if (catalogue) {
    return <CmsPage path={`/services/${slug}`} blocks={page?.blocks}><ServiceCataloguePage category={service} catalogue={catalogue} settings={settings} /></CmsPage>;
  }

  return <CmsPage path={`/services/${slug}`} blocks={page?.blocks}><EditorialDetailPage data={service} settings={settings} /></CmsPage>;
}
