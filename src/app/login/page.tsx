import { LoginForm } from "@/app/components/cms/LoginForm";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { getEditorSession } from "@/lib/cms/actions";
import { getSiteSettings } from "@/lib/cms/queries";
import Link from "next/link";

export default async function LoginPage() {
  const [session, settings] = await Promise.all([getEditorSession(), getSiteSettings()]);

  return (
    <main id="main-content" className="min-h-screen bg-[#f7f8fb] text-[var(--ink)]">
      <SiteHeader settings={settings} />
      <div className="section-shell flex flex-col items-center py-16 sm:py-24">
        {session ? (
          <div className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-semibold">Signed in</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {session.email} ({session.role})
            </p>
            <p className="mt-4 text-sm text-[var(--muted)]">
              Open any page and use the floating Edit toolbar to change content.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-lg bg-[var(--navy)] px-4 py-2.5 text-sm font-semibold text-white"
            >
              Go to homepage
            </Link>
          </div>
        ) : (
          <LoginForm />
        )}
      </div>
      <SiteFooter settings={settings} />
    </main>
  );
}
