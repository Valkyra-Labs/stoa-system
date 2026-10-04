import { useState, type ReactNode } from "react";
import { Button as AriaButton, Tooltip as AriaTooltip, TooltipTrigger } from "react-aria-components";

export type TooltipProps = {
  /** The term the tooltip explains, drawn as text with a dotted underline
   * ("YTM"). It is a button: the tooltip opens when it is focused, hovered
   * or pressed. */
  children: ReactNode;
  /** The explanation: a short phrase or sentence, no controls or links
   * (a tooltip cannot be entered). */
  content: ReactNode;
  /** Where the tooltip opens; "start" and "end" follow the direction of
   * the text. Above the term by default. */
  placement?: "top" | "bottom" | "start" | "end";
  /** Open on first render (a page that points at the term, a story). */
  defaultOpen?: boolean;
};

/** A short explanation of a term, on React Aria's Tooltip. It opens on
 * keyboard focus at once, on hover after a short delay, and on a press, so
 * a touch screen reaches it too; Escape, or leaving the term, closes it.
 * While open it is the term's description for assistive technology.
 *
 * A tooltip is never the only place information lives: what a person
 * needs to act is on the page, and the tooltip only explains a word of it
 * (a glossary entry, the expansion of an abbreviation). */
export function Tooltip({ children, content, placement = "top", defaultOpen = false }: TooltipProps) {
  const [isOpen, setOpen] = useState(defaultOpen);
  return (
    <TooltipTrigger delay={500} closeDelay={200} isOpen={isOpen} onOpenChange={setOpen} shouldCloseOnPress={false}>
      <AriaButton className="stoa-tooltip-term" onPress={() => setOpen((open) => !open)}>
        {children}
      </AriaButton>
      <AriaTooltip className="stoa-tooltip" placement={placement} offset={6}>
        {content}
      </AriaTooltip>
    </TooltipTrigger>
  );
}
