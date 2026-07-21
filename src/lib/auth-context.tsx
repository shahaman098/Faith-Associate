import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "reviewer" | "staff";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  roles: AppRole[];
  loading: boolean;
  signOut: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
  canSetDecision: boolean;
  canMarkPaid: boolean;
  isAdmin: boolean;
  authError: string | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Set up listener FIRST, then fetch session
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setAuthError(null);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        // Defer role fetch to avoid deadlock
        setTimeout(() => {
          void fetchRoles(newSession.user.id);
        }, 0);
      } else {
        setRoles([]);
      }
    });

    void supabase.auth.getSession().then(({ data }) => {
      setAuthError(null);
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        void fetchRoles(data.session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  async function fetchRoles(userId: string) {
    const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    if (!error && data) {
      setRoles(data.map((r) => r.role as AppRole));
      setAuthError(null);
    } else if (error) {
      setRoles([]);
      setAuthError(error.message);
    }
    setLoading(false);
  }

  const signOut = async () => {
    await supabase.auth.signOut();
    setRoles([]);
  };

  const hasRole = (role: AppRole) => roles.includes(role);
  const isAdmin = hasRole("admin");
  const canSetDecision = isAdmin || hasRole("reviewer");
  const canMarkPaid = isAdmin || hasRole("reviewer");

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        roles,
        loading,
        signOut,
        hasRole,
        isAdmin,
        canSetDecision,
        canMarkPaid,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
