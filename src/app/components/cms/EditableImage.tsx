"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { useEdit } from "./EditProvider";

type Props = {
  src: string;
  alt: string;
  path: string;
  /** CMS path for object-position, e.g. whoWeAre.imagePosition */
  positionPath?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  unoptimized?: boolean;
  scope?: "page" | "settings";
  /** Fallback object-position when no CMS value is set */
  defaultPosition?: string;
};

function getByPath(root: Record<string, unknown> | null, path: string): unknown {
  if (!root) return undefined;
  return path.split(".").reduce<unknown>((cursor, key) => {
    if (cursor == null || typeof cursor !== "object") return undefined;
    return (cursor as Record<string, unknown>)[key];
  }, root);
}

function parsePosition(value: string | undefined, fallback: string) {
  const raw = (value && value.trim()) || fallback;
  const parts = raw.split(/\s+/);
  const x = parts[0] ?? "50%";
  const y = parts[1] ?? "50%";
  const toNum = (part: string) => {
    if (part.endsWith("%")) return Number.parseFloat(part);
    if (part === "left" || part === "top") return 0;
    if (part === "right" || part === "bottom") return 100;
    if (part === "center") return 50;
    const n = Number.parseFloat(part);
    return Number.isFinite(n) ? n : 50;
  };
  return {
    raw: `${x} ${y}`,
    x: toNum(x),
    y: toNum(y),
  };
}

function defaultPositionPath(imagePath: string) {
  if (imagePath.endsWith(".image")) return `${imagePath}Position`;
  if (imagePath.endsWith(".poster")) return imagePath.replace(/\.poster$/, ".posterPosition");
  return `${imagePath}Position`;
}

export function EditableImage({
  src,
  alt,
  path,
  positionPath,
  className,
  fill,
  width,
  height,
  sizes,
  priority,
  quality,
  unoptimized,
  scope = "page",
  defaultPosition = "50% 50%",
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
  const frameRef = useRef<HTMLSpanElement>(null);
  const dragSurfaceRef = useRef<HTMLButtonElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const labelId = useId();
  const resolvedPositionPath = positionPath ?? defaultPositionPath(path);

  const root =
    scope === "settings"
      ? (settings as unknown as Record<string, unknown> | null)
      : pageBlocks;

  const liveValue = getByPath(root, path);
  const livePosition = getByPath(root, resolvedPositionPath);
  const displaySrc =
    localPreview ||
    (typeof liveValue === "string" && liveValue.length > 0 ? liveValue : src);
  const position = parsePosition(
    typeof livePosition === "string" ? livePosition : undefined,
    defaultPosition,
  );

  const shouldUnoptimize =
    unoptimized ||
    displaySrc.startsWith("blob:") ||
    displaySrc.includes("supabase.co/storage");

  // Keep sizing utilities; strip hardcoded object-position utilities so CMS position wins.
  const cleanedClassName = (className ?? "")
    .split(/\s+/)
    .filter(
      (token) =>
        token &&
        !token.startsWith("object-[") &&
        !["object-center", "object-top", "object-bottom", "object-left", "object-right"].includes(token),
    )
    .join(" ");

  const setField = (fieldPath: string, value: unknown) => {
    if (scope === "settings") setSettingsField(fieldPath, value);
    else setPageField(fieldPath, value);
  };

  const onPick = async (file: File | undefined) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setLocalPreview(preview);
    setUploading(true);
    try {
      const url = await uploadImage(file);
      if (!url) throw new Error("Upload returned no URL");
      setField(path, url);
      setLocalPreview(url);
      setPanelOpen(true);
    } catch (error) {
      setLocalPreview(null);
      window.alert(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const setFocalFromEvent = (clientX: number, clientY: number) => {
    const rect =
      dragSurfaceRef.current?.getBoundingClientRect() ??
      frameRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;
    const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    setField(resolvedPositionPath, `${Math.round(x)}% ${Math.round(y)}%`);
  };

  const imageStyle = { objectPosition: position.raw };
  const showAdjustPanel = editing && panelOpen;

  const image = fill ? (
    <Image
      src={displaySrc}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={quality}
      unoptimized={shouldUnoptimize}
      className={cleanedClassName}
      style={imageStyle}
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
      className={cleanedClassName}
      style={imageStyle}
    />
  );

  if (!editing) return image;

  return (
    <span
      ref={frameRef}
      className={
        fill
          ? "absolute inset-0 z-30 block outline outline-2 outline-offset-[-2px] outline-[var(--blue)]"
          : "relative z-30 inline-block w-full outline outline-2 outline-offset-2 outline-[var(--blue)]"
      }
      aria-labelledby={labelId}
      onClick={(event) => {
        // Stop parent <Link> navigation while editing
        event.preventDefault();
        event.stopPropagation();
      }}
      onPointerDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      {image}

      {/* Focal-point crosshair */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute z-40 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--blue)] shadow"
        style={{ left: `${position.x}%`, top: `${position.y}%` }}
      />

      <div
        className="absolute inset-x-0 bottom-0 z-50 flex flex-col gap-2 bg-[linear-gradient(180deg,transparent,rgba(7,19,29,0.92))] p-3 pt-8 text-white"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={uploading}
            className="rounded-full bg-[var(--blue)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide disabled:opacity-60"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              inputRef.current?.click();
            }}
          >
            {uploading ? "Uploading…" : "Replace image"}
          </button>
          <button
            type="button"
            className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide hover:bg-white/25"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setPanelOpen((open) => !open);
            }}
          >
            {showAdjustPanel ? "Hide adjust" : "Adjust"}
          </button>
          <span id={labelId} className="text-[11px] text-white/70">
            {alt || "Image"}
          </span>
        </div>

        {showAdjustPanel ? (
          <div className="space-y-2 rounded-lg bg-black/35 p-3 backdrop-blur-sm">
            <p className="text-[11px] text-white/75">
              Drag on the image or use the sliders to set the focal point.
            </p>
            <label className="flex items-center gap-2 text-[11px]">
              <span className="w-8 text-white/70">X</span>
              <input
                type="range"
                min={0}
                max={100}
                value={position.x}
                className="w-full accent-[var(--blue)]"
                onChange={(event) => {
                  const x = Number(event.target.value);
                  setField(resolvedPositionPath, `${x}% ${Math.round(position.y)}%`);
                }}
              />
              <span className="w-10 text-right text-white/80">{Math.round(position.x)}%</span>
            </label>
            <label className="flex items-center gap-2 text-[11px]">
              <span className="w-8 text-white/70">Y</span>
              <input
                type="range"
                min={0}
                max={100}
                value={position.y}
                className="w-full accent-[var(--blue)]"
                onChange={(event) => {
                  const y = Number(event.target.value);
                  setField(resolvedPositionPath, `${Math.round(position.x)}% ${y}%`);
                }}
              />
              <span className="w-10 text-right text-white/80">{Math.round(position.y)}%</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                ["Center", "50% 50%"],
                ["Top", "50% 20%"],
                ["Left", "20% 50%"],
                ["Right", "80% 50%"],
              ].map(([label, value]) => (
                <button
                  key={label}
                  type="button"
                  className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide hover:bg-white/20"
                  onClick={() => setField(resolvedPositionPath, value)}
                >
                  {label}
                </button>
              ))}
              <button
                type="button"
                className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide hover:bg-white/20"
                onClick={() => setField(resolvedPositionPath, defaultPosition)}
              >
                Reset
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Drag surface for focal point — leaves room for the control bar */}
      <button
        ref={dragSurfaceRef}
        type="button"
        aria-label="Set image focal point"
        className="absolute inset-0 z-30 cursor-crosshair bg-transparent"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setFocalFromEvent(event.clientX, event.clientY);
          setPanelOpen(true);
        }}
        onPointerDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (event.button !== 0) return;
          setFocalFromEvent(event.clientX, event.clientY);
          setPanelOpen(true);

          const onMove = (moveEvent: PointerEvent) => {
            setFocalFromEvent(moveEvent.clientX, moveEvent.clientY);
          };
          const onUp = () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
          };
          window.addEventListener("pointermove", onMove);
          window.addEventListener("pointerup", onUp);
        }}
      />

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
