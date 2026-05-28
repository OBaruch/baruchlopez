# Repository Guidelines

## Project Structure

This repository is intentionally split into three layers:

- Public Astro site source: `src/`, `public/`, `astro.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, and `.github/workflows/deploy.yml`.
- Legacy static snapshot: `index.html`, `styles.css`, and `CNAME` remain in the root as a reference/fallback from the pre-Astro phase. Do not use them as the source of truth for new work.
- Reference and tooling layer: local-only `context/`, `scripts/mirror/`, and `docs/`.

`context/` must be preserved locally but kept out of Git because it contains mirrors, screenshots, raw extracts, prompts, and source material for future revisions. `scripts/mirror/` contains scraping/mirroring scripts and should stay isolated from the public site root. `docs/` tracks references, decisions, audits, and project progress.

## Current Stack

- Framework: Astro static site generation.
- Language: Astro + TypeScript.
- Styling: global CSS in `src/styles/global.css` with custom properties.
- Runtime: static-first; JavaScript should remain progressive-enhancement only.
- Hosting: GitHub Pages with the custom domain `baruchlopez.com`.

Do not migrate the project to React, Next.js, Tailwind, a UI kit, or a backend runtime unless there is a documented technical reason and a migration plan.

## Public Routes

Current Astro routes include:

- `/`
- `/about/`
- `/experience/`
- `/projects/`
- `/projects/[slug]/`
- `/corporate/`
- `/credentials/`
- `/contact/`
- `/manifesto/`
- `/timeline/`

`/alpha-signature/` and `/cyrus-global-capital/` are compatibility redirect pages only. Public Alpha Signature and Cyrus calls to action must point directly to:

- `https://alphasignaturefirm.com/`
- `https://www.cyrusglobalcapital.com/`

Keep those redirect pages `noindex` unless the public strategy changes.

## Editing Rules

The publishing model has moved to Astro static build output deployed to GitHub Pages. Prefer edits in `src/` and `public/`; do not edit generated `dist/` output manually.

Public copy must be verifiable from repository context or documented source material. Do not invent roles, clients, metrics, partnerships, fund structures, awards, or legal claims. Where public copy cannot be completed safely, leave a concise code comment such as:

```ts
// TODO(content): Confirm the official public description before displaying this section.
```

When updating mirrors or scraping tooling, keep generated outputs inside local `context/<host>/` and document the change in `docs/mirrors.md` and `docs/tracking.md`.

## Local Preview

Install dependencies with:

```powershell
npm.cmd install
```

Run the local Astro server with:

```powershell
npm.cmd run dev
```

Validate the project with:

```powershell
npm.cmd run check
```

`check` runs TypeScript validation and the Astro production build.

## Documentation Rules

Update documentation when a change affects architecture, stack, content policy, deployment, or Codex operating rules. For Codex-led work, prefer documenting durable decisions in:

- `docs/tech-stack-audit.md`
- `docs/project-architecture.md`
- `docs/codex-operating-guide.md`
- `docs/development-workflow.md`
- `docs/technical-todos.md`
- `docs/change-log-codex.md`

## Dependency Rules

Before adding any dependency:

- Verify that the current Astro/CSS/TypeScript stack cannot solve the need cleanly.
- Check for existing installed packages that already cover the use case.
- Keep the dependency small, maintained, and appropriate for a static personal/professional website.
- Document the reason in `docs/tech-stack-audit.md` and `docs/change-log-codex.md`.

Before removing files or dependencies:

- Search references with `rg`.
- Confirm the code is unused or obsolete.
- Document the removal and reason.

## Deployment

The repository is intended for GitHub Pages with the custom domain `baruchlopez.com`, using the Astro GitHub Actions workflow in `.github/workflows/deploy.yml`. Keep mirror data and documentation out of the public build unless there is a deliberate reason to expose it.
