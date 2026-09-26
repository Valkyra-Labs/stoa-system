// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { StatusBadge, Tabs, TextField } from "./index";

describe("StatusBadge", () => {
  it("carries a symbol and a word, not only a colour", () => {
    render(<StatusBadge tone="negative">Loses x = 0</StatusBadge>);
    const badge = screen.getByText(/Loses x = 0/);
    expect(badge.textContent).toContain("✗");
    expect(badge.className).toContain("stoa-badge--negative");
  });
});

describe("TextField", () => {
  it("submits on Enter", () => {
    const onEnter = vi.fn();
    render(<TextField label="Next line" value="x = 3" onChange={() => {}} onEnter={onEnter} dir="ltr" />);
    const input = screen.getByLabelText("Next line");
    expect(input.getAttribute("dir")).toBe("ltr");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onEnter).toHaveBeenCalledOnce();
  });
});

describe("Tabs", () => {
  it("moves between tabs with the arrow keys", () => {
    render(
      <Tabs
        label="Sections"
        items={[
          { id: "a", label: "Check", content: <p>check panel</p> },
          { id: "b", label: "Examples", content: <p>examples panel</p> },
        ]}
      />,
    );
    const first = screen.getByRole("tab", { name: "Check" });
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Examples" }).getAttribute("aria-selected")).toBe("true");
  });
});
