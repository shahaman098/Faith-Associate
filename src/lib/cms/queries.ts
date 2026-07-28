import { createClient } from "@supabase/supabase-js";
import { localSeed } from "./seed-data";
import type {
  EditorProfile,
  EntryRecord,
  HomeBlocks,
  SiteSettingsData,
} from "./types";

function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export async function getSiteSettings(opts?: {
  preferDraft?: boolean;
}): Promise<SiteSettingsData> {
  if (!isConfigured()) return localSeed.settings;
  try {
    const { data, error } = await publicClient()
      .from("site_settings")
      .select("data, draft_data")
      .eq("id", "default")
      .maybeSingle();
    if (error || !data) return localSeed.settings;
    if (opts?.preferDraft && data.draft_data) {
      return data.draft_data as SiteSettingsData;
    }
    return (data.data as SiteSettingsData) ?? localSeed.settings;
  } catch {
    return localSeed.settings;
  }
}

export async function getPage(
  path: string,
  opts?: { preferDraft?: boolean },
): Promise<{ path: string; title?: string; blocks: Record<string, unknown> } | null> {
  const fallback = localSeed.pages.find((p) => p.path === path) ?? null;
  if (!isConfigured()) {
    return fallback
      ? { path: fallback.path, title: fallback.title, blocks: fallback.blocks }
      : null;
  }
  try {
    const { data, error } = await publicClient()
      .from("pages")
      .select("path, title, blocks, draft_blocks, status")
      .eq("path", path)
      .maybeSingle();
    if (error || !data) {
      return fallback
        ? { path: fallback.path, title: fallback.title, blocks: fallback.blocks }
        : null;
    }
    const blocks =
      opts?.preferDraft && data.draft_blocks
        ? (data.draft_blocks as Record<string, unknown>)
        : (data.blocks as Record<string, unknown>);
    return { path: data.path, title: data.title ?? undefined, blocks };
  } catch {
    return fallback
      ? { path: fallback.path, title: fallback.title, blocks: fallback.blocks }
      : null;
  }
}

export async function getHomeBlocks(opts?: {
  preferDraft?: boolean;
}): Promise<HomeBlocks> {
  const page = await getPage("/", opts);
  if (page?.blocks) return page.blocks as unknown as HomeBlocks;
  const local = localSeed.pages.find((p) => p.path === "/");
  return local!.blocks as unknown as HomeBlocks;
}

export async function getEntries(
  type: string,
  opts?: { preferDraft?: boolean },
): Promise<EntryRecord[]> {
  const fallback = localSeed.entries
    .filter((e) => e.type === type)
    .sort((a, b) => a.sort_order - b.sort_order);

  if (!isConfigured()) return fallback;

  try {
    const { data, error } = await publicClient()
      .from("entries")
      .select("type, slug, data, draft_data, sort_order, status")
      .eq("type", type)
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return fallback;
    return data.map((row) => ({
      type: row.type,
      slug: row.slug,
      data:
        opts?.preferDraft && row.draft_data
          ? (row.draft_data as Record<string, unknown>)
          : (row.data as Record<string, unknown>),
      sort_order: row.sort_order,
      status: row.status as EntryRecord["status"],
    }));
  } catch {
    return fallback;
  }
}

export async function getEntry(
  type: string,
  slug: string,
  opts?: { preferDraft?: boolean },
): Promise<EntryRecord | null> {
  const fallback =
    localSeed.entries.find((e) => e.type === type && e.slug === slug) ?? null;
  if (!isConfigured()) return fallback;
  try {
    const { data, error } = await publicClient()
      .from("entries")
      .select("type, slug, data, draft_data, sort_order, status")
      .eq("type", type)
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) return fallback;
    return {
      type: data.type,
      slug: data.slug,
      data:
        opts?.preferDraft && data.draft_data
          ? (data.draft_data as Record<string, unknown>)
          : (data.data as Record<string, unknown>),
      sort_order: data.sort_order,
      status: data.status as EntryRecord["status"],
    };
  } catch {
    return fallback;
  }
}

export async function getEditorialEntry(
  slug: string,
  opts?: { preferDraft?: boolean },
) {
  const service = await getEntry("service", slug, opts);
  if (service) return { ...service, collection: "service" as const };
  const offering = await getEntry("service_offering", slug, opts);
  if (offering) return { ...offering, collection: "service_offering" as const };
  const project = await getEntry("project", slug, opts);
  if (project) return { ...project, collection: "project" as const };
  return null;
}
