import { createClient } from "@supabase/supabase-js";
import type { HomeBlocks } from "../src/lib/cms/types";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required");
  }

  const mode = process.env.CMS_SMOKE_MODE ?? "read";
  const email = process.env.CMS_TEST_EMAIL;
  const password = process.env.CMS_TEST_PASSWORD;
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: settings, error: settingsError } = await supabase
    .from("site_settings")
    .select("id")
    .eq("id", "default")
    .maybeSingle();
  if (settingsError) throw settingsError;
  if (!settings) {
    throw new Error("site_settings.default is not publicly readable; check GRANTs and RLS policies");
  }

  const { data: page } = await supabase
    .from("pages")
    .select("path,status")
    .eq("path", "/")
    .single();
  if (!page) {
    throw new Error("pages./ is not publicly readable; check GRANTs and RLS policies");
  }
  console.log("home page", page);

  const { count } = await supabase
    .from("entries")
    .select("*", { count: "exact", head: true });
  if (count == null) {
    throw new Error("entries are not publicly readable; check GRANTs and RLS policies");
  }
  console.log("entries", count);

  if (!email || !password) {
    console.log("auth checks skipped: set CMS_TEST_EMAIL and CMS_TEST_PASSWORD to verify editor access");
    return;
  }

  const { data: auth, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (authError) throw authError;
  console.log("login ok", auth.user?.email);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", auth.user!.id)
    .single();
  console.log("profile", profile);

  if (mode !== "write") {
    console.log("write checks skipped: set CMS_SMOKE_MODE=write to verify draft, publish, and upload flows");
    return;
  }

  const { data: home } = await supabase
    .from("pages")
    .select("blocks, draft_blocks, status")
    .eq("path", "/")
    .single();
  if (!home?.blocks) throw new Error("Home page blocks not found");

  const originalBlocks = structuredClone(home.blocks) as HomeBlocks;
  const originalDraftBlocks = home.draft_blocks as Record<string, unknown> | null;
  const originalStatus = home.status;
  const draftBlocks = structuredClone(home.blocks) as HomeBlocks;
  const originalTitle = draftBlocks.whatWeDo.title;
  draftBlocks.whatWeDo = {
    ...draftBlocks.whatWeDo,
    title: "What we do (CMS draft test)",
  };

  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  );
  const assetPath = `test-${Date.now()}.png`;
  let uploadedAsset = false;
  let mediaRowInserted = false;

  try {
    const { error: draftError } = await supabase
      .from("pages")
      .update({ draft_blocks: draftBlocks })
      .eq("path", "/");
    if (draftError) throw draftError;
    console.log("draft save ok");

    const { error: pubError } = await supabase
      .from("pages")
      .update({ blocks: draftBlocks, draft_blocks: null, status: "published" })
      .eq("path", "/");
    if (pubError) throw pubError;
    console.log("publish ok");

    if (draftBlocks.whatWeDo.title !== originalTitle) {
      console.log("draft mutation ok");
    }

    const { error: upError } = await supabase.storage
      .from("media")
      .upload(assetPath, png, { contentType: "image/png" });
    if (upError) throw upError;
    uploadedAsset = true;

    const { data: pub } = supabase.storage.from("media").getPublicUrl(assetPath);
    console.log("upload ok", pub.publicUrl);

    const { error: mediaError } = await supabase.from("media").insert({
      path: assetPath,
      alt: "cms smoke test",
      mime: "image/png",
      size_bytes: png.length,
      created_by: auth.user!.id,
    });
    if (mediaError) throw mediaError;
    mediaRowInserted = true;
    console.log("media row ok");
  } finally {
    await supabase
      .from("pages")
      .update({
        blocks: originalBlocks,
        draft_blocks: originalDraftBlocks,
        status: originalStatus,
      })
      .eq("path", "/");

    if (mediaRowInserted) {
      await supabase.from("media").delete().eq("path", assetPath);
    }
    if (uploadedAsset) {
      await supabase.storage.from("media").remove([assetPath]);
    }
    console.log("restored");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
