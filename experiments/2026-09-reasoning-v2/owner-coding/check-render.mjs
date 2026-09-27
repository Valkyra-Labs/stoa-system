// Headless check: renders every sampled screen and example to a string and
// reports failures and near-empty screens.
// Usage (repository root): node experiments/2026-09-reasoning-v2/owner-coding/check-render.mjs
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
execFileSync("npx", ["vite", "build", "--config", `${here}render/check.vite.mjs`], { cwd: fileURLToPath(new URL("../../..", import.meta.url)), stdio: ["ignore", "ignore", "inherit"] });
const d = JSON.parse(readFileSync(`${here}data.json`, "utf8"));
// Each screen renders in its own process with a time and memory limit: a
// generation that renders itself recursively must not take the check down.
const all = [...d.items, ...d.examples];
const res = all.map((item, i) => {
  try {
    const out = execFileSync("node", ["--max-old-space-size=256", "--stack-size=2000", "--input-type=module", "-e",
      `const { check } = await import(${JSON.stringify(`${here}render-dist/check/check.js`)});
       const d = JSON.parse((await import("node:fs")).readFileSync(${JSON.stringify(`${here}data.json`)}, "utf8"));
       const it = [...d.items, ...d.examples][${i}];
       process.stdout.write(JSON.stringify(check([it])[0]));`], { encoding: "utf8", timeout: 15000, stdio: ["ignore", "pipe", "ignore"] });
    return JSON.parse(out);
  } catch (e) {
    return { id: item.id, status: "crash", message: e.signal ? `killed (${e.signal})` : `exit ${e.status}` };
  }
});
// The coding page reads this to show a wireframe instead of a screen that
// would hang or crash the page.
writeFileSync(`${here}render-report.json`, JSON.stringify(Object.fromEntries(res.map((r) => [r.id, { status: r.status, message: r.message ?? null }]))));
const by = {};
for (const r of res) by[r.status] = (by[r.status] ?? 0) + 1;
console.log(by);
for (const r of res.filter((r) => r.status !== "ok")) console.log(`${r.id} ${r.status} ${r.message ?? ""}`);
const ok = res.filter((r) => r.status === "ok");
const chars = ok.map((r) => r.chars).sort((a, b) => a - b);
console.log(`visible text: min ${chars[0]}, median ${chars[chars.length >> 1]}; screens with components outside the vocabulary: ${ok.filter((r) => r.unknown).length}`);
for (const r of ok.filter((r) => r.chars < 200)) console.log(`thin: ${r.id} (${r.chars}) ${r.sample}`);
