# Repository Guidelines

## Project Structure

This repository is intentionally split into two layers:

- Public static site: `index.html`, `styles.css`, and `CNAME`.
- Reference and tooling layer: local-only `context/`, `scripts/mirror/`, and `docs/`.

`context/` must be preserved locally but kept out of Git because it contains mirrors, screenshots, raw extracts, prompts, and source material for future revisions. `scripts/mirror/` contains scraping/mirroring scripts and should stay isolated from the public site root. `docs/` tracks references, decisions, and project progress.

## Editing Rules

Keep the public site simple and static. Prefer direct edits to the root HTML and CSS files instead of introducing frameworks, build steps, or backend code unless the publishing model changes. Avoid adding JavaScript to the public site unless it is strictly necessary.

When updating mirrors or scraping tooling, keep generated outputs inside local `context/<host>/` and document the change in `docs/mirrors.md` and `docs/tracking.md`.

## Local Preview

Open `index.html` directly in a browser for the fastest preview, or run a minimal static server such as `py -m http.server 3000` from the repository root.

## Mirroring Tooling

Use `scripts/mirror/advanced_mirror_site.mjs` as the generic scraper and follow `context/prompt de scraping.md` as the source instruction set. Keep legacy/specialized scrapers inside `scripts/mirror/` too.

## Deployment

The repository is intended for GitHub Pages with the custom domain `baruchlopez.com`. Do not move mirror data or documentation into the public site root unless there is a deliberate reason to expose it.
