// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { AppHeader, PageShell, ScrollArea } from "./index";

afterEach(cleanup);

// jsdom applies no stylesheet; the rules themselves are the contract.
const css = readFileSync(join(import.meta.dirname, "styles.css"), "utf8");

describe("scrollbars", () => {
  it("draws every scrollbar thin, in the scrollbar tokens, on every box at zero specificity", () => {
    expect(css).toContain(
      ":where(:root), :where(:root) * {\n  scrollbar-color: var(--stoa-color-scrollbar-thumb) var(--stoa-color-scrollbar-track);\n  scrollbar-width: thin;\n}",
    );
    // No component sets a scrollbar of its own.
    expect(css.match(/scrollbar-(color|width):/g)).toHaveLength(2);
  });
});

describe("ScrollArea", () => {
  it("is a named, focusable region when it has a label", () => {
    render(
      <ScrollArea label="Event log">
        <p>Line</p>
      </ScrollArea>,
    );
    const region = screen.getByRole("region", { name: "Event log" });
    expect(region.getAttribute("tabindex")).toBe("0");
    expect(region.className).toBe("stoa-scroll-area");
  });

  it("is a plain box without one, and takes a sizing class", () => {
    const { container } = render(
      <ScrollArea className="app-list">
        <button type="button">Item</button>
      </ScrollArea>,
    );
    const box = container.firstElementChild!;
    expect(box.getAttribute("role")).toBeNull();
    expect(box.hasAttribute("tabindex")).toBe(false);
    expect(box.className).toBe("stoa-scroll-area app-list");
  });

  it("reserves the scrollbar's lane", () => {
    expect(css).toMatch(/\.stoa-scroll-area \{[^}]*overflow: auto; scrollbar-gutter: stable;/);
  });
});

describe("PageShell header position", () => {
  it("keeps the header out of the scrolling region by default, with main and the footer inside it", () => {
    const { container } = render(
      <PageShell header={<AppHeader title="Horkos Bonds" />} footer="Sources">
        <p>Content</p>
      </PageShell>,
    );
    const shell = container.firstElementChild!;
    expect(shell.className).toBe("stoa-page-shell stoa-page-shell--fixed-header");
    const scroll = shell.querySelector(":scope > .stoa-page-shell__scroll")!;
    expect(scroll.contains(screen.getByRole("banner"))).toBe(false);
    expect(scroll.contains(screen.getByRole("main"))).toBe(true);
    expect(scroll.contains(screen.getByRole("contentinfo"))).toBe(true);
  });

  it("lets the header scroll away when it is static", () => {
    const { container } = render(
      <PageShell header={<AppHeader title="Horkos Bonds" />} headerPosition="static">
        <p>Content</p>
      </PageShell>,
    );
    expect(container.firstElementChild!.className).toBe("stoa-page-shell");
  });

  it("is the window's height with a fixed header, and scrolls under it in a reserved lane", () => {
    expect(css).toContain(".stoa-page-shell--fixed-header { block-size: 100dvh; min-block-size: 0; }");
    expect(css).toContain(
      ".stoa-page-shell--fixed-header > .stoa-page-shell__scroll { overflow-y: auto; scrollbar-gutter: stable; }",
    );
  });
});
