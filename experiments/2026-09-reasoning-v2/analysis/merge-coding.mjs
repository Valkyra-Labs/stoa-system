// Merges the 8 coders' files into analysis/blind-coding.json (the first
// coder's answer for each file), enforces the mechanical invalid flag,
// and reports agreement between Claude coders on the double-coded files.
import { readFileSync, writeFileSync } from "node:fs";
import ts from "typescript";

const root = new URL("../", import.meta.url);
const json = (p) => JSON.parse(readFileSync(new URL(p, root), "utf8"));
const plan = json("plan.json");
const assignment = json("analysis/coding/assignment.json");
const batches = Object.fromEntries([1, 2, 3, 4, 5, 6, 7, 8].map((b) => [b, json(`analysis/coding/batch-${b}.json`)]));

const merged = {}, pairs = [];
for (const r of plan.runs) {
  const a = assignment[r.id];
  const first = a.find((x) => !x.second), second = a.find((x) => x.second);
  const c = batches[first.batch][r.id];
  if (!c) throw new Error(`${r.id} missing in batch ${first.batch}`);
  const src = readFileSync(new URL(`generations/${r.id}.tsx`, root), "utf8");
  const parses = ts.createSourceFile("x.tsx", src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX).parseDiagnostics.length === 0;
  merged[r.id] = parses ? { ...c, invalid: c.invalid ? 1 : 0 } : { ...c, archetype: "other", kpi_row: 0, fit: [0, 0, 0], invalid: 1 };
  if (second) pairs.push([merged[r.id], batches[second.batch][r.id], r]);
}
writeFileSync(new URL("analysis/blind-coding.json", root), JSON.stringify(merged, null, 1));

const agree = (f) => pairs.filter(([a, b]) => f(a) === f(b)).length;
const cats = [...new Set(pairs.flatMap(([a, b]) => [a.archetype, b.archetype]))];
const po = agree((x) => x.archetype) / pairs.length;
const pe = cats.reduce((s, k) => s + (pairs.filter(([a]) => a.archetype === k).length / pairs.length) * (pairs.filter(([, b]) => b.archetype === k).length / pairs.length), 0);
console.log(`merged ${Object.keys(merged).length} files; invalid ${Object.values(merged).filter((x) => x.invalid).length}`);
console.log(`Claude coder agreement on ${pairs.length} double-coded files: archetype ${agree((x) => x.archetype)}/${pairs.length} (kappa ${((po - pe) / (1 - pe)).toFixed(3)}), kpi_row ${agree((x) => x.kpi_row)}/${pairs.length}, fit items ${pairs.reduce((s, [a, b]) => s + a.fit.filter((v, i) => v === b.fit[i]).length, 0)}/${pairs.length * 3}`);
for (const [a, b, r] of pairs) if (a.archetype !== b.archetype) console.log(`  ${r.id} ${r.task}: ${a.archetype} vs ${b.archetype}`);
