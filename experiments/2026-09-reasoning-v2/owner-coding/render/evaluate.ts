// Evaluates one generated screen (CommonJS from prepare.mjs) against the
// vocabulary shim, leniently: the file is shown as written, not as a
// bundler would reject it.
import React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import * as shim from "./shim";

const VOCAB = Object.keys(shim).filter((k) => /^[A-Z]/.test(k) && k !== "Unknown");
const HOOKS = ["useState", "useEffect", "useMemo", "useRef", "useCallback", "useReducer", "useLayoutEffect"];
const cache = new Map<string, React.FC>();
const unknown = (name: string): React.FC => {
  if (!cache.has(name)) cache.set(name, (p: any) => React.createElement(shim.Unknown, { ...p, __name: name }));
  return cache.get(name)!;
};
// Names imported from the vocabulary module always resolve: vocabulary
// components, React exports some files import from it (useState), and a
// labelled box for anything else.
const stoa = new Proxy(shim as any, {
  get: (t, k: string) =>
    k in t ? t[k] : k === "__esModule" ? true : k === "default" ? t : k in React ? (React as any)[k] : /^[A-Z]/.test(k) ? unknown(k) : undefined,
});
const other = (spec: string) =>
  new Proxy({}, { get: (_, k: string) => (k === "__esModule" ? true : /^[A-Z]/.test(String(k)) ? unknown(`${spec}.${String(k)}`) : undefined) });
const requireFn = (spec: string) =>
  spec === "react" ? React : spec.startsWith("react/jsx") ? jsxRuntime : spec === "@stoa/react" ? stoa : other(spec);

/** Returns the page component, or throws with a readable message. */
export function evaluate(js: string): React.ComponentType {
  // Components used in JSX but never imported or declared are supplied as
  // labelled boxes, like the vocabulary names a file forgot to import.
  const used = new Set([...js.matchAll(/\.jsxs?\)\(([A-Z]\w*)/g)].map((m) => m[1]));
  const declared = new Set([...js.matchAll(/(?:function|class|const|let|var)\s+([A-Z]\w*)/g)].map((m) => m[1]));
  const extra = [...used].filter((n) => !VOCAB.includes(n) && !declared.has(n));
  const module = { exports: {} as any };
  // Globals live in the outer function; the file runs in an inner one, so
  // its own declarations shadow them instead of colliding.
  const params = ["require", "module", "exports", "React", ...HOOKS, ...VOCAB, ...extra];
  const fn = new Function(...params, `return (function () {\n${js}\n})();`);
  fn(requireFn, module, module.exports, React, ...HOOKS.map((h) => (React as any)[h]), ...VOCAB.map((n) => (shim as any)[n]), ...extra.map(unknown));
  const ex = module.exports;
  const Screen = ex.default ?? Object.values(ex).find((v) => typeof v === "function");
  if (!Screen) throw new Error("the file exports no page component");
  return Screen as React.ComponentType;
}
