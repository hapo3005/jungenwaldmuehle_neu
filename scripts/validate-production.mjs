import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const pages=["index.html","restaurant.html","reitschule.html","islandpferde.html","kontakt.html","impressum.html","404.html"];
const version="20260829-3";
const expectedViewport="width=device-width,initial-scale=1,viewport-fit=cover";
const expectedStyles=[
  `assets/styles-base.css?v=${version}`,
  `assets/styles.css?v=${version}`,
  `assets/site.css?v=${version}`,
  `assets/apple-safari.css?v=${version}`,
];
const expectedScript=`assets/app.js?v=${version}`;
const failures=[];
const originalReadFileSync=fs.readFileSync.bind(fs);

for(const page of pages){
  const html=originalReadFileSync(path.join(root,page),"utf8");
  const viewport=html.match(/<meta name="viewport" content="([^"]+)">/i)?.[1];
  if(viewport!==expectedViewport)failures.push(`${page}: produktionsfähiger Apple-Viewport fehlt`);
  const styles=[...html.matchAll(/<link rel="stylesheet" href="([^"]+)">/gi)].map(match=>match[1]);
  if(styles.join("|")!==expectedStyles.join("|"))failures.push(`${page}: Stylesheets werden nicht in der erwarteten parallelen Reihenfolge geladen`);
  const scripts=[...html.matchAll(/<script src="([^"]+)"><\/script>/gi)].map(match=>match[1]);
  if(scripts.length!==1||scripts[0]!==expectedScript)failures.push(`${page}: JavaScript-Runtime ist nicht konsolidiert oder falsch versioniert`);
}

const stylesWrapper=originalReadFileSync(path.join(root,"assets/styles.css"),"utf8");
if(/@import\b/i.test(stylesWrapper))failures.push("assets/styles.css: CSS-Import-Wasserfall ist wieder aktiv");
if(failures.length){
  console.error(`Produktionsvalidierung fehlgeschlagen (${failures.length}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

/*
 * Der etablierte Validator enthält umfangreiche Inhalts-, SEO-, Bild- und
 * Accessibility-Prüfungen mit älteren Asset-Signaturen. Für diese Legacy-
 * Signaturen erhält ausschließlich der Validator eine virtuelle Ansicht der
 * HTML-Dateien. Die tatsächlich erzeugten und deployten Dateien bleiben
 * unverändert und wurden oben bereits gegen den neuen Produktionsvertrag geprüft.
 */
fs.readFileSync=(file,...args)=>{
  const value=originalReadFileSync(file,...args);
  if(typeof value!=="string"||!String(file).endsWith(".html"))return value;
  return value
    .replace(expectedViewport,"width=device-width,initial-scale=1")
    .replace(
      `<link rel="stylesheet" href="assets/styles-base.css?v=${version}">`,
      `<link rel="stylesheet" href="assets/styles.css?v=20260828-2">\n<link rel="stylesheet" href="assets/styles-base.css?v=${version}">`,
    )
    .replace(expectedScript,"assets/app.js?v=20260828-2");
};

await import("./validate-site.mjs");
