# i18n Implementation

## Summary

The site now has a lightweight bilingual layer for English and Spanish while keeping the existing Astro static architecture. The implementation avoids adding runtime dependencies, route migrations or a UI redesign.

## How It Works

- `src/i18n/en.json` and `src/i18n/es.json` store the translation dictionaries.
- `src/i18n/config.ts` stores supported locales, cookie names, localStorage key and the Latin America country list.
- `src/i18n/runtime.ts` exposes the dictionaries to the Astro layout.
- `src/layouts/BaseLayout.astro` sets the initial locale before paint, translates visible text after the page loads, updates `html[lang]`, updates metadata attributes and exposes `window.BaruchI18n.applyLocale()`.
- `src/components/SiteHeader.astro` includes the accessible EN / ES selector.
- `functions/_middleware.ts` is ready for Cloudflare Pages and sets a short-lived geo language cookie from `request.cf.country` or `CF-IPCountry`.

## Detection Order

1. Manual selection in `localStorage` under `baruch_locale`.
2. Manual cookie `bl_locale`.
3. Cloudflare geo cookie `bl_geo_locale`.
4. Browser language preference when no country signal exists.
5. English fallback.

Manual selection always wins over automatic detection.

## Country Rules

Spanish is selected for these Latin America country codes:

`MX, GT, BZ, SV, HN, NI, CR, PA, CU, DO, PR, CO, VE, EC, PE, BO, CL, AR, PY, UY, BR`

Brazil is intentionally included as Spanish for this version because the product requirement groups Brazil with Latin America.

## Cloudflare Pages

When deployed on Cloudflare Pages, `functions/_middleware.ts` reads:

- `request.cf.country`
- `CF-IPCountry`

It does not call external geolocation services, does not request browser GPS and does not add invasive tracking. If a supported manual language cookie already exists, the middleware leaves the response unchanged.

## Adding New Text

1. Add the English baseline phrase to `src/i18n/es.json` with a natural Spanish translation.
2. If a page or data source starts in Spanish, add the Spanish phrase to `src/i18n/en.json`.
3. Keep brand names, proper names, URLs, emails and product names unchanged.
4. Use `data-i18n-ignore` only for blocks that are already intentionally bilingual or should not be touched by text replacement.

## Local Testing

Run:

```powershell
npm.cmd run dev
```

Clear saved preference in the browser console:

```js
localStorage.removeItem("baruch_locale");
document.cookie = "bl_locale=; Path=/; Max-Age=0";
document.cookie = "bl_geo_locale=; Path=/; Max-Age=0";
```

Simulate Latin America:

```js
document.cookie = "bl_geo_locale=es; Path=/";
location.reload();
```

Simulate a non-Latin America country:

```js
document.cookie = "bl_geo_locale=en; Path=/";
location.reload();
```

Then click EN / ES in the header and refresh to confirm the manual preference persists.

## Validation Checklist

- `npm.cmd run check`
- Home renders and the selector switches EN / ES.
- `/recognitions/` translates its public labels and keeps the 130 mural records visible.
- Manual language persists after refresh.
- Cloudflare geo cookie simulation selects the expected initial language.
- Mobile header keeps the selector visible without covering content.

## Known Limitations

This is a static-first client-side i18n layer, not route-level internationalization. It improves the public bilingual UX without changing the architecture, but it is weaker for SEO than dedicated localized routes.

Recommended future phase:

- Add `/en/` and `/es/` route variants or Astro locale-aware static paths.
- Add `hreflang` links once route-level locales exist.
- Convert large data modules into fully keyed bilingual content instead of phrase replacement.
