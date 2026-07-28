"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/lib/cms/actions";

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    async (_prev: { ok: boolean; error?: string } | null, formData: FormData) => {
      const result = await loginAction(formData);
      if (result.ok) {
        router.push("/");
        router.refresh();
      }
      return result;
    },
    null,
  );

  return (
    <form action={formAction} className="mx-auto w-full max-w-md space-y-4 rounded-2xl border border-[var(--line)] bg-white p-8 shadow-sm">
      <div>
        <p className="type-eyebrow text-[var(--blue)]">Content management</p>
        <h1 className="mt-3 text-2xl font-semibold text-[var(--ink)]">CMS sign in</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Sign in to edit the Faith Associates website on-page.
        </p>
      </div>
      <label className="block text-sm font-medium text-[var(--ink)]">
        Email
        <input
          name="email"
          type="email"
          required
          defaultValue="cms@faithassociates.co.uk"
          className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
        />
      </label>
      <label className="block text-sm font-medium text-[var(--ink)]">
        Password
        <input
          name="password"
          type="password"
          required
          className="mt-1 w-full rounded-lg border border-[var(--line)] px-3 py-2"
        />
      </label>
      {state && !state.ok ? (
        <p className="text-sm text-red-600">{state.error ?? "Login failed"}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-[var(--navy)] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
