"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import {
  logoutAction,
  publishPage,
  publishSiteSettings,
  savePageDraft,
  saveSiteSettingsDraft,
  uploadMedia,
} from "@/lib/cms/actions";
import type { HomeBlocks, SiteSettingsData } from "@/lib/cms/types";

type CmsDocument =
  | { kind: "page"; path: string; blocks: Record<string, unknown> }
  | { kind: "settings"; data: SiteSettingsData }
  | { kind: "entry"; type: string; slug: string; data: Record<string, unknown> };

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
  settings: SiteSettingsData | null;
  setPageField: (path: string, value: unknown) => void;
  setSettingsField: (path: string, value: unknown) => void;
  registerPage: (path: string, blocks: Record<string, unknown> | null) => void;
  saveDraft: () => void;
  publish: () => void;
  logout: () => void;
  uploadImage: (file: File) => Promise<string>;
};

const EditContext = createContext<EditContextValue | null>(null);

function setByPath(obj: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split(".");
  const next = structuredClone(obj);
  let cursor: Record<string, unknown> = next;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]!;
    const index = Number(key);
    if (Array.isArray(cursor[parts[i - 1] as string])) {
      // handled below via object traversal
    }
    const part = parts[i]!;
    const asIndex = /^\d+$/.test(part);
    if (asIndex) {
      const arr = cursor as unknown as unknown[];
      const idx = Number(part);
      if (typeof arr[idx] !== "object" || arr[idx] === null) {
        arr[idx] = {};
      }
      cursor = arr[idx] as Record<string, unknown>;
      continue;
    }
    if (typeof cursor[part] !== "object" || cursor[part] === null) {
      const nextPart = parts[i + 1];
      cursor[part] = nextPart && /^\d+$/.test(nextPart) ? [] : {};
    }
    cursor = cursor[part] as Record<string, unknown>;
  }
  const last = parts[parts.length - 1]!;
  if (/^\d+$/.test(last) && Array.isArray(cursor)) {
    (cursor as unknown as unknown[])[Number(last)] = value;
  } else {
    cursor[last] = value;
  }
  return next;
}

function setPathValue(root: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split(".");
  const clone = structuredClone(root);
  let current: any = clone;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]!;
    const nextKey = parts[i + 1]!;
    if (current[key] == null) {
      current[key] = /^\d+$/.test(nextKey) ? [] : {};
    }
    current = current[key];
  }
  current[parts[parts.length - 1]!] = value;
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
  const [editing, setEditing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettingsData | null>(initialSettings ?? null);
  const [pagePath, setPagePath] = useState<string | null>(initialPagePath ?? null);
  const [pageBlocks, setPageBlocks] = useState<Record<string, unknown> | null>(
    initialPageBlocks ?? null,
  );
  const [isPending, startTransition] = useTransition();

  const registerPage = useCallback((path: string, blocks: Record<string, unknown> | null) => {
    setPagePath(path);
    setPageBlocks(blocks);
    setDirty(false);
  }, []);

  const setPageField = useCallback((path: string, value: unknown) => {
    setPageBlocks((prev) => {
      if (!prev) return prev;
      setDirty(true);
      return setPathValue(prev, path, value);
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
        if (pagePath && pageBlocks) await savePageDraft(pagePath, pageBlocks);
        setDirty(false);
        setMessage("Draft saved");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Save failed");
      }
    });
  }, [pageBlocks, pagePath, settings]);

  const publish = useCallback(() => {
    startTransition(async () => {
      try {
        if (settings) await publishSiteSettings(settings);
        if (pagePath && pageBlocks) await publishPage(pagePath, pageBlocks);
        setDirty(false);
        setMessage("Published");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Publish failed");
      }
    });
  }, [pageBlocks, pagePath, settings]);

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

  const value = useMemo<EditContextValue>(
    () => ({
      isEditor,
      editing: isEditor && editing,
      setEditing,
      dirty,
      saving: isPending,
      message,
      email: email ?? null,
      pagePath,
      pageBlocks,
      settings,
      setPageField,
      setSettingsField,
      registerPage,
      saveDraft,
      publish,
      logout,
      uploadImage,
    }),
    [
      dirty,
      editing,
      email,
      isEditor,
      isPending,
      logout,
      message,
      pageBlocks,
      pagePath,
      publish,
      registerPage,
      saveDraft,
      setPageField,
      setSettingsField,
      settings,
      uploadImage,
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
      settings: null,
      setPageField: () => undefined,
      setSettingsField: () => undefined,
      registerPage: () => undefined,
      saveDraft: () => undefined,
      publish: () => undefined,
      logout: () => undefined,
      uploadImage: async () => "",
    } satisfies EditContextValue;
  }
  return ctx;
}

export type { HomeBlocks };
