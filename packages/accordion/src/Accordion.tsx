/**
 * Accordion — accessible disclosure list with single- or multi-expand modes.
 *
 * Compound API: compose with `Accordion.Item`, `Accordion.Trigger`, and
 * `Accordion.Content`. Works as controlled (via `value`) or uncontrolled
 * (via `defaultValue`).
 */
import type React from "react";
import { useCallback, useId, useMemo, useState } from "react";
import { cx } from "@sisyphos-ui/core/internal";
import { AccordionContext, AccordionItemContext, useAccordion, useAccordionItem } from "./context";
import "./Accordion.scss";

type SingleProps = {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
};
type MultiProps = {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type AccordionProps = {
  variant?: "outlined" | "ghost";
  className?: string;
  children: React.ReactNode;
} & (SingleProps | MultiProps);

interface AccordionComponent extends React.FC<AccordionProps> {
  Item: typeof AccordionItem;
  Trigger: typeof AccordionTrigger;
  Content: typeof AccordionContent;
}

const AccordionRoot: React.FC<AccordionProps> = (props) => {
  const { variant = "outlined", className, children, multiple = false } = props;
  const reactId = useId();
  const baseId = `sisyphos-accordion-${reactId}`;

  const isControlled = (props as { value?: unknown }).value !== undefined;
  const [internalSingle, setInternalSingle] = useState<string | null>(
    (!multiple ? (props as SingleProps).defaultValue : null) ?? null
  );
  const [internalMulti, setInternalMulti] = useState<string[]>(
    (multiple ? (props as MultiProps).defaultValue : []) ?? []
  );

  const isOpen = useCallback(
    (v: string) => {
      if (multiple) {
        const list = isControlled ? ((props as MultiProps).value as string[]) : internalMulti;
        return list.includes(v);
      }
      const single = isControlled
        ? ((props as SingleProps).value as string | null)
        : internalSingle;
      return single === v;
    },
    [multiple, isControlled, props, internalMulti, internalSingle]
  );

  const toggle = useCallback(
    (v: string) => {
      if (multiple) {
        const curr = isControlled ? ((props as MultiProps).value as string[]) : internalMulti;
        const next = curr.includes(v) ? curr.filter((x) => x !== v) : [...curr, v];
        if (!isControlled) setInternalMulti(next);
        (props as MultiProps).onValueChange?.(next);
      } else {
        const curr = isControlled
          ? ((props as SingleProps).value as string | null)
          : internalSingle;
        const next = curr === v ? null : v;
        if (!isControlled) setInternalSingle(next);
        (props as SingleProps).onValueChange?.(next);
      }
    },
    [multiple, isControlled, props, internalMulti, internalSingle]
  );

  const ctx = useMemo(
    () => ({ baseId, isOpen, toggle, multiple: !!multiple }),
    [baseId, isOpen, toggle, multiple]
  );

  return (
    <div className={cx("sisyphos-accordion", variant, className)}>
      <AccordionContext.Provider value={ctx}>{children}</AccordionContext.Provider>
    </div>
  );
};

export interface AccordionItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "value"> {
  /** Stable key identifying this item within the accordion. */
  value: string;
  disabled?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  value,
  disabled = false,
  className,
  children,
  ...rest
}) => {
  const { baseId, isOpen } = useAccordion();
  const open = isOpen(value);
  const ctx = useMemo(
    () => ({
      value,
      open,
      triggerId: `${baseId}-${value}-trigger`,
      contentId: `${baseId}-${value}-content`,
    }),
    [value, open, baseId]
  );
  return (
    <div
      data-state={open ? "open" : "closed"}
      className={cx("sisyphos-accordion-item", open && "open", disabled && "disabled", className)}
      {...rest}
    >
      <AccordionItemContext.Provider value={ctx}>{children}</AccordionItemContext.Provider>
    </div>
  );
};

export interface AccordionTriggerProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> {
  /** Override default chevron icon. */
  icon?: React.ReactNode;
}

const ChevronDown = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path d="M7 10l5 5 5-5z" fill="currentColor" />
  </svg>
);

const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  className,
  children,
  icon,
  onClick,
  disabled,
  ...rest
}) => {
  const { toggle } = useAccordion();
  const item = useAccordionItem();
  return (
    <h3 className="sisyphos-accordion-heading">
      <button
        type="button"
        id={item.triggerId}
        aria-expanded={item.open}
        aria-controls={item.contentId}
        disabled={disabled}
        className={cx("sisyphos-accordion-trigger", item.open && "open", className)}
        onClick={(e) => {
          onClick?.(e);
          if (!disabled) toggle(item.value);
        }}
        {...rest}
      >
        <span className="sisyphos-accordion-trigger-label">{children}</span>
        <span
          className={cx("sisyphos-accordion-trigger-icon", item.open && "rotated")}
          aria-hidden="true"
        >
          {icon ?? <ChevronDown />}
        </span>
      </button>
    </h3>
  );
};

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Keep the content mounted when closed; CSS hides it. Default `true`. */
  forceMount?: boolean;
}

const AccordionContent: React.FC<AccordionContentProps> = ({
  className,
  children,
  forceMount = true,
  ...rest
}) => {
  const item = useAccordionItem();
  if (!item.open && !forceMount) return null;
  return (
    <div
      id={item.contentId}
      role="region"
      aria-labelledby={item.triggerId}
      hidden={!item.open}
      className={cx("sisyphos-accordion-content", className)}
      {...rest}
    >
      <div className="sisyphos-accordion-content-inner">{children}</div>
    </div>
  );
};

export const Accordion = AccordionRoot as AccordionComponent;
Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;
