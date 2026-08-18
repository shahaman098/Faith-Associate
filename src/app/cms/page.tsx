import { LoginForm } from "@/app/components/cms/LoginForm";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { getEditorSession } from "@/lib/cms/actions";
import { getEntries, getPages, getSiteSettings } from "@/lib/cms/queries";
import { CmsDashboard } from "@/app/components/cms/CmsDashboard";

export const metadata = {
  title: "CMS Sign in | Faith Associates",
  robots: { index: false, follow: false },
};

export default async function CmsSignInPage() {
  const [session, settings] = await Promise.all([getEditorSession(), getSiteSettings()]);
  const [newsEntries, publicationEntries, pages] = session
    ? await Promise.all([
        getEntries("news", { preferDraft: true }),
        getEntries("publication", { preferDraft: true }),
        getPages({ preferDraft: true }),
      ])
    : [[], [], []];

  return (
    <main id="main-content" className="min-h-screen bg-[#f7f8fb] text-[var(--ink)]">
      <SiteHeader settings={settings} />
      <div className="section-shell flex flex-col items-center py-16 sm:py-24">
        {session ? (
          <CmsDashboard
            email={session.email}
            role={session.role as "editor" | "admin"}
            newsEntries={newsEntries.map((entry) => ({
              slug: entry.slug,
              title: String(entry.data.title ?? entry.slug),
              category: String(entry.data.category ?? "News"),
              date: String(entry.data.date ?? ""),
            }))}
            publicationEntries={publicationEntries.map((entry) => ({
              slug: entry.slug,
              title: String(entry.data.title ?? entry.slug),
              category: String(entry.data.category ?? "Publication"),
              year: String(entry.data.year ?? ""),
            }))}
            pageEntries={pages.map((page) => ({
              path: page.path,
              title: String(page.title ?? page.path),
              status: page.status,
            }))}
          />
        ) : (
          <LoginForm />
        )}
      </div>
      <SiteFooter settings={settings} />
    </main>
  );
}
