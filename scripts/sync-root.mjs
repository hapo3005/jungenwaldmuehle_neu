import { copyFile } from "node:fs/promises";

const pages = [
  "index.html",
  "restaurant.html",
  "reitschule.html",
  "islandpferde.html",
  "kontakt.html",
  "impressum.html",
  "404.html",
];

await Promise.all(
  pages.map((page) => copyFile(new URL(`../_site/${page}`, import.meta.url), new URL(`../${page}`, import.meta.url))),
);

console.log(`[sync-root] ${pages.length} Seiten für GitHub Pages synchronisiert.`);
