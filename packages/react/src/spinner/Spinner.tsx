/**
 * Spinner — circular progress indicator with `role="status"` and a
 * screen-reader label. Rendered as an inline SVG to avoid Firefox's
 * anti-aliasing seam on `border-radius: 50%` borders.
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

const VIEWBOX = 50;
const CENTER = VIEWBOX / 2;
const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC_LENGTH_OUTER = CIRCUMFERENCE * 0.25;
const ARC_LENGTH_INNER = CIRCUMFERENCE * 0.3;

function Arc({ dash, inner = false }: { dash: number; inner?: boolean }) {
  return (
    <circle
      className={cx(CN.arc, inner && CN.arcInner)}
      cx={CENTER}
      cy={CENTER}
      r={RADIUS}
      fill="none"
      strokeLinecap="round"
      strokeDasharray={`${dash} ${CIRCUMFERENCE}`}
      pathLength={CIRCUMFERENCE}
    />
  );
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
  const mergedStyle = {
    ...style,
    ["--sisyphos-spinner-thickness" as string]: `${thickness}px`,
  } as React.CSSProperties;

  return (
    <span
      ref={ref}
      role="status"
      aria-label={label}
      className={cx(CN.spinner, size, color, variant, className)}
      style={mergedStyle}
      {...rest}
    >
      <svg
        className={CN.svg}
        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        aria-hidden="true"
        focusable="false"
      >
        <Arc dash={ARC_LENGTH_OUTER} />
      </svg>
      {variant === "double" && (
        <svg
          className={cx(CN.svg, CN.svgInner)}
          viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
          aria-hidden="true"
          focusable="false"
        >
          <Arc dash={ARC_LENGTH_INNER} inner />
        </svg>
      )}
    </span>
  );
});

Spinner.displayName = "Spinner";
