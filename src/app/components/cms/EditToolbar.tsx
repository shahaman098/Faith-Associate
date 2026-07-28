"use client";

import Link from "next/link";
import { useEdit } from "./EditProvider";

export function EditToolbar() {
  const {
    isEditor,
    editing,
    setEditing,
    dirty,
    saving,
    message,
    email,
    saveDraft,
    publish,
    logout,
  } = useEdit();

  if (!isEditor) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[100] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center gap-2 rounded-full border border-white/15 bg-[var(--navy)]/95 px-3 py-2 text-white shadow-xl backdrop-blur">
      <span className="hidden px-2 text-[11px] uppercase tracking-[0.14em] text-white/55 sm:inline">
        {email ?? "Editor"}
      </span>
      <button
        type="button"
        onClick={() => setEditing(!editing)}
        className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
          editing ? "bg-[var(--blue)] text-white" : "bg-white/10 hover:bg-white/15"
        }`}
      >
        {editing ? "Editing" : "Edit page"}
      </button>
      {editing ? (
        <>
          <button
            type="button"
            disabled={saving || !dirty}
            onClick={saveDraft}
            className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold disabled:opacity-40"
          >
            Save draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={publish}
            className="rounded-full bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            Publish
          </button>
        </>
      ) : null}
      <Link href="/cms" className="rounded-full px-2 py-1.5 text-xs text-white/60 hover:text-white">
        CMS
      </Link>
      <button
        type="button"
        onClick={logout}
        className="rounded-full px-2 py-1.5 text-xs text-white/60 hover:text-white"
      >
        Log out
      </button>
      {message ? <span className="px-2 text-xs text-emerald-300">{message}</span> : null}
      {dirty ? <span className="px-2 text-xs text-amber-300">Unsaved</span> : null}
    </div>
  );
}
