// Runs generations against a local ollama server with every sampling
// parameter fixed and recorded. One JSON record per generation goes to
// <out>/records.jsonl; the extracted TSX goes to <out>/<id>.tsx.
// Usage: node run.mjs <plan.json> <outdir>
import { readFileSync, writeFileSync, appendFileSync, mkdirSync, existsSync } from "node:fs";

const [planPath, out] = process.argv.slice(2);
const plan = JSON.parse(readFileSync(planPath, "utf8"));
const here = new URL("../", import.meta.url);
const host = plan.host ?? "http://127.0.0.1:11434";
mkdirSync(out, { recursive: true });

const read = (p) => readFileSync(new URL(p, here), "utf8").trim();
const vocabulary = read("conditions/vocabulary.md");
const extra = { components: null, generic: "conditions/generic.md", rules: "conditions/rules.md", reasoning: "conditions/reasoning.md" };
const system = (c) => (extra[c] ? `${vocabulary}\n\n${read(extra[c])}` : vocabulary);
const OUTPUT = 'Output: one TSX file with a single default-exported page component. Import only from "@stoa/react" and use only the components and plain elements the context allows. Put realistic placeholder data inline. Reply with the file in a single ```tsx code block and nothing else.';

const version = (await (await fetch(`${host}/api/version`)).json()).version;
const tags = (await (await fetch(`${host}/api/tags`)).json()).models;
const digest = (m) => tags.find((t) => t.name === m || t.model === m)?.digest ?? null;

for (const run of plan.runs) {
  if (existsSync(`${out}/${run.id}.tsx`)) continue;
  const body = {
    model: run.model,
    stream: false,
    think: run.think,
    messages: [
      { role: "system", content: system(run.condition) },
      { role: "user", content: `Task: ${plan.tasks[run.task]}\n\n${OUTPUT}` },
    ],
    options: { ...plan.options, seed: run.seed },
  };
  const t0 = Date.now();
  const res = await (await fetch(`${host}/api/chat`, { method: "POST", body: JSON.stringify(body) })).json();
  const text = res.message?.content ?? "";
  const m = text.match(/```(?:tsx|jsx|typescript|ts)?\s*\n([\s\S]*?)```/);
  const tsx = m ? m[1] : text;
  writeFileSync(`${out}/${run.id}.tsx`, tsx);
  writeFileSync(`${out}/${run.id}.raw.txt`, text + (res.message?.thinking ? `\n\n<<thinking>>\n${res.message.thinking}` : ""));
  const rec = {
    ...run, ollama: version, digest: digest(run.model), options: body.options,
    done_reason: res.done_reason, prompt_tokens: res.prompt_eval_count, output_tokens: res.eval_count,
    fenced: !!m, wall_ms: Date.now() - t0, error: res.error ?? null,
  };
  appendFileSync(`${out}/records.jsonl`, JSON.stringify(rec) + "\n");
  console.log(run.id, run.model, run.condition, rec.done_reason, rec.prompt_tokens, rec.output_tokens, rec.wall_ms);
}
