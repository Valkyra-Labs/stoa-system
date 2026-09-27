// M1 and M2 per condition and model from generations/ and manifest.json,
// then the pre-registered decision rule. M3 is merged from
// analysis/m3.json when present (blind coding, reported only).
import { readFileSync, existsSync } from "node:fs";
import { features, editDistance } from "./features.mjs";

const root = new URL("../", import.meta.url);
const manifest = JSON.parse(readFileSync(new URL("manifest.json", root), "utf8"));
const m3 = existsSync(new URL("analysis/m3.json", root))
  ? JSON.parse(readFileSync(new URL("analysis/m3.json", root), "utf8")) : {};
const rows = manifest.map((r) => ({
  ...r,
  ...features(readFileSync(new URL(`generations/${r.id}.tsx`, root), "utf8"), r.id),
  m3: m3[r.id],
}));
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
const WITHIN_FLOOR = 0.05;

const out = {};
for (const model of ["sonnet", "haiku"])
  for (const condition of ["A", "B", "C"]) {
    const g = rows.filter((r) => r.model === model && r.condition === condition);
    const within = [], between = [];
    for (let i = 0; i < g.length; i++)
      for (let j = i + 1; j < g.length; j++)
        (g[i].task === g[j].task ? within : between).push(editDistance(g[i].F10, g[j].F10));
    const w = mean(within), b = mean(between);
    const scored = g.filter((r) => Array.isArray(r.m3));
    out[`${model}/${condition}`] = {
      n: g.length,
      M1: mean(g.map((r) => (r.F1 && r.F3 ? 1 : 0))),
      M2: b / Math.max(w, WITHIN_FLOOR),
      within: w,
      between: b,
      M3: scored.length ? mean(scored.map((r) => mean(r.m3))) : null,
    };
  }

const signal = ["sonnet", "haiku"].every((m) => {
  const [A, B, C] = ["A", "B", "C"].map((c) => out[`${m}/${c}`]);
  return B.M1 <= Math.min(A.M1, C.M1) - 0.3 && B.M2 >= Math.max(A.M2, C.M2) + 0.2;
});

if (process.argv.includes("--rows"))
  for (const r of rows) console.log(JSON.stringify(r));
console.table(Object.fromEntries(Object.entries(out).map(([k, v]) =>
  [k, Object.fromEntries(Object.entries(v).map(([a, x]) => [a, typeof x === "number" ? +x.toFixed(3) : x]))])));
console.log(`decision: ${signal ? "SIGNAL" : "NO SIGNAL"}`);
