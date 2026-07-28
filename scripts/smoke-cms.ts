import { createClient } from "@supabase/supabase-js";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(url, key);

  const { data: auth, error: authError } = await supabase.auth.signInWithPassword({
    email: "cms@faithassociates.co.uk",
    password: "FaithCMS2026!",
  });
  if (authError) throw authError;
  console.log("login ok", auth.user?.email);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", auth.user!.id)
    .single();
  console.log("profile", profile);

  const { data: page } = await supabase
    .from("pages")
    .select("path,status")
    .eq("path", "/")
    .single();
  console.log("home page", page);

  const { count } = await supabase
    .from("entries")
    .select("*", { count: "exact", head: true });
  console.log("entries", count);

  const { data: home } = await supabase
    .from("pages")
    .select("blocks")
    .eq("path", "/")
    .single();
  const blocks = structuredClone(home!.blocks) as Record<string, any>;
  const originalTitle = blocks.whatWeDo.title;
  blocks.whatWeDo = { ...blocks.whatWeDo, title: "What we do (CMS draft test)" };

  const { error: draftError } = await supabase
    .from("pages")
    .update({ draft_blocks: blocks })
    .eq("path", "/");
  if (draftError) throw draftError;
  console.log("draft save ok");

  const { error: pubError } = await supabase
    .from("pages")
    .update({ blocks, draft_blocks: null, status: "published" })
    .eq("path", "/");
  if (pubError) throw pubError;
  console.log("publish ok");

  blocks.whatWeDo.title = originalTitle;
  await supabase.from("pages").update({ blocks }).eq("path", "/");
  console.log("restored");

  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  );
  const path = `test-${Date.now()}.png`;
  const { error: upError } = await supabase.storage
    .from("media")
    .upload(path, png, { contentType: "image/png" });
  if (upError) throw upError;
  const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
  console.log("upload ok", pub.publicUrl);

  const { error: mediaError } = await supabase.from("media").insert({
    path,
    alt: "test",
    mime: "image/png",
    size_bytes: png.length,
    created_by: auth.user!.id,
  });
  if (mediaError) throw mediaError;
  console.log("media row ok");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
