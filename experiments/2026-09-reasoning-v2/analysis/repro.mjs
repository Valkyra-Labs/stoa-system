// Reproducibility check (PROTOCOL.md): a seeded random 5 percent of the
// generations is regenerated and compared byte for byte.
// Usage: node analysis/repro.mjs plan   > repro/plan.json
//        node analysis/repro.mjs compare
import { readFileSync, existsSync } from "node:fs";

const root = new URL("../", import.meta.url);
const plan = JSON.parse(readFileSync(new URL("plan.json", root), "utf8"));
const mode = process.argv[2];
let s = 5;
const rand = () => ((s = (s * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const ids = plan.runs.map((r) => r.id);
for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
const pick = new Set(ids.slice(0, Math.round(ids.length * 0.05)));

if (mode === "plan") {
  console.log(JSON.stringify({ ...plan, runs: plan.runs.filter((r) => pick.has(r.id)) }, null, 1));
} else if (mode === "compare") {
  let same = 0, n = 0;
  for (const id of pick) {
    const a = new URL(`generations/${id}`, root), b = new URL(`repro/out/${id}`, root);
    if (!existsSync(new URL(`repro/out/${id}.tsx`, root))) { console.log(`${id} missing`); continue; }
    n++;
    const eq = ["plan.txt", "raw.txt", "tsx"].every((ext) => readFileSync(`${a.pathname}.${ext}`, "utf8") === readFileSync(`${b.pathname}.${ext}`, "utf8"));
    if (eq) same++; else console.log(`${id} differs`);
  }
  console.log(`byte-identical (plan, raw reply, file): ${same}/${n}`);
}
