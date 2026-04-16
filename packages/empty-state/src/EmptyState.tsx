/**
 * EmptyState — placeholder for zero-data views with slots for icon, title,
 * description, and call-to-action buttons.
 */
import React from "react";
import { cx } from "@sisyphos-ui/core/internal";
import "./EmptyState.scss";

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Action buttons slot — typically one or two `<Button>` elements. */
  actions?: React.ReactNode;
  /** Size/density scale. */
  size?: "sm" | "md" | "lg";
  /** Dashed border + subtle background. Defaults to `false` (bare). */
  bordered?: boolean;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState(
    {
      icon,
      title,
      description,
      actions,
      size = "md",
      bordered = false,
      className,
      children,
      ...rest
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        role="status"
        className={cx("sisyphos-empty-state", size, bordered && "bordered", className)}
        {...rest}
      >
        {icon && <div className="sisyphos-empty-state-icon" aria-hidden="true">{icon}</div>}
        {title && <h3 className="sisyphos-empty-state-title">{title}</h3>}
        {description && <p className="sisyphos-empty-state-description">{description}</p>}
        {children}
        {actions && <div className="sisyphos-empty-state-actions">{actions}</div>}
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";
