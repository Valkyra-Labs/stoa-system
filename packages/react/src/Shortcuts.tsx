// Keyboard shortcuts: Kbd draws keys, useShortcuts runs shortcuts and
// lists them for a help dialog (the dialog itself is not here).
import { Fragment, useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { useStoaFormat, type StoaMessages } from "./locale";

export type KbdProps = {
  /** One key ("K", "Esc"). */
  children?: ReactNode;
  /** A combination, held together, in order ("Ctrl", "K"); the labels
   * `shortcutKeys` returns fit here. Takes the place of `children`. */
  keys?: string[];
};

/** A key, or keys pressed together, as the keyboard prints them. A
 * combination is a `kbd` of `kbd`s, as HTML suggests, and stays left to
 * right in a right-to-left page: key names are printed in Latin letters,
 * in that order. */
export function Kbd({ children, keys }: KbdProps) {
  if (!keys) return <kbd className="stoa-kbd">{children}</kbd>;
  return (
    <kbd className="stoa-kbd-combo" dir="ltr">
      {keys.map((key, index) => (
        <Fragment key={`${index}-${key}`}>
          {index > 0 && <span className="stoa-kbd-combo__plus">+</span>}
          <kbd className="stoa-kbd">{key}</kbd>
        </Fragment>
      ))}
    </kbd>
  );
}

/** "mod" is Command on Apple platforms and Control elsewhere: the modifier
 * of a platform's own shortcuts (Cmd+K, Ctrl+K). */
export type ShortcutModifier = "mod" | "ctrl" | "meta" | "alt" | "shift";

export type Shortcut = {
  /** The key as KeyboardEvent.key names it: "k", "?", "ArrowLeft", " ",
   * "Escape". A Latin letter also matches its physical key on another
   * layout (Arabic, Russian), so "k" works without switching layouts. */
  key: string;
  /** The modifiers held with it. Shift is compared for letters, digits and
   * named keys; a symbol such as "?" already carries whatever Shift it
   * needs on the user's layout, so Shift is checked only when listed. */
  modifiers?: ShortcutModifier[];
  /** What it does, in the help list ("Play or pause"). */
  description: string;
  /** A heading for the help list ("Playback"). */
  group?: string;
  /** Runs on a match; the key's default action is prevented. */
  onTrigger: (event: KeyboardEvent) => void;
  /** Listed, but not run (the control it stands for is disabled). */
  isDisabled?: boolean;
  /** Also run while the focus is in a text field. Off by default, so
   * typing a letter types it. */
  allowInFields?: boolean;
};

/** One line of a help dialog: the keys to draw with Kbd, what they do, and
 * the heading they go under. */
export type ShortcutHelp = {
  keys: string[];
  description: string;
  group?: string;
  isDisabled: boolean;
};

/** Whether this is an Apple platform, where "mod" is Command. */
export function isApplePlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
}

const NAMED_KEYS: Record<string, string> = {
  ArrowLeft: "←",
  ArrowRight: "→",
  ArrowUp: "↑",
  ArrowDown: "↓",
  Escape: "Esc",
};

/** The labels of a shortcut's keys, modifiers first in the platform's
 * order, for Kbd. Only the space bar has a word, from `messages`; the
 * other keys keep the names printed on them. */
export function shortcutKeys(shortcut: Pick<Shortcut, "key" | "modifiers">, apple: boolean, messages: Pick<StoaMessages, "keySpace">): string[] {
  const held = new Set(shortcut.modifiers ?? []);
  const ctrl = held.has("ctrl") || (held.has("mod") && !apple);
  const meta = held.has("meta") || (held.has("mod") && apple);
  const labels = apple
    ? [ctrl && "⌃", held.has("alt") && "⌥", held.has("shift") && "⇧", meta && "⌘"]
    : [ctrl && "Ctrl", held.has("alt") && "Alt", held.has("shift") && "Shift", meta && "Meta"];
  const key = shortcut.key === " " ? messages.keySpace : (NAMED_KEYS[shortcut.key] ?? (shortcut.key.length === 1 ? shortcut.key.toUpperCase() : shortcut.key));
  return [...labels.filter((label): label is string => Boolean(label)), key];
}

/** Whether a key event is this shortcut. */
export function matchesShortcut(event: KeyboardEvent, shortcut: Pick<Shortcut, "key" | "modifiers">, apple: boolean): boolean {
  const held = new Set(shortcut.modifiers ?? []);
  const ctrl = held.has("ctrl") || (held.has("mod") && !apple);
  const meta = held.has("meta") || (held.has("mod") && apple);
  if (event.ctrlKey !== ctrl || event.metaKey !== meta || event.altKey !== held.has("alt")) return false;
  const { key } = shortcut;
  const letter = /^[a-z]$/i.test(key);
  const digit = /^[0-9]$/.test(key);
  const symbol = key.length === 1 && !letter && !digit && key !== " ";
  if (symbol ? held.has("shift") && !event.shiftKey : event.shiftKey !== held.has("shift")) return false;
  if (letter) {
    if (event.key.toLowerCase() === key.toLowerCase()) return true;
    // Another layout: the key typed no Latin letter, so its position names it.
    return !/^[a-z]$/i.test(event.key) && event.code === `Key${key.toUpperCase()}`;
  }
  if (digit) return event.key === key || event.code === `Digit${key}`;
  return event.key === key;
}

const NON_TEXT_INPUTS = new Set(["button", "checkbox", "color", "file", "image", "radio", "range", "reset", "submit"]);

/** Whether a key event lands where it types text: a text input, a text
 * area, a select, or editable content. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return true;
  if (target instanceof HTMLInputElement) return !NON_TEXT_INPUTS.has(target.type);
  return target.closest('[contenteditable]:not([contenteditable="false"])') !== null;
}

/** Runs keyboard shortcuts while the component is mounted, and returns them
 * as help lines for a shortcuts dialog. A key event that a control already
 * handled (its default prevented) or that lands in a text field is left
 * alone; the first matching shortcut that is not disabled runs. */
export function useShortcuts(shortcuts: Shortcut[], { enabled = true }: { enabled?: boolean } = {}): ShortcutHelp[] {
  const { messages } = useStoaFormat();
  const apple = isApplePlatform();
  const latest = useRef(shortcuts);
  useLayoutEffect(() => {
    latest.current = shortcuts;
  });
  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing) return;
      const typing = isTypingTarget(event.composedPath?.()[0] ?? event.target);
      const shortcut = latest.current.find(
        (s) => !s.isDisabled && (!typing || s.allowInFields) && matchesShortcut(event, s, apple),
      );
      if (!shortcut) return;
      event.preventDefault();
      shortcut.onTrigger(event);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [enabled, apple]);
  return shortcuts.map((s) => ({
    keys: shortcutKeys(s, apple, messages),
    description: s.description,
    group: s.group,
    isDisabled: s.isDisabled ?? false,
  }));
}
