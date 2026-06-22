import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

// Keep this alias until the locked Astro version no longer fails to resolve
// the prerender entrypoint on Windows/OneDrive paths.
const astroPrerenderEntrypoint = fileURLToPath(
  new URL("./node_modules/astro/dist/entrypoints/prerender.js", import.meta.url),
);

export default defineConfig({
  site: "https://baruchlopez.com",

  vite: {
    resolve: {
      alias: {
        "astro/entrypoints/prerender": astroPrerenderEntrypoint,
      },
    },
  },

  adapter: cloudflare(),
});