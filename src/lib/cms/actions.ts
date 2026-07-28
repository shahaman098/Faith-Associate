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
  return { ok: true };
}

export async function uploadMedia(formData: FormData) {
  const { supabase, user } = await requireEditor();
  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("No file provided");

  const ext = file.name.split(".").pop() || "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(path, buffer, { contentType: file.type, upsert: false });
  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(path);

  await supabase.from("media").insert({
    path,
    alt: (formData.get("alt") as string) || file.name,
    mime: file.type,
    size_bytes: file.size,
    created_by: user.id,
  });

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
