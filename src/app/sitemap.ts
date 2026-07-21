import type { MetadataRoute } from "next";
import { publications } from "./data/publications";
import { newsItems, projects, services } from "./data/site-content";

const baseUrl = "https://faithassociates.co.uk";
const siteUpdated = new Date("2026-07-16T00:00:00.000Z");

const staticRoutes = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about/history", changeFrequency: "yearly", priority: 0.6 },
  { path: "/about/clients", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about/team", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about/approach", changeFrequency: "yearly", priority: 0.6 },
  { path: "/about/careers", changeFrequency: "weekly", priority: 0.6 },
  { path: "/about/vacancies", changeFrequency: "weekly", priority: 0.6 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/projects", changeFrequency: "monthly", priority: 0.9 },
  { path: "/sport", changeFrequency: "monthly", priority: 0.8 },
  { path: "/international", changeFrequency: "monthly", priority: 0.8 },
  { path: "/publications", changeFrequency: "weekly", priority: 0.9 },
  { path: "/news", changeFrequency: "weekly", priority: 0.8 },
  { path: "/events", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map(({ path, changeFrequency, priority }) => ({
      url: `${baseUrl}${path}`,
      lastModified: siteUpdated,
      changeFrequency,
      priority,
    })),
    ...services.map(({ slug }) => ({
      url: `${baseUrl}/services/${slug}`,
      lastModified: siteUpdated,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...projects.map(({ slug }) => ({
      url: `${baseUrl}/projects/${slug}`,
      lastModified: siteUpdated,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...publications.map(({ slug, updated }) => ({
      url: `${baseUrl}/publications/${slug}`,
      lastModified: new Date(`${updated}T00:00:00.000Z`),
      changeFrequency: "yearly" as const,
      priority: 0.65,
    })),
    ...newsItems.map(({ slug, date }) => ({
      url: `${baseUrl}/news/${slug}`,
      lastModified: new Date(date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
