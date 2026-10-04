import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Button } from "./Controls";
import { useStoaFormat } from "./locale";

/** How long the result of a copy stays on screen, in ms. */
const COPY_STATUS_MS = 4000;

type FrameProps = {
  label: string;
  /** The text the Copy button copies. */
  text: string;
  copyable: boolean;
  maxLines: number;
  className: string;
  style?: CSSProperties;
  children: ReactNode;
};

/** The frame LogView and CodeView share: a label, the Copy button and its
 * polite status, and a scroll area that keyboard users can focus and
 * scroll. The scroll area is a region named by the label. */
function Frame({ label, text, copyable, maxLines, className, style, children }: FrameProps) {
  const { messages } = useStoaFormat();
  const labelId = useId();
  const [status, setStatus] = useState<"copied" | "failed" | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      // No clipboard (an insecure page, a denied permission): say so.
      setStatus("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(null), COPY_STATUS_MS);
  };

  return (
    <div className={`stoa-code ${className}`.trim()}>
      <div className="stoa-code__bar">
        <span id={labelId} className="stoa-code__label">
          {label}
        </span>
        <span role="status" className="stoa-code__status">
          {status === "copied" ? messages.copied : status === "failed" ? messages.copyFailed : ""}
        </span>
        {copyable && (
          <Button className="stoa-code__copy" aria-describedby={labelId} onPress={copy}>
            {messages.copy}
          </Button>
        )}
      </div>
      <pre
        className="stoa-code__scroll"
        role="region"
        aria-labelledby={labelId}
        tabIndex={0}
        dir="ltr"
        style={{ ...style, "--code-lines": maxLines } as CSSProperties}
      >
        {children}
      </pre>
    </div>
  );
}

/** A log line: plain text, or its parts. A message given as `text` is
 * isolated (`bdi`) and takes the direction of its own first letter, so an
 * Arabic message reads right to left, its punctuation in place, while the
 * time and level before it stay at the left. */
export type LogLine = string | { time?: string; level?: string; text: string };

const lineText = (line: LogLine) => (typeof line === "string" ? line : [line.time, line.level, line.text].filter(Boolean).join(" "));

export type LogViewProps = {
  /** Names the log, visibly and for assistive technology. */
  label: string;
  /** One entry per line, oldest first. */
  lines: LogLine[];
  /** A Copy button for the whole log. On by default. */
  copyable?: boolean;
  /** Lines shown before the log scrolls. 12 by default. */
  maxLines?: number;
};

/** Log lines in the monospace face, left to right even in a right-to-left
 * page. A plain line is laid out left to right as a whole; give a line its
 * parts (LogLine) to isolate a message that may be in another script. */
export function LogView({ label, lines, copyable = true, maxLines = 12 }: LogViewProps) {
  return (
    <Frame label={label} text={lines.map(lineText).join("\n")} copyable={copyable} maxLines={maxLines} className="stoa-code--log">
      {lines.map((line, i) => (
        <span key={i} className="stoa-code__line">
          {typeof line === "string" ? (
            line
          ) : (
            <>
              {line.time && <span className="stoa-code__time">{line.time} </span>}
              {line.level && <span className="stoa-code__level">{line.level} </span>}
              <bdi>{line.text}</bdi>
            </>
          )}
          {i < lines.length - 1 && "\n"}
        </span>
      ))}
    </Frame>
  );
}

export type CodeViewProps = {
  /** Names the code, visibly and for assistive technology. */
  label: string;
  code: string;
  /** Line numbers before each line, hidden from assistive technology and
   * left out of a copy. */
  lineNumbers?: boolean;
  /** A Copy button for the code. On by default. */
  copyable?: boolean;
  /** Lines shown before the code scrolls. 20 by default. */
  maxLines?: number;
};

/** Code in the monospace face, always left to right. */
export function CodeView({ label, code, lineNumbers = false, copyable = true, maxLines = 20 }: CodeViewProps) {
  const lines = code.split("\n");
  const digits = String(lines.length).length;
  return (
    <Frame
      label={label}
      text={code}
      copyable={copyable}
      maxLines={maxLines}
      className={lineNumbers ? "stoa-code--numbered" : ""}
      style={{ "--code-digits": digits } as CSSProperties}
    >
      <code>
        {lines.map((line, i) => (
          <span key={i} className="stoa-code__line">
            {lineNumbers && (
              <span className="stoa-code__number" aria-hidden="true">
                {i + 1}
              </span>
            )}
            {line}
            {i < lines.length - 1 && "\n"}
          </span>
        ))}
      </code>
    </Frame>
  );
}
