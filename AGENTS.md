# Repository Guidelines

## Project Structure

This repository is intentionally split into two layers:

- Public static site source: `src/`, `public/`, `astro.config.mjs`, `package.json`, and `.github/workflows/deploy.yml`.
- Legacy static snapshot: `index.html`, `styles.css`, and `CNAME` are still kept in the root as a reference/fallback from the pre-Astro phase.
- Reference and tooling layer: local-only `context/`, `scripts/mirror/`, and `docs/`.

`context/` must be preserved locally but kept out of Git because it contains mirrors, screenshots, raw extracts, prompts, and source material for future revisions. `scripts/mirror/` contains scraping/mirroring scripts and should stay isolated from the public site root. `docs/` tracks references, decisions, and project progress.

## Editing Rules

The publishing model has now moved to Astro static build output deployed to GitHub Pages. Keep the public site static-first and do not add backend/server code for v1. Prefer edits in `src/` and `public/`; do not edit generated `dist/` output manually. JavaScript should remain progressive-enhancement only, with SSR/static HTML and fallbacks preserved.

When updating mirrors or scraping tooling, keep generated outputs inside local `context/<host>/` and document the change in `docs/mirrors.md` and `docs/tracking.md`.

## Local Preview

Install dependencies with `npm.cmd install`, run `npm.cmd run dev`, and open the local Astro server shown in the terminal. Use `npm.cmd run build` to validate static output in `dist/`.

## Mirroring Tooling

Use `scripts/mirror/advanced_mirror_site.mjs` as the generic scraper and follow `context/prompt de scraping.md` as the source instruction set. Keep legacy/specialized scrapers inside `scripts/mirror/` too.

## Deployment

The repository is intended for GitHub Pages with the custom domain `baruchlopez.com`, using the Astro GitHub Actions workflow in `.github/workflows/deploy.yml`. Keep mirror data and documentation out of the public build unless there is a deliberate reason to expose it.
