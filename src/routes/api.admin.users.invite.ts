import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Database } from "@/integrations/supabase/types";

const inviteSchema = z.object({
  email: z.string().trim().email().max(255),
  displayName: z.string().trim().min(2).max(100),
  role: z.enum(["admin", "reviewer", "staff"]),
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function getAuthenticatedUser(request: Request) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_PUBLISHABLE_KEY =
    process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("Missing Supabase client environment variables.");
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice("Bearer ".length);
  if (!token) {
    return null;
  }

  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export const Route = createFileRoute("/api/admin/users/invite")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return json({ error: "Invalid JSON" }, 400);
        }

        const parsed = inviteSchema.safeParse(raw);
        if (!parsed.success) {
          return json({ error: "Validation failed", details: parsed.error.issues }, 400);
        }

        const requester = await getAuthenticatedUser(request);
        if (!requester) {
          return json({ error: "Unauthorized" }, 401);
        }

        const { data: requesterRoles, error: roleError } = await supabaseAdmin
          .from("user_roles")
          .select("role")
          .eq("user_id", requester.id);

        if (roleError) {
          console.error("Failed to load requester role", roleError);
          return json({ error: "Failed to verify permissions" }, 500);
        }

        const isAdmin = (requesterRoles ?? []).some((row) => row.role === "admin");
        if (!isAdmin) {
          return json({ error: "Admins only" }, 403);
        }

        const email = parsed.data.email.toLowerCase();
        const { data: existingProfile, error: profileError } = await supabaseAdmin
          .from("profiles")
          .select("user_id, email")
          .eq("email", email)
          .maybeSingle();

        if (profileError) {
          console.error("Failed to check existing profile", profileError);
          return json({ error: "Failed to validate user state" }, 500);
        }

        if (existingProfile) {
          await supabaseAdmin.from("user_roles").delete().eq("user_id", existingProfile.user_id);
          const { error: assignError } = await supabaseAdmin.from("user_roles").insert({
            user_id: existingProfile.user_id,
            role: parsed.data.role,
          });

          if (assignError) {
            console.error("Failed to update existing user role", assignError);
            return json({ error: "Failed to update existing user role" }, 500);
          }

          return json({ ok: true, invited: false, updated: true });
        }

        const redirectTo = process.env.PILOT_INVITE_REDIRECT_TO;
        const { data: invited, error: inviteError } =
          await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
            data: { display_name: parsed.data.displayName },
            ...(redirectTo ? { redirectTo } : {}),
          });

        if (inviteError || !invited.user) {
          console.error("Failed to invite user", inviteError);
          return json({ error: inviteError?.message ?? "Failed to invite user" }, 500);
        }

        await supabaseAdmin
          .from("profiles")
          .update({
            display_name: parsed.data.displayName,
            email,
          })
          .eq("user_id", invited.user.id);

        await supabaseAdmin.from("user_roles").delete().eq("user_id", invited.user.id);
        const { error: assignError } = await supabaseAdmin.from("user_roles").insert({
          user_id: invited.user.id,
          role: parsed.data.role,
        });

        if (assignError) {
          console.error("Failed to assign invited user role", assignError);
          return json({ error: "User invited but role assignment failed" }, 500);
        }

        return json({ ok: true, invited: true, updated: false });
      },
    },
  },
});
