// Picks the 20 calibration screens from the v2 generations: stratified by
// task (4, 4, 3, 3, 3, 3) and spread over models, seeded, excluding the
// owner's earlier 72-file sample and any file that does not parse or
// does not render (ids passed with --skip). Writes plan.json, a subset of
// the v2 plan, for owner-coding/prepare.mjs.
// Usage: node select.mjs [--skip id,id,...]
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import ts from "typescript";

const v2 = new URL("../../2026-09-reasoning-v2/", import.meta.url);
const plan = JSON.parse(readFileSync(new URL("plan.json", v2), "utf8"));
const skip = new Set((process.argv[process.argv.indexOf("--skip") + 1] ?? "").split(",").filter(Boolean));

// The owner's earlier sample, recomputed exactly as owner-coding/prepare.mjs draws it.
let st = 20260929;
const r1 = () => ((st = (st * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const all = plan.runs.map((r) => r.id).filter((id) => existsSync(new URL(`generations/${id}.tsx`, v2))).sort();
for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(r1() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
const earlier = new Set(all.slice(0, 72));

const parses = (id) => ts.createSourceFile("x.tsx", readFileSync(new URL(`generations/${id}.tsx`, v2), "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX).parseDiagnostics.length === 0;
let s = 20260930;
const rand = () => ((s = (s * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const QUOTA = { P1: 4, P2: 4, P3: 3, P4: 3, P5: 3, P6: 3 };
const picked = [];
for (const [task, n] of Object.entries(QUOTA)) {
  const pool = shuffle(plan.runs.filter((r) => r.task === task && !earlier.has(r.id) && !skip.has(r.id)));
  const byModel = {};
  for (const r of pool) (byModel[r.model] ??= []).push(r);
  const models = shuffle(Object.keys(byModel));
  let k = 0;
  while (picked.filter((r) => r.task === task).length < n) {
    const m = models[k++ % models.length];
    const next = byModel[m].shift();
    if (next && parses(next.id)) picked.push(next);
  }
}
writeFileSync(new URL("plan.json", import.meta.url), JSON.stringify({ ...plan, runs: picked }, null, 1));
const count = (f) => Object.entries(picked.reduce((a, r) => ((a[f(r)] = (a[f(r)] ?? 0) + 1), a), {})).map(([k, v]) => `${k} ${v}`).join(", ");
console.log(`${picked.length} screens; tasks: ${count((r) => r.task)}; models: ${count((r) => r.model)}; conditions: ${count((r) => r.condition)}`);
