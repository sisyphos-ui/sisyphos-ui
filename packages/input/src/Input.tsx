/**
 * Input — text field with optional label, error state, three visual variants,
 * built-in password visibility toggle, and an opt-in character counter.
 */
import React, { useState, useRef, useMemo, useCallback } from "react";
import "./Input.scss";
import { CN, DEFAULTS } from "./constants";
import { mergeRefs } from "@sisyphos-ui/core/internal";
import { applyMask, unmask } from "./mask";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "onCopy"
> {
  /** Visual variant. */
  variant?: "standard" | "outlined" | "underline";
  size?: (typeof DEFAULTS)["size"];
  /** Border radius scale. */
  radius?: (typeof DEFAULTS)["radius"];
  /** Field label rendered above the input. */
  label?: string;
  /** Help content rendered as a tooltip next to the label. */
  labelTooltip?: React.ReactNode;
  /** Where the label tooltip popover appears relative to the info icon. */
  labelTooltipPosition?: "top" | "bottom" | "left" | "right";
  /** Marks the field as invalid for styling and ARIA. */
  error?: boolean;
  /** Message rendered below the field when `error` is true. */
  errorMessage?: string;
  /** Icon rendered inside the field, before the value. */
  startIcon?: React.ReactNode;
  /** Icon rendered inside the field, after the value. */
  endIcon?: React.ReactNode;
  /** Render a copy-to-clipboard button on the trailing side. */
  copyable?: boolean;
  /** Called after a successful clipboard copy. */
  onCopy?: (value: string) => void;
  /** Show a `current / max` counter. Requires `maxLength`. */
  showCharacterCount?: boolean;
  /** Stretch the input to its container width. */
  fullWidth?: boolean;
  /**
   * Mask pattern for formatted input.
   * Use `#` for any digit, `A` for any letter, `*` for alphanumeric, anything
   * else renders as a literal.
   *
   * Examples: `"+90 (###) ### ## ##"` (tel), `"#### #### #### ####"` (card),
   * `"##/##/####"` (date), `"AA-####"`.
   *
   * Or preset: `"tel-tr"` → Turkish phone `+90 (5##) ### ## ##`.
   */
  mask?: string;
  /** Fires with the **unmasked** raw value when `mask` is set. */
  onUnmaskedChange?: (unmaskedValue: string) => void;
}

const EyeIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const InfoIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm1 15h-2v-6h2zm0-8h-2V7h2z" />
  </svg>
);

const CopyIcon = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    labelTooltip,
    labelTooltipPosition = "top",
    error = false,
    errorMessage,
    startIcon,
    endIcon,
    copyable = false,
    onCopy,
    variant = DEFAULTS.variant,
    size = DEFAULTS.size,
    radius = DEFAULTS.radius,
    type = DEFAULTS.type,
    disabled = false,
    readOnly = false,
    required = false,
    maxLength,
    showCharacterCount = false,
    fullWidth = false,
    mask,
    onUnmaskedChange,
    className = "",
    onFocus,
    onBlur,
    id,
    ...props
  },
  ref
) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  const hasTrailingAffordance = isPassword || copyable || Boolean(endIcon);

  const containerClasses = useMemo(
    () =>
      [
        CN.container,
        focused && "focused",
        error && "error",
        disabled && "disabled",
        readOnly && "read-only",
        startIcon && "has-start-icon",
        hasTrailingAffordance && "has-end-adornment",
        fullWidth && "full-width",
        className,
      ]
        .filter(Boolean)
        .join(" "),
    [focused, error, disabled, readOnly, startIcon, hasTrailingAffordance, fullWidth, className]
  );

  const inputClasses = useMemo(
    () =>
      [CN.input, variant, CN.size(size), CN.radius(radius), focused && "focused", error && "error"]
        .filter(Boolean)
        .join(" "),
    [variant, size, radius, focused, error]
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  const togglePassword = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  }, []);

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      const node = inputRef.current;
      if (!node) return;
      const value = node.value ?? "";
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
        } else {
          node.select();
          document.execCommand("copy");
        }
        setCopied(true);
        onCopy?.(value);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        /* silently ignore — parent apps can read value directly */
      }
    },
    [onCopy]
  );

  const reactId = React.useId();
  const inputId = id ?? reactId;
  const defaultValue = (props as { defaultValue?: string }).defaultValue;
  const isControlled = props.value !== undefined;

  const [internalValue, setInternalValue] = useState(() => {
    const initial =
      props.value !== undefined ? String(props.value) : String(defaultValue ?? "");
    return mask ? applyMask(initial, mask) : initial;
  });

  const showCount = Boolean(maxLength && showCharacterCount);
  const rawDisplayValue = isControlled ? String(props.value ?? "") : internalValue;
  const displayValue = mask ? applyMask(rawDisplayValue, mask) : rawDisplayValue;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let nextValue = e.target.value;
      if (mask) {
        nextValue = applyMask(nextValue, mask);
        // Patch the synthetic event so downstream `onChange` sees the masked
        // string consistently with the DOM value.
        (e.target as HTMLInputElement).value = nextValue;
      }
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      if (mask) onUnmaskedChange?.(unmask(nextValue, mask));
      props.onChange?.(e);
    },
    [isControlled, mask, onUnmaskedChange, props.onChange]
  );

  const inputElement = (
    <input
      {...props}
      // When `mask` is set we always render the masked display value so the
      // user sees real-time formatting regardless of controlled/uncontrolled.
      {...(mask ? { value: displayValue } : {})}
      ref={mergeRefs(inputRef, ref)}
      id={inputId}
      type={inputType}
      className={inputClasses}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      maxLength={maxLength}
      aria-invalid={error || undefined}
      aria-describedby={
        [error && errorMessage ? `${inputId}-error` : null, showCount ? `${inputId}-count` : null]
          .filter(Boolean)
          .join(" ") || undefined
      }
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  );

  return (
    <div className={containerClasses}>
      {label && (
        <label
          htmlFor={inputId}
          className={`${CN.label} ${focused ? "focused" : ""} ${error ? "error" : ""} ${disabled ? "disabled" : ""} ${readOnly ? "read-only" : ""} ${required ? "required" : ""}`}
        >
          <span className={CN.labelText}>{label}</span>
          {labelTooltip && (
            <span
              className={CN.labelTooltip}
              role="img"
              aria-label={typeof labelTooltip === "string" ? labelTooltip : "More info"}
              title={typeof labelTooltip === "string" ? labelTooltip : undefined}
              tabIndex={0}
            >
              <InfoIcon />
              {typeof labelTooltip !== "string" && (
                <span
                  className={`${CN.labelTooltipPopover} ${labelTooltipPosition}`}
                  role="tooltip"
                >
                  {labelTooltip}
                </span>
              )}
            </span>
          )}
        </label>
      )}
      <div className={CN.wrapper}>
        {startIcon && <span className={CN.startIcon}>{startIcon}</span>}
        {inputElement}
        {endIcon && !copyable && !isPassword && <span className={CN.endIcon}>{endIcon}</span>}
        {copyable && !isPassword && (
          <button
            type="button"
            className={CN.copyButton}
            onClick={handleCopy}
            tabIndex={-1}
            aria-label={copied ? "Copied" : "Copy to clipboard"}
            aria-live="polite"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        )}
        {isPassword && (
          <button
            type="button"
            className={CN.passwordToggle}
            onClick={togglePassword}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {error && errorMessage && (
        <span id={`${inputId}-error`} className={CN.error} role="alert">
          {errorMessage}
        </span>
      )}
      {showCount && !error && (
        <span id={`${inputId}-count`} className={CN.characterCount}>
          {displayValue.length} / {maxLength}
        </span>
      )}
    </div>
  );
});

Input.displayName = "Input";
