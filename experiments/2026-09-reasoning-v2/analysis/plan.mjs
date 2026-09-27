// Builds the run plan: 3 models x 4 conditions x 6 tasks x 5 seeds = 360
// generations with opaque ids. llama.cpp holds one model at a time, so
// the model order is shuffled and runs are shuffled within each model.
// Usage: node analysis/plan.mjs > plan.json
import { readFileSync } from "node:fs";
import { homedir } from "node:os";

const tasks = JSON.parse(readFileSync(new URL("../prompts/tasks.json", import.meta.url), "utf8"));
const models = ["qwen3.5:4b", "qwen3:8b", "qwen2.5:14b"];
const conditions = ["components", "generic", "rules", "reasoning"];
const seeds = [1, 2, 3, 4, 5];
let state = 20260928;
const rand = () => ((state = (state * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const modelOrder = shuffle([...models]);
const used = new Set();
const id = () => {
  let s;
  do s = "v" + Math.floor(rand() * 36 ** 5).toString(36).padStart(5, "0");
  while (used.has(s));
  used.add(s);
  return s;
};
const runs = [];
for (const model of modelOrder) {
  const mine = [];
  for (const condition of conditions)
    for (const task of Object.keys(tasks))
      for (const seed of seeds) mine.push({ model, condition, task, seed, think: false });
  runs.push(...shuffle(mine).map((r) => ({ id: id(), ...r })));
}
console.log(JSON.stringify({
  tasks: Object.fromEntries(Object.entries(tasks).map(([k, v]) => [k, v.prompt])),
  options: { temperature: 0.7, top_p: 0.8, max_tokens: 4096 },
  ctx: 8192,
  gguf: { "qwen3.5:4b": `${homedir()}/models/gguf/Qwen_Qwen3.5-4B-Q4_K_M.gguf` },
  modelOrder,
  runs,
}, null, 1));
