/**
 * ContextMenu — right-click menu anchored at the pointer.
 *
 * Wraps a single child. On `contextmenu` (right-click) the default browser menu
 * is suppressed and a portal-mounted menu is opened at the click coordinates
 * (clamped inside the viewport). Arrow keys navigate, Enter/Space activate,
 * Escape or outside-click close. Items are the same shape as DropdownMenu's
 * so the two feel interchangeable.
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
import { cx, useEscapeKey } from "@sisyphos-ui/core/internal";
import type { ContextMenuItem, ContextMenuAction } from "./types";
import "./ContextMenu.scss";

export interface ContextMenuProps {
  items: ContextMenuItem[];
  /** Viewport margin so the menu never sits flush against an edge. */
  margin?: number;
  disabled?: boolean;
  className?: string;
  /** Rendered when `items` is empty. */
  emptyState?: React.ReactNode;
  /** Fired when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** The trigger — any element that accepts `onContextMenu`. */
  children: ReactElement;
}

function isAction(item: ContextMenuItem): item is ContextMenuAction {
  return item.type === undefined || item.type === "action";
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  items,
  margin = 8,
  disabled = false,
  className,
  emptyState,
  onOpenChange,
  children,
}) => {
  const reactId = useId();
  const menuId = `sisyphos-context-menu-${reactId}`;

  const menuRef = useRef<HTMLUListElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const lastTriggerEl = useRef<HTMLElement | null>(null);

  const [open, setOpenState] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const setOpen = useCallback(
    (next: boolean) => {
      setOpenState(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  const actionIndexes = useMemo(
    () => items.map((item, i) => (isAction(item) && !item.disabled ? i : -1)).filter((i) => i >= 0),
    [items],
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
        return pool[(idx + direction + pool.length) % pool.length];
      });
    },
    [actionIndexes],
  );

  useEscapeKey(() => {
    setOpen(false);
    lastTriggerEl.current?.focus?.();
  }, open);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const tgt = e.target as Node | null;
      if (!tgt) return;
      if (containerRef.current?.contains(tgt)) return;
      setOpen(false);
    };
    // `mousedown` beats our own click on items because stopPropagation is on click.
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, setOpen]);

  // Clamp coordinates inside the viewport after the menu measures itself.
  useEffect(() => {
    if (!open || !coords) return;
    const raf = requestAnimationFrame(() => {
      const el = containerRef.current;
      if (!el) return;
      const { innerWidth, innerHeight } = window;
      const { width, height } = el.getBoundingClientRect();
      let x = coords.x;
      let y = coords.y;
      if (x + width + margin > innerWidth) x = innerWidth - width - margin;
      if (y + height + margin > innerHeight) y = innerHeight - height - margin;
      if (x < margin) x = margin;
      if (y < margin) y = margin;
      if (x !== coords.x || y !== coords.y) setCoords({ x, y });
    });
    return () => cancelAnimationFrame(raf);
  }, [open, coords, margin]);

  useEffect(() => {
    if (!open) {
      setActiveIndex(-1);
      return;
    }
    setActiveIndex(firstFocusable);
  }, [open, firstFocusable]);

  useEffect(() => {
    if (!open) return;
    const el = itemRefs.current[activeIndex];
    el?.focus?.();
  }, [activeIndex, open]);

  const handleSelect = useCallback(
    (item: ContextMenuAction, event: React.SyntheticEvent) => {
      if (item.disabled) return;
      item.onSelect(event);
      if (item.closeOnSelect !== false) {
        setOpen(false);
        lastTriggerEl.current?.focus?.();
      }
    },
    [setOpen],
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
    throw new Error("[@sisyphos-ui/context-menu] Expected a single React element as child.");
  }

  const childProps = children.props as Record<string, unknown>;

  const triggerEl = cloneElement(children as ReactElement<Record<string, unknown>>, {
    onContextMenu: (e: React.MouseEvent<HTMLElement>) => {
      (childProps.onContextMenu as ((e: React.MouseEvent) => void) | undefined)?.(e);
      if (disabled) return;
      e.preventDefault();
      lastTriggerEl.current = e.currentTarget;
      setCoords({ x: e.clientX, y: e.clientY });
      setOpen(true);
    },
  });

  return (
    <>
      {triggerEl}
      {open && coords && (
        <Portal>
          <div
            ref={containerRef}
            className={cx("sisyphos-context-menu", className)}
            style={{ position: "fixed", left: coords.x, top: coords.y }}
            role="presentation"
          >
            {items.length === 0 && emptyState ? (
              <div className="sisyphos-context-menu-empty" role="note">
                {emptyState}
              </div>
            ) : (
              <ul
                ref={menuRef}
                id={menuId}
                role="menu"
                className="sisyphos-context-menu-list"
                onKeyDown={handleKeyDown}
              >
                {items.map((item, i) => {
                  if (item.type === "separator") {
                    return (
                      <li
                        key={item.key ?? `sep-${i}`}
                        className="sisyphos-context-menu-separator"
                        role="separator"
                      />
                    );
                  }
                  if (item.type === "label") {
                    return (
                      <li
                        key={item.key ?? `label-${i}`}
                        className="sisyphos-context-menu-label"
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
                        "sisyphos-context-menu-item",
                        action.destructive && "destructive",
                        action.disabled && "disabled",
                      )}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={(e) => handleSelect(action, e)}
                    >
                      {action.icon && (
                        <span className="sisyphos-context-menu-item-icon">{action.icon}</span>
                      )}
                      <span className="sisyphos-context-menu-item-label">{action.label}</span>
                      {action.shortcut && (
                        <span className="sisyphos-context-menu-item-shortcut">{action.shortcut}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Portal>
      )}
    </>
  );
};

ContextMenu.displayName = "ContextMenu";
