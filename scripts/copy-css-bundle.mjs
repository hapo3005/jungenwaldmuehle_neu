import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const source=path.join(root,"assets/site-bundle.css");
const target=path.join(root,"_site/assets/site-bundle.css");
if(!fs.existsSync(source))throw new Error("Generated CSS bundle is missing before publish copy");
fs.mkdirSync(path.dirname(target),{recursive:true});
fs.copyFileSync(source,target);
console.log(`CSS bundle copied to ${path.relative(root,target)}`);
