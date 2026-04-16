/**
 * Button — primary action trigger with variants, colors, sizes, loading state,
 * optional dropdown menu, and polymorphic rendering as `<a>` when `href` is set.
 */
import React, { useState, useRef, useMemo, useCallback } from "react";
import "./Button.scss";
import { CN, DEFAULTS } from "./constants";
import { mergeRefs, useOutsideClick, useEscapeKey, cx } from "@sisyphos-ui/core/internal";

export interface ButtonDropdownItem {
  /** Visible label for the menu item. */
  label: string;
  /** Invoked when the item is selected; the dropdown is closed afterwards. */
  onClick: () => void;
  /** Stable key when `label` is not unique. */
  key?: string;
}

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color" | "children"> {
  /** Visual style. Defaults to `contained`. */
  variant?: "contained" | "outlined" | "text" | "soft";
  /** Semantic color. Defaults to `primary`. */
  color?: "primary" | "success" | "error" | "warning" | "info";
  size?: (typeof DEFAULTS)["size"];
  /** Border radius scale. Defaults to `md`. */
  radius?: (typeof DEFAULTS)["radius"];
  /** Icon rendered before the label. */
  startIcon?: React.ReactNode;
  /** Icon rendered after the label. */
  endIcon?: React.ReactNode;
  /** When true, shows a spinner and disables interaction. */
  loading?: boolean;
  /** Where the spinner appears relative to the label. */
  loadingPosition?: "start" | "center" | "end";
  /** Custom node to render in place of the default spinner. */
  loadingIndicator?: React.ReactNode;
  /** Stretch the button to its container width. */
  fullWidth?: boolean;
  /** If provided, the button renders as an `<a>` instead of `<button>`. */
  href?: string;
  /** Items to show in the dropdown menu. Ignored when `href` or `loading` is set. */
  dropdownItems?: ButtonDropdownItem[];
  /** Side the dropdown opens on. Defaults to `bottom`. */
  dropdownPosition?: "top" | "bottom";
  /** Omit for icon-only — then `aria-label` is required. */
  children?: React.ReactNode;
}

const LoadingSpinner = ({ position }: { position: "start" | "center" | "end" }) => (
  <span
    className={`${CN.loadingSpinner} ${CN.loadingSpinner}--${position}`}
    aria-hidden="true"
  >
    <svg className={`${CN.loadingSpinnerSvg}`} viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="32"
        strokeDashoffset="12"
      />
    </svg>
  </span>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <span
    className={`${CN.iconDropdown} ${open ? "open" : ""}`}
    aria-hidden="true"
  >
    <svg height={24} width={24} viewBox="0 0 24 24" fill="none">
      <path d="M7 10l5 5 5-5z" fill="currentColor" />
    </svg>
  </span>
);

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(
  {
    children,
    className = "",
    color = DEFAULTS.color,
    disabled = false,
    endIcon,
    onClick,
    size = DEFAULTS.size,
    radius = DEFAULTS.radius,
    startIcon,
    type = DEFAULTS.type,
    variant = DEFAULTS.variant,
    dropdownItems,
    dropdownPosition = DEFAULTS.dropdownPosition,
    loading = false,
    loadingPosition = DEFAULTS.loadingPosition,
    loadingIndicator,
    fullWidth = false,
    href,
    ...props
  },
  ref
) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);

  const hasDropdown = useMemo(
    () => !href && !loading && Boolean(dropdownItems?.length),
    [dropdownItems, href, loading]
  );

  const isDisabled = disabled || loading;

  const buttonClasses = useMemo(
    () =>
      cx(
        CN.button,
        variant,
        color,
        CN.size(size),
        CN.radius(radius),
        hasDropdown && "with-dropdown",
        isDropdownOpen && "dropdown-open",
        loading && "loading",
        fullWidth && "full-width",
        isDisabled && "disabled",
        className
      ),
    [variant, color, size, radius, hasDropdown, isDropdownOpen, loading, fullWidth, isDisabled, className]
  );

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
    buttonRef.current?.focus();
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }
      if (hasDropdown) {
        e.preventDefault();
        setIsDropdownOpen((prev) => !prev);
      } else {
        onClick?.(e as React.MouseEvent<HTMLButtonElement>);
      }
    },
    [isDisabled, hasDropdown, onClick]
  );

  useOutsideClick(wrapperRef, () => setIsDropdownOpen(false), isDropdownOpen);
  useEscapeKey(closeDropdown, isDropdownOpen);

  const spinner = loadingIndicator ?? <LoadingSpinner position={loadingPosition} />;
  const showText = !loading || loadingPosition !== "center";

  const content = (
    <>
      {loading && loadingPosition === "start" && spinner}
      {!loading && startIcon && <span className={CN.iconStart}>{startIcon}</span>}
      {showText && <span className={CN.text}>{children}</span>}
      {loading && loadingPosition === "center" && spinner}
      {hasDropdown ? (
        <ChevronIcon open={isDropdownOpen} />
      ) : (
        <>
          {loading && loadingPosition === "end" && spinner}
          {!loading && endIcon && <span className={CN.iconEnd}>{endIcon}</span>}
        </>
      )}
    </>
  );

  const sharedProps = {
    ref: mergeRefs(buttonRef, ref),
    className: buttonClasses,
    onClick: handleClick,
    "aria-busy": loading || undefined,
    "aria-disabled": isDisabled || undefined,
    "aria-haspopup": hasDropdown ? ("menu" as const) : undefined,
    "aria-expanded": hasDropdown ? isDropdownOpen : undefined,
  };

  const element = href ? (
    <a
      {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      {...sharedProps}
      href={isDisabled ? undefined : href}
      tabIndex={isDisabled ? -1 : undefined}
    >
      {content}
    </a>
  ) : (
    <button
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      {...sharedProps}
      type={type}
      disabled={isDisabled}
    >
      {content}
    </button>
  );

  if (!hasDropdown) return element;

  return (
    <div className={`${CN.wrapper} has-dropdown`} ref={wrapperRef}>
      {element}
      {isDropdownOpen && dropdownItems && (
        <ul className={`${CN.dropdown} ${dropdownPosition}`} role="menu">
          {dropdownItems.map((item, index) => (
            <DropdownItem
              key={item.key ?? index}
              item={item}
              onSelect={closeDropdown}
            />
          ))}
        </ul>
      )}
    </div>
    );
});

Button.displayName = "Button";

function DropdownItem({
  item,
  onSelect,
}: {
  item: ButtonDropdownItem;
  onSelect: () => void;
}) {
  const handleSelect = useCallback(() => {
    item.onClick();
    onSelect();
  }, [item, onSelect]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect();
      }
    },
    [handleSelect]
  );

  return (
    <li
      className={CN.dropdownItem}
      role="menuitem"
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {item.label}
    </li>
  );
}
