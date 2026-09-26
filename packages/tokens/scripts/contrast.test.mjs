// WCAG 2.2 contrast of Stoa's semantic colours, measured on the built
// values in both themes. Text needs 4.5:1 (AA, normal text); prices in
// bid/ask/up/down colours are text too; borders and focus need 3:1
// against the surface (non-text contrast, 1.4.11).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { wcagContrast, parse } from "culori";

const css = await readFile(new URL("../dist/tokens.css", import.meta.url), "utf8");

function block(selector) {
  const at = css.indexOf(selector + " {");
  return css.slice(at, css.indexOf("}", at));
}

function resolve(vars, value) {
  const m = value.match(/^var\(--stoa-([a-z0-9-]+)\)$/);
  return m ? resolve(vars, vars[m[1]]) : value;
}

function theme(selector) {
  const vars = {};
  for (const sel of [":root", selector]) {
    for (const m of block(sel).matchAll(/--stoa-([a-z0-9-]+): ([^;]+);/g)) vars[m[1]] = m[2];
  }
  return (name) => parse(resolve(vars, vars[`color-${name}`]));
}

const pairs = [
  ["text", "bg", 7],
  ["text", "surface", 7],
  ["text-muted", "surface", 4.5],
  ["text-muted", "surface-sunken", 4.5],
  ["accent", "surface", 4.5],
  ["bid", "surface", 4.5],
  ["ask", "surface", 4.5],
  ["up", "surface", 4.5],
  ["down", "surface", 4.5],
  ["focus", "surface", 3],
];

for (const [name, selector] of [["light", ":root"], ["dark", '[data-theme="dark"]']]) {
  const color = theme(selector);
  for (const [fg, bg, min] of pairs) {
    test(`${name}: ${fg} on ${bg} >= ${min}:1`, () => {
      const ratio = wcagContrast(color(fg), color(bg));
      assert.ok(ratio >= min, `${fg} on ${bg} is ${ratio.toFixed(2)}:1`);
    });
  }
}
