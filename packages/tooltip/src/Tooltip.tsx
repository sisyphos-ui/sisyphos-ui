/**
 * Tooltip — accessible hover/focus tooltip mounted in a portal with auto-flip
 * placement.
 *
 * Wraps a single focusable child and wires `aria-describedby` to the tooltip.
 * Use for short transient hints; for rich interactive content prefer `Popover`.
 */
import React, {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { Portal } from "@sisyphos-ui/portal";
import { cx, computePosition, type Placement } from "@sisyphos-ui/core/internal";
import "./Tooltip.scss";

export interface TooltipProps {
  /** Tooltip content. When falsy, the tooltip is disabled entirely. */
  content: React.ReactNode;
  /** Preferred placement. Auto-flips to the opposite side if it doesn't fit. */
  placement?: Placement;
  /** Pixel gap between anchor and tooltip. Defaults to 8. */
  offset?: number;
  /** Ms before showing. Defaults to 200. */
  openDelay?: number;
  /** Ms before hiding. Defaults to 100. */
  closeDelay?: number;
  /** Render an arrow pointing at the anchor. */
  arrow?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Fired whenever open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Disable the tooltip (e.g. on mobile). */
  disabled?: boolean;
  /** Custom className for the tooltip element. */
  className?: string;
  /** Must be exactly one focusable element. */
  children: ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  placement = "top",
  offset = 8,
  openDelay = 200,
  closeDelay = 100,
  arrow = true,
  open: openProp,
  onOpenChange,
  disabled = false,
  className,
  children,
}) => {
  const reactId = useId();
  const tooltipId = `sisyphos-tooltip-${reactId}`;
  const anchorRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const visible = (isControlled ? openProp : internalOpen) && !!content && !disabled;

  const [pos, setPos] = useState<{ left: number; top: number; placement: Placement } | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const clearTimers = () => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    openTimerRef.current = null;
    closeTimerRef.current = null;
  };

  const scheduleOpen = useCallback(() => {
    clearTimers();
    openTimerRef.current = setTimeout(() => setOpen(true), openDelay);
  }, [openDelay, setOpen]);

  const scheduleClose = useCallback(() => {
    clearTimers();
    closeTimerRef.current = setTimeout(() => setOpen(false), closeDelay);
  }, [closeDelay, setOpen]);

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    if (!visible) {
      setPos(null);
      return;
    }
    let raf = 0;
    const update = () => {
      const anchor = anchorRef.current;
      const tooltip = tooltipRef.current;
      if (!anchor || !tooltip) return;
      const a = anchor.getBoundingClientRect();
      const size = { width: tooltip.offsetWidth, height: tooltip.offsetHeight };
      const p = computePosition(a, size, placement, offset);
      setPos(p);
    };
    raf = requestAnimationFrame(() => requestAnimationFrame(update));
    const onResize = () => update();
    window.addEventListener("scroll", onResize, true);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onResize, true);
      window.removeEventListener("resize", onResize);
    };
  }, [visible, placement, offset, content]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, setOpen]);

  if (!isValidElement(children)) {
    throw new Error("[@sisyphos-ui/tooltip] <Tooltip> expects a single React element as child.");
  }

  const childProps = children.props as Record<string, unknown>;

  const mergedChild = cloneElement(children as ReactElement<Record<string, unknown>>, {
    ref: (node: HTMLElement) => {
      anchorRef.current = node;
      const originalRef = (children as unknown as { ref?: React.Ref<HTMLElement> }).ref;
      if (typeof originalRef === "function") originalRef(node);
      else if (originalRef && typeof originalRef === "object") {
        (originalRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    onMouseEnter: (e: React.MouseEvent) => {
      (childProps.onMouseEnter as ((e: React.MouseEvent) => void) | undefined)?.(e);
      scheduleOpen();
    },
    onMouseLeave: (e: React.MouseEvent) => {
      (childProps.onMouseLeave as ((e: React.MouseEvent) => void) | undefined)?.(e);
      scheduleClose();
    },
    onFocus: (e: React.FocusEvent) => {
      (childProps.onFocus as ((e: React.FocusEvent) => void) | undefined)?.(e);
      scheduleOpen();
    },
    onBlur: (e: React.FocusEvent) => {
      (childProps.onBlur as ((e: React.FocusEvent) => void) | undefined)?.(e);
      scheduleClose();
    },
    "aria-describedby": visible
      ? [childProps["aria-describedby"], tooltipId].filter(Boolean).join(" ")
      : childProps["aria-describedby"],
  });

  return (
    <>
      {mergedChild}
      {visible && (
        <Portal>
          <div
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            className={cx("sisyphos-tooltip", pos?.placement ?? placement, className)}
            style={{
              position: "fixed",
              left: pos?.left ?? 0,
              top: pos?.top ?? 0,
              opacity: pos ? 1 : 0,
            }}
            onMouseEnter={() => clearTimers()}
            onMouseLeave={scheduleClose}
          >
            {content}
            {arrow && <span className="sisyphos-tooltip-arrow" aria-hidden="true" />}
          </div>
        </Portal>
      )}
    </>
  );
};
