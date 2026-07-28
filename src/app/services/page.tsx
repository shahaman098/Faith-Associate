import type { Metadata } from "next";
import { EditorialDirectory } from "../components/EditorialDirectory";
import { services } from "../data/site-content";
import { CmsPage } from "../components/cms/CmsPage";
import { loadCmsPage } from "@/lib/cms/page-helpers";
import { getEntries } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Services | Faith Associates",
  description: "Explore Faith Associates services for mosque governance, madrassah support, safeguarding, leadership, strategy and protective security.",
};

export default async function ServicesPage() {
  const { settings, page, preferDraft } = await loadCmsPage("/services");
  const entries = await getEntries("service", { preferDraft });
  const directoryServices = entries.length
    ? (entries.map((entry) => entry.data) as typeof services)
    : services.filter((service) => ["mosque-services", "madrassah-support", "imam-services", "strategic-services", "safeguarding", "safety"].includes(service.slug));
  const blocks = page?.blocks as Record<string, any> | undefined;
  const hero = blocks?.hero;
  return (
    <CmsPage path="/services" blocks={page?.blocks}>
      <EditorialDirectory eyebrow={hero?.eyebrow ?? "What we do"} title={hero?.title ?? "Specialist support for faith institutions."} summary={hero?.summary ?? "Practical services shaped by two decades of work with leaders, trustees, volunteers and public-sector partners."} image={hero?.image ?? "/assets/real/security-training-session.jpg"} introTitle={blocks?.introTitle ?? "Deep sector knowledge, translated into practical change."} introBody={blocks?.introBody ?? "Faith institutions operate in a complex environment. Our services bring together governance, safety, leadership and delivery expertise so teams can act with greater clarity and confidence."} items={directoryServices} basePath="/services" settings={settings} />
    </CmsPage>
  );
}
