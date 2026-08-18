"use client";

import { useRef, useState } from "react";
import { useEdit } from "./EditProvider";
import { EditableImage } from "./EditableImage";

/** Homepage immersive hero media with editable poster + video. */
export function EditableHeroMedia({
  video,
  poster,
}: {
  video: string;
  poster: string;
}) {
  const { editing, pageBlocks, setPageField, uploadImage } = useEdit();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const hero =
    pageBlocks && typeof pageBlocks.hero === "object" && pageBlocks.hero
      ? (pageBlocks.hero as Record<string, unknown>)
      : null;
  const liveVideo = typeof hero?.video === "string" ? hero.video : video;
  const livePoster = typeof hero?.poster === "string" ? hero.poster : poster;

  const replaceVideo = async (file: File | undefined) => {
    if (!file) return;
    setUploadingVideo(true);
    try {
      const url = await uploadImage(file);
      setPageField("hero.video", url);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Video upload failed");
    } finally {
      setUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  if (editing) {
    return (
      <>
        <EditableImage
          src={livePoster}
          alt="Hero poster image"
          path="hero.poster"
          positionPath="hero.posterPosition"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80"
        />
        <div className="absolute bottom-28 left-1/2 z-30 flex -translate-x-1/2 flex-wrap justify-center gap-2 px-4">
          <button
            type="button"
            disabled={uploadingVideo}
            className="rounded-full bg-[var(--blue)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-lg disabled:opacity-60"
            onClick={() => videoInputRef.current?.click()}
          >
            {uploadingVideo ? "Uploading video…" : "Replace hero video"}
          </button>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4"
            className="hidden"
            onChange={(event) => void replaceVideo(event.target.files?.[0])}
          />
        </div>
      </>
    );
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={livePoster}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover opacity-80"
      key={liveVideo}
    >
      <source src={liveVideo} type="video/mp4" />
    </video>
  );
}
