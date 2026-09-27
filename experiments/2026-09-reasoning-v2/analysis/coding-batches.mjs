// Blind coding batches: a seeded random partition of all generations into
// 8 batches of 45, plus 3 files per batch that another batch also holds
// (24 double-coded files). Each batch folder gets the stripped files, the
// guide, the worked examples and the tasks without expected archetypes.
// Usage: node analysis/coding-batches.mjs <outdir>
import ts from "typescript";
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const out = process.argv[2];
const plan = JSON.parse(readFileSync(new URL("plan.json", root), "utf8"));
const tasks = JSON.parse(readFileSync(new URL("prompts/tasks.json", root), "utf8"));
const blindTasks = Object.fromEntries(Object.entries(tasks).map(([k, v]) => [k, { prompt: v.prompt, fit: v.fit }]));
const EXAMPLES = ["gzphq", "g1pab", "ggqjy", "gmf3s", "gs99a", "gnen4", "ggkxo"];

let s = 11;
const rand = () => ((s = (s * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const runs = [...plan.runs];
for (let i = runs.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [runs[i], runs[j]] = [runs[j], runs[i]]; }
const B = 8, per = runs.length / B;
const batches = Array.from({ length: B }, (_, b) => runs.slice(b * per, (b + 1) * per).map((r) => ({ ...r, second: false })));
// Double coding: the first 3 files of batch b are also coded in batch b+1.
for (let b = 0; b < B; b++) batches[(b + 1) % B].push(...batches[b].slice(0, 3).map((r) => ({ ...r, second: true })));

const printer = ts.createPrinter({ removeComments: true });
const manifest = {};
batches.forEach((batch, b) => {
  const dir = `${out}/batch-${b + 1}`;
  mkdirSync(`${dir}/examples`, { recursive: true });
  const shuffled = [...batch].sort((x, y) => x.id.localeCompare(y.id));
  const index = [];
  for (const r of shuffled) {
    const src = readFileSync(new URL(`generations/${r.id}.tsx`, root), "utf8");
    const sf = ts.createSourceFile(`${r.id}.tsx`, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const bad = sf.parseDiagnostics.length > 0;
    writeFileSync(`${dir}/${r.id}.tsx`, bad ? src.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, "") : printer.printFile(sf));
    index.push(`${r.id} ${r.task}${bad ? " does-not-parse" : ""}`);
    (manifest[r.id] ??= []).push({ batch: b + 1, second: r.second });
  }
  writeFileSync(`${dir}/index.txt`, index.join("\n") + "\n");
  writeFileSync(`${dir}/tasks.json`, JSON.stringify(blindTasks, null, 1));
  copyFileSync(new URL("analysis/CODING-GUIDE.md", root), `${dir}/CODING-GUIDE.md`);
  for (const e of EXAMPLES) copyFileSync(new URL(`../2026-09-reasoning-pilot/generations/${e}.tsx`, root), `${dir}/examples/${e}.tsx`);
});
writeFileSync(`${out}/assignment.json`, JSON.stringify(manifest, null, 1));
console.log(batches.map((b, i) => `batch-${i + 1}: ${b.length}`).join(", "));
