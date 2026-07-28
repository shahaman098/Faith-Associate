import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialDetailPage } from "../../components/EditorialDetailPage";
import { getProject, projects } from "../../data/site-content";
import { CmsPage } from "../../components/cms/CmsPage";
import { loadCmsPage } from "@/lib/cms/page-helpers";
import { getEntry } from "@/lib/cms/queries";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: `${project.title} | Faith Associates`, description: project.summary };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { settings, page, preferDraft } = await loadCmsPage(`/projects/${slug}`);
  const entry = await getEntry("project", slug, { preferDraft });
  const project = entry ? ({ slug: entry.slug, ...entry.data } as typeof projects[number]) : getProject(slug);
  if (!project) notFound();
  return <CmsPage path={`/projects/${slug}`} blocks={page?.blocks}><EditorialDetailPage data={project} settings={settings} /></CmsPage>;
}
