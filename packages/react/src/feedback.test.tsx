// @vitest-environment jsdom
// The feedback and layout components; the toasts have their own file.
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import {
  I18nProvider,
  LiveRegion,
  ProgressBar,
  Skeleton,
  SkeletonBlock,
  SkeletonLines,
  VisuallyHidden,
} from "./index";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const ARABIC = "ar-u-nu-arab";

/** Arabic words and digits, in a right-to-left container. */
function Arabic({ children }: { children: ReactNode }) {
  return (
    <I18nProvider locale={ARABIC}>
      <div dir="rtl">{children}</div>
    </I18nProvider>
  );
}

/** Presses a React Aria button from the keyboard. */
function pressKey(element: HTMLElement, key: string) {
  act(() => element.focus());
  fireEvent.keyDown(element, { key });
  fireEvent.keyUp(element, { key });
}

describe("LiveRegion", () => {
  it("is a polite status by default and an alert when assertive, hidden unless asked to show", () => {
    render(<LiveRegion>Saved</LiveRegion>);
    const status = screen.getByRole("status");
    expect(status.getAttribute("aria-live")).toBe("polite");
    expect(status.getAttribute("aria-atomic")).toBe("true");
    expect(status.className).toBe("stoa-visually-hidden");
    expect(status.textContent).toBe("Saved");
    cleanup();
    render(
      <LiveRegion politeness="assertive" visible>
        Connection lost
      </LiveRegion>,
    );
    const alert = screen.getByRole("alert");
    expect(alert.getAttribute("aria-live")).toBe("assertive");
    expect(alert.className).toBe("stoa-live-region");
  });

  it("is in the document empty before its first text, so that text is announced", () => {
    // The first commit renders an empty region; the effect fills it. Read
    // the DOM from a ref callback, which runs at commit before effects.
    let atCommit: string | null = null;
    render(
      <div ref={(node) => { atCommit ??= node?.querySelector("[role='status']")?.textContent ?? null; }}>
        <LiveRegion>Ready</LiveRegion>
      </div>,
    );
    expect(atCommit).toBe("");
    expect(screen.getByRole("status").textContent).toBe("Ready");
  });

  it("follows fast changes at most every announceEvery ms, and ends on the latest text", () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "performance"] });
    const { rerender } = render(<LiveRegion announceEvery={1000}>1 order</LiveRegion>);
    const region = screen.getByRole("status");
    expect(region.textContent).toBe("1 order");
    rerender(<LiveRegion announceEvery={1000}>2 orders</LiveRegion>);
    act(() => vi.advanceTimersByTime(300));
    rerender(<LiveRegion announceEvery={1000}>3 orders</LiveRegion>);
    act(() => vi.advanceTimersByTime(300));
    expect(region.textContent).toBe("1 order");
    act(() => vi.advanceTimersByTime(400));
    expect(region.textContent).toBe("3 orders");
  });
});

describe("VisuallyHidden", () => {
  it("keeps its text for assistive technology, over Stoa's hidden class", () => {
    render(
      <button type="button">
        ×<VisuallyHidden id="close-word">Close</VisuallyHidden>
      </button>,
    );
    expect(screen.getByRole("button", { name: "×Close" })).toBeTruthy();
    const hidden = document.getElementById("close-word")!;
    expect(hidden.tagName).toBe("SPAN");
    expect(hidden.className).toBe("stoa-visually-hidden");
  });
});

describe("Skeleton", () => {
  it("hides its shapes from assistive technology and announces one loading label", () => {
    const { container } = render(
      <Skeleton label="Loading trades">
        <SkeletonBlock blockSize="var(--stoa-space-12)" />
        <SkeletonLines count={4} />
      </Skeleton>,
    );
    const statuses = screen.getAllByRole("status");
    expect(statuses).toHaveLength(1);
    expect(statuses[0]!.textContent).toBe("Loading trades");
    expect(statuses[0]!.getAttribute("aria-live")).toBe("polite");
    const shapes = container.querySelector(".stoa-skeleton__shapes")!;
    expect(shapes.getAttribute("aria-hidden")).toBe("true");
    expect(shapes.querySelectorAll(".stoa-skeleton__line")).toHaveLength(4);
    expect((shapes.querySelector(".stoa-skeleton__block") as HTMLElement).style.blockSize).toBe("var(--stoa-space-12)");
  });

  it("draws three lines and says the locale's loading word by default", () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelectorAll(".stoa-skeleton__line")).toHaveLength(3);
    expect(screen.getByRole("status").textContent).toBe("Loading…");
    cleanup();
    render(
      <Arabic>
        <Skeleton />
      </Arabic>,
    );
    expect(screen.getByRole("status").textContent).toBe("جارٍ التحميل…");
  });
});

describe("ProgressBar", () => {
  it("is a progressbar named by its label, with a percentage shown and announced", () => {
    const { container } = render(<ProgressBar label="Loading AAPL" value={45} />);
    const bar = screen.getByRole("progressbar", { name: "Loading AAPL" });
    expect(bar.getAttribute("aria-valuenow")).toBe("45");
    expect(bar.getAttribute("aria-valuemax")).toBe("100");
    expect(bar.getAttribute("aria-valuetext")).toBe("45%");
    expect(container.querySelector(".stoa-progress__value")?.textContent).toBe("45%");
    expect((container.querySelector(".stoa-progress__fill") as HTMLElement).style.inlineSize).toBe("45%");
  });

  it("reads an amount out of a total when it formats the value", () => {
    const mb = (bytes: number) => `${(bytes / 1e6).toFixed(1)} MB`;
    render(<ProgressBar label="Loading AAPL" value={1.2e6} maxValue={4.8e6} formatValue={mb} />);
    const bar = screen.getByRole("progressbar", { name: "Loading AAPL" });
    // Each amount is isolated (FSI ... PDI), so it keeps its own direction
    // inside a sentence of the other direction.
    expect(bar.getAttribute("aria-valuetext")).toBe("⁨1.2 MB⁩ of ⁨4.8 MB⁩");
    expect(screen.getByText("⁨1.2 MB⁩ of ⁨4.8 MB⁩")).toBeTruthy();
  });

  it("has no value while indeterminate, and the bar moves only through the motion tokens", () => {
    const { container } = render(<ProgressBar label="Starting the engine" isIndeterminate />);
    const bar = screen.getByRole("progressbar", { name: "Starting the engine" });
    expect(bar.hasAttribute("aria-valuenow")).toBe(false);
    expect(bar.hasAttribute("aria-valuetext")).toBe(false);
    expect(container.querySelector(".stoa-progress__value")).toBeNull();
    expect(bar.className).toContain("stoa-progress--indeterminate");
    expect((container.querySelector(".stoa-progress__fill") as HTMLElement).style.inlineSize).toBe("");
  });

  it("writes the value in the locale's words and digits", () => {
    render(
      <Arabic>
        <ProgressBar label="تحميل" value={45} />
        <ProgressBar label="تنزيل" value={3} maxValue={8} formatValue={(n) => `${n}`} />
      </Arabic>,
    );
    expect(screen.getByRole("progressbar", { name: "تحميل" }).getAttribute("aria-valuetext")).toBe(
      // Arabic-Indic digits and percent sign; ICU closes it with an Arabic
      // letter mark, so the expectation comes from Intl too.
      new Intl.NumberFormat(ARABIC, { style: "percent" }).format(0.45),
    );
    expect(new Intl.NumberFormat(ARABIC, { style: "percent" }).format(0.45)).toMatch(/^٤٥٪/);
    expect(screen.getByRole("progressbar", { name: "تنزيل" }).getAttribute("aria-valuetext")).toBe("⁨3⁩ من ⁨8⁩");
  });
});
