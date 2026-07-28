"use client";

import Image from "next/image";
import { useRef } from "react";
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
  const { editing, setPageField, setSettingsField, uploadImage } = useEdit();
  const inputRef = useRef<HTMLInputElement>(null);

  const onPick = async (file: File | undefined) => {
    if (!file) return;
    const url = await uploadImage(file);
    if (!url) return;
    if (scope === "settings") setSettingsField(path, url);
    else setPageField(path, url);
  };

  if (!editing) {
    if (fill) {
      return (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} quality={quality} unoptimized={unoptimized} className={className} />
      );
    }
    return (
      <Image
        src={src}
        alt={alt}
        width={width ?? 800}
        height={height ?? 600}
        sizes={sizes}
        priority={priority}
        quality={quality}
        unoptimized={unoptimized}
        className={className}
      />
    );
  }

  return (
    <button
      type="button"
      className="relative block w-full cursor-pointer overflow-hidden outline outline-2 outline-offset-2 outline-[var(--blue)]/60"
      onClick={() => inputRef.current?.click()}
      aria-label={`Replace image: ${alt}`}
    >
      {fill ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} quality={quality} unoptimized={unoptimized} className={className} />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width ?? 800}
          height={height ?? 600}
          sizes={sizes}
          priority={priority}
          quality={quality}
          unoptimized={unoptimized}
          className={className}
        />
      )}
      <span className="absolute inset-x-0 bottom-0 bg-black/65 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-white">
        Click to replace image
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/mp4,application/pdf"
        className="hidden"
        onChange={(event) => onPick(event.target.files?.[0])}
      />
    </button>
  );
}
