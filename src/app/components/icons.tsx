/**
 * Shared icon set. Glyphs are stroke-only and sized by their container —
 * inside `.icon-tile` they render at 26px (48px tile) / 28px (56px tile).
 * Never hand-roll another copy of these in a page or component file.
 */

type IconProps = {
  className?: string;
};

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 1.7,
} as const;

export function ArrowIcon({ className = "size-4" }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 16 16" {...base}>
      <path d="M3 8h9M8.5 3.5 13 8l-4.5 4.5" />
    </svg>
  );
}

export function ArrowDownIcon({ className = "size-4" }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 16 16" {...base}>
      <path d="M8 3v9M3.5 7.5 8 12l4.5-4.5" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" {...base}>
      <path d="m5 12.5 4.2 4.2L19 7" />
    </svg>
  );
}

export function ChevronDownIcon({ className = "size-4" }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 16 16" {...base}>
      <path d="M3.5 6 8 10.5 12.5 6" />
    </svg>
  );
}

export function CloseIcon({ className = "size-5" }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 20 20" {...base}>
      <path d="M5 5l10 10M15 5 5 15" />
    </svg>
  );
}

export function MenuIcon({ className = "size-6" }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" {...base}>
      <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
    </svg>
  );
}

export function SearchIcon({ className = "size-5" }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 20 20" {...base}>
      <circle cx="9" cy="9" r="5.5" />
      <path d="m13.2 13.2 3.3 3.3" />
    </svg>
  );
}

/* ---- Capability / service glyphs (used inside .icon-tile) ---- */

export function InstitutionIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" {...base}>
      <path d="M3 21h18M5 21V10m14 11V10M9 21v-5.5h6V21" />
      <path d="M4 10h16l-8-6.5L4 10Z" />
    </svg>
  );
}

export function SecurityIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" {...base}>
      <path d="M12 3 4.5 6v6c0 4.4 3.1 7.9 7.5 9 4.4-1.1 7.5-4.6 7.5-9V6L12 3Z" />
      <path d="m8.8 12 2.2 2.2 4.2-4.4" />
    </svg>
  );
}

export function CohesionIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" {...base}>
      <circle cx="8.5" cy="8" r="3" />
      <circle cx="16" cy="10.5" r="2.5" />
      <path d="M3 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5M15 14.5c3 0 5 1.9 5 4.6" />
    </svg>
  );
}

export function NetworksIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.4 2.6 3.6 5.6 3.6 9S14.4 18.4 12 21c-2.4-2.6-3.6-5.6-3.6-9S9.6 5.6 12 3Z" />
    </svg>
  );
}

export function LeadershipIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" {...base}>
      <path d="M4 18.5h16M6 18.5V11m6 7.5V7m6 11.5v-5.5" />
      <path d="m6 11 6-4 6 6" />
    </svg>
  );
}

export function SportIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="m12 7 4.3 3.1-1.6 5h-5.4l-1.6-5L12 7Z" />
    </svg>
  );
}

export function EnvironmentIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" {...base}>
      <path d="M12 21c0-6.5 3.2-10.5 8-11 .5 5.6-2.6 10.4-8 11Z" />
      <path d="M12 21c-4.4-.4-7.2-3.4-7.2-7.4 0-1.3.3-2.5.8-3.5" />
    </svg>
  );
}

export function TrainingIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" {...base}>
      <path d="M3 8.5 12 4.5l9 4-9 4-9-4Z" />
      <path d="M6.5 10.5V16c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-5.5M21 8.5V14" />
    </svg>
  );
}

export function SafeguardingIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" {...base}>
      <path d="M12 3.5 5 6.5v5.8c0 3.9 2.8 7.2 7 8.2 4.2-1 7-4.3 7-8.2V6.5l-7-3Z" />
      <path d="M12 9.5v5M9.5 12h5" />
    </svg>
  );
}

export function DocumentIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" {...base}>
      <path d="M6 3.5h8l4 4v13H6v-17Z" />
      <path d="M14 3.5v4h4M9 13h6M9 16.5h6" />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" {...base}>
      <rect x="4" y="5.5" width="16" height="14" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" {...base}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.2l3.2 2" />
    </svg>
  );
}

export function TagIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" {...base}>
      <path d="M4 4.5h7.5L20 13l-7.5 7.5L4 12V4.5Z" />
      <circle cx="8" cy="8.5" r="1.2" />
    </svg>
  );
}

export function CertificateIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" {...base}>
      <circle cx="12" cy="9.5" r="5.5" />
      <path d="m8.8 14.4-1.3 6 4.5-2.3 4.5 2.3-1.3-6" />
    </svg>
  );
}

export function GlobeIcon({ className }: IconProps) {
  return <NetworksIcon className={className} />;
}

export const capabilityIcons = {
  institution: InstitutionIcon,
  security: SecurityIcon,
  cohesion: CohesionIcon,
  networks: NetworksIcon,
  leadership: LeadershipIcon,
  sport: SportIcon,
  environment: EnvironmentIcon,
  training: TrainingIcon,
  safeguarding: SafeguardingIcon,
  document: DocumentIcon,
} as const;

export type CapabilityIconName = keyof typeof capabilityIcons;
