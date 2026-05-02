/**
 * Switch — controlled toggle with `role="switch"` semantics.
 *
 * Always controlled: pass `checked` and `onChange`. An `aria-label` is required
 * when no visible label is rendered alongside the switch.
 */
import React, { useMemo, useCallback } from "react";
import "./Switch.scss";
import { CN, DEFAULTS } from "./constants";
import { mergeRefs } from "@sisyphos-ui/core/internal";

export interface SwitchProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange"
> {
  /** Current checked state. */
  checked: boolean;
  /** Semantic color used when checked. */
  color?: "neutral" | "primary" | "success" | "error" | "warning" | "info";
  size?: (typeof DEFAULTS)["size"];
  /** Called with the new checked value when the user toggles the switch. */
  onChange?: (checked: boolean) => void;
  /** Required when no adjacent visible label exists. */
  "aria-label"?: string;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked,
    color = DEFAULTS.color,
    size = DEFAULTS.size,
    disabled = false,
    onChange,
    className = "",
    "aria-label": ariaLabel,
    ...props
  },
  ref
) {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const switchClasses = useMemo(
    () =>
      [
        CN.switch,
        color,
        CN.size(size),
        checked && "checked",
        !checked && "unchecked",
        disabled && "disabled",
        className,
      ]
        .filter(Boolean)
        .join(" "),
    [color, size, checked, disabled, className]
  );

  const handleClick = useCallback(() => {
    if (disabled) return;
    onChange?.(!checked);
  }, [disabled, checked, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  return (
    <button
      ref={mergeRefs(buttonRef, ref)}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      className={switchClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : undefined}
      {...props}
    >
      <span className={CN.toggle} aria-hidden />
    </button>
  );
});

Switch.displayName = "Switch";
