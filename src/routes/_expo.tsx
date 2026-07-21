import { createFileRoute } from "@tanstack/react-router";
import { ExpoShell } from "@/components/ExpoShell";

export const Route = createFileRoute("/_expo")({
  component: ExpoShell,
});
