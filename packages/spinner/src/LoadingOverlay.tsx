/**
 * LoadingOverlay — centered spinner with optional label. Renders as a fullscreen
 * portal, an absolutely positioned overlay inside the nearest positioned
 * ancestor, or inline in document flow, depending on `variant`.
 */
import React from "react";
import { Portal } from "@sisyphos-ui/portal";
import { cx } from "@sisyphos-ui/core/internal";
import { Spinner, type SpinnerProps } from "./Spinner";
import { CN } from "./constants";
import "./Spinner.scss";

export interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * `fullscreen` — portal-mounted fixed overlay.
   * `overlay`    — absolute overlay inside nearest positioned ancestor.
   * `inline`     — no backdrop, in-flow.
   */
  variant?: "fullscreen" | "overlay" | "inline";
  /** Show overlay. When `false`, nothing renders. Defaults to `true`. */
  open?: boolean;
  /** Optional loading text rendered below the spinner. */
  text?: React.ReactNode;
  /** Custom icon slot replacing the default spinner (e.g. brand logo). */
  icon?: React.ReactNode;
  /** Props forwarded to the default spinner. */
  spinnerProps?: SpinnerProps;
  /** Blur backdrop. Default on for `fullscreen`/`overlay`. */
  blur?: boolean;
}

export const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  function LoadingOverlay(
    {
      variant = "inline",
      open = true,
      text,
      icon,
      spinnerProps,
      blur = true,
      className,
      ...rest
    },
    ref
  ) {
    if (!open) return null;

    const body = (
      <div
        ref={ref}
        className={cx(CN.overlay, variant, blur && "blur", className)}
        role="status"
        aria-live="polite"
        {...rest}
      >
        {variant !== "inline" && <div className={CN.backdrop} aria-hidden="true" />}
        <div className={CN.content}>
          {icon ?? <Spinner size="lg" {...spinnerProps} />}
          {text && <p className={CN.text}>{text}</p>}
        </div>
      </div>
    );

    return variant === "fullscreen" ? <Portal>{body}</Portal> : body;
  }
);

LoadingOverlay.displayName = "LoadingOverlay";
