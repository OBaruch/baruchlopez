import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";

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
});
