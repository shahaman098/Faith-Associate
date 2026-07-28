import type { Metadata } from "next";
import { EditorialDirectory } from "../components/EditorialDirectory";
import { projects } from "../data/site-content";
import { CmsPage } from "../components/cms/CmsPage";
import { loadCmsPage } from "@/lib/cms/page-helpers";
import { getEntries } from "@/lib/cms/queries";

export const metadata: Metadata = {
  title: "Projects & Programmes | Faith Associates",
  description: "Explore Faith Associates flagship projects across mosque standards, leadership, protective security, sport, sustainability and digital engagement.",
};

export default async function ProjectsPage() {
  const { settings, page, preferDraft } = await loadCmsPage("/projects");
  const entries = await getEntries("project", { preferDraft });
  const items = entries.length ? (entries.map((entry) => entry.data) as typeof projects) : projects;
  const blocks = page?.blocks as Record<string, any> | undefined;
  const hero = blocks?.hero;
  return (
    <CmsPage path="/projects" blocks={page?.blocks}>
      <EditorialDirectory eyebrow={hero?.eyebrow ?? "Projects & programmes"} title={hero?.title ?? "Platforms that move whole sectors forward."} summary={hero?.summary ?? "Flagship programmes that connect people, build standards and turn partnerships into visible community impact."} image={hero?.image ?? "/assets/real/mosque-expo-awards-hall.jpg"} introTitle={blocks?.introTitle ?? "Built to convene, equip and inspire."} introBody={blocks?.introBody ?? "Our projects respond to recurring sector needs: stronger institutions, safer worship, confident leaders, inclusive opportunities and visible standards of excellence."} items={items} basePath="/projects" settings={settings} />
    </CmsPage>
  );
}
