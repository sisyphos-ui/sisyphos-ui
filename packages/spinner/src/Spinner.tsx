/**
 * Spinner — circular progress indicator with `role="status"` and a
 * screen-reader label.
 */
import React from "react";
import { cx } from "@sisyphos-ui/core/internal";
import { CN, DEFAULTS, type Scale, type SpinnerColor } from "./constants";
import "./Spinner.scss";

export interface SpinnerProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  size?: Scale;
  /** Stroke color. `"inherit"` uses currentColor (useful inside buttons). */
  color?: SpinnerColor;
  /** Ring thickness in px. Defaults to 3. */
  thickness?: number;
  /** Visual style. `"ring"` (single rotating arc) or `"double"` (outer + counter-rotating inner). */
  variant?: "ring" | "double";
  /** Accessible label announced to screen readers. Defaults to "Loading". */
  label?: string;
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  {
    size = DEFAULTS.size,
    color = DEFAULTS.color,
    thickness = DEFAULTS.thickness,
    variant = "ring",
    label = "Loading",
    className,
    style,
    ...rest
  },
  ref
) {
  return (
    <span
      ref={ref}
      role="status"
      aria-label={label}
      className={cx(CN.spinner, size, color, variant, className)}
      style={{ borderWidth: thickness, ...style }}
      {...rest}
    />
  );
});

Spinner.displayName = "Spinner";
