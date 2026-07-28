"use client";

import { EditProvider } from "./EditProvider";
import { EditToolbar } from "./EditToolbar";
import type { SiteSettingsData } from "@/lib/cms/types";

export function CmsShell({
  children,
  isEditor,
  email,
  settings,
  pagePath,
  pageBlocks,
}: {
  children: React.ReactNode;
  isEditor: boolean;
  email?: string | null;
  settings: SiteSettingsData;
  pagePath?: string | null;
  pageBlocks?: Record<string, unknown> | null;
}) {
  return (
    <EditProvider
      isEditor={isEditor}
      email={email}
      initialSettings={settings}
      initialPagePath={pagePath}
      initialPageBlocks={pageBlocks}
    >
      {children}
      <EditToolbar />
    </EditProvider>
  );
}
