import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialDetailPage } from "../../components/EditorialDetailPage";
import { CmsEntry } from "../../components/cms/CmsEntry";
import type { Publication } from "../../data/publications";
import { getProject, projects } from "../../data/site-content";
import { loadCmsPage } from "@/lib/cms/page-helpers";
import { getEntries, getEntry } from "@/lib/cms/queries";

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
  const { settings, preferDraft } = await loadCmsPage(`/projects/${slug}`);
  const [entry, publicationEntries] = await Promise.all([
    getEntry("project", slug, { preferDraft }),
    getEntries("publication", { preferDraft }),
  ]);
  const project = entry ? ({ slug: entry.slug, ...entry.data } as typeof projects[number]) : getProject(slug);
  if (!project) notFound();
  const relatedPublications = publicationEntries.length
    ? publicationEntries.map((publication) => ({
        slug: publication.slug,
        ...publication.data,
      })) as Publication[]
    : [];
  const entryData = entry?.data ?? {
    eyebrow: project.eyebrow,
    title: project.title,
    summary: project.summary,
    image: project.image,
    intro: project.intro,
    highlights: project.highlights,
    outcomes: project.outcomes,
    ctaLabel: project.ctaLabel,
    externalUrl: project.externalUrl,
    zohoFormUrl: project.zohoFormUrl,
    stat: project.stat,
  };
  return <CmsEntry type="project" slug={slug} data={entryData}><EditorialDetailPage data={project} relatedPublications={relatedPublications} settings={settings} /></CmsEntry>;
}
