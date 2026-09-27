// Prepares files for blind coding: comments stripped, plan turns left
// out, only the opaque id and the task kept.
// Usage: node analysis/blind.mjs <plan.json> <generations-dir> <outdir>
import ts from "typescript";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const [planPath, gen, out] = process.argv.slice(2);
const plan = JSON.parse(readFileSync(planPath, "utf8"));
mkdirSync(out, { recursive: true });
const printer = ts.createPrinter({ removeComments: true });
const index = [];
for (const r of [...plan.runs].sort((a, b) => a.id.localeCompare(b.id))) {
  const f = `${gen}/${r.id}.tsx`;
  if (!existsSync(f)) continue;
  const src = readFileSync(f, "utf8");
  const sf = ts.createSourceFile(`${r.id}.tsx`, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  // A file that does not parse is passed through unchanged so the coder
  // can mark it invalid; printing would silently repair or mangle it.
  writeFileSync(`${out}/${r.id}.tsx`, sf.parseDiagnostics.length ? src.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, "") : printer.printFile(sf));
  index.push(`${r.id} ${r.task}${sf.parseDiagnostics.length ? " does-not-parse" : ""}`);
}
writeFileSync(`${out}/index.txt`, index.join("\n") + "\n");
console.log(`${index.length} files`);
