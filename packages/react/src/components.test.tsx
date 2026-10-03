// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ChoiceGroup, Disclosure, Select, TimeSlider, TradeTable } from "./index";

afterEach(cleanup);

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

  it("points its input at an extra description when given one", () => {
    const { container } = render(
      <>
        <p id="time-notes">Market hours only</p>
        <TimeSlider label="Time" min={0} max={100} step={1} value={42} onChange={() => {}} format={(v) => `t=${v}`} aria-describedby="time-notes" />
      </>,
    );
    const input = container.querySelector('input[type="range"]');
    expect(input?.getAttribute("aria-describedby")?.split(" ")).toContain("time-notes");
  });
});

describe("Select", () => {
  const VIEWS = [
    { id: "light-ltr", label: "Light, left to right" },
    { id: "dark-rtl", label: "Dark, right to left" },
  ];

  it("names its button with the chosen option and the label, even when the label is hidden", () => {
    render(<Select label="Frame view" hideLabel options={VIEWS} value="dark-rtl" onChange={() => {}} />);
    const button = screen.getByRole("button");
    const names = (button.getAttribute("aria-labelledby") ?? "").split(" ").map((id) => document.getElementById(id)?.textContent);
    expect(names).toContain("Frame view");
    expect(names).toContain("Dark, right to left");
    expect(screen.getByText("Frame view").className).toBe("stoa-visually-hidden");
  });

  it("reports the option picked from the list", () => {
    const onChange = vi.fn();
    render(<Select label="Frame view" options={VIEWS} value="light-ltr" onChange={onChange} />);
    const button = screen.getByRole("button");
    act(() => button.focus());
    fireEvent.keyDown(button, { key: "ArrowDown" });
    fireEvent.keyUp(button, { key: "ArrowDown" });
    const option = screen.getByRole("option", { name: "Dark, right to left" });
    fireEvent.keyDown(option, { key: "Enter" });
    fireEvent.keyUp(option, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("dark-rtl");
  });
});

describe("Disclosure", () => {
  it("opens from its summary and draws the shared chevron, hidden from assistive technology", () => {
    const { container } = render(
      <Disclosure summary="Text contrast" data-role="body">
        <p>pairs</p>
      </Disclosure>,
    );
    const details = container.querySelector("details")!;
    expect(details.open).toBe(false);
    expect(details.dataset.role).toBe("body");
    const summary = container.querySelector("summary")!;
    expect(summary.textContent).toBe("Text contrast");
    expect(summary.querySelector("svg.stoa-chevron")?.getAttribute("aria-hidden")).toBe("true");
    fireEvent.click(summary);
    expect(details.open).toBe(true);
  });

  it("can start open", () => {
    const { container } = render(
      <Disclosure summary="Target size" defaultOpen>
        <p>rows</p>
      </Disclosure>,
    );
    expect(container.querySelector("details")!.open).toBe(true);
  });
});
