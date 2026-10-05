// Local server for the owner's blind coding page. Serves the page and
// data.json, and saves answers to ../analysis/owner-coding.json.
// Usage: node server.mjs [data.json] [port] [answers.json]
import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { readFileSync, writeFileSync, renameSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const dataPath = process.argv[2] ?? new URL("data.json", import.meta.url).pathname;
const port = Number(process.argv[3] ?? 5178);
const answersPath = process.argv[4] ?? process.env.ANSWERS ?? new URL("../analysis/owner-coding.json", import.meta.url).pathname;
const reportPath = process.argv[5] ?? new URL("render-report.json", import.meta.url).pathname;
const load = () => (existsSync(answersPath) ? JSON.parse(readFileSync(answersPath, "utf8")) : {});
const checkJs = fileURLToPath(new URL("render-dist/check/check.js", import.meta.url));

// Only this machine's own pages may use the server. The Host must be the
// loopback address and port it listens on, which a DNS-rebound name is not;
// a request sent by another site carries its Origin or a cross-site
// Sec-Fetch-Site, and is refused before any route runs.
const ownHosts = new Set([`127.0.0.1:${port}`, `localhost:${port}`]);
const crossSite = (req) => {
  if (!ownHosts.has(req.headers.host ?? "")) return "host";
  const origin = req.headers.origin;
  if (origin !== undefined && !ownHosts.has(origin.replace(/^http:\/\//, ""))) return "origin";
  if (req.headers["sec-fetch-site"] === "cross-site") return "sec-fetch-site";
  return null;
};

// A snapshot evaluates model output, so it runs in a separate process under
// Node's permission model (reading only the bundle and the data file), with
// the same time and memory limits as check-render.mjs.
const snapshot = (id) =>
  new Promise((resolve) => {
    const script = `const { snapshotHtml } = await import(${JSON.stringify(checkJs)});
      const d = JSON.parse((await import("node:fs")).readFileSync(${JSON.stringify(dataPath)}, "utf8"));
      const item = [...d.items, ...(d.examples ?? [])].find((x) => x.id === ${JSON.stringify(id)});
      if (!item?.js) { process.exitCode = 3; } else { process.stdout.write(snapshotHtml(item.js)); }`;
    execFile(
      "node",
      ["--max-old-space-size=256", "--stack-size=2000", "--permission", `--allow-fs-read=${checkJs}`, `--allow-fs-read=${dataPath}`, "--input-type=module", "-e", script],
      { encoding: "utf8", timeout: 15000, maxBuffer: 16 * 1024 * 1024 },
      (err, stdout, stderr) => resolve(err ? { code: err.code === 3 ? 404 : 500, body: err.code === 3 ? "no such screen" : String(stderr || err.message).slice(0, 2000) } : { code: 200, body: stdout }),
    );
  });

createServer((req, res) => {
  const send = (code, type, body) => { res.writeHead(code, { "content-type": type, "cache-control": "no-store" }); res.end(body); };
  const refused = crossSite(req);
  if (refused) return send(403, "text/plain", `refused: ${refused}`);
  if (req.method === "GET" && req.url === "/") return send(200, "text/html; charset=utf-8", readFileSync(new URL("index.html", import.meta.url)));
  // The sandboxed renderer (built by start.mjs into render-dist/).
  if (req.method === "GET" && (req.url === "/render/" || req.url === "/render/index.html"))
    return send(200, "text/html; charset=utf-8", readFileSync(new URL("render-dist/index.html", import.meta.url)));
  if (req.method === "GET" && req.url === "/render/render.iife.js")
    return send(200, "text/javascript; charset=utf-8", readFileSync(new URL("render-dist/render.iife.js", import.meta.url)));
  if (req.method === "GET" && req.url === "/render-report.json")
    return send(200, "application/json", existsSync(reportPath) ? readFileSync(reportPath) : "{}");
  // Server-rendered snapshot of one screen (built by check-render.mjs), for
  // visual checks where a sandboxed frame cannot be captured.
  const snap = req.method === "GET" && req.url.match(/^\/snapshot\/([a-z0-9-]{2,40})$/);
  if (snap) {
    return snapshot(snap[1]).then(({ code, body }) => send(code, code === 200 ? "text/html; charset=utf-8" : "text/plain", body));
  }
  if (req.method === "GET" && req.url === "/data.json") return send(200, "application/json", readFileSync(dataPath));
  if (req.method === "GET" && req.url === "/answers") return send(200, "application/json", JSON.stringify(load()));
  if (req.method === "POST" && req.url === "/answers") {
    let body = "";
    req.on("data", (d) => { body += d; if (body.length > 1e6) req.destroy(); });
    req.on("end", () => {
      try {
        const { id, answer } = JSON.parse(body);
        if (!/^[a-z0-9]{2,12}$/.test(id)) return send(400, "text/plain", "bad id");
        const all = load();
        all[id] = { ...answer, saved: new Date().toISOString() };
        writeFileSync(answersPath + ".tmp", JSON.stringify(all, null, 1));
        renameSync(answersPath + ".tmp", answersPath);
        send(200, "application/json", JSON.stringify({ ok: true, n: Object.keys(all).length }));
      } catch (e) { send(400, "text/plain", String(e)); }
    });
    return;
  }
  send(404, "text/plain", "not found");
}).listen(port, "127.0.0.1", () => console.log(`coding page: http://127.0.0.1:${port}  answers -> ${answersPath}`));
