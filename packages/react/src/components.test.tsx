// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ChoiceGroup, Disclosure, I18nProvider, NumberField, Select, TimeSlider, Toggle, TradeTable } from "./index";

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

describe("NumberField", () => {
  it("commits a typed number on Enter and steps with the arrow keys", () => {
    const onChange = vi.fn();
    render(<NumberField label="row-height in px" hideLabel unit="px" value={22} minValue={0} step={1} onChange={onChange} />);
    const input = screen.getByRole("textbox", { name: "row-height in px" });
    expect((input as HTMLInputElement).value).toBe("22");
    fireEvent.change(input, { target: { value: "30" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenLastCalledWith(30);
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(screen.getByText("px").getAttribute("aria-hidden")).toBe("true");
  });

  it("takes digits typed in Latin under a locale that writes Arabic-Indic digits, and shows them in the locale's", () => {
    const onChange = vi.fn();
    render(
      <I18nProvider locale="ar-u-nu-arab">
        <NumberField label="x" value={1} onChange={onChange} />
      </I18nProvider>,
    );
    const input = screen.getByRole("textbox", { name: "x" }) as HTMLInputElement;
    expect(input.value).toBe("١");
    fireEvent.change(input, { target: { value: "500" } });
    expect(input.value).toBe("٥٠٠");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenLastCalledWith(500);
    // A decimal point typed as "." is the locale's decimal separator.
    fireEvent.change(input, { target: { value: "2.5" } });
    expect(input.value).toBe("٢٫٥");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenLastCalledWith(2.5);
    // Arabic-Indic digits are taken as they are, and letters still are not.
    fireEvent.change(input, { target: { value: "٧" } });
    expect(input.value).toBe("٧");
    fireEvent.change(input, { target: { value: "7a" } });
    expect(input.value).toBe("٧");
  });

  it("rounds a typed value to the step by default, as React Aria does", () => {
    const onChange = vi.fn();
    render(<NumberField label="amount" value={20000} minValue={0} step={10000} onChange={onChange} />);
    const input = screen.getByRole("textbox", { name: "amount" });
    fireEvent.change(input, { target: { value: "500" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it("keeps a typed value with keepTypedValue, clamped to the range, while the arrow keys still step", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <NumberField label="amount" value={0} minValue={0} maxValue={50000} step={10000} keepTypedValue onChange={onChange} />,
    );
    const input = screen.getByRole("textbox", { name: "amount" }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "500" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenLastCalledWith(500);
    rerender(<NumberField label="amount" value={500} minValue={0} maxValue={50000} step={10000} keepTypedValue onChange={onChange} />);
    expect(input.value).toBe("500");
    // Off the step is not an error: the step is the arrow keys' stride.
    expect(input.getAttribute("aria-invalid")).toBeNull();
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onChange).toHaveBeenLastCalledWith(10000);
    fireEvent.change(input, { target: { value: "90000" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenLastCalledWith(50000);
  });

  it("reports nothing for an emptied field", () => {
    const onChange = vi.fn();
    render(<NumberField label="gap" value={4} onChange={onChange} />);
    const input = screen.getByRole("textbox", { name: "gap" });
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.blur(input);
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("TimeSlider without its output", () => {
  it("still announces the value, with no visible output", () => {
    const { container } = render(
      <TimeSlider label="Gap" min={0} max={16} step={1} value={4} onChange={() => {}} format={(v) => `${v}px`} showOutput={false} />,
    );
    expect(container.querySelector(".stoa-slider__output")).toBeNull();
    expect(screen.getByRole("slider").getAttribute("aria-valuetext")).toBe("4px");
  });
});

describe("Toggle", () => {
  it("is a pressed button while its setting is on, and reports the change", () => {
    const onChange = vi.fn();
    render(
      <Toggle isSelected={false} onChange={onChange}>
        Reduced motion
      </Toggle>,
    );
    const button = screen.getByRole("button", { name: "Reduced motion" });
    expect(button.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(button);
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
