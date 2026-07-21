import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  Building2,
  Users,
  Package,
  Calendar,
  CreditCard,
  Mail,
  Zap,
  BarChart3,
  Settings,
  LogOut,
  ClipboardCheck,
  ArrowRightLeft,
} from "lucide-react";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard };
type ExpoReadiness = {
  ready: boolean;
  serviceRoleConfigured: boolean;
  expoConfigured: boolean;
  missingTables: string[];
  issues: string[];
};

const EXPO_NAV: NavItem[] = [
  { to: "/expo/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/expo/exhibitors", label: "Exhibitors", icon: Building2 },
  { to: "/expo/attendees", label: "Attendees", icon: Users },
  { to: "/expo/packages", label: "Packages", icon: Package },
  { to: "/expo/meetings", label: "Meetings", icon: Calendar },
  { to: "/expo/invoices", label: "Invoices", icon: CreditCard },
  { to: "/expo/onboarding", label: "Onboarding", icon: ClipboardCheck },
  { to: "/expo/templates", label: "Templates", icon: Mail },
  { to: "/expo/automations", label: "Automations", icon: Zap },
  { to: "/expo/reports", label: "Reports", icon: BarChart3 },
  { to: "/expo/admin", label: "Admin", icon: Settings },
];

export function ExpoShell() {
  const { user, loading, roles, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [readiness, setReadiness] = useState<ExpoReadiness | null>(null);
  const [readinessLoading, setReadinessLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      void navigate({ to: "/login" });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    setReadinessLoading(true);

    void fetch("/api/system/readiness")
      .then(async (response) => {
        const data = (await response.json()) as ExpoReadiness;
        if (!cancelled) setReadiness(data);
      })
      .catch(() => {
        if (!cancelled) {
          setReadiness({
            ready: false,
            serviceRoleConfigured: false,
            expoConfigured: false,
            missingTables: [],
            issues: ["Could not load system readiness status."],
          });
        }
      })
      .finally(() => {
        if (!cancelled) setReadinessLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading || !user || readinessLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    void navigate({ to: "/login" });
  };

  const roleLabel = roles[0] ? roles[0].charAt(0).toUpperCase() + roles[0].slice(1) : "—";
  const initials = (user.email ?? "?").slice(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Expo Sidebar — deep slate with emerald accent */}
      <aside className="hidden w-60 flex-col bg-[#0f1623] text-white md:flex">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-sm font-bold text-white shadow-sm">
            ME
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight text-white">Mosque Expo</p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-white/40">
              Operations Portal
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/25">
            Navigation
          </p>
          {EXPO_NAV.map((item) => {
            const Icon = item.icon;
            const active = location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to as never}
                className={`mb-0.5 flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150 ${
                  active
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "text-white/55 hover:bg-white/6 hover:text-white"
                }`}
              >
                <Icon
                  className={`h-4 w-4 flex-shrink-0 ${active ? "text-emerald-400" : "text-white/40"}`}
                />
                {item.label}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />}
              </Link>
            );
          })}

          {/* Portal switch */}
          <div className="mt-4 border-t border-white/8 pt-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-white/40 transition-all hover:bg-white/6 hover:text-white"
            >
              <ArrowRightLeft className="h-4 w-4 flex-shrink-0" />
              Switch to MBA CRM
            </Link>
          </div>
        </nav>

        {/* User footer */}
        <div className="border-t border-white/8 px-3 py-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium text-white/80">{user.email}</p>
              <p className="text-[10px] text-white/35">{roleLabel}</p>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-white/30 transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden">
        {readiness?.ready ? (
          <Outlet />
        ) : (
          <div className="px-6 py-8 md:px-10">
            <div className="max-w-3xl rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                Setup Required
              </p>
              <h1 className="mt-3 text-2xl font-semibold text-foreground">
                Expo portal is not ready yet
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                The linked Supabase project is missing part of the Expo deployment, so these pages
                are intentionally blocked until setup is completed.
              </p>
              <div className="mt-5 space-y-2 text-sm text-foreground">
                <p>
                  Service role key:{" "}
                  <strong>{readiness?.serviceRoleConfigured ? "configured" : "missing"}</strong>
                </p>
                <p>
                  Expo schema:{" "}
                  <strong>{readiness?.expoConfigured ? "deployed" : "not deployed"}</strong>
                </p>
                {readiness?.missingTables.length ? (
                  <p>Missing tables: {readiness.missingTables.join(", ")}</p>
                ) : null}
              </div>
              {readiness?.issues.length ? (
                <div className="mt-5 rounded-lg border border-amber-300 bg-white/70 p-3 text-xs text-amber-900">
                  {readiness.issues[0]}
                </div>
              ) : null}
              <div className="mt-6 flex gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  Back to MBA CRM
                </Link>
                <button
                  onClick={() => {
                    setReadinessLoading(true);
                    void fetch("/api/system/readiness")
                      .then(async (response) => {
                        const data = (await response.json()) as ExpoReadiness;
                        setReadiness(data);
                      })
                      .finally(() => setReadinessLoading(false));
                  }}
                  className="inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Recheck setup
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
