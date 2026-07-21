<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:design-system -->
# Design system

UI work uses the in-repo design system (Tailwind + CSS tokens), not a third-party component library.

- Read `src/app/design-system/README.md` before changing layout, components, or styles.
- Keep `src/app/globals.css` and `src/app/design-system/tokens.ts` in sync when editing tokens.
- Every page `<main>` must include `id="main-content"` for the skip link.
<!-- END:design-system -->
