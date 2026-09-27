// What the current tokens actually do: the real packages/tokens build and
// its tests, run by the dev server on the values in the panel, plus a
// comparison between the values the previews are using and the values the
// build emitted. A disagreement means the previews are lying and is shown
// as a failure, not a warning.
import { useState } from "react";
import { Button, StatusBadge } from "@valkyra-labs/stoa-react";
import { requestBuild, type BuildResult } from "./api";
import { compareVariables, variablesFromCss, type Disagreement } from "./builtCss";
import { runBrowserChecks } from "./browserChecks";
import type { DensityMode, ResolvedTokens, Theme } from "./tokenModel";

export type VerificationProps = {
  tokens: Record<Theme, ResolvedTokens>;
  density: DensityMode;
  /** The current token files as text, exactly as they would be written. */
  files: Record<string, string>;
};

type Agreement = Record<Theme, Disagreement[]>;

const THEMES: Theme[] = ["light", "dark"];
/** Disagreements listed before the rest are counted only. */
const SHOWN = 8;

export function Verification({ tokens, density, files }: VerificationProps) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<BuildResult | null>(null);
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const browser = runBrowserChecks(tokens);

  const run = async () => {
    setBusy(true);
    setError(null);
    try {
      const built = await requestBuild(files);
      setResult(built);
      setAgreement(
        built.css
          ? {
              light: compareVariables(tokens.light.variables, variablesFromCss(built.css, "light", density)),
              dark: compareVariables(tokens.dark.variables, variablesFromCss(built.css, "dark", density)),
            }
          : null,
      );
    } catch (cause) {
      setResult(null);
      setAgreement(null);
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(false);
    }
  };

  const disagreements = agreement ? THEMES.flatMap((theme) => agreement[theme]) : [];

  return (
    <div className="pg-verify">
      <div className="pg-row pg-row--between">
        <Button variant="primary" onPress={run} isDisabled={busy}>
          {busy ? "Building..." : "Build and test"}
        </Button>
        {result && (
          <span className="pg-verify__commit">
            commit <code>{result.commit.slice(0, 7)}</code>
            {result.dirty ? " (working tree dirty)" : ""}
          </span>
        )}
      </div>

      {error && <p className="pg-verify__error" role="alert">{error}</p>}

      {result && (
        <dl className="pg-verify__results" data-testid="build-results">
          <dt>Build</dt>
          <dd data-testid="build-status">
            <StatusBadge tone={result.build.ok ? "positive" : "negative"}>
              {result.build.ok ? "passed" : "failed"}
            </StatusBadge>
            <code>{result.build.command}</code>
          </dd>
          <dt>Tests</dt>
          <dd data-testid="test-status">
            <StatusBadge tone={result.test.ok ? "positive" : "negative"}>
              {result.test.ok ? "passed" : "failed"}
            </StatusBadge>
            <code>{result.test.command}</code>
          </dd>
          <dt>Preview against built CSS</dt>
          <dd data-testid="agreement-status">
            {agreement === null ? (
              <StatusBadge tone="neutral">no CSS to compare</StatusBadge>
            ) : (
              <StatusBadge tone={disagreements.length === 0 ? "positive" : "negative"}>
                {disagreements.length === 0
                  ? `agrees on ${Object.keys(tokens.light.variables).length} variables per theme`
                  : `${disagreements.length} variable(s) disagree`}
              </StatusBadge>
            )}
          </dd>
        </dl>
      )}

      {disagreements.length > 0 && (
        <table className="stoa-table">
          <caption className="stoa-visually-hidden">Variables where the preview and the built CSS differ</caption>
          <thead>
            <tr>
              <th scope="col">Variable</th>
              <th scope="col">Preview</th>
              <th scope="col">Built</th>
            </tr>
          </thead>
          <tbody>
            {disagreements.slice(0, SHOWN).map((row) => (
              <tr key={`${row.variable}-${row.built}`}>
                <td>
                  <code>{row.variable}</code>
                </td>
                <td>
                  <code>{row.live}</code>
                </td>
                <td>
                  <code>{row.built}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {result && (
        <>
          <h3 className="pg-group__title">Test output</h3>
          <pre className="pg-output" data-testid="test-output">
            {result.test.output.trim() || "(no output)"}
          </pre>
          {!result.build.ok && (
            <>
              <h3 className="pg-group__title">Build output</h3>
              <pre className="pg-output">{result.build.output.trim() || "(no output)"}</pre>
            </>
          )}
        </>
      )}

      <h3 className="pg-group__title">In-browser checks</h3>
      {browser.available ? (
        <ul className="pg-checks">
          {browser.checks.map((check) => (
            <li key={check.name}>
              <StatusBadge tone={check.ok ? "positive" : "negative"}>{check.name}</StatusBadge> {check.detail}
            </li>
          ))}
        </ul>
      ) : (
        <p className="pg-note">{browser.note}</p>
      )}
    </div>
  );
}
