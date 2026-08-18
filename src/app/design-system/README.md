# Faith Associates design system

Shared language for humans and agents. Do not import Astryx or another component library — extend this system.

## Stack

- Next.js App Router + React
- Tailwind CSS v4 (`@import "tailwindcss"` in `globals.css`)
- Brand tokens as CSS variables on `:root`
- Utility classes for type, buttons, sections, forms

## Tokens

| Role | Token | Use |
| --- | --- | --- |
| Brand / links / labels | `--blue` | Eyebrows, text links, focus |
| Primary action | `--red` | `btn-primary` only |
| Ink | `--ink` / `--foreground` | Body text |
| Dark surface | `--navy` | Inverted bands, footer |
| Soft surface | `--soft` | Section tint |
| Line | `--line` | Hairline rules |
| Muted | `--muted` | Secondary copy |
| Dark surface (deepest) | `--navy-deep` | Footer legal bar |
| Raised dark surface | `--navy-raised` | Cards inside navy bands |
| Action hover | `--red-dark` | `btn-primary:hover` — red deepens, never turns blue |
| Header chrome | `--header-ink` / `--header-surface` / `--header-line` / `--header-muted` | Mobile + utility bars |

Typeface is **Poppins** (`--font-poppins`, loaded in `layout.tsx`). Do not fall back to Inter or Arial.

JS mirror: `src/app/design-system/tokens.ts` (keep in sync with `globals.css`).

## Primitives (reuse these)

| Class | Purpose |
| --- | --- |
| `section-shell` | Page width + gutters |
| `band` / `band-tight` | Vertical rhythm for a section. Always pair with a surface. |
| `band-soft` / `band-white` / `band-navy` | Section surface. `band-navy` recolours eyebrows and body copy for you. |
| `band-rule` | Hairline above a band (adapts on navy) |
| `type-eyebrow` | Uppercase section label |
| `type-display` / `type-title` / `type-body` / `type-meta` / `type-cta` | Type roles |
| `btn-primary` / `btn-secondary` | CTAs |
| `icon-tile` (+ `icon-tile-lg`, `--red`, `--navy`, `--on-navy`, `--ghost`) | **Every** meaningful icon. 48px mobile / 56px desktop coloured square. Bare line icons are only allowed for inline arrows and form affordances. |
| `index-number` (+ `--quiet`, `--on-navy`) | Oversized `01` numerals on cards and agendas |
| `stat-figure` | Oversized proof numbers (5000+, 20+) |
| `chip-row` / `chip` (+ `--on-navy`, `--accent`) | Hero metadata: duration, cost, status |
| `rule-red` | Short red rule under a headline |
| `panel-frame` / `__head` / `__body` | Framed booking + enquiry panels. A form embed is never bare. |
| `sticky-rail` | Sticky "At a glance" column (static below `lg`) |
| `media-frame` | Image crop + hover zoom |
| `field` / `field-label` / `field-hint` / `field-error` | Forms |
| `skip-link` | Skip to main content |
| `capability-index` | Small numeric label (legacy; prefer `index-number`) |

Icons live in `src/app/components/icons.tsx`. Import from there — do not redeclare `ArrowIcon`
in a page or component file.

## Layout recipe

```tsx
<main id="main-content" className="min-h-screen bg-white text-[var(--ink)]">
  <SiteHeader />
  <section className="py-16 sm:py-20">
    <div className="section-shell">
      <div className="section-head">
        <p className="type-eyebrow text-[var(--blue)]">Section label</p>
        <h2 className="type-title mt-3 text-3xl text-[var(--ink)]">Headline</h2>
        <p className="type-body mt-4 text-[var(--muted)]">One supporting sentence.</p>
      </div>
      {/* one job for this section */}
    </div>
  </section>
  <SiteFooter />
</main>
```

## Accessibility rules

1. Every page `<main>` must have `id="main-content"` (skip link target).
2. Interactive icons: `aria-hidden="true"` on decorative SVGs; `aria-label` on icon-only controls.
3. Forms: every control needs a visible `<label htmlFor=…>` (or `sr-only` when intentional).
4. Errors: `aria-invalid` + `aria-describedby` pointing at `.field-error`.
5. Dialogs/menus: `aria-expanded`, `aria-haspopup`, `aria-controls` / `aria-modal` as appropriate.
6. Motion: use `usePrefersReducedMotion()` for JS animation; CSS already respects `prefers-reduced-motion`.
7. Focus: do not remove `:focus-visible` outlines; use `--focus-ring`.

## Do / don’t

- **Do** compose with tokens + primitives above.
- **Do** keep sharp editorial surfaces (minimal radius, hairline rules).
- **Don’t** invent one-off hex colors in components — add a token first.
- **Don’t** add card grids, pill clusters, or purple/cream AI defaults.
- **Don’t** put secondary marketing chrome in the hero.
- **Don’t** adopt StyleX, Astryx, shadcn, or a second design system.

## Key components

| Component | Path |
| --- | --- |
| Header / nav | `components/SiteHeader.tsx` |
| Footer | `components/SiteFooter.tsx` |
| Contact form | `components/ContactForm.tsx` |
| Editorial hero / directory / detail | `components/Editorial*.tsx` |
| Reduced motion hook | `components/usePrefersReducedMotion.ts` |
| Skip link | `components/SkipLink.tsx` |
