/**
 * Tabs — accessible tab list with roving tabindex, arrow-key navigation, and an
 * animated active indicator.
 *
 * Compound API: compose with `Tabs.List`, `Tabs.Trigger`, and `Tabs.Panel`.
 * Works as controlled (`value`) or uncontrolled (`defaultValue`).
 */
import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cx } from "@sisyphos-ui/core/internal";
import { TabsContext, useTabs, type TabsOrientation } from "./context";
import "./Tabs.scss";

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Active tab value (controlled). */
  value?: string;
  /** Initial active tab value (uncontrolled). */
  defaultValue?: string;
  /** Called with the new value when the active tab changes. */
  onValueChange?: (value: string) => void;
  orientation?: TabsOrientation;
  /** Stretch triggers to fill the list width. */
  fullWidth?: boolean;
  variant?: "underline" | "pill" | "soft";
  size?: "sm" | "md" | "lg";
}

interface TabsComponent extends React.FC<TabsProps> {
  List: typeof TabsList;
  Trigger: typeof TabsTrigger;
  Panel: typeof TabsPanel;
}

const TabsRoot: React.FC<TabsProps> = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  fullWidth = false,
  variant = "underline",
  size = "md",
  className,
  children,
  ...rest
}) => {
  const reactId = useId();
  const baseId = `sisyphos-tabs-${reactId}`;

  const isControlled = valueProp !== undefined;
  const [internal, setInternal] = useState<string>(defaultValue ?? "");
  const value = isControlled ? (valueProp as string) : internal;

  const triggers = useRef<Map<string, HTMLButtonElement | null>>(new Map());

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  const registerTrigger = useCallback((v: string, el: HTMLButtonElement | null) => {
    if (el) triggers.current.set(v, el);
    else triggers.current.delete(v);
  }, []);

  const focusValue = useCallback((v: string) => {
    triggers.current.get(v)?.focus();
  }, []);

  const values = useCallback(() => Array.from(triggers.current.keys()), []);

  const ctx = useMemo(
    () => ({ baseId, value, setValue, orientation, registerTrigger, focusValue, values }),
    [baseId, value, setValue, orientation, registerTrigger, focusValue, values]
  );

  useEffect(() => {
    if (value || !defaultValue) return;
    setValue(defaultValue);
  }, [value, defaultValue, setValue]);

  return (
    <div
      data-orientation={orientation}
      className={cx(
        "sisyphos-tabs",
        orientation,
        variant,
        size,
        fullWidth && "full-width",
        className
      )}
      {...rest}
    >
      <TabsContext.Provider value={ctx}>{children}</TabsContext.Provider>
    </div>
  );
};

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

const TabsList: React.FC<TabsListProps> = ({ className, children, ...rest }) => {
  const ctx = useTabs();
  const listRef = useRef<HTMLDivElement | null>(null);
  const [indicator, setIndicator] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  useLayoutEffect(() => {
    const update = () => {
      const list = listRef.current;
      if (!list) return;
      const active = list.querySelector<HTMLButtonElement>(
        `[data-sisyphos-tab-value="${CSS.escape(ctx.value)}"]`
      );
      if (!active) {
        setIndicator(null);
        return;
      }
      const aRect = active.getBoundingClientRect();
      const lRect = list.getBoundingClientRect();
      setIndicator({
        x: aRect.left - lRect.left,
        y: aRect.top - lRect.top,
        width: aRect.width,
        height: aRect.height,
      });
    };
    update();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    if (ro && listRef.current) ro.observe(listRef.current);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      ro?.disconnect();
    };
  }, [ctx.value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const horizontal = ctx.orientation === "horizontal";
    const next = horizontal ? "ArrowRight" : "ArrowDown";
    const prev = horizontal ? "ArrowLeft" : "ArrowUp";
    if (e.key !== next && e.key !== prev && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const all = ctx.values();
    if (all.length === 0) return;
    const idx = Math.max(0, all.indexOf(ctx.value));
    let nextIdx = idx;
    if (e.key === next) nextIdx = (idx + 1) % all.length;
    else if (e.key === prev) nextIdx = (idx - 1 + all.length) % all.length;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = all.length - 1;
    const target = all[nextIdx];
    ctx.setValue(target);
    ctx.focusValue(target);
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={ctx.orientation}
      className={cx("sisyphos-tabs-list", className)}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {indicator && (
        <span
          className="sisyphos-tabs-indicator"
          style={{
            transform: `translate(${indicator.x}px, ${indicator.y}px)`,
            width: indicator.width,
            height: indicator.height,
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
};

export interface TabsTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onSelect"> {
  /** Identifier matching a sibling `Tabs.Panel`. */
  value: string;
  /** Optional icon rendered before the label. */
  icon?: React.ReactNode;
  disabled?: boolean;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  icon,
  disabled = false,
  className,
  children,
  onClick,
  ...rest
}) => {
  const ctx = useTabs();
  const ref = useRef<HTMLButtonElement | null>(null);
  const selected = ctx.value === value;

  useEffect(() => {
    ctx.registerTrigger(value, ref.current);
    return () => ctx.registerTrigger(value, null);
  }, [ctx, value]);

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      id={`${ctx.baseId}-trigger-${value}`}
      aria-selected={selected}
      aria-controls={`${ctx.baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      data-sisyphos-tab-value={value}
      className={cx("sisyphos-tabs-trigger", selected && "active", disabled && "disabled", className)}
      onClick={(e) => {
        onClick?.(e);
        if (!disabled) ctx.setValue(value);
      }}
      {...rest}
    >
      {icon && <span className="sisyphos-tabs-trigger-icon" aria-hidden="true">{icon}</span>}
      <span className="sisyphos-tabs-trigger-label">{children}</span>
    </button>
  );
};

export interface TabsPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "value"> {
  /** Identifier matching a sibling `Tabs.Trigger`. */
  value: string;
  /** Keep the panel mounted when inactive; set `false` to unmount. Default `true`. */
  forceMount?: boolean;
}

const TabsPanel: React.FC<TabsPanelProps> = ({ value, forceMount = true, className, children, ...rest }) => {
  const ctx = useTabs();
  const selected = ctx.value === value;
  if (!selected && !forceMount) return null;
  return (
    <div
      role="tabpanel"
      id={`${ctx.baseId}-panel-${value}`}
      aria-labelledby={`${ctx.baseId}-trigger-${value}`}
      hidden={!selected}
      className={cx("sisyphos-tabs-panel", className)}
      tabIndex={0}
      {...rest}
    >
      {children}
    </div>
  );
};

export const Tabs = TabsRoot as TabsComponent;
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Panel = TabsPanel;
