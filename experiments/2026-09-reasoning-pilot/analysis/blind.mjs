// Prepares files for blind M3 coding: comments stripped (conditions B and
// C require a top-of-file comment that would reveal the condition), task
// kept, condition and model hidden behind the opaque id.
// Usage: node blind.mjs <outdir>
import ts from "typescript";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const root = new URL("../", import.meta.url);
const out = process.argv[2];
mkdirSync(out, { recursive: true });
const manifest = JSON.parse(readFileSync(new URL("manifest.json", root), "utf8"));
const printer = ts.createPrinter({ removeComments: true });
const index = [];
for (const r of [...manifest].sort((a, b) => a.id.localeCompare(b.id))) {
  const src = readFileSync(new URL(`generations/${r.id}.tsx`, root), "utf8");
  const sf = ts.createSourceFile(`${r.id}.tsx`, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  writeFileSync(`${out}/${r.id}.tsx`, printer.printFile(sf));
  index.push(`${r.id} ${r.task}`);
}
writeFileSync(`${out}/index.txt`, index.join("\n") + "\n");
