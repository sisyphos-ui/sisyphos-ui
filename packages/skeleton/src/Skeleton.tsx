/**
 * Skeleton — placeholder block with three shapes and three animations for use
 * while real content is loading.
 */
import React from "react";
import { cx } from "@sisyphos-ui/core/internal";
import "./Skeleton.scss";

export type SkeletonShape = "rectangular" | "circular" | "text";
export type SkeletonAnimation = "shimmer" | "pulse" | "none";

export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  shape?: SkeletonShape;
  animation?: SkeletonAnimation;
  /** CSS width (px → number, or any CSS value). */
  width?: number | string;
  /** CSS height (px → number, or any CSS value). */
  height?: number | string;
  /** Corner radius. Ignored when `shape === "circular"`. */
  radius?: number | string;
  /** When provided, wraps children — dimensions derived from children if width/height omitted. */
  children?: React.ReactNode;
}

function toSize(v: number | string | undefined): string | undefined {
  if (v === undefined) return undefined;
  return typeof v === "number" ? `${v}px` : v;
}

export const Skeleton = React.forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  {
    shape = "rectangular",
    animation = "shimmer",
    width,
    height,
    radius,
    className,
    style,
    children,
    ...rest
  },
  ref
) {
  const resolvedStyle: React.CSSProperties = {
    width: toSize(width),
    height: toSize(height) ?? (shape === "text" ? "1em" : undefined),
    borderRadius: shape === "circular" ? "50%" : toSize(radius),
    ...style,
  };

  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-testid="sisyphos-skeleton"
      className={cx("sisyphos-skeleton", shape, animation, className)}
      style={resolvedStyle}
      {...rest}
    >
      {children && <span className="sisyphos-skeleton-ghost">{children}</span>}
    </span>
  );
});

Skeleton.displayName = "Skeleton";
