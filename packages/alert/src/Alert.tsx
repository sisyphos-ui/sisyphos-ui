/**
 * Alert — static inline callout for persistent messages. For transient
 * notifications use `Toast` instead.
 *
 * Provides slots for title, description, icon (defaulted per `color`), actions,
 * and an optional close button when `onClose` is supplied.
 */
import React, { useEffect } from "react";
import { cx } from "@sisyphos-ui/core/internal";
import type { SemanticColor } from "@sisyphos-ui/core/internal";
import "./Alert.scss";

export type AlertColor = SemanticColor;
export type AlertVariant = "contained" | "outlined" | "soft";

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "color"> {
  variant?: AlertVariant;
  color?: AlertColor;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Override the default semantic icon. Pass `null` to hide. */
  icon?: React.ReactNode | null;
  /** Action slot (typically a Button). */
  actions?: React.ReactNode;
  /** When provided, renders a close button. */
  onClose?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  /** aria-label for the close button. Defaults to "Close". */
  closeAriaLabel?: string;
  /**
   * When set, auto-dismiss the alert after this many ms. `onClose` fires when
   * the timer elapses. Requires `onClose` to also unmount the alert.
   */
  autoCloseDuration?: number;
}

// Default icons per semantic color.
const CheckCircle = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const AlertTriangle = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const XCircle = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
const InfoCircle = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
const Sparkle = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polygon points="12 2 15 9 22 10 17 15 18 22 12 18 6 22 7 15 2 10 9 9 12 2" />
  </svg>
);

const DEFAULT_ICONS: Record<AlertColor, React.ReactNode> = {
  primary: <Sparkle />,
  success: <CheckCircle />,
  error: <XCircle />,
  warning: <AlertTriangle />,
  info: <InfoCircle />,
};

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
    <path
      d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
      fill="currentColor"
    />
  </svg>
);

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    variant = "soft",
    color = "info",
    title,
    description,
    icon,
    actions,
    onClose,
    closeAriaLabel = "Close",
    autoCloseDuration,
    className,
    children,
    role,
    ...rest
  },
  ref
) {
  const iconNode = icon === null ? null : (icon ?? DEFAULT_ICONS[color]);
  const inferredRole = role ?? (color === "error" ? "alert" : "status");

  useEffect(() => {
    if (!autoCloseDuration || !onClose) return;
    const t = setTimeout(() => onClose(), autoCloseDuration);
    return () => clearTimeout(t);
  }, [autoCloseDuration, onClose]);

  return (
    <div
      ref={ref}
      role={inferredRole}
      className={cx("sisyphos-alert", variant, color, className)}
      {...rest}
    >
      {iconNode && <div className="sisyphos-alert-icon">{iconNode}</div>}
      <div className="sisyphos-alert-body">
        {title && <div className="sisyphos-alert-title">{title}</div>}
        {description && <div className="sisyphos-alert-description">{description}</div>}
        {children}
        {actions && <div className="sisyphos-alert-actions">{actions}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          className="sisyphos-alert-close"
          onClick={onClose}
          aria-label={closeAriaLabel}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
});

Alert.displayName = "Alert";
