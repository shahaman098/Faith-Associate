"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createCmsPageAction,
  createNewsPostAction,
  createPublicationAction,
} from "@/lib/cms/actions";

type DashboardState = {
  ok: boolean;
  error?: string;
  path?: string;
} | null;

type ExistingNewsEntry = {
  slug: string;
  title: string;
  category: string;
  date: string;
};

type ExistingPublicationEntry = {
  slug: string;
  title: string;
  category: string;
  year: string;
};

type ExistingPageEntry = {
  path: string;
  title: string;
  status: "draft" | "published";
};

function CreateCard({
  eyebrow,
  title,
  description,
  submitLabel,
  pendingLabel,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  submitLabel: string;
  pendingLabel: string;
  action: (formData: FormData) => Promise<{ ok: boolean; error?: string; path?: string }>;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<DashboardState, FormData>(
    async (_prev, formData) => action(formData),
    null,
  );

  useEffect(() => {
    if (state?.ok && state.path) {
      router.push(state.path);
      router.refresh();
    }
  }, [router, state]);

  return (
    <form action={formAction} className="rounded-[2rem] border border-[var(--line)] bg-white p-8 shadow-sm">
      <div>
        <p className="type-eyebrow text-[var(--blue)]">{eyebrow}</p>
        <h2 className="mt-3 text-2xl font-semibold text-[var(--ink)]">{title}</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">{description}</p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {children}
      </div>

      {state && !state.ok ? (
        <p className="mt-4 text-sm text-red-600">{state.error ?? "Creation failed"}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex rounded-lg bg-[var(--navy)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? pendingLabel : submitLabel}
      </button>
    </form>
  );
}

function ExistingList({
  eyebrow,
  title,
  empty,
  items,
}: {
  eyebrow: string;
  title: string;
  empty: string;
  items: Array<{
    key: string;
    href: string;
    meta: string;
    heading: string;
    body: string;
  }>;
}) {
  return (
    <section className="rounded-[2rem] border border-[var(--line)] bg-white p-8 shadow-sm">
      <p className="type-eyebrow text-[var(--blue)]">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold text-[var(--ink)]">{title}</h2>
      <div className="mt-6 space-y-4">
        {items.length ? (
          items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="block rounded-2xl border border-[var(--line)] px-5 py-4 transition hover:border-[var(--blue)]"
            >
              <p className="type-meta text-[var(--blue)]">{item.meta}</p>
              <h3 className="mt-2 text-lg font-semibold text-[var(--ink)]">{item.heading}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{item.body}</p>
            </Link>
          ))
        ) : (
          <p className="text-sm text-[var(--muted)]">{empty}</p>
        )}
      </div>
    </section>
  );
}

export function CmsDashboard({
  email,
  role,
  newsEntries,
  publicationEntries,
  pageEntries,
}: {
  email: string | null;
  role: "editor" | "admin";
  newsEntries: ExistingNewsEntry[];
  publicationEntries: ExistingPublicationEntry[];
  pageEntries: ExistingPageEntry[];
}) {
  return (
    <div className="w-full max-w-6xl space-y-10">
      <div className="rounded-[2rem] border border-[var(--line)] bg-white p-8 shadow-sm">
        <p className="type-eyebrow text-[var(--blue)]">Content management</p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--ink)]">CMS dashboard</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Signed in as {email} ({role}). New posts, publications and pages are created as drafts.
          After creation, you will be taken straight to the editable route.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex rounded-lg bg-[var(--navy)] px-4 py-2.5 text-sm font-semibold text-white"
          >
            View homepage
          </Link>
          <Link
            href="/news"
            className="inline-flex rounded-lg border border-[var(--line)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)]"
          >
            View news
          </Link>
          <Link
            href="/publications"
            className="inline-flex rounded-lg border border-[var(--line)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)]"
          >
            View publications
          </Link>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-3">
        <CreateCard
          eyebrow="Create post"
          title="Add a news post"
          description="Create the draft, then finish the content inline on the post page."
          submitLabel="Create post"
          pendingLabel="Creating post…"
          action={createNewsPostAction}
        >
          <label className="block text-sm font-medium text-[var(--ink)] sm:col-span-2">
            Title
            <input
              name="title"
              type="text"
              required
              className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--ink)]">
            Category
            <input
              name="category"
              type="text"
              defaultValue="News"
              className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--ink)]">
            Date label
            <input
              name="date"
              type="text"
              placeholder="31 July 2026"
              className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--ink)] sm:col-span-2">
            Slug
            <input
              name="slug"
              type="text"
              placeholder="leave blank to generate from the title"
              className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--ink)] sm:col-span-2">
            Summary
            <textarea
              name="summary"
              required
              rows={3}
              className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--ink)] sm:col-span-2">
            Body
            <textarea
              name="body"
              rows={8}
              placeholder="Separate paragraphs with a blank line."
              className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--ink)]">
            Cover image URL
            <input
              name="imageUrl"
              type="url"
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--ink)]">
            Or upload cover image
            <input
              name="imageFile"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="mt-1 block w-full text-sm"
            />
          </label>
        </CreateCard>

        <CreateCard
          eyebrow="Create publication"
          title="Add a publication"
          description="This creates a publication draft with editable defaults for the detail page."
          submitLabel="Create publication"
          pendingLabel="Creating publication…"
          action={createPublicationAction}
        >
          <label className="block text-sm font-medium text-[var(--ink)] sm:col-span-2">
            Title
            <input
              name="title"
              type="text"
              required
              className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--ink)]">
            Category
            <input
              name="category"
              type="text"
              defaultValue="Reports & insight"
              className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--ink)]">
            Format
            <input
              name="format"
              type="text"
              defaultValue="Guide"
              className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--ink)]">
            Year
            <input
              name="year"
              type="text"
              defaultValue="2026"
              className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--ink)]">
            Slug
            <input
              name="slug"
              type="text"
              placeholder="leave blank to generate from the title"
              className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--ink)] sm:col-span-2">
            Summary
            <textarea
              name="summary"
              rows={3}
              placeholder="Optional starter summary"
              className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--ink)]">
            Download URL
            <input
              name="downloadUrl"
              type="url"
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--ink)]">
            Zoho form URL
            <input
              name="zohoFormUrl"
              type="url"
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--ink)]">
            Cover image URL
            <input
              name="imageUrl"
              type="url"
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--ink)]">
            Or upload cover image
            <input
              name="imageFile"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="mt-1 block w-full text-sm"
            />
          </label>
        </CreateCard>

        <CreateCard
          eyebrow="Create page"
          title="Add a CMS page"
          description="Create a generic content page on a new route. Built-in routes like /news and /publications are excluded."
          submitLabel="Create page"
          pendingLabel="Creating page…"
          action={createCmsPageAction}
        >
          <label className="block text-sm font-medium text-[var(--ink)] sm:col-span-2">
            Title
            <input
              name="title"
              type="text"
              required
              className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--ink)] sm:col-span-2">
            Path
            <input
              name="path"
              type="text"
              placeholder="/community-partnerships"
              className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--ink)] sm:col-span-2">
            Summary
            <textarea
              name="summary"
              rows={4}
              placeholder="Optional starter summary"
              className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
            />
          </label>
        </CreateCard>
      </div>

      <div className="grid gap-8 xl:grid-cols-3">
        <ExistingList
          eyebrow="Existing posts"
          title="Edit news"
          empty="No news posts found yet."
          items={newsEntries.map((entry) => ({
            key: entry.slug,
            href: `/news/${entry.slug}`,
            meta: `${entry.category} / ${entry.date}`,
            heading: entry.title,
            body: "Open this post and use the Edit page toolbar.",
          }))}
        />
        <ExistingList
          eyebrow="Existing publications"
          title="Edit publications"
          empty="No publications found yet."
          items={publicationEntries.map((entry) => ({
            key: entry.slug,
            href: `/publications/${entry.slug}`,
            meta: `${entry.category} / ${entry.year}`,
            heading: entry.title,
            body: "Open this publication and use the Edit page toolbar.",
          }))}
        />
        <ExistingList
          eyebrow="Existing pages"
          title="Edit CMS pages"
          empty="No CMS pages found yet."
          items={pageEntries.map((entry) => ({
            key: entry.path,
            href: entry.path,
            meta: `${entry.status.toUpperCase()} / ${entry.path}`,
            heading: entry.title,
            body: "Open this page and use the Edit page toolbar.",
          }))}
        />
      </div>
    </div>
  );
}
