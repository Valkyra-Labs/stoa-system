import { Fragment, useId, type ReactNode } from "react";
import { Dialog, type OverlayOpenProps } from "./Dialog";

export type Shortcut = {
  /** The keys pressed together, in order: ["Ctrl", "K"]. */
  keys: string[];
  /** What the shortcut does. */
  description: ReactNode;
};

export type ShortcutGroup = {
  /** The group's heading ("Playback"). */
  title: string;
  shortcuts: Shortcut[];
};

/** The keys of one shortcut as nested kbd elements, the HTML idiom for a
 * key combination. Key names stay left to right in a right-to-left page.
 * The inner `stoa-kbd` class is meant to become a shared Kbd component. */
function Keys({ keys }: { keys: string[] }) {
  return (
    <kbd className="stoa-shortcuts__keys" dir="ltr">
      {keys.map((key, i) => (
        <Fragment key={`${key}-${i}`}>
          {i > 0 && <span className="stoa-shortcuts__plus">+</span>}
          <kbd className="stoa-kbd">{key}</kbd>
        </Fragment>
      ))}
    </kbd>
  );
}

function Group({ group }: { group: ShortcutGroup }) {
  const id = useId();
  return (
    <section className="stoa-shortcuts__group" aria-labelledby={id}>
      <h3 id={id} className="stoa-shortcuts__title">
        {group.title}
      </h3>
      <dl className="stoa-shortcuts__list">
        {group.shortcuts.map((shortcut) => (
          <div key={shortcut.keys.join("+")} className="stoa-shortcuts__row">
            <dt>
              <Keys keys={shortcut.keys} />
            </dt>
            <dd>{shortcut.description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Keyboard shortcuts in titled groups: each shortcut's keys under its
 * term, its description beside them. */
export function ShortcutList({ groups }: { groups: ShortcutGroup[] }) {
  return (
    <div className="stoa-shortcuts">
      {groups.map((group) => (
        <Group key={group.title} group={group} />
      ))}
    </div>
  );
}

export type ShortcutsDialogProps = OverlayOpenProps & {
  /** The dialog's title ("Keyboard shortcuts"). */
  title: ReactNode;
  groups: ShortcutGroup[];
};

/** A Dialog that lists keyboard shortcuts (ShortcutList). */
export function ShortcutsDialog({ title, groups, ...open }: ShortcutsDialogProps) {
  return (
    <Dialog {...open} title={title}>
      <ShortcutList groups={groups} />
    </Dialog>
  );
}
