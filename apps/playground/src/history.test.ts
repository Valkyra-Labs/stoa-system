import { describe, expect, it } from "vitest";
import { canRedo, canUndo, clearAll, clearOverride, commit, emptyHistory, redo, setOverride, undo } from "./history";

describe("the override history", () => {
  it("steps back and forward through edits", () => {
    let history = setOverride(emptyHistory(), "primitive:color.teal.600", "oklch(0.5 0.2 160)");
    history = setOverride(history, "primitive:color.red.600", "oklch(0.5 0.2 20)");
    expect(Object.keys(history.present)).toHaveLength(2);

    history = undo(history);
    expect(history.present).toEqual({ "primitive:color.teal.600": "oklch(0.5 0.2 160)" });
    expect(canRedo(history)).toBe(true);

    history = redo(history);
    expect(Object.keys(history.present)).toHaveLength(2);
    expect(canRedo(history)).toBe(false);
  });

  it("does not record an edit that changes nothing", () => {
    const first = setOverride(emptyHistory(), "primitive:radius.md", "6px");
    const again = setOverride(first, "primitive:radius.md", "6px");
    expect(again).toBe(first);
    expect(again.past).toHaveLength(1);
  });

  it("drops the future when a new edit follows an undo", () => {
    let history = setOverride(emptyHistory(), "primitive:radius.md", "6px");
    history = undo(history);
    history = setOverride(history, "primitive:radius.lg", "10px");
    expect(canRedo(history)).toBe(false);
    expect(history.present).toEqual({ "primitive:radius.lg": "10px" });
  });

  it("resets one override and all of them, each as one step back", () => {
    let history = setOverride(emptyHistory(), "primitive:radius.md", "6px");
    history = setOverride(history, "primitive:radius.lg", "10px");
    history = clearOverride(history, "primitive:radius.md");
    expect(history.present).toEqual({ "primitive:radius.lg": "10px" });

    history = clearAll(history);
    expect(history.present).toEqual({});
    expect(undo(history).present).toEqual({ "primitive:radius.lg": "10px" });
  });

  it("has nothing to undo or redo when empty", () => {
    const history = emptyHistory();
    expect(canUndo(history)).toBe(false);
    expect(undo(history)).toBe(history);
    expect(redo(history)).toBe(history);
    expect(commit(history, {})).toBe(history);
    expect(clearAll(history)).toBe(history);
  });
});
