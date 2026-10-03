// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

afterEach(cleanup);
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

  it("keeps its own description and adds an extra one when given", () => {
    render(
      <>
        <p id="field-notes">Read by two checks</p>
        <TextField label="Colour" value="red" onChange={() => {}} description="--stoa-color-text" aria-describedby="field-notes" />
      </>,
    );
    const ids = screen.getByLabelText("Colour").getAttribute("aria-describedby")?.split(" ") ?? [];
    expect(ids).toContain("field-notes");
    expect(ids.map((id) => document.getElementById(id)?.textContent)).toContain("--stoa-color-text");
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

  it("keeps inactive panels mounted and inert with keepMounted, so their state survives", () => {
    let mounts = 0;
    const Counted = () => {
      React.useEffect(() => {
        mounts += 1;
      }, []);
      return <p>examples panel</p>;
    };
    render(
      <Tabs
        label="Sections"
        keepMounted
        items={[
          { id: "a", label: "Check", content: <p>check panel</p> },
          { id: "b", label: "Examples", content: <Counted /> },
        ]}
      />,
    );
    // The inactive panel is in the document but inert, so it is neither
    // shown nor reachable.
    const hidden = screen.getByText("examples panel").closest(".stoa-tabs__panel");
    expect(hidden?.hasAttribute("inert")).toBe(true);
    const tab = screen.getByRole("tab", { name: "Examples" });
    fireEvent.mouseDown(tab);
    fireEvent.click(tab);
    fireEvent.keyDown(screen.getByRole("tab", { name: "Check" }), { key: "ArrowRight" });
    expect(mounts).toBe(1);
  });

  it("unmounts inactive panels by default", () => {
    render(
      <Tabs
        label="Sections"
        items={[
          { id: "a", label: "Check", content: <p>check panel</p> },
          { id: "b", label: "Examples", content: <p>examples panel</p> },
        ]}
      />,
    );
    expect(screen.queryByText("examples panel")).toBeNull();
  });
});
