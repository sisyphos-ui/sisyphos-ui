/**
 * Avatar — image avatar with graceful fallback to initials, custom content, or
 * semantic-colored placeholder when the image is missing or errors.
 */
import React, { useState, useEffect, useMemo } from "react";
import { cx } from "@sisyphos-ui/core/internal";
import { CN, DEFAULTS, type AvatarColor, type AvatarShape, type Scale } from "./constants";
import { getInitials } from "./initials";
import "./Avatar.scss";

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  /** Image source. Falls back to initials/fallback when omitted or on load error. */
  src?: string;
  /** Alt text. Required when `src` is set for accessibility. */
  alt?: string;
  /** Display name — used to derive initials when `src` is missing/errored. */
  name?: string;
  /** Max initials derived from `name`. Defaults to 2. */
  initialsMax?: number;
  /** Override fallback content (icon, custom text). Takes precedence over derived initials. */
  fallback?: React.ReactNode;
  size?: Scale;
  /** Semantic color (applied to fallback background). */
  color?: AvatarColor;
  /** Shape variant. `circular` (default), `rounded` (slight radius), `square`. */
  shape?: AvatarShape;
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  {
    src,
    alt,
    name,
    initialsMax = 2,
    fallback,
    size = DEFAULTS.size,
    color = DEFAULTS.color,
    shape = DEFAULTS.shape,
    className,
    children,
    ...rest
  },
  ref
) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [src]);

  const initials = useMemo(() => getInitials(name, initialsMax), [name, initialsMax]);
  const showImage = src && !imgFailed;

  const rootClass = cx(CN.root, size, color, shape, className);

  return (
    <span ref={ref} className={rootClass} {...rest}>
      {showImage ? (
        <img
          className={CN.image}
          src={src}
          alt={alt ?? name ?? ""}
          onError={() => setImgFailed(true)}
          draggable={false}
        />
      ) : (
        <span className={CN.fallback} aria-label={alt ?? name}>
          {children ?? fallback ?? initials}
        </span>
      )}
    </span>
  );
});

Avatar.displayName = "Avatar";
