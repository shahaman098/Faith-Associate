"use client";

import { useEdit } from "./EditProvider";

type Props = {
  value: string;
  path: string;
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "div";
  className?: string;
  multiline?: boolean;
  scope?: "page" | "settings";
};

export function EditableText({
  value,
  path,
  as: Tag = "span",
  className,
  multiline = false,
  scope = "page",
}: Props) {
  const { editing, setPageField, setSettingsField } = useEdit();

  if (!editing) {
    return <Tag className={className}>{value}</Tag>;
  }

  return (
    <Tag
      className={`${className ?? ""} outline outline-2 outline-offset-2 outline-[var(--blue)]/50 rounded-sm bg-[var(--blue)]/5`}
      contentEditable
      suppressContentEditableWarning
      onBlur={(event) => {
        const next = event.currentTarget.textContent ?? "";
        if (scope === "settings") setSettingsField(path, next);
        else setPageField(path, next);
      }}
      style={multiline ? { whiteSpace: "pre-wrap" } : undefined}
    >
      {value}
    </Tag>
  );
}
