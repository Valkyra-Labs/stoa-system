// Two-turn generations against llama.cpp server, one model at a time,
// one slot, prompt cache off, every option recorded. Turn 1 asks for a
// plan in the condition's terms; turn 2 asks for the file.
// Usage: node llama.mjs <plan.json> <outdir>
import { spawn, execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync } from "node:fs";
import { homedir } from "node:os";

const [planPath, out] = process.argv.slice(2);
const plan = JSON.parse(readFileSync(planPath, "utf8"));
const here = new URL("../", import.meta.url);
const PORT = plan.port ?? 8089;
const URL_ = `http://127.0.0.1:${PORT}`;
mkdirSync(out, { recursive: true });

const read = (p) => readFileSync(new URL(p, here), "utf8").trim();
const vocabulary = read("conditions/vocabulary.md");
const extra = { components: null, generic: "conditions/generic.md", rules: "conditions/rules.md", reasoning: "conditions/reasoning.md" };
const system = (c) => (extra[c] ? `${vocabulary}\n\n${read(extra[c])}` : vocabulary);
const PLAN = {
  components: "describe what the screen is for and how it is laid out",
  generic: "state the main goal of the screen and how its layout supports it",
  rules: "state which of the rules shape this screen most, and how",
  reasoning: "give your short answers to steps 1 to 5",
};
const planPrompt = (c) => `Before any code, ${PLAN[c]}, in under 150 words. Do not write code yet.`;
const OUTPUT = 'Now write the file: one TSX file with a single default-exported page component. Import only from "@stoa/react" and use only the components and plain elements the context allows. Put realistic placeholder data inline. Reply with the file in a single ```tsx code block and nothing else.';

// Model name -> GGUF blob that ollama already holds.
function blob(model) {
  const [name, tag] = model.split(":");
  const m = JSON.parse(readFileSync(`${homedir()}/.ollama/models/manifests/registry.ollama.ai/library/${name}/${tag}`, "utf8"));
  const digest = m.layers.find((l) => l.mediaType.endsWith(".model")).digest;
  return { digest, path: `${homedir()}/.ollama/models/blobs/${digest.replace(":", "-")}` };
}
const build = execFileSync("llama-server", ["--version"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] })
  .match(/version: (.*)/)?.[1];

async function chat(messages, run) {
  const body = {
    messages, seed: run.seed, cache_prompt: false,
    ...plan.options,
    chat_template_kwargs: { enable_thinking: run.think ?? false },
  };
  const t0 = Date.now();
  const r = await (await fetch(`${URL_}/v1/chat/completions`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body),
  })).json();
  const c = r.choices?.[0];
  return { text: c?.message?.content ?? "", finish: c?.finish_reason, prompt: r.usage?.prompt_tokens,
    completion: r.usage?.completion_tokens, ms: Date.now() - t0, error: r.error ?? null };
}

async function waitHealthy(server) {
  let exited = null;
  server.on("exit", (code) => { exited = code; });
  for (let i = 0; i < 600; i++) {
    if (exited !== null) throw new Error(`llama-server exited with code ${exited} before becoming healthy`);
    try { if ((await fetch(`${URL_}/health`)).ok) return; } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("llama-server did not become healthy");
}

const byModel = new Map();
for (const run of plan.runs) (byModel.get(run.model) ?? byModel.set(run.model, []).get(run.model)).push(run);

for (const model of plan.modelOrder ?? [...byModel.keys()]) {
  const runs = byModel.get(model).filter((r) => !existsSync(`${out}/${r.id}.tsx`));
  if (!runs.length) continue;
  const { digest, path } = blob(model);
  const server = spawn("llama-server", ["-m", path, "-np", "1", "-c", String(plan.ctx ?? 8192), "--jinja",
    "-ngl", "99", "--host", "127.0.0.1", "--port", String(PORT)], { stdio: ["ignore", "ignore", "pipe"] });
  let log = "";
  server.stderr.on("data", (d) => { log = (log + d).slice(-4000); });
  try {
    await waitHealthy(server).catch((e) => { throw new Error(`${model}: ${e.message}\n${log.split("\n").filter((l) => / E /.test(l)).slice(0, 3).join("\n")}`); });
    for (const run of runs) {
      const messages = [
        { role: "system", content: system(run.condition) },
        { role: "user", content: `Task: ${plan.tasks[run.task]}\n\n${planPrompt(run.condition)}` },
      ];
      const t1 = await chat(messages, run);
      messages.push({ role: "assistant", content: t1.text }, { role: "user", content: OUTPUT });
      const t2 = await chat(messages, run);
      const m = t2.text.match(/```(?:tsx|jsx|typescript|ts)?\s*\n([\s\S]*?)```/);
      writeFileSync(`${out}/${run.id}.plan.txt`, t1.text);
      writeFileSync(`${out}/${run.id}.raw.txt`, t2.text);
      writeFileSync(`${out}/${run.id}.tsx`, m ? m[1] : t2.text);
      const rec = { ...run, engine: "llama.cpp", build, digest, options: plan.options, ctx: plan.ctx ?? 8192,
        plan_turn: { finish: t1.finish, prompt: t1.prompt, completion: t1.completion, ms: t1.ms, error: t1.error },
        file_turn: { finish: t2.finish, prompt: t2.prompt, completion: t2.completion, ms: t2.ms, error: t2.error },
        fenced: !!m };
      appendFileSync(`${out}/records.jsonl`, JSON.stringify(rec) + "\n");
      console.log(run.id, model, run.condition, run.task, t1.completion, t2.completion, t2.finish, t1.ms + t2.ms);
    }
  } finally {
    server.kill();
  }
}
