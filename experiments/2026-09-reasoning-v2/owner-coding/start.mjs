// One command for the owner's blind coding: builds the sample data and the
// sandboxed renderer when they are missing or older than their sources,
// then starts the coding page at http://127.0.0.1:5178.
// Usage (from experiments/2026-09-reasoning-v2): node owner-coding/start.mjs
import { execFileSync } from "node:child_process";
import { existsSync, statSync, copyFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const exp = fileURLToPath(new URL("..", import.meta.url));
const repo = fileURLToPath(new URL("../../..", import.meta.url));
const mtime = (p) => (existsSync(p) ? statSync(p).mtimeMs : 0);
const newest = (dir) => Math.max(...readdirSync(dir).map((f) => mtime(`${dir}/${f}`)));
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: "inherit" });

if (mtime(`${here}data.json`) < Math.max(mtime(`${here}prepare.mjs`), newest(`${here}examples`), mtime(`${exp}analysis/CODING-GUIDE.md`)))
  run("node", ["owner-coding/prepare.mjs", "plan.json", "generations", "owner-coding/data.json", "--sample", "72"], exp);
if (mtime(`${here}render-dist/render.iife.js`) < newest(`${here}render`)) {
  run("npx", ["vite", "build", "--config", `${here}render/vite.config.mjs`, "--logLevel", "warn"], repo);
  copyFileSync(`${here}render/index.html`, `${here}render-dist/index.html`);
}
if (mtime(`${here}render-report.json`) < Math.max(mtime(`${here}data.json`), mtime(`${here}render-dist/render.iife.js`)))
  run("node", [`${here}check-render.mjs`], repo);
await import("./server.mjs");
