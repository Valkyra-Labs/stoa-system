// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChoiceGroup, TimeSlider, TradeTable } from "./index";

describe("TradeTable", () => {
  it("states the side in words, not only in colour", () => {
    render(
      <TradeTable
        caption="Trades"
        trades={[
          { id: "1", time: "10:00:00.000", side: "buy", price: 99.1, size: 100 },
          { id: "2", time: "10:00:01.000", side: "sell", price: 99.05, size: 1200 },
        ]}
      />,
    );
    expect(screen.getByText("Buy").className).toBe("stoa-up");
    expect(screen.getByText("Sell").className).toBe("stoa-down");
    expect(screen.getByText("1,200")).toBeTruthy();
  });
});

describe("ChoiceGroup", () => {
  it("marks exactly the chosen option as pressed", () => {
    render(
      <ChoiceGroup
        label="Speed"
        choices={[{ id: 1, label: "1x" }, { id: 10, label: "10x" }]}
        value={10}
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole("radio", { name: "10x" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("radio", { name: "1x" }).getAttribute("aria-checked")).toBe("false");
  });
});

describe("TimeSlider", () => {
  it("announces the formatted time, not the raw number", () => {
    render(<TimeSlider label="Time" min={0} max={100} step={1} value={42} onChange={() => {}} format={(v) => `t=${v}`} />);
    const input = screen.getByRole("slider");
    expect(input.getAttribute("aria-valuetext")).toBe("t=42");
  });
});
