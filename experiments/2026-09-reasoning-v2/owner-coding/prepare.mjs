// Builds data.json for the owner's blind coding page: a seeded random
// sample of generation ids, each with its task, its stripped code, a
// parse flag and a wireframe tree of the page. No condition, no model,
// no plan turn, no expected archetype.
// Usage: node prepare.mjs <plan.json> <generations-dir> <out.json> [--sample N] [--seed S]
import ts from "typescript";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const [planPath, gen, outPath] = process.argv.slice(2);
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? Number(process.argv[i + 1]) : d; };
const plan = JSON.parse(readFileSync(planPath, "utf8"));
const tasks = JSON.parse(readFileSync(new URL("../prompts/tasks.json", import.meta.url), "utf8"));
const guide = readFileSync(new URL("../analysis/CODING-GUIDE.md", import.meta.url), "utf8");

let state = arg("--seed", 20260929);
const rand = () => ((state = (state * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
let ids = plan.runs.map((r) => r.id).filter((id) => existsSync(`${gen}/${id}.tsx`)).sort();
const n = arg("--sample", ids.length);
for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
ids = ids.slice(0, n);

const printer = ts.createPrinter({ removeComments: true });
const toJs = (src) => ts.transpileModule(src, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, removeComments: true },
}).outputText;
const LABEL_KEYS = ["label", "header", "title", "name", "key", "field"];

function convert(src) {
  const sf = ts.createSourceFile("x.tsx", src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const consts = new Map(), locals = new Map();
  let main;
  for (const s of sf.statements) {
    const isDefault = s.modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword);
    if (ts.isFunctionDeclaration(s) && s.body) {
      if (s.name) locals.set(s.name.text, s.body);
      if (isDefault) main = s.body;
    } else if (ts.isVariableStatement(s)) {
      for (const d of s.declarationList.declarations) {
        if (!ts.isIdentifier(d.name) || !d.initializer) continue;
        if (ts.isArrowFunction(d.initializer) || ts.isFunctionExpression(d.initializer)) locals.set(d.name.text, d.initializer.body);
        else consts.set(d.name.text, d.initializer);
      }
    } else if (ts.isExportAssignment(s) && ts.isIdentifier(s.expression)) main = locals.get(s.expression.text);
  }
  // Consts declared inside the page component are visible too.
  const collectInner = (n) => {
    if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer && !consts.has(n.name.text)) consts.set(n.name.text, n.initializer);
    ts.forEachChild(n, collectInner);
  };
  if (main) collectInner(main);
  for (const [k, v] of locals) if (v === main) locals.delete(k);

  const text = (e) => (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e) ? e.text
    : ts.isNumericLiteral(e) ? e.text : e.kind === ts.SyntaxKind.TrueKeyword ? "true"
    : e.kind === ts.SyntaxKind.FalseKeyword ? "false" : null);
  const deref = (e, d = 0) => (e && ts.isIdentifier(e) && consts.has(e.text) && d < 4 ? deref(consts.get(e.text), d + 1) : e);

  function summarise(e, depth) {
    e = deref(e);
    if (!e) return null;
    const t = text(e);
    if (t !== null) return { v: t };
    if (ts.isTemplateExpression(e)) return { v: e.getText().slice(1, -1).replace(/\$\{[^}]*\}/g, "…") };
    if (ts.isArrowFunction(e) || ts.isFunctionExpression(e)) {
      const out = []; walk(e.body, out, depth); return out.length ? { jsx: out } : { v: "fn" };
    }
    if (ts.isArrayLiteralExpression(e)) {
      const labels = [], jsx = [], items = [];
      for (const el of e.elements) {
        const x = deref(el);
        if (x && ts.isObjectLiteralExpression(x)) {
          const item = { labels: [], jsx: [] };
          for (const p of x.properties) {
            if (!ts.isPropertyAssignment(p)) continue;
            const key = p.name.getText();
            const val = deref(p.initializer);
            const tv = val && text(val);
            if (LABEL_KEYS.includes(key) && tv !== null && !item.labels.length) item.labels.push(tv);
            const inner = []; walk(p.initializer, inner, depth);
            if (inner.length) item.jsx.push({ t: "@slot", name: key, c: inner });
          }
          if (item.labels.length) labels.push(item.labels[0]);
          items.push(item);
        } else if (x) {
          const tv = text(x);
          if (tv !== null) labels.push(tv);
          else walk(x, jsx, depth);
        }
      }
      return { arr: e.elements.length, labels, items: items.filter((i) => i.jsx.length || i.labels.length), jsx };
    }
    if (ts.isObjectLiteralExpression(e)) return { v: "{…}" };
    const inner = []; walk(e, inner, depth);
    if (inner.length) return { jsx: inner };
    if (ts.isCallExpression(e) && ts.isPropertyAccessExpression(e.expression) && ["filter", "slice", "sort"].includes(e.expression.name.text)) {
      const base = summarise(e.expression.expression, depth);
      return base ? { ...base, derived: e.expression.name.text } : { v: "…" };
    }
    return { v: "…" };
  }

  function element(node, depth) {
    const el = ts.isJsxElement(node) ? node.openingElement : node;
    const name = el.tagName.getText();
    if (locals.has(name) && depth < 6) {
      const out = []; walk(locals.get(name), out, depth + 1);
      if (out.length === 1) return out[0];
      if (out.length) return { t: "div", c: out };
    }
    const p = {}, slots = [];
    for (const a of el.attributes.properties) {
      if (!ts.isJsxAttribute(a)) continue;
      const key = a.name.getText();
      const init = a.initializer;
      if (!init) { p[key] = { v: "true" }; continue; }
      const expr = ts.isJsxExpression(init) ? init.expression : init;
      const s = summarise(expr, depth);
      if (!s) continue;
      if (s.jsx?.length && s.arr === undefined) { slots.push({ t: "@slot", name: key, c: s.jsx }); continue; }
      if (s.jsx && s.arr === undefined) continue;
      p[key] = { v: s.v, arr: s.arr, labels: s.labels, derived: s.derived };
      if (s.items?.some((i) => i.jsx.length)) slots.push({ t: "@items", name: key, items: s.items });
      if (s.arr !== undefined && s.jsx?.length) slots.push({ t: "@slot", name: key, c: s.jsx });
    }
    const children = [];
    if (ts.isJsxElement(node)) for (const c of node.children) walk(c, children, depth);
    return { t: name, p, c: [...slots, ...children] };
  }

  function walk(node, out, depth, rep = false) {
    if (!node) return;
    if (ts.isJsxText(node)) { const v = node.text.trim(); if (v) out.push({ t: "#text", v }); return; }
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const e = element(node, depth); if (rep) e.rep = true; out.push(e); return;
    }
    if (ts.isJsxFragment(node)) { for (const c of node.children) walk(c, out, depth, rep); return; }
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === "map") {
      const before = out.length;
      ts.forEachChild(node, (c) => walk(c, out, depth, true));
      const src = summarise(node.expression.expression, depth);
      for (let i = before; i < out.length; i++) if (src?.arr) out[i].repCount = src.arr;
      return;
    }
    if (ts.isJsxExpression(node) && node.expression) {
      const e = node.expression;
      if (ts.isIdentifier(e) || ts.isPropertyAccessExpression(e)) {
        const d = deref(e);
        const t = d && text(d);
        if (t !== null && t !== undefined) { out.push({ t: "#text", v: t }); return; }
        if (d && d !== e) { walk(d, out, depth, rep); return; }
        out.push({ t: "#text", v: "{" + e.getText() + "}" });
        return;
      }
    }
    ts.forEachChild(node, (c) => walk(c, out, depth, rep));
  }

  const found = [];
  walk(main ?? sf, found, 0);
  const size = (n) => 1 + (n.c ?? []).reduce((s, c) => s + size(c), 0);
  return { sf, tree: found.sort((a, b) => size(b) - size(a))[0] ?? null };
}

const items = ids.map((id) => {
  const r = plan.runs.find((x) => x.id === id);
  const src = readFileSync(`${gen}/${id}.tsx`, "utf8");
  const { sf, tree } = convert(src);
  const parses = sf.parseDiagnostics.length === 0;
  return {
    id, task: r.task, prompt: tasks[r.task].prompt, fit: tasks[r.task].fit, parses,
    code: parses ? printer.printFile(sf) : src.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, ""),
    tree: parses ? tree : null,
    js: parses ? toJs(src) : null,
  };
});

// Worked examples from the guide: Stage 0 files as coded blind there, plus
// two synthetic ones for the archetypes Stage 0 never produced.
const EXAMPLES = [
  ["dashboard", "gzphq", "Dashboard shell: metrics against the previous unit, charts, table; nothing opens."],
  ["dashboard", "g1pab", "Summary numbers and a chart lead; the movers table is one panel among several."],
  ["explorer", "ggqjy", "A student table sorted low-first with a needs-support view and a detail pane for the selected student."],
  ["explorer", "gmf3s", "Explorer shell: filters, table, a thin detail pane; still an explorer, just a weak one."],
  ["queue", "gs99a", "The current payout with reason and attempts, resolution buttons, N of total and remaining in an aside."],
  ["queue", "gnen4", "A queue of failing students with a current-student pane and a decision, preceded by summary tables."],
  ["report", "ggkxo", "Metrics, a group comparison, then grouped tables read top to bottom; nothing selected, nothing decided."],
  ["inspector", "inspector-synthetic", "Synthetic, outside the tasks: one account at the centre with figures against a basis, history, notes and actions."],
  ["comparison", "comparison-synthetic", "Synthetic, outside the tasks: two suppliers on the same measures, differences marked, basis stated."],
];
const examples = EXAMPLES.map(([archetype, id, why]) => {
  const file = id.endsWith("synthetic")
    ? new URL(`./examples/${id}.tsx`, import.meta.url)
    : new URL(`../../2026-09-reasoning-pilot/generations/${id}.tsx`, import.meta.url);
  const src = readFileSync(file, "utf8");
  const { sf, tree } = convert(src);
  return { id, archetype, why, code: printer.printFile(sf), tree, js: toJs(src) };
});
writeFileSync(outPath, JSON.stringify({ guide, items, examples }));
console.log(`${items.length} items -> ${outPath}`);
