/**
 * Popover — interactive floating panel anchored to a trigger element.
 *
 * Portal-mounted with auto-flip placement. Closes on outside click and Escape
 * by default. Works controlled (`open`) or uncontrolled (`defaultOpen`). Wraps
 * a single focusable child as the trigger; use `Tooltip` for read-only hints.
 */
import React, {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { Portal } from "@sisyphos-ui/portal";
import {
  cx,
  computePosition,
  useEscapeKey,
  type Placement,
} from "@sisyphos-ui/core/internal";
import "./Popover.scss";

export interface PopoverProps {
  /** Floating content rendered inside the popover. */
  content: React.ReactNode;
  /** Preferred placement; auto-flips to the opposite side if it doesn't fit. */
  placement?: Placement;
  /** Pixel gap between trigger and popover. Defaults to 8. */
  offset?: number;
  /** Interaction that opens the popover. `manual` only opens via the `open` prop. */
  trigger?: "click" | "hover" | "manual";
  /** Delay before opening on the hover trigger. */
  openDelay?: number;
  /** Delay before closing on the hover trigger. */
  closeDelay?: number;
  /** Render an arrow pointing at the trigger. */
  arrow?: boolean;
  /** Open state (controlled). */
  open?: boolean;
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean;
  /** Called whenever the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Close when Escape is pressed. Default `true`. */
  closeOnEscape?: boolean;
  /** Close when a click occurs outside the trigger and panel. Default `true`. */
  closeOnOutsideClick?: boolean;
  disabled?: boolean;
  className?: string;
  /** Single focusable React element used as the trigger. */
  children: ReactElement;
}

export const Popover: React.FC<PopoverProps> = ({
  content,
  placement = "bottom",
  offset = 8,
  trigger = "click",
  openDelay = 100,
  closeDelay = 150,
  arrow = true,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  disabled = false,
  className,
  children,
}) => {
  const reactId = useId();
  const popoverId = `sisyphos-popover-${reactId}`;
  const anchorRef = useRef<HTMLElement | null>(null);
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = (isControlled ? openProp : internalOpen) && !disabled;

  const [pos, setPos] = useState<{ left: number; top: number; placement: Placement } | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };
  const schedule = useCallback(
    (next: boolean, delay: number) => {
      clearTimer();
      timerRef.current = setTimeout(() => setOpen(next), delay);
    },
    [setOpen]
  );

  useEffect(() => () => clearTimer(), []);

  useEscapeKey(() => setOpen(false), open && closeOnEscape);

  useEffect(() => {
    if (!open || !closeOnOutsideClick) return;
    const handler = (e: MouseEvent) => {
      const tgt = e.target as Node;
      if (anchorRef.current?.contains(tgt)) return;
      if (floatingRef.current?.contains(tgt)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, closeOnOutsideClick, setOpen]);

  useEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    let raf = 0;
    const update = () => {
      const anchor = anchorRef.current;
      const tooltip = floatingRef.current;
      if (!anchor || !tooltip) return;
      const a = anchor.getBoundingClientRect();
      const p = computePosition(a, { width: tooltip.offsetWidth, height: tooltip.offsetHeight }, placement, offset);
      setPos(p);
    };
    raf = requestAnimationFrame(() => requestAnimationFrame(update));
    const onWin = () => update();
    window.addEventListener("scroll", onWin, true);
    window.addEventListener("resize", onWin);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onWin, true);
      window.removeEventListener("resize", onWin);
    };
  }, [open, placement, offset, content]);

  if (!isValidElement(children)) {
    throw new Error("[@sisyphos-ui/popover] <Popover> expects a single React element as child.");
  }

  const childProps = children.props as Record<string, unknown>;

  const triggerHandlers = useMemo(() => {
    const handlers: Record<string, unknown> = {};
    if (trigger === "click") {
      handlers.onClick = (e: React.MouseEvent) => {
        (childProps.onClick as ((e: React.MouseEvent) => void) | undefined)?.(e);
        setOpen(!open);
      };
    } else if (trigger === "hover") {
      handlers.onMouseEnter = (e: React.MouseEvent) => {
        (childProps.onMouseEnter as ((e: React.MouseEvent) => void) | undefined)?.(e);
        schedule(true, openDelay);
      };
      handlers.onMouseLeave = (e: React.MouseEvent) => {
        (childProps.onMouseLeave as ((e: React.MouseEvent) => void) | undefined)?.(e);
        schedule(false, closeDelay);
      };
      handlers.onFocus = (e: React.FocusEvent) => {
        (childProps.onFocus as ((e: React.FocusEvent) => void) | undefined)?.(e);
        schedule(true, openDelay);
      };
      handlers.onBlur = (e: React.FocusEvent) => {
        (childProps.onBlur as ((e: React.FocusEvent) => void) | undefined)?.(e);
        schedule(false, closeDelay);
      };
    }
    return handlers;
  }, [trigger, childProps, open, setOpen, schedule, openDelay, closeDelay]);

  const merged = cloneElement(children as ReactElement<Record<string, unknown>>, {
    ref: (node: HTMLElement) => {
      anchorRef.current = node;
      const orig = (children as unknown as { ref?: React.Ref<HTMLElement> }).ref;
      if (typeof orig === "function") orig(node);
      else if (orig && typeof orig === "object") {
        (orig as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    "aria-expanded": open || undefined,
    "aria-controls": open ? popoverId : undefined,
    "aria-haspopup": "dialog",
    ...triggerHandlers,
  });

  return (
    <>
      {merged}
      {open && (
        <Portal>
          <div
            ref={floatingRef}
            id={popoverId}
            role="dialog"
            className={cx("sisyphos-popover", pos?.placement ?? placement, className)}
            style={{
              position: "fixed",
              left: pos?.left ?? 0,
              top: pos?.top ?? 0,
              opacity: pos ? 1 : 0,
            }}
            onMouseEnter={trigger === "hover" ? () => clearTimer() : undefined}
            onMouseLeave={trigger === "hover" ? () => schedule(false, closeDelay) : undefined}
          >
            {content}
            {arrow && <span className="sisyphos-popover-arrow" aria-hidden="true" />}
          </div>
        </Portal>
      )}
    </>
  );
};
