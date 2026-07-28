"use client";

import { useEffect } from "react";
import { useEdit } from "./EditProvider";

/** Registers the current route's CMS page document with the root EditProvider. */
export function CmsPage({
  path,
  blocks,
  children,
}: {
  path: string;
  blocks?: Record<string, unknown> | null;
  children: React.ReactNode;
}) {
  const { registerPage } = useEdit();

  useEffect(() => {
    registerPage(path, blocks ?? null);
  }, [blocks, path, registerPage]);

  return <>{children}</>;
}
