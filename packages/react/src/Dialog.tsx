import type { ReactElement, ReactNode } from "react";
import { Dialog as AriaDialog, DialogTrigger, Heading, Modal, ModalOverlay } from "react-aria-components";
import { Button } from "./Controls";
import { useStoaFormat } from "./locale";

/** How an overlay opens: from a trigger it wraps, or from the caller's own
 * state. */
export type OverlayOpenProps = {
  /** The control that opens the overlay, usually a Button. Focus returns to
   * it on close. Leave it out to open the overlay with `isOpen`; focus then
   * returns to whatever had it before the overlay opened. */
  trigger?: ReactElement;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

type ContentProps = {
  /** The dialog's heading, which also names it. */
  title: ReactNode;
  /** The body. */
  children: ReactNode;
  /** Buttons at the end of the dialog. A function is given `close`. */
  actions?: ReactNode | ((close: () => void) => ReactNode);
};

export type DialogProps = OverlayOpenProps &
  ContentProps & {
    /** Close on a press outside the dialog as well as on Escape and the
     * close button. On by default. */
    isDismissable?: boolean;
  };

export type SheetProps = DialogProps & {
  /** Where the sheet comes from: the inline end (right in left-to-right
   * text, left in right-to-left), the bottom, or "auto": the inline end on
   * a wide screen and the bottom on a narrow one. */
  placement?: "end" | "bottom" | "auto";
};

/** The modal frame every overlay here shares. React Aria's ModalOverlay
 * traps focus inside, locks the page's scroll, closes on Escape and hides
 * the rest of the page from assistive technology while it is open. */
function Overlay({
  trigger,
  isOpen,
  defaultOpen,
  onOpenChange,
  isDismissable,
  overlayClassName = "stoa-overlay",
  modalClassName,
  children,
}: OverlayOpenProps & { isDismissable: boolean; overlayClassName?: string; modalClassName: string; children: ReactNode }) {
  if (!trigger) {
    return (
      <ModalOverlay
        className={overlayClassName}
        isDismissable={isDismissable}
        isOpen={isOpen}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        <Modal className={modalClassName}>{children}</Modal>
      </ModalOverlay>
    );
  }
  return (
    <DialogTrigger isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger}
      <ModalOverlay className={overlayClassName} isDismissable={isDismissable}>
        <Modal className={modalClassName}>{children}</Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}

/** Title, close button, body and actions, inside React Aria's Dialog,
 * which labels the dialog with its heading. */
function DialogContent({ title, children, actions }: ContentProps) {
  const { messages } = useStoaFormat();
  return (
    <AriaDialog className="stoa-dialog">
      {({ close }) => (
        <>
          <div className="stoa-dialog__header">
            <Heading slot="title" level={2} className="stoa-dialog__title">
              {title}
            </Heading>
            <Button className="stoa-dialog__close" aria-label={messages.close} onPress={close}>
              <span aria-hidden="true">×</span>
            </Button>
          </div>
          <div className="stoa-dialog__body">{children}</div>
          {actions && <div className="stoa-dialog__actions">{typeof actions === "function" ? actions(close) : actions}</div>}
        </>
      )}
    </AriaDialog>
  );
}

/** A modal dialog: a title that names it, a body, optional actions and a
 * close button with the locale's word for "Close". Escape closes it, Tab
 * stays inside it, the page behind does not scroll, and focus returns to
 * the trigger on close. */
export function Dialog({ title, children, actions, isDismissable = true, ...open }: DialogProps) {
  return (
    <Overlay {...open} isDismissable={isDismissable} modalClassName="stoa-modal">
      <DialogContent title={title} actions={actions}>
        {children}
      </DialogContent>
    </Overlay>
  );
}

/** A Dialog drawn as a side panel from the inline end, or as a bottom
 * sheet; it behaves exactly as a Dialog does. */
export function Sheet({ title, children, actions, isDismissable = true, placement = "auto", ...open }: SheetProps) {
  return (
    <Overlay
      {...open}
      isDismissable={isDismissable}
      overlayClassName={`stoa-overlay stoa-overlay--sheet stoa-overlay--${placement}`}
      modalClassName={`stoa-modal stoa-sheet stoa-sheet--${placement}`}
    >
      <DialogContent title={title} actions={actions}>
        {children}
      </DialogContent>
    </Overlay>
  );
}

export type AlertDialogProps = OverlayOpenProps & {
  title: ReactNode;
  /** What will happen, and what cannot be taken back. */
  children: ReactNode;
  /** The primary action's label: a verb for what it does ("Delete run"),
   * not "OK". */
  confirmLabel: string;
  onConfirm: () => void;
  /** "destructive" draws the primary action in the negative colour, for an
   * action that loses work; "neutral" in the accent. */
  tone?: "destructive" | "neutral";
  /** The safe action's label; the locale's "Cancel" by default. */
  cancelLabel?: string;
  /** The action focused when the dialog opens: the safe one by default, so
   * an Enter pressed by habit does not confirm. */
  autoFocus?: "cancel" | "confirm";
};

/** A confirmation that interrupts: role alertdialog, a safe action and a
 * primary one, focus on the safe action by default. A press outside does
 * not close it; Escape and the safe action do. */
export function AlertDialog({
  title,
  children,
  confirmLabel,
  onConfirm,
  tone = "neutral",
  cancelLabel,
  autoFocus = "cancel",
  ...open
}: AlertDialogProps) {
  const { messages } = useStoaFormat();
  return (
    <Overlay {...open} isDismissable={false} modalClassName="stoa-modal stoa-modal--alert">
      <AriaDialog className="stoa-dialog" role="alertdialog">
        {({ close }) => (
          <>
            <div className="stoa-dialog__header">
              <Heading slot="title" level={2} className="stoa-dialog__title">
                {title}
              </Heading>
            </div>
            <div className="stoa-dialog__body">{children}</div>
            <div className="stoa-dialog__actions">
              <Button autoFocus={autoFocus === "cancel"} onPress={close}>
                {cancelLabel ?? messages.cancel}
              </Button>
              <Button
                variant={tone === "destructive" ? "danger" : "primary"}
                autoFocus={autoFocus === "confirm"}
                onPress={() => {
                  onConfirm();
                  close();
                }}
              >
                {confirmLabel}
              </Button>
            </div>
          </>
        )}
      </AriaDialog>
    </Overlay>
  );
}
