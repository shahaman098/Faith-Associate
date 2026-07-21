import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialDetailPage } from "../../components/EditorialDetailPage";
import { getProject, projects } from "../../data/site-content";

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
  const project = getProject(slug);
  if (!project) notFound();
  return <EditorialDetailPage data={project} />;
}
