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
const fail=(scope,message)=>failures.push(`${scope}: ${message}`);
const localPath=value=>value.split(/[?#]/)[0].replace(/^\/+/,"");

for(const page of pages){
  const filePath=path.join(root,page);
  const generatedPath=path.join(root,"_site",page);
  if(!fs.existsSync(filePath)){fail(page,"Root-Ausgabedatei fehlt");continue;}
  if(!fs.existsSync(generatedPath)){fail(page,"_site-Ausgabedatei fehlt");continue;}

  const html=fs.readFileSync(filePath,"utf8");
  const generated=fs.readFileSync(generatedPath,"utf8");
  if(html!==generated)fail(page,"Root-Ausgabe ist nicht mit _site synchron");
  if(!/^<!doctype html>/i.test(html))fail(page,"DOCTYPE fehlt");
  if(!/<html lang="de">/i.test(html))fail(page,"deutsches html-Element fehlt");

  const viewport=html.match(/<meta name="viewport" content="([^"]+)">/i)?.[1];
  if(viewport!==expectedViewport)fail(page,"produktionsfähiger Apple-Viewport fehlt");

  const styles=[...html.matchAll(/<link rel="stylesheet" href="([^"]+)">/gi)].map(match=>match[1]);
  if(styles.join("|")!==expectedStyles.join("|"))fail(page,"Stylesheets werden nicht in der erwarteten parallelen Reihenfolge geladen");

  const scripts=[...html.matchAll(/<script src="([^"]+)"><\/script>/gi)].map(match=>match[1]);
  if(scripts.length!==1||scripts[0]!==expectedScript)fail(page,"JavaScript-Runtime ist nicht konsolidiert oder falsch versioniert");

  if((html.match(/<h1\b/gi)||[]).length!==1)fail(page,"genau eine H1 erforderlich");
  if(!/<main id="main" tabindex="-1">/i.test(html))fail(page,"main benötigt eindeutiges Sprung- und Fokusziel");
  if(/<script src="https?:/i.test(html)||/<link rel="stylesheet" href="https?:/i.test(html))fail(page,"unerwartete externe Skripte oder Stylesheets gefunden");

  for(const match of html.matchAll(/(?:src|href)="([^"]+)"/gi)){
    const value=match[1];
    if(!value||value.startsWith("#")||/^(?:https?:|mailto:|tel:|data:)/i.test(value))continue;
    const target=localPath(value);
    if(target&&!fs.existsSync(path.join(root,target)))fail(page,`lokale Ressource fehlt: ${value}`);
  }
}

const stylesWrapper=fs.readFileSync(path.join(root,"assets/styles.css"),"utf8");
if(/@import\b/i.test(stylesWrapper))fail("assets/styles.css","CSS-Import-Wasserfall ist wieder aktiv");

const appleCss=fs.readFileSync(path.join(root,"assets/apple-safari.css"),"utf8");
for(const requirement of [
  ["safe-area-inset","Safe-Area-Unterstützung fehlt"],
  ["touch-action:manipulation","Touch-Härtung fehlt"],
  ["1svh","svh-Fallback/Erkennung fehlt"],
  ["1dvh","dvh-Fallback/Erkennung fehlt"],
  ["orientation:landscape","iPhone-Landscape-Regel fehlt"],
]){
  if(!appleCss.includes(requirement[0]))fail("assets/apple-safari.css",requirement[1]);
}

for(const asset of [
  "assets/styles-base.css",
  "assets/styles.css",
  "assets/site.css",
  "assets/apple-safari.css",
  "assets/app.js",
]){
  if(!fs.existsSync(path.join(root,asset)))fail(asset,"Produktionsasset fehlt");
}

if(failures.length){
  console.error(`Produktionsvalidierung fehlgeschlagen (${failures.length}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`Produktionsvalidierung erfolgreich: ${pages.length} Seiten sowie Apple/WebKit-, Asset-, Semantik- und Runtime-Vertrag geprüft.`);
