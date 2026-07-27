const configuredBase=process.env.SITE_URL||"https://hapo3005.github.io/jungenwaldmuehle_neu/";
const baseUrl=new URL(configuredBase.endsWith("/")?configuredBase:`${configuredBase}/`);
const pages=[
  "index.html",
  "restaurant.html",
  "reitschule.html",
  "islandpferde.html",
  "kontakt.html",
  "impressum.html",
  "404.html",
];
const nestedMissing="nicht-vorhanden/tiefer/pfad/";
const retries=8;
const retryDelay=2500;

const wait=milliseconds=>new Promise(resolve=>setTimeout(resolve,milliseconds));
const unique=values=>[...new Set(values)];
const attribute=(html,tagName,name)=>{
  const tag=html.match(new RegExp(`<${tagName}\\b[^>]*\\s${name}="[^"]*"[^>]*>`,"i"))?.[0];
  return tag?.match(new RegExp(`\\s${name}="([^"]*)"`,"i"))?.[1];
};
const allAttributes=(html,tagName,name)=>[
  ...html.matchAll(new RegExp(`<${tagName}\\b[^>]*\\s${name}="([^"]+)"[^>]*>`,"gi")),
].map(match=>match[1]);
const request=async url=>{
  const response=await fetch(url,{headers:{"user-agent":"Jungenwaldmuehle-Live-Check/1.0"}});
  const contentType=response.headers.get("content-type")||"";
  return {response,contentType};
};

async function validate(){
  const failures=[];
  const resourceUrls=[];

  for(const page of pages){
    const url=new URL(page,baseUrl);
    const {response,contentType}=await request(url);
    const html=await response.text();
    if(response.status!==200)failures.push(`${url.href}: HTTP ${response.status} statt 200`);
    if(!contentType.includes("text/html"))failures.push(`${url.href}: unerwarteter Content-Type ${contentType}`);
    if(!/^<!doctype html>/i.test(html))failures.push(`${url.href}: DOCTYPE fehlt`);
    if(!/<html lang="de">/i.test(html))failures.push(`${url.href}: deutsche Seitensprache fehlt`);
    if(!/<main id="main" tabindex="-1">/i.test(html))failures.push(`${url.href}: Hauptinhalt oder Fokusziel fehlt`);
    if((html.match(/<h1\b/gi)||[]).length!==1)failures.push(`${url.href}: genau eine H1 erforderlich`);
    if(/[ÃƒÃ‚ï¿½]/.test(html))failures.push(`${url.href}: mögliche fehlerhafte Zeichenkodierung`);
    const documentBase=new URL(attribute(html,"base","href")||response.url);
    for(const source of [
      ...allAttributes(html,"link","href").filter(value=>!value.startsWith("http")&&!value.startsWith("mailto:")&&!value.startsWith("tel:")),
      ...allAttributes(html,"script","src"),
      ...allAttributes(html,"img","src"),
    ]){
      resourceUrls.push(new URL(source,documentBase).href);
    }
  }

  const nestedUrl=new URL(nestedMissing,baseUrl);
  const {response:nestedResponse,contentType:nestedType}=await request(nestedUrl);
  const nestedHtml=await nestedResponse.text();
  if(nestedResponse.status!==404)failures.push(`${nestedUrl.href}: HTTP ${nestedResponse.status} statt 404`);
  if(!nestedType.includes("text/html"))failures.push(`${nestedUrl.href}: unerwarteter Content-Type ${nestedType}`);
  if(!/<meta name="robots" content="[^"]*\bnoindex\b[^"]*">/i.test(nestedHtml))failures.push(`${nestedUrl.href}: noindex fehlt`);
  const nestedBase=attribute(nestedHtml,"base","href");
  if(nestedBase!==baseUrl.href)failures.push(`${nestedUrl.href}: Basis-URL ist ${nestedBase||"nicht gesetzt"}`);
  const resolvedNestedBase=new URL(nestedBase||nestedResponse.url);
  const stylesheet=nestedHtml.match(/<link rel="stylesheet" href="([^"]+)">/i)?.[1];
  const script=attribute(nestedHtml,"script","src");
  const logo=attribute(nestedHtml,"img","src");
  const homeLink=nestedHtml.match(/<a class="btn btn-light" href="([^"]+)">Zur Startseite<\/a>/i)?.[1];
  for(const [label,value] of [["Stylesheet",stylesheet],["Skript",script],["Logo",logo],["Startlink",homeLink]]){
    if(!value){
      failures.push(`${nestedUrl.href}: ${label} fehlt`);
      continue;
    }
    const resolved=new URL(value,resolvedNestedBase);
    if(!resolved.href.startsWith(baseUrl.href))failures.push(`${nestedUrl.href}: ${label} verweist außerhalb der Website`);
    if(label!=="Startlink")resourceUrls.push(resolved.href);
    if(label==="Startlink"&&resolved.href!==new URL("index.html",baseUrl).href){
      failures.push(`${nestedUrl.href}: Startlink führt zu ${resolved.href}`);
    }
  }

  const checkedResources=unique(resourceUrls.filter(url=>url.startsWith(baseUrl.href)));
  const resourceResults=await Promise.all(checkedResources.map(async url=>{
    try{
      const {response}=await request(url);
      return response.ok?null:`${url}: HTTP ${response.status}`;
    }catch(error){
      return `${url}: ${error.message}`;
    }
  }));
  failures.push(...resourceResults.filter(Boolean));

  if(failures.length)throw new Error(`Live-Validierung fehlgeschlagen (${failures.length}):\n- ${failures.join("\n- ")}`);
  console.log(`Live-Validierung erfolgreich: ${pages.length} Seiten, verschachtelte 404-Seite und ${checkedResources.length} Ressourcen geprüft.`);
}

let lastError;
for(let attempt=1;attempt<=retries;attempt++){
  try{
    await validate();
    process.exit(0);
  }catch(error){
    lastError=error;
    if(attempt<retries){
      console.warn(`Live-Prüfung ${attempt}/${retries} noch nicht erfolgreich; erneuter Versuch folgt.`);
      await wait(retryDelay);
    }
  }
}
console.error(lastError.message);
process.exit(1);

