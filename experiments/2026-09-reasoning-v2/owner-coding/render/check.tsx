// Headless check of the renderer: evaluates every sampled screen and
// example the same way main.tsx does and renders it to a string.
import React from "react";
import { renderToString } from "react-dom/server";
import { evaluate } from "./evaluate";

export function check(items: { id: string; js: string | null }[]) {
  return items.map(({ id, js }) => {
    if (!js) return { id, status: "no-js" };
    try {
      const html = renderToString(React.createElement(evaluate(js)));
      const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      return { id, status: "ok", chars: text.length, unknown: (html.match(/not in the vocabulary/g) ?? []).length, sample: text.slice(0, 160) };
    } catch (e: any) {
      return { id, status: "error", message: String(e?.message ?? e).slice(0, 160) };
    }
  });
}

import { css } from "./styles";
/** Static HTML of one screen, for visual checks outside the sandbox. */
export function snapshotHtml(js: string): string {
  const body = renderToString(React.createElement(evaluate(js)));
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body><div id="root">${body}</div></body></html>`;
}
