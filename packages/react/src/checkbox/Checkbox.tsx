/**
 * Checkbox — React binding.
 *
 * Always controlled. Defers transition logic to the framework-agnostic
 * `nextCheckboxStateAfterToggle` helper from @sisyphos-ui/core, so the
 * indeterminate-promotion rule and disabled gating match the Vue and
 * Angular bindings exactly. No internal state — props are the source of
 * truth, and the host framework re-renders after `onChange`.
 */
import React, { useEffect, useMemo, useRef } from "react";
import { nextCheckboxStateAfterToggle } from "@sisyphos-ui/core";
import "./Checkbox.scss";

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "onChange" | "checked"
> {
  /** Current checked state. */
  checked: boolean;
  /** Tristate indicator. Activating an indeterminate box promotes to checked=true. */
  indeterminate?: boolean;
  /** Called with the next checked value when the user toggles. */
  onChange?: (checked: boolean) => void;
  /** Optional label rendered next to the box. */
  label?: React.ReactNode;
  /** Semantic color used when checked or indeterminate. */
  color?: "neutral" | "primary" | "success" | "error" | "warning" | "info";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const CheckMark = () => (
  <svg viewBox="0 0 16 16" width="100%" height="100%" fill="none" aria-hidden>
    <path
      d="M13 4L6 11L3 8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IndeterminateMark = () => (
  <svg viewBox="0 0 16 16" width="100%" height="100%" fill="none" aria-hidden>
    <path d="M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    checked,
    indeterminate = false,
    onChange,
    label,
    color = "primary",
    size = "md",
    disabled = false,
    className,
    id: idProp,
    ...rest
  },
  ref
) {
  const innerRef = useRef<HTMLInputElement | null>(null);
  const reactId = React.useId();
  const id = idProp ?? reactId;

  // The DOM `indeterminate` flag is not reflected through React props.
  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const rootClasses = useMemo(
    () =>
      ["sisyphos-checkbox", indeterminate && "indeterminate", disabled && "disabled", className]
        .filter(Boolean)
        .join(" "),
    [indeterminate, disabled, className]
  );

  const inputClasses = useMemo(
    () =>
      ["sisyphos-checkbox-input", color, size, disabled && "disabled"].filter(Boolean).join(" "),
    [color, size, disabled]
  );

  const handleNativeChange = () => {
    if (disabled) return;
    const next = nextCheckboxStateAfterToggle({ checked, indeterminate, disabled });
    onChange?.(next.checked);
  };

  const setBothRefs = (node: HTMLInputElement | null) => {
    innerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
  };

  return (
    <div className={rootClasses}>
      <label className="sisyphos-checkbox-label" htmlFor={id}>
        <span className="sisyphos-checkbox-box">
          <input
            ref={setBothRefs}
            id={id}
            type="checkbox"
            className={inputClasses}
            checked={checked}
            disabled={disabled}
            onChange={handleNativeChange}
            aria-checked={indeterminate ? "mixed" : checked}
            aria-disabled={disabled || undefined}
            {...rest}
          />
          <span className="sisyphos-checkbox-mark" aria-hidden>
            {indeterminate ? <IndeterminateMark /> : <CheckMark />}
          </span>
        </span>
        {label != null && <span className="sisyphos-checkbox-label-text">{label}</span>}
      </label>
    </div>
  );
});

Checkbox.displayName = "Checkbox";
