/**
 * Faith Associates design tokens.
 * Keep in sync with CSS custom properties in `src/app/globals.css`.
 * Prefer CSS vars in markup (`var(--blue)` / Tailwind theme colors).
 * Use this module only when a value is needed in JS (charts, canvas, etc.).
 */

export const color = {
  background: "#ffffff",
  foreground: "#0a2342",
  ink: "#0a2342",
  navy: "#0b1824",
  muted: "#5b6d82",
  line: "rgba(11, 24, 36, 0.12)",
  blue: "#0060b0",
  blueDark: "#004a8c",
  blueLight: "#3d86c4",
  teal: "#3d6b7a",
  red: "#cc3f48",
  gold: "#c79a3b",
  soft: "#f4f7fa",
  softStrong: "#e8eef4",
  fieldBorder: "#cfd6dc",
  fieldLabel: "#444444",
  fieldHint: "#888888",
  focusRing: "rgba(0, 96, 176, 0.9)",
} as const;

export const role = {
  /** Brand identity, labels, links */
  brand: color.blue,
  /** Primary actions only (CTAs) */
  action: color.red,
  /** Dark surfaces / inverted bands */
  surfaceDark: color.navy,
  /** Cool page tint behind soft sections */
  surfaceSoft: color.soft,
  /** Body / ink */
  text: color.ink,
  /** Secondary copy */
  textMuted: color.muted,
} as const;

export const radius = {
  sm: "0.125rem",
  md: "0.25rem",
  lg: "0.25rem",
  xl: "0.375rem",
} as const;

export const motion = {
  easeOut: "cubic-bezier(0.22, 1, 0.36, 1)",
  durationFast: "280ms",
  durationMedia: "600ms",
} as const;

export const layout = {
  maxWidth: "1280px",
  sectionGutterDesktop: "40px",
  sectionGutterMobile: "28px",
} as const;
