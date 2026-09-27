// One command for the owner's coding page: builds the data and the
// sandboxed renderer when they are missing or older than their sources,
// then starts the page.
// Usage (from experiments/2026-09-reasoning-v2):
//   node owner-coding/start.mjs                 v2 archetype coding, http://127.0.0.1:5178
//   node owner-coding/start.mjs --calibration   Stage 3 feature calibration, http://127.0.0.1:5179
import { execFileSync } from "node:child_process";
import { existsSync, statSync, copyFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const exp = fileURLToPath(new URL("..", import.meta.url));
const repo = fileURLToPath(new URL("../../..", import.meta.url));
const mtime = (p) => (existsSync(p) ? statSync(p).mtimeMs : 0);
const newest = (dir) => Math.max(...readdirSync(dir).map((f) => mtime(`${dir}/${f}`)));
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: "inherit" });

// --calibration: the Stage 3 feature calibration (20 screens, yes/no
// features, answers in experiments/stage-3-draft/calibration/owner.json).
const cal = process.argv.includes("--calibration");
const calDir = fileURLToPath(new URL("../../stage-3-draft/calibration/", import.meta.url));
const dataPath = cal ? `${calDir}data.json` : `${here}data.json`;
const reportPath = cal ? `${calDir}render-report.json` : `${here}render-report.json`;
const answersPath = cal ? `${calDir}owner.json` : fileURLToPath(new URL("../analysis/owner-coding.json", import.meta.url));

const sources = [`${here}prepare.mjs`, newest(`${here}examples`), mtime(`${exp}analysis/CODING-GUIDE.md`)].map((x) => (typeof x === "string" ? mtime(x) : x));
if (cal) sources.push(mtime(`${calDir}plan.json`), mtime(`${calDir}features.json`), mtime(`${calDir}../RUBRIC-DRAFT.md`));
if (mtime(dataPath) < Math.max(...sources))
  run("node", cal
    ? ["owner-coding/prepare.mjs", `${calDir}plan.json`, "generations", dataPath, "--sample", "20", "--features", `${calDir}features.json`, "--guide", `${calDir}../RUBRIC-DRAFT.md`]
    : ["owner-coding/prepare.mjs", "plan.json", "generations", dataPath, "--sample", "72"], exp);
if (mtime(`${here}render-dist/render.iife.js`) < newest(`${here}render`)) {
  run("npx", ["vite", "build", "--config", `${here}render/vite.config.mjs`, "--logLevel", "warn"], repo);
  copyFileSync(`${here}render/index.html`, `${here}render-dist/index.html`);
}
if (mtime(reportPath) < Math.max(mtime(dataPath), mtime(`${here}render-dist/render.iife.js`)))
  run("node", [`${here}check-render.mjs`, dataPath, reportPath], repo);
process.argv.splice(2, process.argv.length, dataPath, cal ? "5179" : "5178", answersPath, reportPath);
await import("./server.mjs");
