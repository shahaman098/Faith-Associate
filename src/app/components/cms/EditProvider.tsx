"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import {
  logoutAction,
  publishEntry,
  publishPage,
  publishSiteSettings,
  saveEntryDraft,
  savePageDraft,
  saveSiteSettingsDraft,
  uploadMedia,
} from "@/lib/cms/actions";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type { HomeBlocks, SiteSettingsData } from "@/lib/cms/types";

type CmsDocument =
  | { kind: "page"; path: string; blocks: Record<string, unknown> | null }
  | { kind: "entry"; type: string; slug: string; data: Record<string, unknown> | null };

type EditContextValue = {
  isEditor: boolean;
  editing: boolean;
  setEditing: (value: boolean) => void;
  dirty: boolean;
  saving: boolean;
  message: string | null;
  email: string | null;
  pagePath: string | null;
  pageBlocks: Record<string, unknown> | null;
  documentKind: "page" | "entry" | null;
  entryType: string | null;
  entrySlug: string | null;
  settings: SiteSettingsData | null;
  setPageField: (path: string, value: unknown) => void;
  setSettingsField: (path: string, value: unknown) => void;
  registerPage: (path: string, blocks: Record<string, unknown> | null) => void;
  registerEntry: (type: string, slug: string, data: Record<string, unknown> | null) => void;
  saveDraft: () => void;
  publish: () => void;
  logout: () => void;
  uploadImage: (file: File) => Promise<string>;
};

const EditContext = createContext<EditContextValue | null>(null);

function setPathValue(root: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split(".");
  const clone = structuredClone(root);
  let current: Record<string, unknown> | unknown[] = clone;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]!;
    const nextKey = parts[i + 1]!;
    const bucket = current as Record<string, unknown>;
    if (bucket[key] == null) {
      bucket[key] = /^\d+$/.test(nextKey) ? [] : {};
    }
    current = bucket[key] as Record<string, unknown> | unknown[];
  }
  (current as Record<string, unknown>)[parts[parts.length - 1]!] = value;
  return clone as Record<string, unknown>;
}

export function EditProvider({
  children,
  isEditor,
  email,
  initialSettings,
  initialPagePath,
  initialPageBlocks,
}: {
  children: ReactNode;
  isEditor: boolean;
  email?: string | null;
  initialSettings?: SiteSettingsData | null;
  initialPagePath?: string | null;
  initialPageBlocks?: Record<string, unknown> | null;
}) {
  const [editorState, setEditorState] = useState({
    isEditor,
    email: email ?? null,
  });
  const [editing, setEditing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettingsData | null>(initialSettings ?? null);
  const [document, setDocument] = useState<CmsDocument | null>(
    initialPagePath ? { kind: "page", path: initialPagePath, blocks: initialPageBlocks ?? null } : null,
  );
  const [isPending, startTransition] = useTransition();
  const dirtyRef = useRef(false);

  useEffect(() => {
    dirtyRef.current = dirty;
  }, [dirty]);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) return;

    const client = createBrowserClient();
    let cancelled = false;

    async function syncEditorState() {
      const {
        data: { user },
      } = await client.auth.getUser();

      if (!user) {
        if (!cancelled) setEditorState({ isEditor: false, email: null });
        return;
      }

      const { data: profile } = await client
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (cancelled) return;

      setEditorState({
        isEditor: Boolean(profile && ["editor", "admin"].includes(profile.role)),
        email: user.email ?? null,
      });
    }

    void syncEditorState();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange(() => {
      void syncEditorState();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const registerPage = useCallback((path: string, blocks: Record<string, unknown> | null) => {
    setDocument((current) => {
      if (current?.kind === "page" && current.path === path && dirtyRef.current) {
        return current;
      }
      setDirty(false);
      return { kind: "page", path, blocks };
    });
  }, []);

  const registerEntry = useCallback((type: string, slug: string, data: Record<string, unknown> | null) => {
    setDocument((current) => {
      if (
        current?.kind === "entry" &&
        current.type === type &&
        current.slug === slug &&
        dirtyRef.current
      ) {
        return current;
      }
      setDirty(false);
      return { kind: "entry", type, slug, data };
    });
  }, []);

  const setPageField = useCallback((path: string, value: unknown) => {
    setDocument((prev) => {
      setDirty(true);
      if (prev?.kind === "page") {
        return { ...prev, blocks: setPathValue(prev.blocks ?? {}, path, value) };
      }
      if (prev?.kind === "entry") {
        return { ...prev, data: setPathValue(prev.data ?? {}, path, value) };
      }
      return { kind: "page", path: "/", blocks: setPathValue({}, path, value) };
    });
  }, []);

  const setSettingsField = useCallback((path: string, value: unknown) => {
    setSettings((prev) => {
      if (!prev) return prev;
      setDirty(true);
      return setPathValue(prev as unknown as Record<string, unknown>, path, value) as unknown as SiteSettingsData;
    });
  }, []);

  const saveDraft = useCallback(() => {
    startTransition(async () => {
      try {
        if (settings) await saveSiteSettingsDraft(settings);
        if (document?.kind === "page" && document.path && document.blocks) {
          await savePageDraft(document.path, document.blocks);
        }
        if (document?.kind === "entry" && document.type && document.slug && document.data) {
          await saveEntryDraft(document.type, document.slug, document.data);
        }
        setDirty(false);
        setMessage("Draft saved");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Save failed");
      }
    });
  }, [document, settings]);

  const publish = useCallback(() => {
    startTransition(async () => {
      try {
        if (settings) await publishSiteSettings(settings);
        if (document?.kind === "page" && document.path && document.blocks) {
          await publishPage(document.path, document.blocks);
        }
        if (document?.kind === "entry" && document.type && document.slug && document.data) {
          await publishEntry(document.type, document.slug, document.data);
        }
        setDirty(false);
        setMessage("Published");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Publish failed");
      }
    });
  }, [document, settings]);

  const logout = useCallback(() => {
    startTransition(async () => {
      await logoutAction();
      window.location.href = "/";
    });
  }, []);

  const uploadImage = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.set("file", file);
    formData.set("alt", file.name);
    try {
      const result = await uploadMedia(formData);
      setMessage("Image uploaded — save draft or publish");
      setDirty(true);
      return result.url;
    } catch (error) {
      const text = error instanceof Error ? error.message : "Upload failed";
      setMessage(text);
      throw error;
    }
  }, []);

  const pagePath = document?.kind === "page" ? document.path : null;
  const pageBlocks =
    document?.kind === "page"
      ? document.blocks
      : document?.kind === "entry"
        ? document.data
        : null;

  const value = useMemo<EditContextValue>(
    () => ({
      isEditor: editorState.isEditor,
      editing: editorState.isEditor && editing,
      setEditing,
      dirty,
      saving: isPending,
      message,
      email: editorState.email,
      pagePath,
      pageBlocks,
      documentKind: document?.kind ?? null,
      entryType: document?.kind === "entry" ? document.type : null,
      entrySlug: document?.kind === "entry" ? document.slug : null,
      settings,
      setPageField,
      setSettingsField,
      registerPage,
      registerEntry,
      saveDraft,
      publish,
      logout,
      uploadImage,
    }),
    [
      dirty,
      editing,
      editorState,
      isPending,
      logout,
      message,
      pagePath,
      pageBlocks,
      publish,
      registerEntry,
      registerPage,
      saveDraft,
      setPageField,
      setSettingsField,
      settings,
      uploadImage,
      document,
    ],
  );

  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
}

export function useEdit() {
  const ctx = useContext(EditContext);
  if (!ctx) {
    return {
      isEditor: false,
      editing: false,
      setEditing: () => undefined,
      dirty: false,
      saving: false,
      message: null,
      email: null,
      pagePath: null,
      pageBlocks: null,
      documentKind: null,
      entryType: null,
      entrySlug: null,
      settings: null,
      setPageField: () => undefined,
      setSettingsField: () => undefined,
      registerPage: () => undefined,
      registerEntry: () => undefined,
      saveDraft: () => undefined,
      publish: () => undefined,
      logout: () => undefined,
      uploadImage: async () => "",
    } satisfies EditContextValue;
  }
  return ctx;
}

export type { HomeBlocks };
