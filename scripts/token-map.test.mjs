import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildTokenMap } from "./token-map/lib.mjs";

// A small fixture tree covering: a CSS var read, an inline style var read,
// a canvas read (through readCanvasTokens's getPropertyValue alias, one hop
// of call-graph propagation to its caller), a semantic alias to a primitive,
// and a token that nothing reads.
const tokensCssText = `
:root {
  --stoa-color-neutral-500: #888888;
  --stoa-color-text: var(--stoa-color-neutral-500);
  --stoa-space-2: 8px;
  --stoa-space-unused: 99px;
  --stoa-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
}
`;

const cssFiles = [
  {
    path: "packages/react/src/styles.css",
    content: `
.fx-panel {
  color: var(--stoa-color-text);
  padding: var(--stoa-space-2);
  transition: color 200ms cubic-bezier(0.2, 0, 0, 1);
}
`,
  },
];

const sourceFiles = [
  {
    path: "packages/react/src/Panel.tsx",
    content: `
export function Panel({ children }) {
  return <section className="fx-panel">{children}</section>;
}
`,
  },
  {
    path: "packages/react/src/Badge.tsx",
    content: `
export function Badge() {
  return <span style={{ color: "var(--stoa-color-text)" }}>x</span>;
}
`,
  },
  {
    path: "packages/react/src/tokens.ts",
    content: `
export function readCanvasTokens(el) {
  const s = getComputedStyle(el);
  const v = (n) => s.getPropertyValue(n).trim();
  return { text: v("--stoa-color-text") };
}
`,
  },
  {
    path: "packages/react/src/Ladder.tsx",
    content: `
import { readCanvasTokens } from "./tokens";
export function Ladder() {
  const t = readCanvasTokens(document.body);
  return null;
}
`,
  },
];

const knownComponents = new Set(["Panel", "Badge", "Ladder"]);

function map() {
  return buildTokenMap({ tokensCssText, cssFiles, sourceFiles, storyFiles: [], knownComponents });
}

function tokenNamed(m, name) {
  const t = m.tokens.find((t) => t.name === name);
  assert.ok(t, `expected a token named ${name}`);
  return t;
}

describe("token-map", () => {
  it("resolves a semantic alias to its primitive value, showing both", () => {
    const text = tokenNamed(map(), "--stoa-color-text");
    assert.equal(text.kind, "semantic");
    assert.equal(text.aliasOf, "--stoa-color-neutral-500");
    assert.equal(text.resolvedValue, "#888888");
  });

  it("attributes a CSS var() read to the component owning the class", () => {
    const text = tokenNamed(map(), "--stoa-color-text");
    assert.ok(text.readBy.components.some((c) => c.component === "Panel" && c.file === "packages/react/src/styles.css"));
    const space = tokenNamed(map(), "--stoa-space-2");
    assert.ok(space.readBy.components.some((c) => c.component === "Panel"));
  });

  it("attributes an inline style var() read to its component", () => {
    const text = tokenNamed(map(), "--stoa-color-text");
    assert.ok(text.readBy.components.some((c) => c.component === "Badge" && c.file === "packages/react/src/Badge.tsx"));
  });

  it("propagates a canvas read through readCanvasTokens to its caller", () => {
    const text = tokenNamed(map(), "--stoa-color-text");
    assert.ok(text.readBy.components.some((c) => c.component === "Ladder" && c.via === "readCanvasTokens"));
  });

  it("marks a token nothing reads as unused, without flagging its reached primitive", () => {
    const m = map();
    // --stoa-motion-easing-standard is unused too: styles.css hard-codes its
    // value (see the next test) instead of reading it with var().
    assert.deepEqual(m.unusedTokens, ["--stoa-motion-easing-standard", "--stoa-space-unused"]);
    assert.equal(tokenNamed(m, "--stoa-color-neutral-500").unused, false);
    assert.equal(tokenNamed(m, "--stoa-color-text").unused, false);
  });

  it("flags a hard-coded easing literal that matches a token", () => {
    const m = map();
    const easing = m.hardcodedLiterals.find((l) => l.category === "easing");
    assert.ok(easing);
    assert.equal(easing.matchingToken, "--stoa-motion-easing-standard");
    const duration = m.hardcodedLiterals.find((l) => l.category === "duration");
    assert.ok(duration, "a hard-coded duration with no matching token is still reported");
    assert.equal(duration.matchingToken, null);
  });

  it("reports a var() reference to an undefined custom property", () => {
    const m = buildTokenMap({
      tokensCssText,
      cssFiles: [{ path: "packages/react/src/styles.css", content: `.fx-panel { color: var(--stoa-color-missing); }` }],
      sourceFiles: [],
      storyFiles: [],
      knownComponents,
    });
    assert.ok(m.undefinedCustomProperties.some((u) => u.name === "--stoa-color-missing"));
  });
});
