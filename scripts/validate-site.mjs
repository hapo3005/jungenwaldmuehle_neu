import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const baseUrl="https://hapo3005.github.io/jungenwaldmuehle_neu";
const assetVersion="20260727-3";
const definitions=[
  {file:"index.html",canonical:`${baseUrl}/`,current:"index.html",indexable:true},
  {file:"restaurant.html",canonical:`${baseUrl}/restaurant.html`,current:"restaurant.html",indexable:true},
  {file:"reitschule.html",canonical:`${baseUrl}/reitschule.html`,current:"reitschule.html",indexable:true},
  {file:"islandpferde.html",canonical:`${baseUrl}/islandpferde.html`,current:"islandpferde.html",indexable:true},
  {file:"kontakt.html",canonical:`${baseUrl}/kontakt.html`,current:"kontakt.html",indexable:true},
  {file:"impressum.html",canonical:`${baseUrl}/impressum.html`,current:null,indexable:false},
  {file:"404.html",canonical:`${baseUrl}/404.html`,current:null,indexable:false,absoluteBase:true},
];
const failures=[];
const titles=new Map();
const descriptions=new Map();
const fail=(page,message)=>failures.push(`${page}: ${message}`);
const count=(text,pattern)=>(text.match(pattern)||[]).length;
const attr=(tag,name)=>tag.match(new RegExp(`\\s${name}="([^"]*)"`,"i"))?.[1];
const localPath=value=>value.split(/[?#]/)[0].replace(/^\/+/,"");
const textContent=value=>value.replace(/<[^>]+>/g," ").replace(/&(?:[a-z]+|#\d+);/gi,"x").replace(/\s+/g," ").trim();

for(const definition of definitions){
  const {file,canonical,current,indexable,absoluteBase=false}=definition;
  const rootPath=path.join(root,file);
  const sitePath=path.join(root,"_site",file);
  if(!fs.existsSync(rootPath)||!fs.existsSync(sitePath)){
    fail(file,"Ausgabedatei fehlt");
    continue;
  }

  const html=fs.readFileSync(rootPath,"utf8");
  const generated=fs.readFileSync(sitePath,"utf8");
  if(html!==generated)fail(file,"Root-Ausgabe ist nicht mit _site synchron");
  if(Buffer.byteLength(html)>100_000)fail(file,"HTML überschreitet 100 KB");
  if(!/^<!doctype html>/i.test(html))fail(file,"DOCTYPE fehlt");
  if(count(html,/<html\b/gi)!==1||!/<html lang="de">/i.test(html))fail(file,"genau ein deutsches html-Element erforderlich");
  if(count(html,/<head\b/gi)!==1||count(html,/<body\b/gi)!==1)fail(file,"head oder body ist nicht eindeutig");
  if(!/<meta charset="utf-8">/i.test(html))fail(file,"UTF-8-Metadatum fehlt");
  if(/[ÃÂ�]/.test(html))fail(file,"möglicherweise fehlerhafte Zeichenkodierung gefunden");
  if(!/<meta name="viewport" content="width=device-width,initial-scale=1">/i.test(html))fail(file,"Viewport-Metadatum fehlt");
  const baseHref=html.match(/<base href="([^"]+)">/i)?.[1];
  if(absoluteBase&&baseHref!==`${baseUrl}/`)fail(file,"404-Seite benötigt eine absolute Basis-URL für verschachtelte Fehlerpfade");
  if(!absoluteBase&&baseHref)fail(file,"unerwartete Basis-URL auf regulärer Seite");
  if(/<!--[\s\S]*?-->/g.test(html))fail(file,"interner HTML-Kommentar wird öffentlich ausgeliefert");

  const title=html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  if(!title||title.length>70)fail(file,"Seitentitel fehlt oder ist länger als 70 Zeichen");
  else if(titles.has(title))fail(file,`Seitentitel ist nicht eindeutig (${titles.get(title)})`);
  else titles.set(title,file);

  const description=html.match(/<meta name="description" content="([^"]+)">/i)?.[1]?.trim();
  if(!description||description.length<50||description.length>170)fail(file,"Meta-Beschreibung muss 50–170 Zeichen lang sein");
  else if(descriptions.has(description))fail(file,`Meta-Beschreibung ist nicht eindeutig (${descriptions.get(description)})`);
  else descriptions.set(description,file);

  const canonicalValue=html.match(/<link rel="canonical" href="([^"]+)">/i)?.[1];
  if(canonicalValue!==canonical)fail(file,`Canonical-URL ist falsch: ${canonicalValue||"fehlt"}`);
  if(html.match(/<meta property="og:title" content="([^"]+)">/i)?.[1]===undefined)fail(file,"Open-Graph-Titel fehlt");
  if(html.match(/<meta property="og:description" content="([^"]+)">/i)?.[1]!==description)fail(file,"Open-Graph-Beschreibung weicht ab");
  if(html.match(/<meta property="og:url" content="([^"]+)">/i)?.[1]!==canonical)fail(file,"Open-Graph-URL weicht ab");
  if(indexable&&/<meta name="robots" content="noindex">/i.test(html))fail(file,"indexierbare Seite ist auf noindex gesetzt");
  if(!indexable&&!/<meta name="robots" content="noindex">/i.test(html))fail(file,"nicht indexierbare Seite benötigt noindex");

  if(count(html,/<header\b/gi)!==1||count(html,/<footer\b/gi)!==1)fail(file,"Header oder Footer ist nicht eindeutig");
  if(count(html,/<nav\b[^>]*aria-label="Hauptnavigation"[^>]*>/gi)!==1)fail(file,"genau eine Hauptnavigation erforderlich");
  if(count(html,/<main\b/gi)!==1||!/<main id="main" tabindex="-1">/i.test(html))fail(file,"main benötigt eindeutiges Sprungziel und Fokusziel");
  if(count(html,/<h1\b/gi)!==1)fail(file,"genau eine H1 erforderlich");
  const headings=[...html.matchAll(/<h([1-6])\b/gi)].map(match=>Number(match[1]));
  if(headings[0]!==1)fail(file,"Überschriftenfolge muss mit H1 beginnen");
  for(let index=1;index<headings.length;index++){
    if(headings[index]>headings[index-1]+1)fail(file,`Überschriftenebene springt von H${headings[index-1]} auf H${headings[index]}`);
  }
  if(!/<a class="skip" href="#main">/i.test(html))fail(file,"Sprunglink zum Hauptinhalt fehlt");

  const currentLinks=[...html.matchAll(/<a\b[^>]*aria-current="page"[^>]*>/gi)];
  if(current&&currentLinks.length!==1)fail(file,"genau ein aktueller Navigationspunkt erforderlich");
  if(!current&&currentLinks.length!==0)fail(file,"Seite darf keinen aktuellen Hauptnavigationspunkt markieren");
  if(current&&attr(currentLinks[0]?.[0]||"","href")!==current)fail(file,"falscher Navigationspunkt ist als aktuell markiert");

  if(/Konzeptentwurf|vor Veröffentlichung|Entwurfsstand|localhost|TODO|FIXME|Lorem ipsum/i.test(html))fail(file,"Entwurfs- oder Platzhaltertext gefunden");
  if(/href=(?:""|''|"#"|'#')/i.test(html))fail(file,"leerer Link gefunden");
  if(/<iframe\b/i.test(html))fail(file,"unerwartete externe Einbettung gefunden");
  if(/<form\b/i.test(html))fail(file,"unerwartetes Formular gefunden");
  for(const tag of html.matchAll(/<button\b[^>]*>/gi)){
    if(!/\stype="button"/i.test(tag[0]))fail(file,"Button ohne expliziten type=button");
    if(!attr(tag[0],"aria-label")&&!textContent(tag[0]))fail(file,"Button ohne zugänglichen Namen");
  }
  const scrollButtons=[...html.matchAll(/<button\b[^>]*\bclass="[^"]*\bscroll-top\b[^"]*"[^>]*>/gi)];
  if(scrollButtons.length!==1)fail(file,"genau ein Scroll-up-Button erforderlich");
  else{
    const scrollButton=scrollButtons[0][0];
    if(attr(scrollButton,"aria-label")!=="Zum Seitenanfang")fail(file,"Scroll-up-Button benötigt eindeutigen zugänglichen Namen");
    if(attr(scrollButton,"tabindex")!=="-1")fail(file,"Scroll-up-Button muss vor der Laufzeitinitialisierung aus der Tab-Reihenfolge entfernt sein");
  }
  for(const match of html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)){
    const tag=match[0].match(/^<a\b[^>]*>/i)?.[0]||"";
    if(!attr(tag,"href"))fail(file,"Link ohne href");
    if(!attr(tag,"aria-label")&&!textContent(match[1]))fail(file,"Link ohne zugänglichen Namen");
    if(/\starget="_blank"/i.test(tag)&&!/\srel="[^"]*\bnoopener\b/i.test(tag))fail(file,"target=_blank ohne noopener");
  }

  const ids=[...html.matchAll(/\sid="([^"]+)"/gi)].map(match=>match[1]);
  const duplicates=ids.filter((id,index)=>ids.indexOf(id)!==index);
  if(duplicates.length)fail(file,`doppelte IDs: ${[...new Set(duplicates)].join(", ")}`);
  for(const match of html.matchAll(/\saria-controls="([^"]+)"/gi)){
    if(!ids.includes(match[1]))fail(file,`aria-controls verweist auf fehlendes Ziel: ${match[1]}`);
  }

  const jsonLdBlocks=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  if(indexable&&jsonLdBlocks.length!==1)fail(file,"indexierbare Seite benötigt genau einen JSON-LD-Block");
  if(!indexable&&jsonLdBlocks.length!==0)fail(file,"noindex-Seite darf keine Restaurant-Strukturdaten ausliefern");
  for(const match of jsonLdBlocks){
    try{
      const data=JSON.parse(match[1]);
      for(const key of ["@context","@type","name","url","telephone","email","address","openingHoursSpecification"]){
        if(!data[key])fail(file,`JSON-LD-Feld fehlt: ${key}`);
      }
      if(data.url!==`${baseUrl}/`)fail(file,"JSON-LD-Unternehmens-URL ist falsch");
    }catch(error){
      fail(file,`ungültiges JSON-LD: ${error.message}`);
    }
  }

  for(const match of html.matchAll(/<img\b[^>]*>/gi)){
    const tag=match[0];
    const source=attr(tag,"src");
    if(!source){fail(file,"Bild ohne src");continue;}
    if(attr(tag,"alt")===undefined)fail(file,`Bild ohne alt: ${source}`);
    if(!/^\d+$/.test(attr(tag,"width")||"")||!/^\d+$/.test(attr(tag,"height")||""))fail(file,`Bild ohne Abmessungen: ${source}`);
    if(!/^https?:|^data:/.test(source)&&!fs.existsSync(path.join(root,localPath(source))))fail(file,`Bilddatei fehlt: ${source}`);
    const srcset=attr(tag,"srcset");
    if(srcset){
      if(!attr(tag,"sizes"))fail(file,`responsives Bild ohne sizes: ${source}`);
      for(const candidate of srcset.split(",")){
        const candidateSource=candidate.trim().split(/\s+/)[0];
        if(!candidateSource)continue;
        if(!/^https?:|^data:/.test(candidateSource)&&!fs.existsSync(path.join(root,localPath(candidateSource))))fail(file,`srcset-Bilddatei fehlt: ${candidateSource}`);
      }
    }
    if(source==="assets/images/terrace-enhanced.webp"){
      for(const expected of ["assets/images/terrace-enhanced-640.webp 640w","assets/images/terrace-enhanced-800.webp 800w","assets/images/terrace-enhanced.webp 1108w"]){
        if(!srcset?.includes(expected))fail(file,`Terrassenbild benötigt responsive Variante: ${expected}`);
      }
    }
  }

  if(file==="index.html"){
    const heroPreload=html.match(/<link rel="preload" as="image"[^>]*>/i)?.[0]||"";
    if(!attr(heroPreload,"imagesrcset")?.includes("assets/images/terrace-enhanced-800.webp 800w"))fail(file,"Hero-Preload muss das responsive Bildset verwenden");
    if(attr(heroPreload,"imagesizes")!=="100vw")fail(file,"Hero-Preload benötigt imagesizes=100vw");
  }

  if(file==="restaurant.html"){
    for(const id of ["speisekarte","vorspeisen","hauptgerichte","saisonkarte","dessert","zeiten"]){
      if(!ids.includes(id))fail(file,`Speisekarten-Sprungziel fehlt: ${id}`);
    }
    if(count(html,/class="menu-item(?:\s|")/gi)<19)fail(file,"Speisekarte enthält nicht alle veröffentlichten Gerichte");
    for(const href of ["#speisekarte","#vorspeisen","#hauptgerichte","#saisonkarte","#dessert","#zeiten","kontakt.html#anfahrt"]){
      if(!html.includes(`href="${href}"`))fail(file,`Restaurant-Direktlink fehlt: ${href}`);
    }
    if(!/Stand Juli 2026/i.test(html))fail(file,"sichtbarer Aktualitätsstand der Speisekarte fehlt");
  }

  for(const match of html.matchAll(/<link\b[^>]*\shref="([^"]+)"[^>]*>/gi)){
    const tag=match[0];
    const href=match[1];
    if(/^https?:/i.test(href))continue;
    if(attr(tag,"rel")==="canonical")continue;
    if(!fs.existsSync(path.join(root,localPath(href))))fail(file,`verknüpfte Ressource fehlt: ${href}`);
  }
  const stylesheet=html.match(/<link rel="stylesheet" href="([^"]+)">/i)?.[1];
  const scriptSource=html.match(/<script src="([^"]+)"><\/script>/i)?.[1];
  if(stylesheet!==`assets/styles.css?v=${assetVersion}`)fail(file,"Stylesheet-Version ist nicht aktuell");
  if(scriptSource!==`assets/app.js?v=${assetVersion}`)fail(file,"Skript-Version ist nicht aktuell");
  if(/<script src="https?:/i.test(html)||/<link rel="stylesheet" href="https?:/i.test(html))fail(file,"unerwartete externe Skripte oder Schriften gefunden");

  for(const match of html.matchAll(/\shref="([^"]+)"/gi)){
    const href=match[1];
    if(/^tel:/i.test(href)&&href!=="tel:+4965347493854")fail(file,`abweichende Telefonnummer: ${href}`);
    if(/^mailto:/i.test(href)&&href!=="mailto:jungenwaldmuehle1@gmail.com")fail(file,`abweichende E-Mail-Adresse: ${href}`);
    if(/^(https?:|mailto:|tel:)/i.test(href))continue;
    const [targetName,anchor]=href.split("#");
    const target=localPath(targetName||file);
    const targetPath=path.join(root,target);
    if(!fs.existsSync(targetPath)){fail(file,`interner Link fehlt: ${href}`);continue;}
    if(anchor){
      const targetHtml=fs.readFileSync(targetPath,"utf8");
      const escaped=anchor.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
      if(!new RegExp(`\\sid=["']${escaped}["']`,"i").test(targetHtml))fail(file,`Sprungziel fehlt: ${href}`);
    }
  }
}

const sitemap=fs.readFileSync(path.join(root,"sitemap.xml"),"utf8");
const sitemapUrls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]);
const expectedSitemap=definitions.filter(page=>page.indexable).map(page=>page.canonical);
if(new Set(sitemapUrls).size!==sitemapUrls.length)fail("sitemap.xml","doppelte URL");
for(const url of expectedSitemap)if(!sitemapUrls.includes(url))fail("sitemap.xml",`URL fehlt: ${url}`);
for(const url of sitemapUrls)if(!expectedSitemap.includes(url))fail("sitemap.xml",`unerwartete oder nicht indexierbare URL: ${url}`);

const robots=fs.readFileSync(path.join(root,"robots.txt"),"utf8");
if(!/^User-agent: \*\s+Allow: \//m.test(robots))fail("robots.txt","Crawler-Freigabe fehlt");
if(!robots.includes(`Sitemap: ${baseUrl}/sitemap.xml`))fail("robots.txt","Sitemap-Verweis fehlt");

const budgets=[
  ["assets/styles.css",30_000],
  ["assets/app.js",15_000],
];

const css=fs.readFileSync(path.join(root,"assets/styles.css"),"utf8");
if(!/\.scroll-top\.is-visible\b/.test(css))fail("assets/styles.css","sichtbarer Zustand des Scroll-up-Buttons fehlt");
if(!/@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)/.test(css))fail("assets/styles.css","Bewegungsreduktion fehlt");
if(/counter-reset\s*:\s*steps|content\s*:\s*"0"\s*counter\s*\(/i.test(css))fail("assets/styles.css","dekorative Schrittziffern dürfen nicht erzeugt werden");

for(const [file,maximum] of budgets){
  const size=fs.statSync(path.join(root,file)).size;
  if(size>maximum)fail(file,`Dateigröße ${size} überschreitet Budget ${maximum}`);
}
for(const file of fs.readdirSync(path.join(root,"assets/images"))){
  const size=fs.statSync(path.join(root,"assets/images",file)).size;
  if(size>300_000)fail(`assets/images/${file}`,`Bildgröße ${size} überschreitet 300 KB`);
}

if(failures.length){
  console.error(`Validierung fehlgeschlagen (${failures.length}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`Validierung erfolgreich: ${definitions.length} Seiten, SEO, Semantik, Navigation, Ressourcen, Sitemap, JSON-LD und Dateibudgets geprüft.`);
