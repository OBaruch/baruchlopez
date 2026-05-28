# Content Audit / Production Readiness

Date: 2026-05-27

## Current External Impression

The site already has a strong editorial direction: dark, premium, structured and serious. The main risk before this pass was that the public copy often described the website strategy instead of speaking directly to a real reader. The first screen communicated AI, data and business systems, but Baruch Lopez himself was not the clearest first signal.

## Main Content Problems Found

- Homepage copy sounded like an internal information-architecture brief.
- Several section headers explained how a page should work instead of presenting final public content.
- "Public-safe" appeared too often in visible UI, making the page feel defensive and unfinished.
- CTAs such as "Open bridge" and "Contact pathway" felt mechanical.
- The navigation was crowded enough to wrap on desktop, weakening the first impression.
- The homepage did not center Baruch as strongly as the project positioning requires.

## Tone Problems Found

- Too much audit language: "this page," "this site," "should," "not a raw repository dump," "not a CV dump."
- Too much explanatory scaffolding around page intent.
- Some copy was sober but cold, with limited warmth or personal authority.
- Finance and institutional language needed caution without sounding anxious.

## Visual / UX Problems Found

- The rendered site felt elegant but very dark and heavy.
- Desktop navigation wrapped, placing Contact on a second line.
- Mobile header was tall enough to consume too much of the first viewport.
- The hero was visually strong but could better support Baruch as the central identity.
- Vertical card images lacked meaningful alt text.

## SEO Issues Found

- Page titles and descriptions were usable but could better target "Baruch López," robotics, AI, data, consulting and business systems.
- Twitter/X card metadata was missing.
- `robots.txt` and `sitemap.xml` were missing from `public/`.
- Some metadata and schema used the unaccented name only.
- The previous structured data exposed a fuller legal-style alternate name that is not needed publicly.

## SEM / Conversion Issues Found

- The homepage did not guide visitors by intent clearly enough without sounding like documentation.
- CTAs were too static and did not always map to natural visitor intent.
- Alpha Signature and Cyrus Global Capital needed clearer boundaries and direct routing to their official websites.
- Contact flow was clear in architecture but needed warmer, more direct language.

## Veracity Risks Found

- Cyrus Global Capital can be mentioned, but the personal site must avoid investment solicitation, performance claims, advisory language or internal structure.
- The Co-Founder & CFO role is visible in local LinkedIn export evidence, but the preferred public prominence still needs Baruch's confirmation.
- Alpha Signature has enough support for a sober consulting + implementation description; the official URL was later provided by Baruch as `https://alphasignaturefirm.com/`.
- Bosch work must remain high level: no internal systems, clients, metrics, workflows, dashboards, tables or proprietary architecture.
- No evidence was found in the repo for "Cygnus Global Capital" or "Alpha Cygnus Global" as public names for this site.

## What Was Changed

- Recentered the homepage around "Baruch López" as the hero H1.
- Rewrote homepage, About, Experience, Projects, Contact, Alpha Signature, Cyrus, Corporate, Credentials and Timeline copy to feel final and public-facing.
- Reduced visible internal-guidance language and moved caution into natural public-facing framing instead of disclosure blocks.
- Simplified main navigation to reduce wrapping and improve the first viewport.
- Updated core metadata, Open Graph/Twitter metadata and Person schema.
- Added meaningful alt text for vertical cards.
- Added `public/robots.txt` and `public/sitemap.xml`.
- Lightened and tightened the dark visual system, including card radius, panel contrast, hero image treatment and mobile header behavior.
- Updated Alpha Signature and Cyrus Global Capital navigation/buttons to go directly to their official websites.

## What Remains Pending

- Confirm preferred Cyrus role wording and whether the personal site should say "Co-Founder & CFO" prominently or more lightly.
- Confirm whether any Alpha Signature offer names should be public.
- Confirm whether any additional public project pages deserve richer case-study detail.
- Add more specific public project summaries only when evidence and safe boundaries are available.
