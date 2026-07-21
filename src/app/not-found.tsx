import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";

export const metadata: Metadata = {
  title: "Page Not Found | Faith Associates",
  description: "The requested Faith Associates page could not be found.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main id="main-content" className="min-h-screen bg-[var(--navy)] text-white">
      <SiteHeader />
      <section className="relative isolate flex min-h-[720px] items-center overflow-hidden pb-20 pt-28 lg:pt-44">
        <div className="section-shell">
          <p className="type-eyebrow text-white/45">Error 404</p>
          <h1 className="type-display mt-6 max-w-[11ch] text-[clamp(3rem,7vw,5.5rem)]">
            This page has moved on.
          </h1>
          <p className="type-body mt-7 max-w-xl text-base text-white/62 sm:text-lg">
            The address may belong to our previous website, or the page may no longer be available.
            Start again or explore the work we do.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/" className="btn-primary bg-white text-[var(--navy)] hover:bg-[var(--red)] hover:text-white">
              Return home →
            </Link>
            <Link
              href="/services"
              className="btn-secondary border-white text-white hover:bg-white hover:text-[var(--navy)]"
            >
              Explore services
            </Link>
            <Link
              href="/publications"
              className="btn-secondary border-white text-white hover:bg-white hover:text-[var(--navy)]"
            >
              Browse publications
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
