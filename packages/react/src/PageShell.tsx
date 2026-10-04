import { useId, useRef, type ReactNode } from "react";
import { useStoaFormat } from "./locale";

export type PageShellProps = {
  /** The bar at the top, usually an AppHeader (the banner landmark). */
  header?: ReactNode;
  /** The page's content, inside its one main landmark. */
  children: ReactNode;
  /** Small print at the bottom: sources, terms (the contentinfo landmark). */
  footer?: ReactNode;
};

/** The frame of an application page: a skip link, the header, the main
 * region and an optional footer, as landmarks. The skip link is the first
 * Tab stop, hidden until focused; it moves focus to the main region, past
 * the header's controls. Gutters come from the space tokens; logical
 * properties only, so it mirrors in a right-to-left page. */
export function PageShell({ header, children, footer }: PageShellProps) {
  const { messages } = useStoaFormat();
  const id = useId();
  const main = useRef<HTMLElement>(null);
  return (
    <div className="stoa-page-shell">
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
      <main ref={main} id={id} tabIndex={-1} className="stoa-page-shell__main">
        {children}
      </main>
      {footer && <footer className="stoa-page-shell__footer">{footer}</footer>}
    </div>
  );
}
