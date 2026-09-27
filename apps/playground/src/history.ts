// The override layer with undo and redo. Every edit replaces the whole
// override map, so a step back is one map back: the base is never touched.
import type { Overrides } from "./tokenModel";

export type History = {
  past: Overrides[];
  present: Overrides;
  future: Overrides[];
};

export const emptyHistory = (): History => ({ past: [], present: {}, future: [] });

function same(a: Overrides, b: Overrides): boolean {
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every((k) => a[k] === b[k]);
}

/** Record a new override map. An edit that changes nothing is not a step. */
export function commit(history: History, next: Overrides): History {
  if (same(history.present, next)) return history;
  return { past: [...history.past, history.present], present: next, future: [] };
}

export const canUndo = (history: History) => history.past.length > 0;
export const canRedo = (history: History) => history.future.length > 0;

export function undo(history: History): History {
  const previous = history.past[history.past.length - 1];
  if (previous === undefined) return history;
  return { past: history.past.slice(0, -1), present: previous, future: [history.present, ...history.future] };
}

export function redo(history: History): History {
  const [next, ...rest] = history.future;
  if (next === undefined) return history;
  return { past: [...history.past, history.present], present: next, future: rest };
}

export function setOverride(history: History, id: string, value: string): History {
  return commit(history, { ...history.present, [id]: value });
}

export function clearOverride(history: History, id: string): History {
  const next = { ...history.present };
  delete next[id];
  return commit(history, next);
}

export function clearAll(history: History): History {
  return commit(history, {});
}
