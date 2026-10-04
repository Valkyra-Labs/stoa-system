import { useEffect, useId, useRef, type ReactNode } from "react";
import { useStoaFormat } from "./locale";

export type PageShellProps = {
  /** The bar at the top, usually an AppHeader (the banner landmark). */
  header?: ReactNode;
  /** The page's content, inside its one main landmark. */
  children: ReactNode;
  /** Small print at the bottom: sources, terms (the contentinfo landmark). */
  footer?: ReactNode;
  /** "fixed" (the default) keeps the header at the top of the window: the
   * shell is the window's height and the region under the header scrolls,
   * so the scrollbar starts below the header and its lane is reserved.
   * "static" lets the header scroll away with the page. */
  headerPosition?: "fixed" | "static";
};

const SCROLL_KEYS = new Set(["PageDown", "PageUp", " ", "Home", "End", "ArrowDown", "ArrowUp"]);

/** The frame of an application page: a skip link, the header, the main
 * region and an optional footer, as landmarks. The skip link is the first
 * Tab stop, hidden until focused; it moves focus to the main region, past
 * the header's controls, and from there the keyboard scrolls the page.
 * Gutters come from the space tokens; logical properties only, so it
 * mirrors in a right-to-left page. */
export function PageShell({ header, children, footer, headerPosition = "fixed" }: PageShellProps) {
  const { messages } = useStoaFormat();
  const id = useId();
  const main = useRef<HTMLElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const fixed = headerPosition === "fixed";
  useEffect(() => {
    if (!fixed) return;
    // The page scrolls in the region under the header, not the document, and
    // a browser sends a scroll key pressed with nothing focused to the
    // document. Focusing the region first lets the browser's own scrolling
    // run on it: the same keys, distances and smoothness as a page.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
      if (!SCROLL_KEYS.has(event.key)) return;
      const active = document.activeElement;
      if (active && active !== document.body && active !== document.documentElement) return;
      scroll.current?.focus({ preventScroll: true });
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [fixed]);
  return (
    <div className={`stoa-page-shell${fixed ? " stoa-page-shell--fixed-header" : ""}`}>
      <a
        className="stoa-skip-link"
        href={`#${id}`}
        onClick={(e) => {
          // Focus the target directly: a fragment link moves focus only in
          // some browsers, and would change the URL of a routed page.
          e.preventDefault();
          main.current?.focus();
        }}
      >
        {messages.skipToMain}
      </a>
      {header}
      {/* Focusable from script only, for the scroll keys; never a Tab stop. */}
      <div ref={scroll} className="stoa-page-shell__scroll" tabIndex={fixed ? -1 : undefined}>
        <main ref={main} id={id} tabIndex={-1} className="stoa-page-shell__main">
          {children}
        </main>
        {footer && <footer className="stoa-page-shell__footer">{footer}</footer>}
      </div>
    </div>
  );
}
