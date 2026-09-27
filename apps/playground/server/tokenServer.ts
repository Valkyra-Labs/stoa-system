// The playground's dev-server endpoints. Editing tokens in the browser is
// a guess until the real build agrees, so the server runs the real
// packages/tokens build and its tests on the edited files, in a temporary
// directory, and never touches the working tree except to write snapshots.
//
// Development only (`apply: "serve"`): it runs repository commands and must
// not exist in a built bundle.
import { execFile } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import type { Plugin } from "vite";

const execFileAsync = promisify(execFile);

/** The only files the client may write into the temporary token package. */
const TOKEN_FILES = ["primitive.json", "semantic.light.json", "semantic.dark.json", "density.json"];

/** Cap on a request body: the four token files are a few kilobytes. */
const MAX_BODY = 1 << 20;

type CommandResult = { ok: boolean; command: string; output: string };

function findRepoRoot(from: string): string {
  let dir = path.resolve(from);
  while (!existsSync(path.join(dir, "pnpm-workspace.yaml"))) {
    const up = path.dirname(dir);
    if (up === dir) throw new Error(`no pnpm-workspace.yaml above ${from}`);
    dir = up;
  }
  return dir;
}

async function run(command: string, cwd: string): Promise<CommandResult> {
  try {
    const { stdout, stderr } = await execFileAsync("sh", ["-c", command], { cwd, maxBuffer: 1 << 24 });
    return { ok: true, command, output: `${stdout}${stderr}` };
  } catch (cause) {
    const failure = cause as { stdout?: string; stderr?: string; message?: string };
    const output = `${failure.stdout ?? ""}${failure.stderr ?? ""}`;
    return { ok: false, command, output: output || failure.message || "the command failed" };
  }
}

async function readBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = chunk as Buffer;
    size += buffer.length;
    if (size > MAX_BODY) throw new Error("request body too large");
    chunks.push(buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
}

function send(response: ServerResponse, status: number, body: unknown): void {
  const text = JSON.stringify(body);
  response.statusCode = status;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.setHeader("cache-control", "no-store");
  response.end(text);
}

async function repositoryState(repoRoot: string): Promise<{ commit: string; dirty: boolean }> {
  const commit = await run("git rev-parse HEAD", repoRoot);
  const status = await run("git status --porcelain", repoRoot);
  return { commit: commit.output.trim() || "unknown", dirty: status.output.trim() !== "" };
}

/** The files as sent by the client, with the file names checked. */
function tokenFilesFrom(body: unknown): Record<string, string> {
  const files = (body as { files?: unknown }).files;
  if (typeof files !== "object" || files === null) throw new Error("no token files in the request");
  const out: Record<string, string> = {};
  for (const [name, text] of Object.entries(files as Record<string, unknown>)) {
    if (!TOKEN_FILES.includes(name)) throw new Error(`unexpected token file: ${name}`);
    if (typeof text !== "string") throw new Error(`token file ${name} is not text`);
    JSON.parse(text);
    out[name] = text;
  }
  for (const name of TOKEN_FILES) {
    if (!(name in out)) throw new Error(`token file ${name} is missing`);
  }
  return out;
}

/** Build and test the given token files with the real packages/tokens
 * scripts, in a temporary copy of the package. */
async function buildInTemp(repoRoot: string, files: Record<string, string>) {
  const tokensPackage = path.join(repoRoot, "packages", "tokens");
  const manifest = JSON.parse(await readFile(path.join(tokensPackage, "package.json"), "utf8")) as {
    scripts: Record<string, string>;
  };
  const buildCommand = manifest.scripts.build;
  const testCommand = manifest.scripts.test;
  if (!buildCommand || !testCommand) throw new Error("packages/tokens has no build or test script");

  const dir = await mkdtemp(path.join(tmpdir(), "stoa-playground-"));
  try {
    await mkdir(path.join(dir, "tokens"), { recursive: true });
    for (const [name, text] of Object.entries(files)) {
      await writeFile(path.join(dir, "tokens", name), text);
    }
    await cp(path.join(tokensPackage, "scripts"), path.join(dir, "scripts"), { recursive: true });
    // style-dictionary and culori come from the real package rather than a
    // second install, so the build here is the build there.
    await symlink(path.join(tokensPackage, "node_modules"), path.join(dir, "node_modules"), "dir");

    const build = await run(buildCommand, dir);
    const test = build.ok
      ? await run(testCommand, dir)
      : { ok: false, command: testCommand, output: "not run: the build failed" };
    const css = build.ok ? await readFile(path.join(dir, "dist", "tokens.css"), "utf8").catch(() => "") : "";
    return { build, test, css };
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "snapshot";

export function tokenServer(): Plugin {
  let repoRoot = "";
  let appRoot = "";

  return {
    name: "stoa-playground-token-server",
    apply: "serve",
    configResolved(config) {
      appRoot = config.root;
      repoRoot = findRepoRoot(config.root);
    },
    configureServer(server) {
      server.middlewares.use((request: IncomingMessage, response: ServerResponse, next: () => void) => {
        const url = (request.url ?? "").split("?")[0];
        if (url !== "/api/build" && url !== "/api/save" && url !== "/api/commit") {
          next();
          return;
        }

        void (async () => {
          try {
            if (url === "/api/commit") {
              send(response, 200, await repositoryState(repoRoot));
              return;
            }
            if (request.method !== "POST") {
              send(response, 405, { error: "POST only" });
              return;
            }
            const body = await readBody(request);
            const files = tokenFilesFrom(body);
            const state = await repositoryState(repoRoot);

            if (url === "/api/build") {
              const result = await buildInTemp(repoRoot, files);
              send(response, 200, { ...state, ...result });
              return;
            }

            const { name, overrides } = body as { name?: unknown; overrides?: unknown };
            const snapshot = {
              name: typeof name === "string" && name.trim() !== "" ? name.trim() : "snapshot",
              savedAt: new Date().toISOString(),
              commit: state.commit,
              dirty: state.dirty,
              base: "Stoa today: the token files of packages/tokens at this commit",
              overrides: (overrides ?? {}) as Record<string, string>,
              tokens: Object.fromEntries(Object.entries(files).map(([file, text]) => [file, JSON.parse(text)])),
            };
            const file = path.join(appRoot, "snapshots", `${slugify(snapshot.name)}.json`);
            await mkdir(path.dirname(file), { recursive: true });
            await writeFile(file, `${JSON.stringify(snapshot, null, 2)}\n`);
            send(response, 200, { path: path.relative(repoRoot, file), commit: state.commit, dirty: state.dirty });
          } catch (cause) {
            send(response, 400, { error: cause instanceof Error ? cause.message : String(cause) });
          }
        })();
      });
    },
  };
}
