import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialDetailPage } from "../../components/EditorialDetailPage";
import { ServiceCataloguePage } from "../../components/ServiceCataloguePage";
import { CmsEntry } from "../../components/cms/CmsEntry";
import type { Publication } from "../../data/publications";
import {
  getServiceCatalogue,
  getServiceOffering,
  serviceCatalogues,
  serviceOfferings,
  type ServiceCatalogue,
} from "../../data/service-catalogues";
import { getService, services } from "../../data/site-content";
import { loadCmsPage } from "@/lib/cms/page-helpers";
import { getEntries, getEntry } from "@/lib/cms/queries";

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

/**
 * Related items stay inside the same family: the other offerings listed alongside
 * this one in its catalogue section, falling back to the rest of the catalogue.
 */
function relatedServicesFor(service: { slug: string }) {
  const siblings: string[] = [];
  for (const catalogue of serviceCatalogues) {
    for (const section of catalogue.sections) {
      const hrefs = section.links.map((link) => link.href);
      if (!hrefs.includes(`/services/${service.slug}`)) continue;
      for (const href of hrefs) {
        const slug = href.replace("/services/", "");
        if (slug !== service.slug && !siblings.includes(slug)) siblings.push(slug);
      }
    }
  }

  return siblings
    .map((slug) => getServiceOffering(slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 3)
    .map((item) => ({
      title: item.title,
      href: `/services/${item.slug}`,
      summary: item.summary,
      image: item.image,
    }));
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { settings, preferDraft } = await loadCmsPage(`/services/${slug}`);
  const [serviceRecord, offeringRecord, catalogueEntry, publicationEntries] = await Promise.all([
    getEntry("service", slug, { preferDraft }),
    getEntry("service_offering", slug, { preferDraft }),
    getEntry("service_catalogue", slug, { preferDraft }),
    getEntries("publication", { preferDraft }),
  ]);
  const serviceEntry = serviceRecord ?? offeringRecord;
  const service = serviceEntry ? ({ slug: serviceEntry.slug, ...serviceEntry.data } as typeof services[number]) : getService(slug);
  if (!service) notFound();

  const entryType = serviceEntry?.type === "service_offering" ? "service_offering" : "service";
  // A catalogue edited through the CMS is stored on the service entry itself, so the
  // page can register a single document and on-page edits actually persist.
  const embeddedCatalogue = (serviceEntry?.data as { catalogue?: ServiceCatalogue } | undefined)?.catalogue;
  const catalogue =
    embeddedCatalogue ??
    (catalogueEntry ? (catalogueEntry.data as ServiceCatalogue) : getServiceCatalogue(slug));

  const entryData = serviceEntry?.data ?? {
    eyebrow: service.eyebrow,
    title: service.title,
    summary: service.summary,
    image: service.image,
    intro: service.intro,
    highlights: service.highlights,
    outcomes: service.outcomes,
    ctaLabel: service.ctaLabel,
    externalUrl: service.externalUrl,
    zohoFormUrl: service.zohoFormUrl,
    stat: service.stat,
    duration: service.duration,
    cost: service.cost,
    chips: service.chips,
    quickFacts: service.quickFacts,
    audience: service.audience,
    agendaTitle: service.agendaTitle,
    agenda: service.agenda,
    materialsTitle: service.materialsTitle,
    materials: service.materials,
    benefits: service.benefits,
    certificate: service.certificate,
    quote: service.quote,
    secondaryCtaLabel: service.secondaryCtaLabel,
    secondaryCtaHref: service.secondaryCtaHref,
    ...(catalogue ? { catalogue } : {}),
  };

  if (catalogue) {
    return (
      <CmsEntry type={entryType} slug={slug} data={entryData}>
        <ServiceCataloguePage category={service} catalogue={catalogue} settings={settings} />
      </CmsEntry>
    );
  }
  const relatedPublications = publicationEntries.length
    ? publicationEntries.map((publication) => ({
        slug: publication.slug,
        ...publication.data,
      })) as Publication[]
    : [];

  const relatedItems = relatedServicesFor(service);

  return (
    <CmsEntry type={entryType} slug={slug} data={entryData}>
      <EditorialDetailPage
        data={service}
        relatedPublications={relatedPublications}
        relatedItems={relatedItems}
        settings={settings}
      />
    </CmsEntry>
  );
}
