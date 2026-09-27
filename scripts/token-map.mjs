// Token usage map: which token reaches which component and which story.
// See docs/stage-1/03-token-map.md for the brief.
//
// Usage:
//   node scripts/token-map.mjs          regenerate docs/generated/token-map.{json,md}
//   node scripts/token-map.mjs --check  fail if the committed output is stale
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { buildTokenMap, renderMarkdown } from "./token-map/lib.mjs";

const root = new URL("..", import.meta.url).pathname;
const rel = (p) => relative(root, p).split("\\").join("/");

function walk(dir, filter) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist") continue;
      out.push(...walk(path, filter));
    } else if (filter(entry.name)) {
      out.push(path);
    }
  }
  return out;
}

function readAll(paths) {
  return paths.map((path) => ({ path: rel(path), content: readFileSync(path, "utf8") }));
}

function parseKnownComponents(indexTs) {
  const names = new Set();
  for (const block of indexTs.matchAll(/export\s*\{([^}]+)\}\s*from/g)) {
    for (const part of block[1].split(",")) {
      const name = part.trim().split(/\s+as\s+/)[0].trim();
      if (name && !name.startsWith("type ")) names.add(name);
    }
  }
  return names;
}

const tokensCssPath = join(root, "packages/tokens/dist/tokens.css");
if (!existsSync(tokensCssPath)) {
  console.error("packages/tokens/dist/tokens.css not found. Run `pnpm build` (or `pnpm --filter @valkyra-labs/stoa-tokens build`) first.");
  process.exit(1);
}
const tokensCssText = readFileSync(tokensCssPath, "utf8");

const reactSrc = join(root, "packages/react/src");
const isTestOrStory = (name) => /\.(test|stories)\.tsx?$/.test(name);

const cssFiles = readAll(walk(reactSrc, (name) => extname(name) === ".css"));
const sourceFiles = readAll(walk(reactSrc, (name) => /\.tsx?$/.test(name) && !isTestOrStory(name)));
const storyFiles = readAll([...walk(reactSrc, (name) => name.endsWith(".stories.tsx")), ...walk(join(root, "stories"), (name) => name.endsWith(".stories.tsx"))]);
const knownComponents = parseKnownComponents(readFileSync(join(reactSrc, "index.ts"), "utf8"));

const map = buildTokenMap({ tokensCssText, cssFiles, sourceFiles, storyFiles, knownComponents });
const json = `${JSON.stringify(map, null, 2)}\n`;
const md = renderMarkdown(map);

const jsonPath = join(root, "docs/generated/token-map.json");
const mdPath = join(root, "docs/generated/token-map.md");

if (process.argv.includes("--check")) {
  const problems = [];
  if (!existsSync(jsonPath) || readFileSync(jsonPath, "utf8") !== json) problems.push("docs/generated/token-map.json is stale");
  if (!existsSync(mdPath) || readFileSync(mdPath, "utf8") !== md) problems.push("docs/generated/token-map.md is stale");
  if (problems.length) {
    console.log(problems.join("\n"));
    console.log("Run `pnpm token-map` and commit the result.");
    process.exit(1);
  }
  console.log("token map is up to date");
} else {
  mkdirSync(join(root, "docs/generated"), { recursive: true });
  writeFileSync(jsonPath, json);
  writeFileSync(mdPath, md);
  console.log(`wrote ${rel(jsonPath)} and ${rel(mdPath)}`);
  console.log(`${map.summary.tokenCount} tokens, ${map.summary.unusedCount} unused, ${map.summary.hardcodedLiteralCount} hard-coded literals, ${map.summary.undefinedCount} undefined custom properties`);
}
