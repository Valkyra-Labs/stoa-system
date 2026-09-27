// The dev-server endpoints in server/tokenServer.ts. The playground only
// ever runs against its own dev server, so there is no base URL to config-
// ure and no error handling beyond reporting what came back.

export type CommandResult = { ok: boolean; command: string; output: string };

export type BuildResult = {
  /** Commit the repository was on when the build ran. */
  commit: string;
  /** Whether the working tree had uncommitted changes at that moment. */
  dirty: boolean;
  build: CommandResult;
  test: CommandResult;
  /** The built tokens.css, empty when the build itself failed. */
  css: string;
};

export type SaveResult = { path: string; commit: string; dirty: boolean };

async function post<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`${url}: ${response.status} ${text.slice(0, 400)}`);
  return JSON.parse(text) as T;
}

/** Build and test the given token files in a temporary directory, with the
 * real packages/tokens build. */
export function requestBuild(files: Record<string, string>): Promise<BuildResult> {
  return post<BuildResult>("/api/build", { files });
}

/** Write a snapshot of the current token files and overrides. */
export function saveSnapshot(payload: {
  name: string;
  files: Record<string, string>;
  overrides: Record<string, string>;
}): Promise<SaveResult> {
  return post<SaveResult>("/api/save", payload);
}

export async function readCommit(): Promise<{ commit: string; dirty: boolean }> {
  const response = await fetch("/api/commit");
  if (!response.ok) throw new Error(`/api/commit: ${response.status}`);
  return (await response.json()) as { commit: string; dirty: boolean };
}
