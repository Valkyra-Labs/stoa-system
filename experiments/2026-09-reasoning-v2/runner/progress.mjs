// Progress of a run: done / total, per model, recent generations, ETA.
// Usage: node runner/progress.mjs <plan.json> <outdir> [--watch [seconds]]
import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

const [planPath, out] = process.argv.slice(2);
const w = process.argv.indexOf("--watch");
const every = w > 0 ? Number(process.argv[w + 1]) || 15 : 0;

function render() {
  const plan = JSON.parse(readFileSync(planPath, "utf8"));
  const recs = existsSync(`${out}/records.jsonl`)
    ? readFileSync(`${out}/records.jsonl`, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l))
    : [];
  const done = new Set(recs.map((r) => r.id));
  const ms = (r) => (r.plan_turn?.ms ?? 0) + (r.file_turn?.ms ?? r.wall_ms ?? 0);
  let alive = false;
  try { alive = !!execSync("pgrep -f 'runner/(llama|run).mjs'", { encoding: "utf8" }).trim(); } catch {}
  const lines = [];
  const pct = (a, b) => (b ? ((100 * a) / b).toFixed(1) : "0.0");
  lines.push(`${new Date().toLocaleTimeString()}  runner ${alive ? "RUNNING" : "not running"}`);
  lines.push(`total ${done.size}/${plan.runs.length} (${pct(done.size, plan.runs.length)}%)`);
  let etaMs = 0;
  const models = [...new Set(plan.runs.map((r) => r.model))];
  for (const m of models) {
    const all = plan.runs.filter((r) => r.model === m);
    const mine = recs.filter((r) => r.model === m);
    const avg = mine.length ? mine.reduce((s, r) => s + ms(r), 0) / mine.length : null;
    const left = all.length - mine.length;
    const bad = mine.filter((r) => !r.fenced || r.file_turn?.finish !== "stop").length;
    if (left && avg) etaMs += left * avg;
    lines.push(`  ${m.padEnd(14)} ${String(mine.length).padStart(4)}/${all.length}  avg ${avg ? (avg / 1000).toFixed(1) + " s" : "  -   "}  unfenced or cut: ${bad}`);
  }
  const unknown = models.filter((m) => !recs.some((r) => r.model === m)).length;
  lines.push(`ETA ${etaMs ? Math.round(etaMs / 60000) + " min" : "-"}${unknown ? ` + ${unknown} model(s) not started, time unknown` : ""}`);
  lines.push("last:");
  for (const r of recs.slice(-5))
    lines.push(`  ${r.id} ${r.model} ${r.task} seed ${r.seed} ${r.file_turn?.finish ?? r.done_reason} ${(ms(r) / 1000).toFixed(1)} s`);
  return lines.join("\n");
}

if (every) {
  const tick = () => { process.stdout.write("\x1b[2J\x1b[H" + render() + "\n"); };
  tick();
  setInterval(tick, every * 1000);
} else console.log(render());
