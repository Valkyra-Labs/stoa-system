// Calibration agreement: owner (rendered screen) against the Claude coder
// (code), per feature (percent and Cohen's kappa) and for the archetype
// derived by the draft rule. Input: owner.json, claude.json.
import { readFileSync } from "node:fs";

const json = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const features = json("features.json");
const plan = json("plan.json");
const owner = json("owner.json"), claude = json("claude.json");

// Draft rule from RUBRIC-DRAFT.md, first match wins.
const derive = ([F1, F2, F3, F4, F5, F6]) =>
  F3 && F4 ? "queue" : F1 && F2 ? "explorer" : F5 ? "comparison" : F6 ? "inspector" : "overview";

const ids = plan.runs.map((r) => r.id).filter((id) => owner[id]?.features?.every((v) => v === 0 || v === 1) && claude[id]);
const kappa = (pairs) => {
  const n = pairs.length, cats = [...new Set(pairs.flat())];
  const po = pairs.filter(([a, b]) => a === b).length / n;
  const pe = cats.reduce((s, c) => s + (pairs.filter(([a]) => a === c).length / n) * (pairs.filter(([, b]) => b === c).length / n), 0);
  return pe === 1 ? 1 : (po - pe) / (1 - pe);
};
console.log(`screens coded by both: ${ids.length} of ${plan.runs.length}`);
features.forEach((f, i) => {
  const pairs = ids.map((id) => [owner[id].features[i], claude[id].features[i]]);
  const agree = pairs.filter(([a, b]) => a === b).length;
  const yes = (k) => pairs.filter((p) => p[k] === 1).length;
  console.log(`${f.id} ${f.name.padEnd(9)} agree ${agree}/${ids.length}  kappa ${kappa(pairs).toFixed(2)}  yes: owner ${yes(0)}, claude ${yes(1)}`);
});
const arch = ids.map((id) => [derive(owner[id].features), derive(claude[id].features)]);
console.log(`derived archetype: agree ${arch.filter(([a, b]) => a === b).length}/${ids.length}, kappa ${kappa(arch).toFixed(2)}`);
for (const [id, [a, b]] of ids.map((id, k) => [id, arch[k]])) if (a !== b) console.log(`  ${id}: owner ${a}, claude ${b}`);
