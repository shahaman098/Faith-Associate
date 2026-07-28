"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useEdit } from "./EditProvider";

type Props = {
  src: string;
  alt: string;
  path: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  unoptimized?: boolean;
  scope?: "page" | "settings";
};

function getByPath(root: Record<string, unknown> | null, path: string): unknown {
  if (!root) return undefined;
  return path.split(".").reduce<unknown>((cursor, key) => {
    if (cursor == null || typeof cursor !== "object") return undefined;
    return (cursor as Record<string, unknown>)[key];
  }, root);
}

export function EditableImage({
  src,
  alt,
  path,
  className,
  fill,
  width,
  height,
  sizes,
  priority,
  quality,
  unoptimized,
  scope = "page",
}: Props) {
  const {
    editing,
    pageBlocks,
    settings,
    setPageField,
    setSettingsField,
    uploadImage,
  } = useEdit();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const liveValue =
    scope === "settings"
      ? getByPath(settings as unknown as Record<string, unknown> | null, path)
      : getByPath(pageBlocks, path);
  const displaySrc =
    localPreview ||
    (typeof liveValue === "string" && liveValue.length > 0 ? liveValue : src);
  const shouldUnoptimize =
    unoptimized ||
    displaySrc.startsWith("blob:") ||
    displaySrc.includes("supabase.co/storage");

  const onPick = async (file: File | undefined) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setLocalPreview(preview);
    setUploading(true);
    try {
      const url = await uploadImage(file);
      if (!url) throw new Error("Upload returned no URL");
      if (scope === "settings") setSettingsField(path, url);
      else setPageField(path, url);
      setLocalPreview(url);
    } catch (error) {
      setLocalPreview(null);
      window.alert(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const image = fill ? (
    <Image
      src={displaySrc}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={quality}
      unoptimized={shouldUnoptimize}
      className={className}
    />
  ) : (
    <Image
      src={displaySrc}
      alt={alt}
      width={width ?? 800}
      height={height ?? 600}
      sizes={sizes}
      priority={priority}
      quality={quality}
      unoptimized={shouldUnoptimize}
      className={className}
    />
  );

  if (!editing) return image;

  return (
    <span
      role="button"
      tabIndex={0}
      className={
        fill
          ? "absolute inset-0 z-20 block cursor-pointer outline outline-2 outline-offset-[-2px] outline-[var(--blue)]/70"
          : "relative inline-block w-full cursor-pointer outline outline-2 outline-offset-2 outline-[var(--blue)]/70"
      }
      aria-label={`Replace image: ${alt || path}`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!uploading) inputRef.current?.click();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          if (!uploading) inputRef.current?.click();
        }
      }}
    >
      {image}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-black/70 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-white">
        {uploading ? "Uploading…" : "Click to replace image"}
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(event) => {
          event.stopPropagation();
          void onPick(event.target.files?.[0]);
        }}
      />
    </span>
  );
}
