// Mechanical structural features of a generated screen, v2 of the
// Stage 0 extractor (../../2026-09-reasoning-pilot/analysis/features.mjs).
// Changes: pattern components are expanded wherever they sit under
// layout wrappers, not only at the top level; Metric runs inside a
// detail pane (Inspector, Drawer, a detail/current/primary slot) do not
// count as a KPI row. A secondary check against blind coding only.
// Usage: node features.mjs file.tsx [...]   -> one JSON line per file
import ts from "typescript";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

// Pattern components and their slots in declared order (vocabulary.md).
const PATTERNS = {
  Explorer: ["toolbar", "table", "detail"],
  Compare: ["entities", "metrics", "evidence"],
  Inspector: ["primary", "context", "history", "actions"],
  Monitor: ["signals", "exceptions"],
  ReviewQueue: ["items", "current", "decision"],
  Dashboard: ["metrics", "charts", "table"],
};
const SLOT_KIND = {
  toolbar: "filters", table: "table", detail: "detail", entities: "comparison",
  metrics: "metrics", evidence: "history", primary: "detail", context: "detail",
  history: "history", actions: "actions", signals: "metrics", exceptions: "table",
  items: "table", current: "detail", decision: "actions", charts: "chart",
};
const LEAF_DATA = ["Metric", "Chart", "DataTable", "Comparison", "Timeline", "AuditLog", "Trend"];
const INLINE_CONTROLS = ["Button", "Tabs", "input", "select"];

let locals = new Map();

/** Node: { name, attrs: Map<prop, {jsx: Node[], arrayLen}>, children: Node[] } */
function toTree(node, depth = 0) {
  const el = ts.isJsxElement(node) ? node.openingElement : node;
  const name = el.tagName.getText();
  // Local helper components are inlined (once per level, depth-limited).
  if (locals.has(name) && depth < 8) {
    const out = [];
    walk(locals.get(name), out, depth + 1);
    if (out.length === 1) return out[0];
  }
  const attrs = new Map();
  const propChildren = [];
  for (const a of el.attributes.properties) {
    if (!ts.isJsxAttribute(a)) continue;
    const jsx = [];
    let arrayLen = 0;
    if (a.initializer) {
      walk(a.initializer, jsx, depth);
      const e = ts.isJsxExpression(a.initializer) ? a.initializer.expression : undefined;
      if (e && ts.isArrayLiteralExpression(e)) arrayLen = e.elements.length;
    }
    attrs.set(a.name.getText(), { jsx, arrayLen });
    propChildren.push(...jsx);
  }
  const children = [];
  if (ts.isJsxElement(node)) for (const c of node.children) walk(c, children, depth);
  return { name, attrs, children: [...propChildren, ...children] };
}

// JSX returned from a `.map(...)` callback is marked `repeated`: it
// renders once per data item, so one Metric there is a row of Metrics.
function walk(node, out, depth = 0, rep = false) {
  if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
    const t = toTree(node, depth);
    if (rep) t.repeated = true;
    out.push(t);
    return;
  }
  if (ts.isJsxFragment(node)) {
    for (const c of node.children) walk(c, out, depth, rep);
    return;
  }
  if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === "map") {
    ts.forEachChild(node, (c) => walk(c, out, depth, true));
    return;
  }
  ts.forEachChild(node, (c) => walk(c, out, depth, rep));
}

/** Collect top-level functions / const arrows; return the default export's body. */
function collect(sf) {
  locals = new Map();
  let main;
  for (const s of sf.statements) {
    const isDefault = s.modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword);
    if (ts.isFunctionDeclaration(s) && s.body) {
      if (s.name) locals.set(s.name.text, s.body);
      if (isDefault) main = s.body;
    } else if (ts.isVariableStatement(s)) {
      for (const d of s.declarationList.declarations)
        if (ts.isIdentifier(d.name) && d.initializer && (ts.isArrowFunction(d.initializer) || ts.isFunctionExpression(d.initializer)))
          locals.set(d.name.text, d.initializer.body);
    } else if (ts.isExportAssignment(s) && ts.isIdentifier(s.expression)) {
      main = locals.get(s.expression.text);
    }
  }
  return main;
}

const size = (n) => 1 + n.children.reduce((s, c) => s + size(c), 0);
const all = (n) => [n, ...n.children.flatMap(all)];
const has = (n, names) => all(n).some((x) => names.includes(x.name));

function rootOf(sf) {
  const main = collect(sf);
  const found = [];
  if (main) {
    // The page component itself must not be inlined into its own body.
    for (const [k, v] of locals) if (v === main) locals.delete(k);
    walk(main, found);
  } else walk(sf, found);
  return found.sort((a, b) => size(b) - size(a))[0];
}

function kind(r) {
  if (r.slot) {
    if (r.children.length === 0) return SLOT_KIND[r.slot] ?? r.slot;
  }
  if (r.name === "Header" || /^h[1-3]$/.test(r.name)) return "header";
  if (all(r).filter((x) => x.name === "Metric").length >= 2) return "metrics";
  if (has(r, ["DataTable"])) return "table";
  if (has(r, ["Chart"])) return "chart";
  if (has(r, ["Comparison"])) return "comparison";
  if (has(r, ["Inspector", "Drawer"])) return "detail";
  if (has(r, ["Timeline", "AuditLog"])) return "history";
  if (has(r, ["FilterBar", "SavedViews"])) return "filters";
  if (r.slot) return SLOT_KIND[r.slot] ?? r.slot;
  return r.name;
}

const WRAPPERS = ["Section", "Card", "div", "section", "main", "Tabs"];
const hasPattern = (n) => all(n).some((x) => x.name in PATTERNS);

/** Expand a region: patterns become their slots; wrappers that hold a
 * pattern are opened so the pattern's slots become regions. */
function expand(r) {
  const slots = PATTERNS[r.name];
  if (slots)
    return slots.flatMap((s) => {
      const a = r.attrs.get(s);
      return a ? [{ name: `${r.name}.${s}`, slot: s, arrayLen: a.arrayLen, attrs: new Map(), children: a.jsx }] : [];
    });
  if (WRAPPERS.includes(r.name) && hasPattern(r)) return r.children.flatMap(expand);
  return [r];
}

/** Top-level regions: unwrap shells, expand patterns at any depth. */
function regions(root) {
  const out = [];
  if (root.name === "Page" && root.attrs.has("title")) out.push({ name: "PageTitle", header: true, attrs: new Map(), children: [] });
  let top = ["Page", "main", "div"].includes(root.name) ? root.children : [root];
  while (top.length === 1 && ["main", "div"].includes(top[0].name)) top = top[0].children;
  for (const r of top) out.push(...expand(r));
  return out;
}

export function features(src, file = "x.tsx") {
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const root = rootOf(sf);
  if (!root) return { error: "no JSX" };
  const regs = regions(root);
  const nodes = all(root);
  const F10 = regs.map((r) => (r.header ? "header" : kind(r)));

  // F1: a KPI row before the main working content. A KPI row is a run
  // of >= 3 Metric (or Card holding a Metric) siblings, a repeated
  // (mapped) Metric, or a Dashboard/Monitor metrics or signals slot.
  // Runs inside a detail pane do not count. Working content is the
  // first table, detail, comparison, history or actions region.
  const DETAIL = ["Inspector", "Drawer"];
  const metricish = (n) => n.name === "Metric" || (n.name === "Card" && n.children.some((c) => c.name === "Metric"));
  const runIn = (n) => {
    if (DETAIL.includes(n.name) || ["detail", "current", "primary", "context"].includes(n.slot)) return false;
    let run = 0;
    for (const c of n.children) {
      run = metricish(c) ? run + (c.repeated ? 3 : 1) : 0;
      if (run >= 3) return true;
    }
    return n.children.some(runIn);
  };
  const kpi = (r) => (["metrics", "signals"].includes(r.slot) && (r.arrayLen >= 3 || r.children.length === 0 || runIn(r)))
    || runIn({ children: [r] });
  const WORK = ["table", "detail", "comparison", "history", "actions"];
  const firstWork = F10.findIndex((k) => WORK.includes(k));
  const before = firstWork < 0 ? regs : regs.slice(0, firstWork);
  const F1 = before.some((r, i) => F10[i] !== "header" && kpi(r)) ? 1 : 0;

  // F2: a Sidebar, or nav/aside, within two levels of the page root.
  const shallow = [root, ...root.children, ...root.children.flatMap((c) => c.children)];
  const F2 = shallow.some((n) => ["Sidebar", "nav", "aside"].includes(n.name)) ? 1 : 0;

  // F3: header, metrics, chart, table appear in this order among the regions.
  const order = ["header", "metrics", "chart", "table"];
  let i = 0;
  for (const k of F10) if (k === order[i]) i++;
  const F3 = i === order.length ? 1 : 0;

  const F4 = regs.length;
  const F5 = has(root, ["SavedViews"]) ? "saved_views"
    : has(root, ["FilterBar"]) || nodes.some((n) => n.name === "Explorer" && n.attrs.has("toolbar")) ? "filter_bar"
    : has(root, INLINE_CONTROLS) ? "inline" : "none";
  const F6 = nodes.some((n) => ["Inspector", "Drawer", "DetailPanel"].includes(n.name)
    || (n.name === "Explorer" && n.attrs.has("detail"))
    || (n.name === "DataTable" && n.attrs.has("onRowSelect"))) ? 1 : 0;
  const F7 = has(root, ["Comparison", "Compare"]) ? "side_by_side"
    : nodes.some((n) => n.name === "Delta" && n.attrs.has("basis")) ? "baseline"
    : has(root, ["Delta"]) || nodes.some((n) => n.name === "Metric" && n.attrs.has("delta")) ? "delta" : "none";

  // F8: share of leaf data components with a Card ancestor.
  let leaves = 0, carded = 0;
  const visit = (n, inCard) => {
    if (LEAF_DATA.includes(n.name)) { leaves++; if (inCard) carded++; }
    n.children.forEach((c) => visit(c, inCard || n.name === "Card"));
  };
  visit(root, false);
  const F8 = leaves ? +(carded / leaves).toFixed(3) : 0;
  const F9 = nodes.find((n) => n.name in PATTERNS)?.name ?? "none";
  return { F1, F2, F3, F4, F5, F6, F7, F8, F9, F10 };
}

/** Normalised edit distance between two sequences. */
export function editDistance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length] / Math.max(1, a.length, b.length);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  for (const f of process.argv.slice(2)) console.log(JSON.stringify({ file: f, ...features(readFileSync(f, "utf8"), f) }));
}
