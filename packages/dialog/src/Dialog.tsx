/**
 * Dialog — accessible modal with portal mounting, focus trap, and scroll lock.
 *
 * Closes on backdrop click and Escape by default; both are configurable.
 * Automatically wires `aria-labelledby` to `Dialog.Title`. Compose with
 * `Dialog.Header`, `Dialog.Title`, `Dialog.Description`, `Dialog.Body`,
 * `Dialog.Footer`, and `Dialog.Close`.
 */
import React, { useCallback, useEffect, useId, useMemo, useRef } from "react";
import { Portal, useFocusTrap, useScrollLock } from "@sisyphos-ui/portal";
import { cx, useEscapeKey } from "@sisyphos-ui/core/internal";
import { DialogContext } from "./context";
import "./Dialog.scss";

export type DialogSize = "sm" | "md" | "lg" | "xl" | "full";

export interface DialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Called with the next open state when the dialog requests to close. */
  onOpenChange: (open: boolean) => void;
  size?: DialogSize;
  /** Close when the backdrop is clicked. Default `true`. */
  closeOnBackdropClick?: boolean;
  /** Close when Escape is pressed. Default `true`. */
  closeOnEscape?: boolean;
  /** Render the backdrop. Disable for transparent dialogs. Default `true`. */
  backdrop?: boolean;
  /** Element that receives focus on open. Defaults to the first focusable child. */
  initialFocus?: React.RefObject<HTMLElement>;
  className?: string;
  children: React.ReactNode;
}

interface DialogComponent extends React.FC<DialogProps> {
  Header: typeof DialogHeader;
  Title: typeof DialogTitle;
  Description: typeof DialogDescription;
  Body: typeof DialogBody;
  Footer: typeof DialogFooter;
  Close: typeof DialogClose;
}

const DialogRoot: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  size = "md",
  closeOnBackdropClick = true,
  closeOnEscape = true,
  backdrop = true,
  initialFocus,
  className,
  children,
}) => {
  const reactId = useId();
  const titleId = `sisyphos-dialog-title-${reactId}`;
  const descriptionId = `sisyphos-dialog-desc-${reactId}`;

  const contentRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  useEscapeKey(close, open && closeOnEscape);
  useScrollLock(open);
  useFocusTrap(contentRef, open);

  useEffect(() => {
    if (!open) return;
    const t = initialFocus?.current;
    if (t) {
      t.focus({ preventScroll: true });
    }
  }, [open, initialFocus]);

  const ctx = useMemo(() => ({ titleId, descriptionId, onClose: close }), [titleId, descriptionId, close]);

  if (!open) return null;

  return (
    <Portal>
      <div
        className={cx("sisyphos-dialog-root", backdrop && "with-backdrop")}
        onMouseDown={(e) => {
          if (!closeOnBackdropClick) return;
          if (e.target === e.currentTarget) close();
        }}
      >
        <div
          ref={contentRef}
          className={cx("sisyphos-dialog", size, className)}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          tabIndex={-1}
        >
          <DialogContext.Provider value={ctx}>{children}</DialogContext.Provider>
        </div>
      </div>
    </Portal>
  );
};

const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...rest }) => (
  <header className={cx("sisyphos-dialog-header", className)} {...rest}>
    {children}
  </header>
);

const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...rest }) => {
  const { titleId } = React.useContext(DialogContext)!;
  return (
    <h2 id={titleId} className={cx("sisyphos-dialog-title", className)} {...rest}>
      {children}
    </h2>
  );
};

const DialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, children, ...rest }) => {
  const { descriptionId } = React.useContext(DialogContext)!;
  return (
    <p id={descriptionId} className={cx("sisyphos-dialog-description", className)} {...rest}>
      {children}
    </p>
  );
};

const DialogBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...rest }) => (
  <div className={cx("sisyphos-dialog-body", className)} {...rest}>
    {children}
  </div>
);

const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...rest }) => (
  <div className={cx("sisyphos-dialog-footer", className)} {...rest}>
    {children}
  </div>
);

const DialogClose: React.FC<Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type">> = ({
  className,
  children,
  onClick,
  "aria-label": ariaLabel = "Close",
  ...rest
}) => {
  const { onClose } = React.useContext(DialogContext)!;
  return (
    <button
      type="button"
      className={cx("sisyphos-dialog-close", className)}
      aria-label={ariaLabel}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) onClose();
      }}
      {...rest}
    >
      {children ?? (
        <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
          <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
        </svg>
      )}
    </button>
  );
};

export const Dialog = DialogRoot as DialogComponent;
Dialog.Header = DialogHeader;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Body = DialogBody;
Dialog.Footer = DialogFooter;
Dialog.Close = DialogClose;
