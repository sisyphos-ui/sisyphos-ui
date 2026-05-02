/**
 * SkeletonText — renders N text-line skeletons. The last line is narrower by
 * default so the placeholder resembles a real paragraph.
 */
import React from "react";
import { cx } from "@sisyphos-ui/core/internal";
import { Skeleton, type SkeletonAnimation } from "./Skeleton";

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of lines. Defaults to 3. */
  lines?: number;
  /** Shared animation. */
  animation?: SkeletonAnimation;
  /** Whether the last line should be narrower (60% width). */
  lastNarrow?: boolean;
  /** Line height (CSS). Defaults to `1em`. */
  lineHeight?: number | string;
  /** Gap between lines. Defaults to `0.5em`. */
  gap?: number | string;
}

export const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  function SkeletonText(
    {
      lines = 3,
      animation = "shimmer",
      lastNarrow = true,
      lineHeight = "1em",
      gap = "0.5em",
      className,
      style,
      ...rest
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={cx("sisyphos-skeleton-text", className)}
        style={{ display: "flex", flexDirection: "column", gap, ...style }}
        {...rest}
      >
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            shape="text"
            animation={animation}
            height={lineHeight}
            width={lastNarrow && i === lines - 1 ? "60%" : "100%"}
          />
        ))}
      </div>
    );
  }
);

SkeletonText.displayName = "SkeletonText";
