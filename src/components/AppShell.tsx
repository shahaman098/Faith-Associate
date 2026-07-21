import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import faithLogo from "@/assets/faith-associates-logo.jpeg";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Kanban,
  CheckSquare,
  Calendar,
  CreditCard,
  Mail,
  Zap,
  BarChart3,
  Settings,
  FileInput,
  LogOut,
  ArrowRightLeft,
} from "lucide-react";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; adminOnly?: boolean };

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/contacts", label: "Contacts", icon: Users },
  { to: "/applications", label: "Applications", icon: ClipboardList },
  { to: "/pipeline", label: "Pipeline", icon: Kanban },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/meetings", label: "Meetings", icon: Calendar },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/templates", label: "Templates", icon: Mail },
  { to: "/forms", label: "Forms", icon: FileInput },
  { to: "/automations", label: "Automations", icon: Zap },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/admin", label: "Admin", icon: Settings, adminOnly: true },
];

export function AppShell() {
  const { user, loading, roles, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      void navigate({ to: "/login" });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
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
      {/* Sidebar */}
      <aside className="hidden w-60 flex-col bg-sidebar text-sidebar-foreground md:flex">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5">
          <img
            src={faithLogo}
            alt="Faith Associates"
            className="h-9 w-9 flex-shrink-0 rounded-lg bg-white object-contain p-0.5 shadow-sm"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight text-sidebar-foreground">
              Faith Associates
            </p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-sidebar-foreground opacity-50">
              Admissions CRM
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground opacity-30">
            Navigation
          </p>
          {NAV.filter((item) => !item.adminOnly || isAdmin).map((item) => {
            const Icon = item.icon;
            const active = location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to as never}
                className={`mb-0.5 flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150 ${
                  active
                    ? "bg-white/15 shadow-sm"
                    : "hover:bg-white/10"
                }`}
                style={{ color: active ? "var(--color-sidebar-foreground)" : "color-mix(in oklch, var(--color-sidebar-foreground) 65%, transparent)" }}
              >
                <Icon
                  className="h-4 w-4 flex-shrink-0"
                  style={{ color: active ? "var(--color-sidebar-foreground)" : "color-mix(in oklch, var(--color-sidebar-foreground) 50%, transparent)" }}
                />
                {item.label}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}

          {/* Portal switch */}
          <div className="mt-4 border-t border-sidebar-border pt-4">
            <Link
              to="/expo/dashboard"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-sidebar-foreground/50 transition-all hover:bg-white/10 hover:text-sidebar-foreground"
            >
              <ArrowRightLeft className="h-4 w-4 flex-shrink-0" />
              Switch to Expo Portal
            </Link>
          </div>
        </nav>

        {/* User footer */}
        <div className="border-t border-sidebar-border px-3 py-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium text-sidebar-foreground">{user.email}</p>
              <p className="text-[10px] text-sidebar-foreground opacity-50">{roleLabel}</p>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-sidebar-foreground/40 transition-colors hover:bg-white/10 hover:text-sidebar-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
