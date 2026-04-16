/**
 * AvatarGroup — stacks child avatars with an overlap; collapses any overflow
 * past `max` into a `+N` chip.
 */
import React, { Children, isValidElement, cloneElement } from "react";
import { cx } from "@sisyphos-ui/core/internal";
import { Avatar, type AvatarProps } from "./Avatar";
import { CN, DEFAULTS, type AvatarColor, type AvatarShape, type Scale } from "./constants";

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Max avatars to render before collapsing into `+N`. */
  max?: number;
  /** Override the overflow label. Receives hidden count; default `+N`. */
  renderOverflow?: (hidden: number) => React.ReactNode;
  /** Shared size applied to each child avatar (unless child overrides). */
  size?: Scale;
  /** Shared shape applied to each child avatar (unless child overrides). */
  shape?: AvatarShape;
  /** Color applied to overflow chip. */
  overflowColor?: AvatarColor;
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  function AvatarGroup(
    {
      children,
      className,
      max,
      renderOverflow,
      size = DEFAULTS.size,
      shape = DEFAULTS.shape,
      overflowColor = "neutral",
      ...rest
    },
    ref
  ) {
    const all = Children.toArray(children).filter(isValidElement);
    const visible = typeof max === "number" ? all.slice(0, max) : all;
    const hidden = all.length - visible.length;

    return (
      <div ref={ref} className={cx(CN.group, size, className)} {...rest}>
        {visible.map((child, idx) => {
          const el = child as React.ReactElement<AvatarProps>;
          return cloneElement(el, {
            key: el.key ?? idx,
            size: el.props.size ?? size,
            shape: el.props.shape ?? shape,
          });
        })}
        {hidden > 0 && (
          <Avatar
            className={CN.groupOverflow}
            size={size}
            shape={shape}
            color={overflowColor}
          >
            {renderOverflow ? renderOverflow(hidden) : `+${hidden}`}
          </Avatar>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = "AvatarGroup";
