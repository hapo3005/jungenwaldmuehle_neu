import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const parts=[
  "assets/styles-base.css",
  "assets/styles.css",
  "assets/site.css",
  "assets/apple-safari.css",
];
const output="assets/site-bundle.css";
const banner="/* Generated production bundle. Edit the source CSS files, not this file. */\n";
const content=banner+parts.map(file=>`\n/* ===== ${file} ===== */\n${fs.readFileSync(path.join(root,file),"utf8").trim()}\n`).join("");
fs.writeFileSync(path.join(root,output),content,"utf8");
console.log(`CSS bundle written: ${output} (${Buffer.byteLength(content)} bytes)`);
