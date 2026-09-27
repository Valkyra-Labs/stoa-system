// The font engine, off the main thread. The HarfBuzz WASM is about 175 KB
// gzipped and shaping every digit four ways plus every feature twice is
// enough work to drop a frame, so the whole engine runs here and the panel
// only ever receives a report.
//
// The listener is added with `addEventListener` rather than by assigning
// `self.onmessage`. HarfBuzz initialises its WASM with a top-level await, so
// this module finishes evaluating in a later task, and a module worker whose
// only handler is an `onmessage` assigned after that await receives nothing
// at all in Chromium 141, while a listener added this way receives
// everything. Measured on this project against the playground's dev server.
import { inspectFont } from "./engine.ts";
import type { InspectRequest, InspectResponse } from "./protocol.ts";

const reply = (message: InspectResponse) => {
  self.postMessage(message);
};

self.addEventListener("message", (event: MessageEvent<InspectRequest>) => {
  const { id, bytes } = event.data;
  void inspectFont(bytes).then(
    (report) => reply({ id, ok: true, report }),
    // A file that cannot be read is reported as a refusal with its reason;
    // the panel shows it instead of showing measurements of nothing.
    (cause: unknown) => reply({ id, ok: false, error: cause instanceof Error ? cause.message : String(cause) }),
  );
});
