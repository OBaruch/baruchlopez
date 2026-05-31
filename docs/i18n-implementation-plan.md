# i18n Implementation Plan

## Stack Detected

- Framework: Astro static site generation.
- Language: Astro + TypeScript.
- Styling: global CSS in `src/styles/global.css`.
- Current deployment model: static build through GitHub Pages workflow.
- Cloudflare readiness: no `functions/` directory was present before this work; a Pages Function can be added without changing the Astro stack.

## Text Locations

- Main shared content and metadata: `src/data/site.ts`.
- Manifesto bilingual content: `src/data/manifesto.ts`.
- Recognition mural data: `src/data/recognitions.ts`.
- Page-level visible copy: `src/pages/**/index.astro`, `src/pages/projects/[slug].astro`.
- Shared UI labels: `src/components/**.astro`, especially header, footer, cards, CTA and timeline components.

## Strategy

- Keep Astro static-first and avoid adding a large i18n dependency.
- Add a lightweight i18n layer in `src/i18n/`.
- Render the existing site normally, then apply translations client-side using a centralized phrase dictionary and `data-i18n-*` attributes where needed.
- Store manual language choice in `localStorage` and a cookie.
- Read a Cloudflare-provided cookie/header when available, with browser language fallback in local development.
- Add a small `functions/_middleware.ts` for Cloudflare Pages that derives the initial language from `request.cf.country` or `CF-IPCountry`.

## Files Expected To Change

- `src/i18n/*`
- `src/layouts/BaseLayout.astro`
- `src/components/SiteHeader.astro`
- `src/components/SiteFooter.astro`
- `src/styles/global.css`
- selected components/pages that need explicit i18n attributes
- `functions/_middleware.ts`
- `docs/i18n-implementation.md`

## Risks

- The current site has substantial content volume. A first phase should prioritize visible navigation, shared UI, page copy, metadata and common card content without restructuring every route into localized static pages.
- Client-side translation is not as strong for SEO as separate `/en/` and `/es/` routes.
- Cloudflare country detection is unavailable in local Astro dev; local testing must simulate with cookie/header or rely on browser language.

## Testing

- Run `npm.cmd run check`.
- Verify default English fallback with no saved preference.
- Verify Spanish selection via `localStorage`/selector.
- Verify manual preference persists after refresh.
- Verify simulated Cloudflare country cookie/header path.
- Check `/`, `/recognitions/`, `/projects/`, `/experience/`, `/contact/` and mobile header behavior.
