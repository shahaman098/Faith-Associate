import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin")({
  component: Admin,
});

type UserRow = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  role: "admin" | "reviewer" | "staff" | null;
};

type SystemReadiness = {
  ready: boolean;
  serviceRoleConfigured: boolean;
  expoConfigured: boolean;
  missingTables: string[];
  issues: string[];
};

function Admin() {
  const { isAdmin, loading, user, session, authError } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "reviewer" | "staff">("staff");
  const [inviting, setInviting] = useState(false);
  const [readiness, setReadiness] = useState<SystemReadiness | null>(null);

  useEffect(() => {
    if (!loading && isAdmin) void load();
  }, [loading, isAdmin]);

  useEffect(() => {
    if (!loading && isAdmin) {
      void fetch("/api/system/readiness")
        .then((response) => response.json())
        .then((data: SystemReadiness) => setReadiness(data))
        .catch(() => {
          setReadiness(null);
        });
    }
  }, [loading, isAdmin]);

  async function load() {
    const [{ data: profiles, error: profilesError }, { data: roles, error: rolesError }] =
      await Promise.all([
        supabase.from("profiles").select("user_id, email, display_name"),
        supabase.from("user_roles").select("user_id, role"),
      ]);
    if (profilesError || rolesError) {
      toast.error(profilesError?.message ?? rolesError?.message ?? "Failed to load admin data");
      return;
    }
    const roleMap = new Map<string, "admin" | "reviewer" | "staff">();
    roles?.forEach((r) => roleMap.set(r.user_id, r.role));
    setUsers(
      (profiles ?? []).map((p) => ({
        user_id: p.user_id,
        email: p.email,
        display_name: p.display_name,
        role: roleMap.get(p.user_id) ?? null,
      })),
    );
  }

  async function setRole(userId: string, role: "admin" | "reviewer" | "staff") {
    if (!isAdmin) {
      toast.error("Admins only");
      return;
    }
    if (user?.id === userId && role !== "admin") {
      toast.error("You cannot remove your own admin role");
      return;
    }
    await supabase.from("user_roles").delete().eq("user_id", userId);
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
    if (error) return toast.error(error.message);
    toast.success("Role updated");
    void load();
  }

  async function inviteUser() {
    if (!isAdmin) {
      toast.error("Admins only");
      return;
    }
    if (!session?.access_token) {
      toast.error("Your session expired. Sign in again.");
      return;
    }

    setInviting(true);
    try {
      const response = await fetch("/api/admin/users/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          email: inviteEmail,
          displayName: inviteName,
          role: inviteRole,
        }),
      });

      const result = (await response.json()) as {
        error?: string;
        invited?: boolean;
        updated?: boolean;
      };
      if (!response.ok) {
        throw new Error(result.error ?? "Failed to invite user");
      }

      toast.success(result.updated ? "Existing user role updated" : "Invitation sent");
      setInviteEmail("");
      setInviteName("");
      setInviteRole("staff");
      void load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to invite user");
    } finally {
      setInviting(false);
    }
  }

  if (loading) return <div className="p-10 text-sm text-muted-foreground">Loading…</div>;
  if (!isAdmin) {
    return (
      <div>
        <PageHeader title="Admin" />
        <div className="px-6 py-6 md:px-10">
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              Admins only.
            </CardContent>
          </Card>
          {authError ? <p className="mt-3 text-xs text-destructive">{authError}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Admin" description="Manage users, roles, and system settings." />
      <div className="space-y-6 px-6 py-6 md:px-10">
        <Card>
          <CardHeader>
            <CardTitle>System readiness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              Service role key:{" "}
              <strong>{readiness?.serviceRoleConfigured ? "configured" : "missing"}</strong>
            </p>
            <p>
              Expo schema:{" "}
              <strong>{readiness?.expoConfigured ? "deployed" : "not deployed"}</strong>
            </p>
            {readiness?.missingTables.length ? (
              <p className="text-muted-foreground">
                Missing tables: {readiness.missingTables.join(", ")}
              </p>
            ) : null}
            {!readiness?.serviceRoleConfigured ? (
              <p className="text-destructive">
                Add `SUPABASE_SERVICE_ROLE_KEY` before using admin invites or server-side admin
                actions.
              </p>
            ) : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Invite staff user</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[1.2fr_1fr_180px_auto]">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="staff@faithassociates.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Staff member name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={inviteRole}
                onValueChange={(v) => setInviteRole(v as "admin" | "reviewer" | "staff")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="reviewer">Reviewer</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={inviteUser}
                disabled={inviting || readiness?.serviceRoleConfigured === false}
              >
                {inviting ? "Sending…" : "Send invite"}
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Users & roles</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.user_id}>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.display_name ?? "—"}</TableCell>
                    <TableCell className="capitalize">{u.role ?? "—"}</TableCell>
                    <TableCell>
                      <Select
                        value={u.role ?? ""}
                        onValueChange={(v) => setRole(u.user_id, v as never)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Set role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="reviewer">Reviewer</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground">
          Pilot access should be provisioned from this screen by an admin. Self-sign-up should be
          disabled in the Supabase project before launch.
        </p>
        <Button variant="outline" onClick={load}>
          Refresh
        </Button>
      </div>
    </div>
  );
}
