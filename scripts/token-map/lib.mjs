// Core analysis for the token usage map (docs/stage-1/03-token-map.md).
// Pure functions over in-memory file contents so scripts/token-map.mjs (I/O,
// CLI) and scripts/token-map.test.mjs (fixtures) can share the same engine.
import ts from "typescript";

const VAR_NAME = /--stoa-[\w-]+/g;
const VAR_CALL = /var\(\s*(--stoa-[\w-]+)\s*\)/g;

// ---------------------------------------------------------------------------
// Token list: parsed from the built tokens.css (light theme + density, the
// canonical default values), keyed by CSS custom property name.

/** @returns {Map<string, {name: string, rawValue: string}>} first definition of each `--stoa-*` custom property, in file order. */
function parseDeclarations(cssText) {
  const declarations = new Map();
  const re = /(--stoa-[\w-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(cssText))) {
    if (!declarations.has(m[1])) declarations.set(m[1], { name: m[1], rawValue: m[2].trim() });
  }
  return declarations;
}

/** Token descriptors from the built tokens.css: group, alias info and the
 * value resolved through one level of aliasing (semantic tokens alias
 * primitives directly in this system; there is no multi-level chain). */
export function parseTokenList(tokensCssText) {
  const declarations = parseDeclarations(tokensCssText);
  const aliasRe = /^var\(\s*(--stoa-[\w-]+)\s*\)$/;
  const tokens = new Map();
  for (const { name, rawValue } of declarations.values()) {
    const aliasMatch = rawValue.match(aliasRe);
    const aliasOf = aliasMatch ? aliasMatch[1] : null;
    tokens.set(name, {
      name,
      group: name.slice("--stoa-".length).split("-")[0],
      value: rawValue,
      aliasOf,
      kind: aliasOf ? "semantic" : name.startsWith("--stoa-density-") ? "density" : "primitive",
    });
  }
  for (const token of tokens.values()) {
    token.resolvedValue = token.aliasOf ? (tokens.get(token.aliasOf)?.resolvedValue ?? tokens.get(token.aliasOf)?.value ?? token.value) : token.value;
  }
  return tokens;
}

function lineOf(text, index) {
  let line = 1;
  for (let i = 0; i < index; i++) if (text.charCodeAt(i) === 10) line++;
  return line;
}

/** Split a CSS value into space-separated components, respecting
 * parentheses (so `cubic-bezier(0.2, 0, 0, 1)` stays one component). */
function splitCssValue(value) {
  const parts = [];
  let depth = 0;
  let current = "";
  for (const ch of value.trim()) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (/\s/.test(ch) && depth === 0) {
      if (current) parts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current) parts.push(current);
  return parts;
}

function lastCompoundSelector(selector) {
  const compounds = selector.trim().split(/\s+/).filter(Boolean);
  return compounds[compounds.length - 1] ?? "";
}

function classesOf(compound) {
  return [...compound.matchAll(/\.([\w-]+)/g)].map((m) => m[1]);
}

// ---------------------------------------------------------------------------
// CSS scanning: reads (var() usage) and hard-coded literals, per rule block.
// styles.css has no nesting, so a flat `selector { body }` scan is enough.

const DURATION_PROPS = /^(transition|transition-duration|animation|animation-duration)$/;
const SIZE_PROPS = /(radius|padding|margin|gap|inset|^top$|^right$|^bottom$|^left$|^font-size$)/;
const COLOR_LITERAL = /^(#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\(|oklch\(|oklab\(|lab\(|lch\()/;
const DURATION_LITERAL = /^-?\d*\.?\d+m?s$/;
const SIZE_LITERAL = /^-?\d*\.?\d+(px|rem|em|ch|%)$/;
const norm = (s) => s.replace(/\s+/g, "");

/** @param {{path:string, content:string}[]} cssFiles */
export function scanCss(cssFiles, tokens) {
  const reads = [];
  const literals = [];
  const resolvedValues = [...tokens.values()].map((t) => ({ name: t.name, value: norm(t.resolvedValue) }));

  for (const { path, content } of cssFiles) {
    for (const block of content.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const selectorText = block[1];
      const body = block[2];
      const bodyOffset = block.index + block[1].length + 1;
      const selectors = selectorText.split(",").map((s) => s.trim()).filter(Boolean);
      const classes = [...new Set(selectors.flatMap((s) => classesOf(lastCompoundSelector(s))))];

      for (const varMatch of body.matchAll(VAR_CALL)) {
        reads.push({
          token: varMatch[1],
          file: path,
          line: lineOf(content, bodyOffset + varMatch.index),
          selectors,
          classes,
        });
      }

      for (const decl of body.matchAll(/([a-zA-Z-]+)\s*:\s*([^;]+);/g)) {
        const property = decl[1].trim();
        const declOffset = bodyOffset + decl.index;
        for (const value of splitCssValue(decl[2])) {
          if (value.includes("var(")) continue;
          let category = null;
          if (COLOR_LITERAL.test(value)) category = "color";
          else if (DURATION_LITERAL.test(value) && DURATION_PROPS.test(property)) category = "duration";
          else if (value.startsWith("cubic-bezier(")) category = "easing";
          else if (SIZE_LITERAL.test(value) && SIZE_PROPS.test(property)) category = "size";
          if (!category) continue;
          const match = resolvedValues.find((t) => t.value === norm(value));
          if (category === "size" && !match) continue; // sizes: only flag exact token matches, too many legitimate one-off pixels otherwise
          literals.push({
            file: path,
            line: lineOf(content, declOffset),
            property,
            value,
            category,
            matchingToken: match?.name ?? null,
          });
        }
      }
    }
  }
  return { reads, literals };
}

// ---------------------------------------------------------------------------
// TS/TSX scanning via the compiler API.

function makeSourceFile(path, content) {
  const scriptKind = path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  return ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true, scriptKind);
}

function lineOfNode(sourceFile, node) {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
}

/** Outermost enclosing named function (a component) or named story object
 * (a `export const X = {...}` in a *.stories.tsx file, found the same way
 * since neither is itself a special AST node kind). Components often read
 * tokens through an inner closure (a `render` callback, an event handler);
 * walking to the outermost match attributes the read to the component
 * itself rather than to that anonymous-in-spirit local helper. */
function enclosingName(node) {
  let result = null;
  for (let n = node; n; n = n.parent) {
    if (ts.isFunctionDeclaration(n) && n.name) result = n.name.text;
    else if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer) {
      const init = n.initializer;
      if (ts.isArrowFunction(init) || ts.isFunctionExpression(init) || ts.isObjectLiteralExpression(init)) {
        result = n.name.text;
      }
    }
  }
  return result;
}

function forEachDescendant(node, visit) {
  visit(node);
  ts.forEachChild(node, (child) => forEachDescendant(child, visit));
}

/** Whitespace-delimited pieces of a JSX className expression. A piece
 * adjoining a template substitution is `dynamic: true` (its text is a
 * prefix or suffix, not a full class name). */
function classNamePieces(expr) {
  const pieces = [];
  const splitLiteral = (text, dynamicStart, dynamicEnd) => {
    const tokens = text.split(/(\s+)/);
    tokens.forEach((tok, i) => {
      if (!tok || /^\s+$/.test(tok)) return;
      const isFirst = tokens.slice(0, i).every((t) => !t || /^\s+$/.test(t));
      const isLast = tokens.slice(i + 1).every((t) => !t || /^\s+$/.test(t));
      pieces.push({ text: tok, dynamic: (isFirst && dynamicStart) || (isLast && dynamicEnd) });
    });
  };
  const visit = (n) => {
    if (!n) return;
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) splitLiteral(n.text, false, false);
    else if (ts.isTemplateExpression(n)) {
      splitLiteral(n.head.text, false, true);
      n.templateSpans.forEach((span, i) => splitLiteral(span.literal.text, true, i < n.templateSpans.length - 1));
    } else if (ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression)) visit(n.expression.expression);
    else if (ts.isBinaryExpression(n) && n.operatorToken.kind === ts.SyntaxKind.PlusToken) {
      visit(n.left);
      visit(n.right);
    } else if (ts.isConditionalExpression(n)) {
      visit(n.whenTrue);
      visit(n.whenFalse);
    } else if (ts.isParenthesizedExpression(n)) visit(n.expression);
  };
  visit(expr);
  return pieces;
}

/** Find the array literal driving a `.map((pattern) => ...)` call whose
 * callback parameter (or a destructured element of it) is named `paramName`,
 * searching outward from `node`. Resolves both `arr.map(...)` and
 * `name.map(...)` where `const name = [...]` is declared in the same file. */
function findMapArraySource(paramName, node, sourceFile) {
  for (let n = node; n; n = n.parent) {
    if ((ts.isArrowFunction(n) || ts.isFunctionExpression(n)) && n.parent && ts.isCallExpression(n.parent)) {
      const call = n.parent;
      if (!ts.isPropertyAccessExpression(call.expression) || call.expression.name.text !== "map") continue;
      const param = n.parameters[0];
      if (!param) continue;
      let index = null;
      if (ts.isIdentifier(param.name) && param.name.text === paramName) index = "whole";
      else if (ts.isArrayBindingPattern(param.name)) {
        param.name.elements.forEach((el, i) => {
          if (!ts.isOmittedExpression(el) && ts.isIdentifier(el.name) && el.name.text === paramName) index = i;
        });
      }
      if (index === null) continue;
      let arrayLiteral = null;
      const target = call.expression.expression;
      if (ts.isArrayLiteralExpression(target)) arrayLiteral = target;
      else if (ts.isIdentifier(target)) {
        forEachDescendant(sourceFile, (d) => {
          if (!arrayLiteral && ts.isVariableDeclaration(d) && ts.isIdentifier(d.name) && d.name.text === target.text && d.initializer && ts.isArrayLiteralExpression(d.initializer)) {
            arrayLiteral = d.initializer;
          }
        });
      }
      if (arrayLiteral) return { arrayLiteral, index };
    }
  }
  return null;
}

function resolveArrayValues({ arrayLiteral, index }) {
  const values = [];
  for (const el of arrayLiteral.elements) {
    if (index === "whole" && ts.isStringLiteral(el)) values.push(el.text);
    else if (typeof index === "number" && ts.isArrayLiteralExpression(el)) {
      const item = el.elements[index];
      if (item && ts.isStringLiteral(item)) values.push(item.text);
    }
  }
  return values;
}

/** Local `const alias = (n) => ...getPropertyValue(ARG)...` helpers, where
 * ARG is the parameter itself (a direct pass-through) or a template with the
 * parameter as its only interpolation (a prefix/suffix wrapper). */
function findGetPropertyValueAliases(sourceFile) {
  const aliases = new Map();
  forEachDescendant(sourceFile, (node) => {
    if (!ts.isVariableDeclaration(node) || !ts.isIdentifier(node.name) || !node.initializer) return;
    const init = node.initializer;
    if (!ts.isArrowFunction(init) && !ts.isFunctionExpression(init)) return;
    const param = init.parameters[0];
    if (!param || !ts.isIdentifier(param.name)) return;
    const paramName = param.name.text;
    let found = null;
    forEachDescendant(init.body, (n) => {
      if (found || !ts.isCallExpression(n)) return;
      if (!ts.isPropertyAccessExpression(n.expression) || n.expression.name.text !== "getPropertyValue") return;
      const arg = n.arguments[0];
      if (!arg) return;
      if (ts.isIdentifier(arg) && arg.text === paramName) found = { direct: true };
      else if (ts.isTemplateExpression(arg) && arg.templateSpans.length === 1 && ts.isIdentifier(arg.templateSpans[0].expression) && arg.templateSpans[0].expression.text === paramName) {
        found = { direct: false, prefix: arg.head.text, suffix: arg.templateSpans[0].literal.text };
      }
    });
    if (found) aliases.set(node.name.text, found);
  });
  return aliases;
}

/** All `--stoa-*` reads via `getPropertyValue("--stoa-x")` or a local alias
 * of it (see `findGetPropertyValueAliases`), including reads whose argument
 * is resolved through a `.map()` over an array literal. */
function scanGetPropertyValueReads(sourceFile) {
  const aliases = findGetPropertyValueAliases(sourceFile);
  const reads = [];
  const record = (name, node) => {
    if (name.startsWith("--stoa-")) reads.push({ token: name, line: lineOfNode(sourceFile, node), enclosing: enclosingName(node) });
  };
  const resolveArg = (arg, alias, node) => {
    if (ts.isStringLiteral(arg)) return record(alias.direct ? arg.text : `${alias.prefix}${arg.text}${alias.suffix}`, node);
    if (ts.isIdentifier(arg)) {
      const source = findMapArraySource(arg.text, node, sourceFile);
      if (source) {
        for (const value of resolveArrayValues(source)) record(alias.direct ? value : `${alias.prefix}${value}${alias.suffix}`, node);
      }
    }
  };
  forEachDescendant(sourceFile, (node) => {
    if (!ts.isCallExpression(node)) return;
    const arg = node.arguments[0];
    if (!arg) return;
    if (ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === "getPropertyValue") {
      resolveArg(arg, { direct: true }, node);
    } else if (ts.isIdentifier(node.expression) && aliases.has(node.expression.text)) {
      resolveArg(arg, aliases.get(node.expression.text), node);
    }
  });
  return reads;
}

/** `var(--stoa-x)` occurrences in string/template literals outside CSS
 * files (inline styles), attributed to the nearest enclosing component. */
function scanInlineVarReads(sourceFile) {
  const reads = [];
  forEachDescendant(sourceFile, (node) => {
    if (!ts.isStringLiteral(node) && !ts.isNoSubstitutionTemplateLiteral(node)) return;
    for (const m of node.text.matchAll(VAR_CALL)) {
      reads.push({ token: m[1], line: lineOfNode(sourceFile, node), enclosing: enclosingName(node) });
    }
  });
  return reads;
}

/** className literal pieces (exact and dynamic-prefix), each attributed to
 * its enclosing component. */
function scanClassNames(sourceFile) {
  const exact = [];
  const prefixes = [];
  forEachDescendant(sourceFile, (node) => {
    if (!ts.isJsxAttribute(node) || node.name.getText(sourceFile) !== "className" || !node.initializer) return;
    const expr = ts.isJsxExpression(node.initializer) ? node.initializer.expression : node.initializer;
    if (!expr) return;
    const component = enclosingName(node);
    const line = lineOfNode(sourceFile, node);
    for (const piece of classNamePieces(expr)) {
      (piece.dynamic ? prefixes : exact).push({ text: piece.text, component, line });
    }
  });
  return { exact, prefixes };
}

/** Call sites of `name(...)`, each attributed to the enclosing component. */
function scanCallSites(sourceFile, name) {
  const sites = [];
  forEachDescendant(sourceFile, (node) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === name) {
      sites.push({ component: enclosingName(node) });
    }
  });
  return sites;
}

export function scanSource(sourceFiles) {
  const rawReads = []; // { token, file, line, enclosing }
  const classToOwners = new Map();
  const classPrefixToOwners = new Map();
  const callSitesByFn = new Map(); // helper fn name -> [{component, file}]

  for (const { path, content } of sourceFiles) {
    const sourceFile = makeSourceFile(path, content);
    for (const r of scanGetPropertyValueReads(sourceFile)) rawReads.push({ ...r, file: path });
    for (const r of scanInlineVarReads(sourceFile)) rawReads.push({ ...r, file: path });

    const { exact, prefixes } = scanClassNames(sourceFile);
    for (const e of exact) {
      if (!classToOwners.has(e.text)) classToOwners.set(e.text, []);
      classToOwners.get(e.text).push({ component: e.component, file: path, line: e.line });
    }
    for (const p of prefixes) {
      if (!classPrefixToOwners.has(p.text)) classPrefixToOwners.set(p.text, []);
      classPrefixToOwners.get(p.text).push({ component: p.component, file: path, line: p.line });
    }
  }

  // One hop of call-graph propagation: a helper (e.g. readCanvasTokens) that
  // reads tokens, called from a component, attributes those reads to the
  // caller too.
  const helperNames = new Set(rawReads.map((r) => r.enclosing).filter(Boolean));
  for (const { path, content } of sourceFiles) {
    const sourceFile = makeSourceFile(path, content);
    for (const name of helperNames) {
      for (const site of scanCallSites(sourceFile, name)) {
        if (!callSitesByFn.has(name)) callSitesByFn.set(name, []);
        callSitesByFn.get(name).push({ component: site.component, file: path });
      }
    }
  }
  const propagated = [];
  for (const read of rawReads) {
    for (const site of callSitesByFn.get(read.enclosing) ?? []) {
      if (site.component && site.component !== read.enclosing) {
        propagated.push({ token: read.token, file: site.file, line: read.line, enclosing: site.component, via: read.enclosing });
      }
    }
  }

  return { reads: [...rawReads, ...propagated], classToOwners, classPrefixToOwners };
}

function matchClass(cls, classToOwners, classPrefixToOwners) {
  const owners = [...(classToOwners.get(cls) ?? [])];
  for (const [prefix, list] of classPrefixToOwners) {
    if (cls.startsWith(prefix)) owners.push(...list);
  }
  return owners;
}

// ---------------------------------------------------------------------------
// Stories: which story exercises which component, via the compiler API.

export function scanStories(storyFiles) {
  const componentToStories = new Map();
  const directReads = []; // reads made directly in a story file, not through a shipped component

  for (const { path, content } of storyFiles) {
    const sourceFile = makeSourceFile(path, content);
    const imported = new Set();
    let title = null;
    let metaComponent = null;
    const exportedStories = [];

    forEachDescendant(sourceFile, (node) => {
      if (ts.isImportDeclaration(node) && node.importClause?.namedBindings && ts.isNamedImports(node.importClause.namedBindings)) {
        for (const el of node.importClause.namedBindings.elements) {
          if (!el.isTypeOnly) imported.add(el.name.text);
        }
      }
      if (ts.isVariableStatement(node) && node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
        for (const decl of node.declarationList.declarations) {
          if (ts.isIdentifier(decl.name)) exportedStories.push(decl.name.text);
        }
      }
      if (ts.isPropertyAssignment(node) && ts.isIdentifier(node.name)) {
        if (node.name.text === "title" && ts.isStringLiteral(node.initializer)) title = node.initializer.text;
        if (node.name.text === "component" && ts.isIdentifier(node.initializer)) metaComponent = node.initializer.text;
      }
    });

    const usedComponents = new Set(metaComponent ? [metaComponent] : []);
    forEachDescendant(sourceFile, (node) => {
      const tag = ts.isJsxSelfClosingElement(node) ? node.tagName : ts.isJsxOpeningElement(node) ? node.tagName : null;
      if (tag && ts.isIdentifier(tag) && imported.has(tag.text)) usedComponents.add(tag.text);
    });

    for (const component of usedComponents) {
      if (!componentToStories.has(component)) componentToStories.set(component, new Set());
      for (const story of exportedStories) componentToStories.get(component).add(`${title ?? path} > ${story}`);
    }
    if (usedComponents.size === 0) {
      for (const r of scanGetPropertyValueReads(sourceFile)) directReads.push({ ...r, file: path, story: `${title ?? path} > ${r.enclosing}` });
      for (const r of scanInlineVarReads(sourceFile)) directReads.push({ ...r, file: path, story: `${title ?? path} > ${r.enclosing}` });
    }
  }
  return { componentToStories, directReads };
}

// ---------------------------------------------------------------------------
// Assembly.

export function buildTokenMap({ tokensCssText, cssFiles, sourceFiles, storyFiles, knownComponents }) {
  const tokens = parseTokenList(tokensCssText);
  const { reads: cssReads, literals } = scanCss(cssFiles, tokens);
  const { reads: sourceReads, classToOwners, classPrefixToOwners } = scanSource(sourceFiles);
  const { componentToStories, directReads } = scanStories(storyFiles ?? []);

  const byToken = new Map([...tokens.keys()].map((name) => [name, { components: new Map(), stories: new Set() }]));
  const reached = new Set();
  const undefinedRefs = [];

  const noteReach = (name) => {
    reached.add(name);
    let t = tokens.get(name);
    while (t?.aliasOf) {
      reached.add(t.aliasOf);
      t = tokens.get(t.aliasOf);
    }
  };

  for (const read of cssReads) {
    if (!tokens.has(read.token)) {
      undefinedRefs.push({ name: read.token, file: read.file, line: read.line });
      continue;
    }
    noteReach(read.token);
    const entry = byToken.get(read.token);
    let matched = false;
    for (const cls of read.classes) {
      for (const owner of matchClass(cls, classToOwners, classPrefixToOwners)) {
        if (owner.component && (!knownComponents || knownComponents.has(owner.component))) {
          entry.components.set(`${owner.component}|${read.file}|${read.line}`, { component: owner.component, file: read.file, line: read.line });
          matched = true;
        }
      }
    }
    if (!matched) {
      const label = read.selectors.join(", ");
      entry.components.set(`css:${label}|${read.file}|${read.line}`, { component: `(css) ${label}`, file: read.file, line: read.line });
    }
  }

  for (const read of sourceReads) {
    if (!tokens.has(read.token)) {
      undefinedRefs.push({ name: read.token, file: read.file, line: read.line });
      continue;
    }
    noteReach(read.token);
    const entry = byToken.get(read.token);
    if (read.enclosing && (!knownComponents || knownComponents.has(read.enclosing))) {
      const key = `${read.enclosing}|${read.file}|${read.line}`;
      entry.components.set(key, { component: read.enclosing, file: read.file, line: read.line, via: read.via });
    }
  }

  for (const read of directReads) {
    if (!tokens.has(read.token)) continue;
    noteReach(read.token);
    byToken.get(read.token).stories.add(read.story);
  }

  for (const [component, stories] of componentToStories) {
    for (const entry of byToken.values()) {
      if ([...entry.components.values()].some((c) => c.component === component)) {
        for (const s of stories) entry.stories.add(s);
      }
    }
  }

  const tokenList = [...tokens.values()]
    .map((t) => {
      const entry = byToken.get(t.name);
      return {
        name: t.name,
        group: t.group,
        kind: t.kind,
        value: t.value,
        resolvedValue: t.resolvedValue,
        aliasOf: t.aliasOf,
        readBy: {
          components: [...entry.components.values()].sort((a, b) => a.component.localeCompare(b.component) || a.file.localeCompare(b.file) || a.line - b.line),
          stories: [...entry.stories].sort(),
        },
        unused: !reached.has(t.name),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const unusedTokens = tokenList.filter((t) => t.unused).map((t) => t.name);
  const dedupedUndefined = [...new Map(undefinedRefs.map((r) => [`${r.name}|${r.file}|${r.line}`, r])).values()].sort(
    (a, b) => a.name.localeCompare(b.name) || a.file.localeCompare(b.file) || a.line - b.line,
  );
  const dedupedLiterals = literals.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);

  return {
    tokens: tokenList,
    unusedTokens,
    hardcodedLiterals: dedupedLiterals,
    undefinedCustomProperties: dedupedUndefined,
    summary: {
      tokenCount: tokenList.length,
      unusedCount: unusedTokens.length,
      hardcodedLiteralCount: dedupedLiterals.length,
      undefinedCount: dedupedUndefined.length,
    },
  };
}

export function renderMarkdown(map) {
  const lines = [
    "# Token usage map",
    "",
    "Generated by `scripts/token-map.mjs`. Do not edit by hand; run `pnpm token-map`.",
    "",
    `${map.summary.tokenCount} tokens, ${map.summary.unusedCount} unused, ${map.summary.hardcodedLiteralCount} hard-coded literals, ${map.summary.undefinedCount} undefined custom properties referenced.`,
    "",
    "## Tokens",
    "",
    "| Token | Group | Kind | Value | Resolves to | Read by | Stories |",
    "| --- | --- | --- | --- | --- | --- | --- |",
  ];
  for (const t of map.tokens) {
    const readBy = t.readBy.components.length
      ? [...new Set(t.readBy.components.map((c) => c.component))].join(", ")
      : t.unused
        ? "_unused_"
        : "_(not attributed to a component)_";
    const stories = t.readBy.stories.length ? t.readBy.stories.join("<br>") : "";
    lines.push(`| \`${t.name}\` | ${t.group} | ${t.kind} | \`${t.value}\` | ${t.aliasOf ? `\`${t.resolvedValue}\`` : "-"} | ${readBy} | ${stories} |`);
  }

  lines.push("", "## Unused tokens", "");
  if (map.unusedTokens.length) for (const name of map.unusedTokens) lines.push(`- \`${name}\``);
  else lines.push("None.");

  lines.push("", "## Hard-coded literals that match or should be a token", "");
  if (map.hardcodedLiterals.length) {
    lines.push("| File | Line | Property | Value | Category | Matching token |", "| --- | --- | --- | --- | --- | --- |");
    for (const l of map.hardcodedLiterals) {
      lines.push(`| ${l.file} | ${l.line} | \`${l.property}\` | \`${l.value}\` | ${l.category} | ${l.matchingToken ? `\`${l.matchingToken}\`` : "-"} |`);
    }
  } else lines.push("None.");

  lines.push("", "## Custom properties referenced but not defined", "");
  if (map.undefinedCustomProperties.length) {
    lines.push("| Name | File | Line |", "| --- | --- | --- |");
    for (const u of map.undefinedCustomProperties) lines.push(`| \`${u.name}\` | ${u.file} | ${u.line} |`);
  } else lines.push("None.");

  lines.push("");
  return lines.join("\n");
}
