// Development check: agreement of the KPI-row feature (F1) with the
// Stage 0 blind coding, for the v1 and v2 extractors. Stage 0 was used
// to develop v2, so this is not a held-out estimate.
import { readFileSync } from "node:fs";
import { features } from "./features.mjs";

const dir = new URL("../../2026-09-reasoning-pilot/", import.meta.url);
const json = (p) => JSON.parse(readFileSync(new URL(p, dir), "utf8"));
const blind = json("analysis/blind-coding.json");
const v1 = Object.fromEntries(readFileSync(new URL("analysis/results-primary.txt", dir), "utf8")
  .split("\n").filter((l) => l.startsWith("{")).map((l) => JSON.parse(l)).map((r) => [r.id, r.F1]));
let a1 = 0, a2 = 0;
for (const { id } of json("manifest.json")) {
  const f = features(readFileSync(new URL(`generations/${id}.tsx`, dir), "utf8"));
  if (v1[id] === blind[id].q1) a1++;
  if (f.F1 === blind[id].q1) a2++;
  else console.log(`  ${id} v2=${f.F1} blind=${blind[id].q1} ${f.F10.join(">")} | ${blind[id].note}`);
}
console.log(`F1 against blind Q1: v1 ${a1}/36, v2 ${a2}/36`);
