"use client";

import { useEffect } from "react";
import { useEdit } from "./EditProvider";

export function CmsEntry({
  type,
  slug,
  data,
  children,
}: {
  type: string;
  slug: string;
  data: Record<string, unknown>;
  children: React.ReactNode;
}) {
  const { registerEntry } = useEdit();

  useEffect(() => {
    registerEntry(type, slug, data);
  }, [data, registerEntry, slug, type]);

  return <>{children}</>;
}
