/**
 * DropdownMenu — accessible action menu following the WAI-ARIA menu-button
 * pattern.
 *
 * Portal-mounted with auto-flip placement. Click the trigger to open; navigate
 * with Arrow keys, activate with Enter/Space, close with Escape or outside
 * click.
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
import type { DropdownMenuItem, DropdownMenuAction } from "./types";
import "./DropdownMenu.scss";

export interface DropdownMenuProps {
  items: DropdownMenuItem[];
  placement?: Placement;
  offset?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
  /** Single focusable element — the trigger. */
  children: ReactElement;
}

function isAction(item: DropdownMenuItem): item is DropdownMenuAction {
  return item.type === undefined || item.type === "action";
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  placement = "bottom-start",
  offset = 4,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className,
  children,
}) => {
  const reactId = useId();
  const menuId = `sisyphos-menu-${reactId}`;

  const anchorRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  const isControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = (isControlled ? openProp : internalOpen) && !disabled;

  const [pos, setPos] = useState<{ left: number; top: number; placement: Placement } | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const actionIndexes = useMemo(
    () => items.map((item, i) => (isAction(item) && !item.disabled ? i : -1)).filter((i) => i >= 0),
    [items]
  );

  const firstFocusable = actionIndexes[0] ?? -1;
  const lastFocusable = actionIndexes[actionIndexes.length - 1] ?? -1;

  const moveFocus = useCallback(
    (direction: 1 | -1) => {
      setActiveIndex((current) => {
        const pool = actionIndexes;
        if (pool.length === 0) return -1;
        if (current === -1) return direction === 1 ? pool[0] : pool[pool.length - 1];
        const idx = pool.indexOf(current);
        if (idx === -1) return pool[0];
        const next = pool[(idx + direction + pool.length) % pool.length];
        return next;
      });
    },
    [actionIndexes]
  );

  useEscapeKey(() => {
    setOpen(false);
    (anchorRef.current as HTMLElement | null)?.focus?.();
  }, open);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const tgt = e.target as Node | null;
      if (!tgt) return;
      if (anchorRef.current?.contains(tgt)) return;
      if (menuRef.current?.contains(tgt)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) {
      setPos(null);
      setActiveIndex(firstFocusable);
      return;
    }
    let raf = 0;
    const update = () => {
      const anchor = anchorRef.current;
      const menu = menuRef.current;
      if (!anchor || !menu) return;
      const a = anchor.getBoundingClientRect();
      const size = { width: menu.offsetWidth, height: menu.offsetHeight };
      const p = computePosition(a, size, placement, offset);
      setPos(p);
    };
    raf = requestAnimationFrame(() => requestAnimationFrame(update));
    const onWin = () => update();
    window.addEventListener("scroll", onWin, true);
    window.addEventListener("resize", onWin);
    setActiveIndex(firstFocusable);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onWin, true);
      window.removeEventListener("resize", onWin);
    };
  }, [open, placement, offset, firstFocusable]);

  useEffect(() => {
    if (!open) return;
    const el = itemRefs.current[activeIndex];
    el?.focus?.();
  }, [activeIndex, open]);

  const handleSelect = useCallback(
    (item: DropdownMenuAction, event: React.SyntheticEvent) => {
      if (item.disabled) return;
      item.onSelect(event);
      if (item.closeOnSelect !== false) {
        setOpen(false);
        anchorRef.current?.focus?.();
      }
    },
    [setOpen]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveFocus(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveFocus(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(firstFocusable);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(lastFocusable);
    } else if ((e.key === "Enter" || e.key === " ") && activeIndex >= 0) {
      e.preventDefault();
      const item = items[activeIndex];
      if (item && isAction(item)) handleSelect(item, e);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  if (!isValidElement(children)) {
    throw new Error("[@sisyphos-ui/dropdown-menu] Expected a single React element as child.");
  }

  const childProps = children.props as Record<string, unknown>;

  const triggerEl = cloneElement(children as ReactElement<Record<string, unknown>>, {
    ref: (node: HTMLElement) => {
      anchorRef.current = node;
      const orig = (children as unknown as { ref?: React.Ref<HTMLElement> }).ref;
      if (typeof orig === "function") orig(node);
      else if (orig && typeof orig === "object") {
        (orig as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    "aria-haspopup": "menu",
    "aria-expanded": open || undefined,
    "aria-controls": open ? menuId : undefined,
    onClick: (e: React.MouseEvent) => {
      (childProps.onClick as ((e: React.MouseEvent) => void) | undefined)?.(e);
      setOpen(!open);
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      (childProps.onKeyDown as ((e: React.KeyboardEvent) => void) | undefined)?.(e);
      if (!open) {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen(true);
        }
        return;
      }
      // While open the trigger keeps focus, so delegate menu navigation here.
      handleKeyDown(e);
    },
  });

  return (
    <>
      {triggerEl}
      {open && (
        <Portal>
          <ul
            ref={menuRef}
            id={menuId}
            role="menu"
            className={cx("sisyphos-dropdown-menu", pos?.placement ?? placement, className)}
            style={{
              position: "fixed",
              left: pos?.left ?? 0,
              top: pos?.top ?? 0,
              opacity: pos ? 1 : 0,
            }}
            onKeyDown={handleKeyDown}
          >
            {items.map((item, i) => {
              if (item.type === "separator") {
                return <li key={item.key ?? `sep-${i}`} className="sisyphos-dropdown-menu-separator" role="separator" />;
              }
              if (item.type === "label") {
                return (
                  <li
                    key={item.key ?? `label-${i}`}
                    className="sisyphos-dropdown-menu-label"
                    role="presentation"
                  >
                    {item.label}
                  </li>
                );
              }
              const action = item;
              return (
                <li
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  key={action.key ?? `item-${i}`}
                  role="menuitem"
                  tabIndex={activeIndex === i ? 0 : -1}
                  aria-disabled={action.disabled || undefined}
                  className={cx(
                    "sisyphos-dropdown-menu-item",
                    action.destructive && "destructive",
                    action.disabled && "disabled"
                  )}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={(e) => handleSelect(action, e)}
                >
                  {action.icon && <span className="sisyphos-dropdown-menu-item-icon">{action.icon}</span>}
                  <span className="sisyphos-dropdown-menu-item-label">{action.label}</span>
                  {action.shortcut && (
                    <span className="sisyphos-dropdown-menu-item-shortcut">{action.shortcut}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </Portal>
      )}
    </>
  );
};
