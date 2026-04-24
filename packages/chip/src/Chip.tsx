/**
 * Chip — compact label with optional avatar/icon and an optional delete button.
 *
 * The delete button is a separate `<button>` so activating the chip itself does
 * not trigger deletion. Non-interactive chips have no ARIA role.
 */
import React, { useCallback } from "react";
import { cx } from "@sisyphos-ui/core/internal";
import "./Chip.scss";
import { CN, DEFAULTS, type Scale, type SemanticColor } from "./constants";

type Radius = Scale | "full";

export interface ChipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  /** Visual variant. */
  variant?: "contained" | "outlined" | "soft";
  /** Semantic color. */
  color?: SemanticColor;
  size?: Scale;
  /** Border radius. Defaults to `full` (pill). */
  radius?: Radius;
  /** Avatar node rendered before the label (24×24 circle). */
  avatar?: React.ReactNode;
  /** Icon rendered before the label (overridden by `avatar` when both are set). */
  startIcon?: React.ReactNode;
  /** Icon rendered after the label. Hidden when `onDelete` is set. */
  endIcon?: React.ReactNode;
  /** When provided, renders a delete button. Not fired when the chip itself is clicked. */
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** aria-label for the delete button. Defaults to "Remove". */
  deleteAriaLabel?: string;
  disabled?: boolean;
  /** When set, the chip itself becomes a button. */
  clickable?: boolean;
  children: React.ReactNode;
}

const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
    <path
      d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
      fill="currentColor"
    />
  </svg>
);

export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(function Chip(
  {
    children,
    className,
    variant = DEFAULTS.variant,
    color = DEFAULTS.color,
    size = DEFAULTS.size,
    radius = DEFAULTS.radius,
    avatar,
    startIcon,
    endIcon,
    onDelete,
    deleteAriaLabel = "Remove",
    disabled = false,
    clickable = false,
    onClick,
    onKeyDown,
    ...rest
  },
  ref
) {
  const isInteractive = clickable && !disabled;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (!isInteractive || !onClick) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
      }
    },
    [isInteractive, onClick, onKeyDown]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      onDelete?.(e);
    },
    [disabled, onDelete]
  );

  const rootClass = cx(
    CN.root,
    variant,
    color,
    CN.size(size),
    radius === "full" ? "radius-full" : CN.radius(radius),
    disabled && "disabled",
    isInteractive && "clickable",
    Boolean(onDelete) && "has-delete",
    className
  );

  return (
    <div
      ref={ref}
      className={rootClass}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-disabled={disabled || undefined}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {avatar ? (
        <span className={CN.avatar} aria-hidden="true">
          {avatar}
        </span>
      ) : startIcon ? (
        <span className={CN.iconStart} aria-hidden="true">
          {startIcon}
        </span>
      ) : null}
      <span className={CN.label}>{children}</span>
      {onDelete ? (
        <button
          type="button"
          className={CN.deleteButton}
          onClick={handleDelete}
          aria-label={deleteAriaLabel}
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
        >
          <DeleteIcon />
        </button>
      ) : endIcon ? (
        <span className={CN.iconEnd} aria-hidden="true">
          {endIcon}
        </span>
      ) : null}
    </div>
  );
});

Chip.displayName = "Chip";
