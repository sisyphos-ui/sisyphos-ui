/**
 * Checkbox — controlled boolean input with an optional label and semantic colors.
 *
 * Always controlled: pass `checked` and `onChange`. For uncontrolled defaults,
 * manage the value in parent state.
 */
import React, { useMemo, useCallback, useEffect } from "react";
import "./Checkbox.scss";
import { CN, DEFAULTS } from "./constants";
import { mergeRefs } from "@sisyphos-ui/core/internal";

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "onChange"
> {
  /** Current checked state. */
  checked: boolean;
  /**
   * Tristate indicator. When `true`, the box renders a horizontal "minus"
   * mark and exposes `aria-checked="mixed"`. Activating an indeterminate
   * checkbox calls `onChange(true)` (the standard "select all" behavior).
   */
  indeterminate?: boolean;
  /** Called with the new checked value when the user toggles the box. */
  onChange?: (checked: boolean) => void;
  /** Optional label rendered next to the box. */
  label?: React.ReactNode;
  /** Semantic color used when checked. */
  color?: "neutral" | "primary" | "success" | "error" | "warning" | "info";
  size?: (typeof DEFAULTS)["size"];
  /** Border radius of the box. */
  radius?: (typeof DEFAULTS)["radius"];
}

const CheckMarkSvg = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
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
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path d="M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    checked,
    indeterminate = false,
    onChange,
    label,
    color = DEFAULTS.color,
    size = DEFAULTS.size,
    radius = DEFAULTS.radius,
    disabled = false,
    className = "",
    id: idProp,
    ...props
  },
  ref
) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const reactId = React.useId();
  const id = idProp ?? reactId;

  // The DOM `indeterminate` flag is not reflected as an attribute, so it
  // must be assigned imperatively. React doesn't carry it through props.
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const rootClasses = useMemo(
    () =>
      [CN.checkbox, indeterminate && "indeterminate", disabled && "disabled", className]
        .filter(Boolean)
        .join(" "),
    [indeterminate, disabled, className]
  );

  const inputClasses = useMemo(
    () =>
      [CN.input, color, CN.size(size), CN.radius(radius), disabled && "disabled"]
        .filter(Boolean)
        .join(" "),
    [color, size, radius, disabled]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      // Indeterminate → checked is the standard "select all" promotion.
      if (indeterminate) {
        onChange?.(true);
        return;
      }
      onChange?.(e.target.checked);
    },
    [disabled, indeterminate, onChange]
  );

  return (
    <div className={rootClasses}>
      <label className={CN.label} htmlFor={id}>
        <span className={CN.box}>
          <input
            ref={mergeRefs(inputRef, ref)}
            id={id}
            type="checkbox"
            className={inputClasses}
            checked={checked}
            disabled={disabled}
            onChange={handleChange}
            aria-checked={indeterminate ? "mixed" : checked}
            aria-disabled={disabled || undefined}
            {...props}
          />
          <span className={CN.mark} aria-hidden>
            {indeterminate ? <IndeterminateMark /> : <CheckMarkSvg />}
          </span>
        </span>
        {label != null && <span className={CN.labelText}>{label}</span>}
      </label>
    </div>
  );
});

Checkbox.displayName = "Checkbox";
