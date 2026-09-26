import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const css = await readFile(new URL("../dist/tokens.css", import.meta.url), "utf8");

test("light and dark themes define the same semantic colours", () => {
  const names = (block) => [...block.matchAll(/--stoa-color-([a-z-]+):/g)].map((m) => m[1]);
  const darkBlock = css.slice(css.indexOf('[data-theme="dark"]'), css.indexOf("@media (prefers-color-scheme"));
  const semantic = ["bg", "surface", "text", "text-muted", "accent", "focus", "bid", "ask", "up", "down"];
  for (const s of semantic) {
    assert.ok(names(css).includes(s), `light defines ${s}`);
    assert.ok(names(darkBlock).includes(s), `dark defines ${s}`);
  }
});

test("density modes and reduced motion are present", () => {
  for (const mode of ["compact", "comfortable"]) assert.match(css, new RegExp(`\\[data-density="${mode}"\\]`));
  assert.match(css, /--stoa-density-row-height: 28px/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*--stoa-motion-duration-flash: 0ms/);
});
