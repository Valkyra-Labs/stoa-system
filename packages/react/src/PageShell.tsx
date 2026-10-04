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
/** How far a page key moves, as a share of the region's height, and how
 * far an arrow key moves, in pixels: close to what browsers do for a page. */
const PAGE_FRACTION = 0.875;
const LINE = 40;

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
    // document, which cannot scroll. So the region scrolls itself by the
    // distances a page would, once every listener has seen the key: an
    // application's own shortcut (Space to play) claims it by preventing
    // the default, and focus never moves.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
      if (!SCROLL_KEYS.has(event.key)) return;
      const active = document.activeElement;
      if (active && active !== document.body && active !== document.documentElement) return;
      setTimeout(() => {
        const region = scroll.current;
        if (event.defaultPrevented || !region) return;
        const page = region.clientHeight * PAGE_FRACTION;
        const back = event.key === "PageUp" || event.key === "ArrowUp" || (event.key === " " && event.shiftKey);
        const by =
          event.key === "Home"
            ? -region.scrollTop
            : event.key === "End"
              ? region.scrollHeight
              : (event.key.startsWith("Arrow") ? LINE : page) * (back ? -1 : 1);
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        region.scrollBy({ top: by, behavior: reduce ? "auto" : "smooth" });
      });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
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
      <div ref={scroll} className="stoa-page-shell__scroll">
        <main ref={main} id={id} tabIndex={-1} className="stoa-page-shell__main">
          {children}
        </main>
        {footer && <footer className="stoa-page-shell__footer">{footer}</footer>}
      </div>
    </div>
  );
}
