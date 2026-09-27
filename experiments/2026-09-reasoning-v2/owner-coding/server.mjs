// Local server for the owner's blind coding page. Serves the page and
// data.json, and saves answers to ../analysis/owner-coding.json.
// Usage: node server.mjs [data.json] [port] [answers.json]
import { createServer } from "node:http";
import { readFileSync, writeFileSync, renameSync, existsSync } from "node:fs";

const dataPath = process.argv[2] ?? new URL("data.json", import.meta.url).pathname;
const port = Number(process.argv[3] ?? 5178);
const answersPath = process.argv[4] ?? process.env.ANSWERS ?? new URL("../analysis/owner-coding.json", import.meta.url).pathname;
const load = () => (existsSync(answersPath) ? JSON.parse(readFileSync(answersPath, "utf8")) : {});

createServer((req, res) => {
  const send = (code, type, body) => { res.writeHead(code, { "content-type": type, "cache-control": "no-store" }); res.end(body); };
  if (req.method === "GET" && req.url === "/") return send(200, "text/html; charset=utf-8", readFileSync(new URL("index.html", import.meta.url)));
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
