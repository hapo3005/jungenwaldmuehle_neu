import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const pages=["index.html","restaurant.html","reitschule.html","islandpferde.html","kontakt.html","impressum.html"];
const failures=[];
const fail=(page,message)=>failures.push(`${page}: ${message}`);

for(const page of pages){
  const rootPath=path.join(root,page);
  const sitePath=path.join(root,"_site",page);
  if(!fs.existsSync(rootPath)||!fs.existsSync(sitePath)){
    fail(page,"Ausgabedatei fehlt");
    continue;
  }
  const html=fs.readFileSync(rootPath,"utf8");
  const generated=fs.readFileSync(sitePath,"utf8");
  if(html!==generated)fail(page,"Root-Ausgabe ist nicht mit _site synchron");
  if(!/^<!doctype html>/i.test(html))fail(page,"DOCTYPE fehlt");
  if(!/<html lang="de">/i.test(html))fail(page,"deutsche Dokumentsprache fehlt");
  if(!/<meta name="viewport" content="width=device-width,initial-scale=1">/i.test(html))fail(page,"Viewport-Metadatum fehlt");
  if(!/<meta name="description" content="[^"]{30,}">/i.test(html))fail(page,"brauchbare Meta-Beschreibung fehlt");
  if(!/<link rel="canonical" href="https:\/\/hapo3005\.github\.io\/jungenwaldmuehle_neu\//i.test(html))fail(page,"Canonical-URL fehlt");
  if((html.match(/<main\b/gi)||[]).length!==1)fail(page,"genau ein main-Element erforderlich");
  if((html.match(/<h1\b/gi)||[]).length!==1)fail(page,"genau eine H1 erforderlich");
  if(/Konzeptentwurf|vor Veröffentlichung|Entwurfsstand|localhost/i.test(html))fail(page,"Entwurfs- oder lokale Platzhaltertexte gefunden");
  if(/href="#"/i.test(html))fail(page,"leerer Sprunglink gefunden");

  const ids=[...html.matchAll(/\sid="([^"]+)"/gi)].map(match=>match[1]);
  const duplicates=ids.filter((id,index)=>ids.indexOf(id)!==index);
  if(duplicates.length)fail(page,`doppelte IDs: ${[...new Set(duplicates)].join(", ")}`);

  for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)){
    try{JSON.parse(match[1]);}catch(error){fail(page,`ungültiges JSON-LD: ${error.message}`);}
  }

  for(const match of html.matchAll(/<img\b[^>]*>/gi)){
    const tag=match[0];
    const source=tag.match(/\ssrc="([^"]+)"/i)?.[1];
    if(!source){fail(page,"Bild ohne src");continue;}
    if(!/\salt="[^"]*"/i.test(tag))fail(page,`Bild ohne alt: ${source}`);
    if(!/\swidth="\d+"/i.test(tag)||!/\sheight="\d+"/i.test(tag))fail(page,`Bild ohne Abmessungen: ${source}`);
    if(!/^https?:|^data:/.test(source)&&!fs.existsSync(path.join(root,source)))fail(page,`Bilddatei fehlt: ${source}`);
  }

  for(const match of html.matchAll(/\shref="([^"]+)"/gi)){
    const href=match[1];
    if(/^(https?:|mailto:|tel:)/i.test(href))continue;
    const [targetName,anchor]=href.split("#");
    const target=(targetName||page).split("?")[0];
    const targetPath=path.join(root,target);
    if(!fs.existsSync(targetPath)){fail(page,`interner Link fehlt: ${href}`);continue;}
    if(anchor){
      const targetHtml=fs.readFileSync(targetPath,"utf8");
      if(!new RegExp(`\\sid=["']${anchor.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}["']`,"i").test(targetHtml))fail(page,`Sprungziel fehlt: ${href}`);
    }
  }
}

if(failures.length){
  console.error(`Validierung fehlgeschlagen (${failures.length}):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`Validierung erfolgreich: ${pages.length} Seiten, interne Links, Bilder, Metadaten und JSON-LD geprüft.`);
