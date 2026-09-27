// Builds the run manifest: 36 generations with opaque ids in a seeded
// random order. Ids hide task, condition and model from anyone coding M3.
// Usage: node plan.mjs > ../manifest.json
const tasks = ["T1", "T2", "T3"];
const conditions = ["A", "B", "C"];
const models = ["sonnet", "haiku"];
let seed = 20260927;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const runs = [];
for (const task of tasks)
  for (const condition of conditions)
    for (const model of models)
      for (const sample of [1, 2]) runs.push({ task, condition, model, sample });
for (let i = runs.length - 1; i > 0; i--) {
  const j = Math.floor(rand() * (i + 1));
  [runs[i], runs[j]] = [runs[j], runs[i]];
}
const used = new Set();
for (const r of runs) {
  let id;
  do id = "g" + Math.floor(rand() * 36 ** 4).toString(36).padStart(4, "0");
  while (used.has(id));
  used.add(id);
  r.id = id;
}
console.log(JSON.stringify(runs.map((r, order) => ({ order, ...r })), null, 1));
