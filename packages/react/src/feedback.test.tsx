// @vitest-environment jsdom
// The feedback and layout components; the toasts have their own file.
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import {
  I18nProvider,
  LiveRegion,
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
