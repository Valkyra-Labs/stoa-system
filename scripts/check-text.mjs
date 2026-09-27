// House-style gate for tracked text and commit messages:
// no emoji, no AI attribution trailers.
// Usage: node scripts/check-text.mjs [base-ref]
// With a base ref, commit messages in base..HEAD are checked too.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const git = (...a) => execFileSync("git", a, { encoding: "utf8", maxBuffer: 1 << 26 });
const BINARY = /\.(png|jpe?g|gif|webp|ico|woff2?|ttf|otf|gz|tycz|wasm|pdf)$/i;
// Raw model output is experiment data and is kept verbatim, emoji included.
const RAW = /^experiments\/[^/]+\/(generations\/|calibration\/(.*\/)?out\/|[^/]*-run\.log$)/;
const EMOJI = /\p{Emoji_Presentation}|\p{Extended_Pictographic}️/u;
const TRAILER = /^(co-authored-by:.*(claude|anthropic)|.*generated with \[?claude code)/im;

const problems = [];
for (const file of git("ls-files", "--cached", "--others", "--exclude-standard").split("\n").filter((f) => f && !BINARY.test(f) && !RAW.test(f))) {
  let text;
  try { text = readFileSync(file, "utf8"); } catch { continue; }
  text.split("\n").forEach((line, i) => {
    if (EMOJI.test(line)) problems.push(`${file}:${i + 1}: emoji`);
  });
}

const base = process.argv[2];
if (base) {
  for (const sha of git("rev-list", `${base}..HEAD`).split("\n").filter(Boolean)) {
    const msg = git("log", "-1", "--format=%B", sha);
    if (EMOJI.test(msg)) problems.push(`commit ${sha.slice(0, 7)}: emoji in message`);
    if (TRAILER.test(msg)) problems.push(`commit ${sha.slice(0, 7)}: AI attribution line`);
  }
}

for (const p of problems) console.log(p);
console.log(problems.length ? `${problems.length} problem(s)` : "text ok");
process.exit(problems.length ? 1 : 0);
