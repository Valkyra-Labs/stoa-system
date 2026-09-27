// Primary analysis (PROTOCOL.md): archetype match per cell, R minus U
// pooled with a task-level bootstrap, per-model signs, the dashboard
// guard, and agreement with the owner's blind coding.
// Inputs: plan.json, prompts/tasks.json, analysis/blind-coding.json
// ({ id: { archetype, fit: [0|1,0|1,0|1], invalid } }), optionally
// analysis/owner-coding.json (same shape, subset of ids).
import { readFileSync, existsSync } from "node:fs";

const root = new URL("../", import.meta.url);
const json = (p) => JSON.parse(readFileSync(new URL(p, root), "utf8"));
const plan = json("plan.json");
const tasks = json("prompts/tasks.json");
const blind = json("analysis/blind-coding.json");
const owner = existsSync(new URL("analysis/owner-coding.json", root)) ? json("analysis/owner-coding.json") : null;

const rows = plan.runs.map((r) => {
  const c = blind[r.id];
  if (!c) throw new Error(`no blind coding for ${r.id}`);
  const invalid = !!c.invalid;
  return { ...r, archetype: c.archetype, invalid, match: !invalid && c.archetype === tasks[r.task].expected ? 1 : 0,
    fit: invalid ? 0 : c.fit.reduce((a, b) => a + b, 0) / c.fit.length };
});
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);
const rate = (f) => mean(rows.filter(f).map((r) => r.match));
const CONDS = ["components", "generic", "rules", "reasoning"];
const MODELS = plan.modelOrder;
const TASKS = Object.keys(tasks);

// Match rate per task and condition (pooled over models and seeds);
// the bootstrap resamples tasks, the unit that generalises.
const byTask = Object.fromEntries(TASKS.map((t) => [t, Object.fromEntries(CONDS.map((c) =>
  [c, rate((r) => r.task === t && r.condition === c)]))]));
const diff = (ts) => mean(ts.map((t) => byTask[t].reasoning - byTask[t].rules));
let s = 7;
const rand = () => ((s = (s * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const boots = [];
for (let b = 0; b < 10000; b++) boots.push(diff(TASKS.map(() => TASKS[Math.floor(rand() * TASKS.length)])));
boots.sort((a, b) => a - b);
const est = diff(TASKS);
const lo = boots[249], hi = boots[9749];

const perModel = Object.fromEntries(MODELS.map((m) => [m,
  rate((r) => r.model === m && r.condition === "reasoning") - rate((r) => r.model === m && r.condition === "rules")]));
const dash = (c) => rate((r) => ["P5", "P6"].includes(r.task) && r.condition === c);
const guard = dash("reasoning") >= dash("components") - 0.1;

const table = {};
for (const m of MODELS) for (const c of CONDS) {
  const g = rows.filter((r) => r.model === m && r.condition === c);
  table[`${m} / ${c}`] = { n: g.length, match: +mean(g.map((r) => r.match)).toFixed(3),
    fit: +mean(g.map((r) => r.fit)).toFixed(3), invalid: g.filter((r) => r.invalid).length };
}
console.table(table);
console.log("match rate by task (pooled over models):");
console.table(Object.fromEntries(TASKS.map((t) => [`${t} (${tasks[t].expected})`,
  Object.fromEntries(CONDS.map((c) => [c, +byTask[t][c].toFixed(3)]))])));
console.log(`R - U pooled: ${est.toFixed(3)}  95% task-bootstrap interval [${lo.toFixed(3)}, ${hi.toFixed(3)}]`);
console.log(`R - U per model: ${Object.entries(perModel).map(([m, d]) => `${m} ${d.toFixed(3)}`).join(", ")}`);
console.log(`guard (dashboard tasks): reasoning ${dash("reasoning").toFixed(3)} vs components ${dash("components").toFixed(3)} -> ${guard ? "holds" : "FAILS"}`);

let kappa = null;
if (owner) {
  const ids = Object.keys(owner).filter((id) => blind[id]);
  const cats = [...new Set(ids.flatMap((id) => [owner[id].archetype, blind[id].archetype]))];
  const po = mean(ids.map((id) => (owner[id].archetype === blind[id].archetype ? 1 : 0)));
  const pe = cats.reduce((sum, k) => sum
    + mean(ids.map((id) => (owner[id].archetype === k ? 1 : 0))) * mean(ids.map((id) => (blind[id].archetype === k ? 1 : 0))), 0);
  kappa = (po - pe) / (1 - pe);
  console.log(`owner vs blind coder on ${ids.length} files: agreement ${po.toFixed(3)}, Cohen's kappa ${kappa.toFixed(3)}`);
}
const valid = kappa === null ? "pending (owner coding missing)" : kappa >= 0.6 ? "valid" : "INVALID (kappa < 0.6)";
const signal = est >= 0.15 && lo > 0 && Object.values(perModel).filter((d) => d > 0).length >= 2 && guard;
console.log(`coding: ${valid}`);
const verdict = signal ? "SIGNAL" : "NO SIGNAL";
console.log(`decision: ${kappa === null ? `provisional ${verdict}, final only with owner agreement` : kappa < 0.6 ? "no claim (coding invalid)" : verdict}`);
