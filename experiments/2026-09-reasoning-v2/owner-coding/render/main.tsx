// Sandboxed renderer for one generated screen. The coding page posts the
// screen's CommonJS code into this iframe (sandbox="allow-scripts", no
// same-origin), which evaluates it against the vocabulary shim.
import React from "react";
import { createRoot } from "react-dom/client";
import { evaluate } from "./evaluate";
import { css } from "./styles";

class Boundary extends React.Component<{ children: React.ReactNode }, { error: string | null }> {
  state = { error: null as string | null };
  static getDerivedStateFromError(e: any) { return { error: String(e?.message ?? e) }; }
  componentDidCatch(e: any) { parent.postMessage({ type: "render-error", message: String(e?.message ?? e) }, "*"); }
  render() {
    return this.state.error
      ? <div className="s-crash"><b>This screen fails at runtime:</b> {this.state.error}<div className="s-sub">Code it from the wireframe or the code view, as written.</div></div>
      : this.props.children;
  }
}

const style = document.createElement("style");
style.textContent = css;
document.head.append(style);
const root = createRoot(document.getElementById("root")!);

window.addEventListener("message", (ev) => {
  const { type, js } = ev.data ?? {};
  if (type !== "render") return;
  let Screen: any = null, error: string | null = null;
  try { Screen = evaluate(js); } catch (e: any) { error = String(e?.message ?? e); }
  setTimeout(() => parent.postMessage({ type: "render-done", error, chars: document.body.innerText.trim().length }, "*"), 400);
  root.render(
    error
      ? <div className="s-crash"><b>This screen cannot be evaluated:</b> {error}<div className="s-sub">Code it from the wireframe or the code view, as written.</div></div>
      : <Boundary key={Math.random()}><Screen /></Boundary>,
  );
});
parent.postMessage({ type: "render-ready" }, "*");
