// @vitest-environment jsdom
// Button, Panel and StatBar, and the empty states of the data views.
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Button, Heatmap, I18nProvider, Ladder, Panel, StatBar, TradeTable } from "./index";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Button", () => {
  it("is a button that calls onPress, in the variant it was given", () => {
    const onPress = vi.fn();
    render(
      <Button variant="primary" onPress={onPress}>
        Send
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Send" });
    expect(button.className).toContain("stoa-button--primary");
    fireEvent.click(button);
    expect(onPress).toHaveBeenCalledOnce();
  });

  it("does not call onPress while disabled, and says it is disabled", () => {
    const onPress = vi.fn();
    render(
      <Button onPress={onPress} isDisabled>
        Undo
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Undo" });
    expect(button.hasAttribute("disabled")).toBe(true);
    fireEvent.click(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe("Panel", () => {
  it("is a region named by its heading", () => {
    render(
      <Panel title="Order book">
        <p>levels</p>
      </Panel>,
    );
    const region = screen.getByRole("region", { name: "Order book" });
    expect(region.querySelector("h2")?.textContent).toBe("Order book");
    expect(region.textContent).toContain("levels");
  });
});

describe("StatBar", () => {
  it("lists each value under its term, as one named description list", () => {
    const { container } = render(
      <StatBar
        label="Counters"
        items={[
          { label: "frames/s", value: "60" },
          { label: "frame p95", value: "16.9 ms" },
        ]}
      />,
    );
    const list = container.querySelector("dl")!;
    expect(list.getAttribute("aria-label")).toBe("Counters");
    expect([...list.querySelectorAll("dt")].map((dt) => dt.textContent)).toEqual(["frames/s", "frame p95"]);
    expect([...list.querySelectorAll("dd")].map((dd) => dd.textContent)).toEqual(["60", "16.9 ms"]);
  });
});

describe("empty states", () => {
  it("a trades table with no trades says so in one row, in the locale's words", () => {
    render(<TradeTable caption="Trades" trades={[]} />);
    expect(screen.getByRole("cell", { name: "No trades yet." }).getAttribute("colspan")).toBe("4");
    cleanup();
    render(
      <I18nProvider locale="ar-u-nu-arab">
        <TradeTable caption="Trades" trades={[]} />
      </I18nProvider>,
    );
    expect(screen.getByRole("cell", { name: "لا صفقات بعد." })).toBeTruthy();
  });

  it("a caller's own empty text replaces the default", () => {
    render(<TradeTable caption="Trades" trades={[]} emptyText="Waiting for the open." />);
    expect(screen.getByRole("cell", { name: "Waiting for the open." })).toBeTruthy();
  });

  it("a heatmap with nothing to draw says so to assistive technology", () => {
    // jsdom has no canvas; the drawing calls go to a context that keeps
    // nothing, so the test is about the text alternative only.
    const context = new Proxy({ measureText: () => ({ width: 0 }) } as Record<string, unknown>, {
      get: (target, key) => (key in target ? target[key as string] : () => {}),
      set: () => true,
    });
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context as unknown as CanvasRenderingContext2D);
    const { container } = render(<Heatmap label="Liquidity" description="Bids below, asks above." data={null} />);
    expect(container.querySelector("figcaption")?.textContent).toBe("No liquidity to show.");
  });
});

describe("canvas views reserve their height before they draw", () => {
  it("sizes the heatmap and the ladder from their props, not the canvas default", () => {
    const { container } = render(
      <>
        <Heatmap label="Liquidity" height={180} />
        <Ladder label="Book" depth={12} />
      </>,
    );
    const [heatmap, ladder] = [...container.querySelectorAll("canvas")];
    expect(heatmap!.style.blockSize).toBe("180px");
    expect(ladder!.style.blockSize).toBe("calc(var(--stoa-density-row-height, 28px) * 24)");
  });
});
