"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettingsData } from "./types";

async function requireEditor() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile || !["editor", "admin"].includes(profile.role)) {
    throw new Error("Not authorized");
  }

  return { supabase, user, role: profile.role as "editor" | "admin" };
}

function revalidateSite(path?: string) {
  revalidatePath("/", "layout");
  if (path) revalidatePath(path);
  revalidateTag("cms", "max");
}

export async function saveSiteSettingsDraft(data: SiteSettingsData) {
  const { supabase, user } = await requireEditor();
  const { error } = await supabase
    .from("site_settings")
    .upsert({
      id: "default",
      draft_data: data,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    });
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function publishSiteSettings(data?: SiteSettingsData) {
  const { supabase, user } = await requireEditor();
  const payload: Record<string, unknown> = {
    id: "default",
    draft_data: null,
    updated_at: new Date().toISOString(),
    updated_by: user.id,
  };
  if (data) payload.data = data;
  else {
    const { data: row } = await supabase
      .from("site_settings")
      .select("draft_data, data")
      .eq("id", "default")
      .single();
    if (row?.draft_data) payload.data = row.draft_data;
  }
  const { error } = await supabase.from("site_settings").upsert(payload);
  if (error) throw new Error(error.message);
  revalidateSite();
  return { ok: true };
}

export async function savePageDraft(path: string, blocks: Record<string, unknown>) {
  const { supabase, user } = await requireEditor();
  const { data: existing } = await supabase
    .from("pages")
    .select("id")
    .eq("path", path)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("pages")
      .update({
        draft_blocks: blocks,
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      })
      .eq("path", path);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("pages").insert({
      path,
      blocks,
      draft_blocks: blocks,
      status: "draft",
      updated_by: user.id,
    });
    if (error) throw new Error(error.message);
  }
  revalidateSite(path === "/" ? "/" : path);
  return { ok: true };
}

export async function publishPage(path: string, blocks?: Record<string, unknown>) {
  const { supabase, user } = await requireEditor();
  let nextBlocks = blocks;
  if (!nextBlocks) {
    const { data: row } = await supabase
      .from("pages")
      .select("draft_blocks, blocks")
      .eq("path", path)
      .maybeSingle();
    nextBlocks = (row?.draft_blocks as Record<string, unknown>) ?? undefined;
  }
  const update: Record<string, unknown> = {
    status: "published",
    draft_blocks: null,
    updated_at: new Date().toISOString(),
    updated_by: user.id,
  };
  if (nextBlocks) update.blocks = nextBlocks;

  const { error } = await supabase.from("pages").update(update).eq("path", path);
  if (error) throw new Error(error.message);
  revalidateSite(path === "/" ? "/" : path);
  return { ok: true };
}

export async function saveEntryDraft(
  type: string,
  slug: string,
  data: Record<string, unknown>,
  sortOrder = 0,
) {
  const { supabase, user } = await requireEditor();
  const { error } = await supabase.from("entries").upsert(
    {
      type,
      slug,
      draft_data: data,
      sort_order: sortOrder,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    },
    { onConflict: "type,slug" },
  );
  if (error) throw new Error(error.message);
  revalidateSite();
  return { ok: true };
}

export async function publishEntry(
  type: string,
  slug: string,
  data?: Record<string, unknown>,
) {
  const { supabase, user } = await requireEditor();
  let nextData = data;
  if (!nextData) {
    const { data: row } = await supabase
      .from("entries")
      .select("draft_data, data")
      .eq("type", type)
      .eq("slug", slug)
      .maybeSingle();
    nextData = (row?.draft_data as Record<string, unknown>) ?? undefined;
  }
  const payload: Record<string, unknown> = {
    type,
    slug,
    status: "published",
    draft_data: null,
    updated_at: new Date().toISOString(),
    updated_by: user.id,
  };
  if (nextData) payload.data = nextData;

  const { error } = await supabase
    .from("entries")
    .upsert(payload, { onConflict: "type,slug" });
  if (error) throw new Error(error.message);
  revalidateSite();
  return { ok: true };
}

export async function deleteEntry(type: string, slug: string) {
  const { supabase } = await requireEditor();
  const { error } = await supabase
    .from("entries")
    .delete()
    .eq("type", type)
    .eq("slug", slug);
  if (error) throw new Error(error.message);
  revalidateSite();
  return { ok: true };
}

export async function createEntry(
  type: string,
  slug: string,
  data: Record<string, unknown>,
  sortOrder = 0,
) {
  const { supabase, user } = await requireEditor();
  const { error } = await supabase.from("entries").insert({
    type,
    slug,
    data,
    draft_data: data,
    sort_order: sortOrder,
    status: "draft",
    updated_by: user.id,
  });
  if (error) throw new Error(error.message);
  revalidateSite();
  return { ok: true };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function resolveUploadedImage(formData: FormData, imageKey: string, fileKey: string, alt: string) {
  let image = String(formData.get(imageKey) || "").trim();
  const file = formData.get(fileKey);

  if (file instanceof Blob && file.size > 0) {
    const uploadFormData = new FormData();
    uploadFormData.set("file", file);
    uploadFormData.set("alt", alt);
    const uploaded = await uploadMedia(uploadFormData);
    image = uploaded.url;
  }

  return image;
}

function normalizeCmsPath(value: string) {
  const cleaned = value
    .trim()
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/[?#].*$/, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  return cleaned ? `/${cleaned}` : "/";
}

const reservedCmsSegments = new Set([
  "_next",
  "about",
  "api",
  "cms",
  "contact",
  "events",
  "international",
  "news",
  "privacy",
  "projects",
  "publications",
  "services",
  "sport",
]);

function validateGenericCmsPath(path: string) {
  if (path === "/") return "Use the homepage editor for '/'.";
  const firstSegment = path.split("/").filter(Boolean)[0] ?? "";
  if (reservedCmsSegments.has(firstSegment)) {
    return `Paths under '/${firstSegment}' are already handled by built-in routes.`;
  }
  return null;
}

function buildGenericPageBlocks(title: string, summary: string) {
  return {
    hero: {
      eyebrow: "New page",
      title,
      summary,
      image: "/assets/real/faith-training-speaker.jpg",
    },
    intro: {
      eyebrow: "Overview",
      title: "Shape this page in the CMS.",
      body: "Use the inline editor to replace this starter content with your own copy, structure and calls to action.",
    },
    sections: [
      {
        title: "First section",
        body: "Add the core information for this page here.",
      },
      {
        title: "Second section",
        body: "Use additional sections for supporting detail, guidance or next steps.",
      },
    ],
  } satisfies Record<string, unknown>;
}

function buildPublicationPayload(input: {
  title: string;
  summary?: string;
  category?: string;
  format?: string;
  year?: string;
  image?: string;
  downloadUrl?: string;
  zohoFormUrl?: string;
}) {
  return {
    title: input.title,
    category: input.category || "Reports & insight",
    summary: input.summary || "Add a short summary for this publication.",
    image: input.image || "/assets/real/fa-activity-report-2024.png",
    format: input.format || "Guide",
    year: input.year || String(new Date().getFullYear()),
    isLegacy: false,
    downloadUrl: input.downloadUrl || undefined,
    zohoFormUrl: input.zohoFormUrl || undefined,
    legacyNoticeTitle: "Archived operational guidance.",
    legacyNoticeBody:
      "This resource is preserved for historical reference and may not reflect current public-health, legal or regulatory requirements.",
    accessEyebrow: "Access the resource",
    downloadCtaLabel: "Download publication",
    requestCtaLabel: "Request this publication",
    publishedBy: "Published by Faith Associates",
    resourceTypeLabel: "Resource type",
    catalogueYearLabel: "Catalogue year",
    overviewEyebrow: "Overview",
    overviewTitle: "Guidance grounded in sector experience.",
    overviewBody:
      "Faith Associates develops publications from direct work with faith institutions, leadership teams and delivery partners. The aim is to turn field learning into practical material that can inform discussion, planning and implementation.",
    requestEyebrow: "Request this publication",
    requestTitle: "Complete the form below.",
    requestBody: "Register your details to receive this publication from Faith Associates.",
    usageEyebrow: "Using this publication",
    usageSteps: [
      "Review the resource with the people responsible for governance or delivery in your institution.",
      "Adapt recommendations to your context, legal duties, risk profile and available capacity.",
      "Turn agreed actions into named responsibilities, timescales and a clear review point.",
    ],
    implementationTitle: "Need help implementing it?",
    implementationBody:
      "The Faith Associates team can support training, review, policy development and implementation linked to this area of work.",
    implementationCtaLabel: "Talk to the team",
    relatedEyebrow: "Continue reading",
    relatedTitle: "Related publications",
    relatedCtaLabel: "View library",
  };
}

export async function createNewsPostAction(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const category = String(formData.get("category") || "").trim() || "News";
  const date = String(formData.get("date") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const bodyRaw = String(formData.get("body") || "").trim();
  const slug = slugify(slugInput || title);

  if (!title) return { ok: false, error: "Title is required." };
  if (!summary) return { ok: false, error: "Summary is required." };
  if (!slug) return { ok: false, error: "A valid slug is required." };

  const image = await resolveUploadedImage(formData, "imageUrl", "imageFile", title);

  const body = bodyRaw
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  try {
    await createEntry(
      "news",
      slug,
      {
        date: date || new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        category,
        title,
        summary,
        image: image || "/assets/real/mosque-expo-2024-hall.jpg",
        body: body.length ? body : [summary],
      },
      Date.now(),
    );
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Post creation failed." };
  }

  return { ok: true, slug, path: `/news/${slug}` };
}

export async function createPublicationAction(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const slug = slugify(slugInput || title);

  if (!title) return { ok: false, error: "Title is required." };
  if (!slug) return { ok: false, error: "A valid slug is required." };

  const image = await resolveUploadedImage(formData, "imageUrl", "imageFile", title);

  try {
    await createEntry(
      "publication",
      slug,
      buildPublicationPayload({
        title,
        summary: String(formData.get("summary") || "").trim(),
        category: String(formData.get("category") || "").trim(),
        format: String(formData.get("format") || "").trim(),
        year: String(formData.get("year") || "").trim(),
        image,
        downloadUrl: String(formData.get("downloadUrl") || "").trim(),
        zohoFormUrl: String(formData.get("zohoFormUrl") || "").trim(),
      }),
      Date.now(),
    );
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Publication creation failed." };
  }

  return { ok: true, slug, path: `/publications/${slug}` };
}

export async function createCmsPageAction(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const pathInput = String(formData.get("path") || "").trim();
  const derivedPath = normalizeCmsPath(pathInput || slugify(title));

  if (!title) return { ok: false, error: "Title is required." };

  const pathError = validateGenericCmsPath(derivedPath);
  if (pathError) return { ok: false, error: pathError };

  const { supabase, user } = await requireEditor();
  const blocks = buildGenericPageBlocks(
    title,
    summary || "Add a short summary for this page.",
  );

  const { error } = await supabase.from("pages").insert({
    path: derivedPath,
    title,
    blocks,
    draft_blocks: blocks,
    status: "draft",
    updated_by: user.id,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidateSite(derivedPath);
  return { ok: true, path: derivedPath };
}

export async function uploadMedia(formData: FormData) {
  const { supabase, user } = await requireEditor();
  const file = formData.get("file");
  if (!(file instanceof Blob) || file.size === 0) {
    throw new Error("No file provided");
  }

  const originalName = file instanceof File ? file.name : "upload.bin";
  const ext = originalName.includes(".")
    ? originalName.split(".").pop() || "bin"
    : file.type === "video/mp4"
      ? "mp4"
      : "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || "application/octet-stream";

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(path, buffer, { contentType, upsert: false });
  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(path);

  const { error: mediaError } = await supabase.from("media").insert({
    path,
    alt: String(formData.get("alt") || originalName),
    mime: contentType,
    size_bytes: file.size,
    created_by: user.id,
  });
  if (mediaError) {
    // Upload succeeded; metadata insert is best-effort
    console.error("media metadata insert failed", mediaError.message);
  }

  return { ok: true, url: publicUrl, path };
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function getEditorSession(): Promise<{
  email: string | null;
  role: "editor" | "admin" | null;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile || !["editor", "admin"].includes(profile.role)) return null;
  return {
    email: user.email ?? null,
    role: profile.role as "editor" | "admin",
  };
}
