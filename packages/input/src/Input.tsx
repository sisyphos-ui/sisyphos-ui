/**
 * Input — text field with optional label, error state, three visual variants,
 * built-in password visibility toggle, and an opt-in character counter.
 */
import React, { useState, useRef, useMemo, useCallback } from "react";
import "./Input.scss";
import { CN, DEFAULTS } from "./constants";
import { mergeRefs } from "@sisyphos-ui/core/internal";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Visual variant. */
  variant?: "standard" | "outlined" | "underline";
  size?: (typeof DEFAULTS)["size"];
  /** Border radius scale. */
  radius?: (typeof DEFAULTS)["radius"];
  /** Field label rendered above the input. */
  label?: string;
  /** Marks the field as invalid for styling and ARIA. */
  error?: boolean;
  /** Message rendered below the field when `error` is true. */
  errorMessage?: string;
  /** Icon rendered inside the field, before the value. */
  startIcon?: React.ReactNode;
  /** Show a `current / max` counter. Requires `maxLength`. */
  showCharacterCount?: boolean;
  /** Stretch the input to its container width. */
  fullWidth?: boolean;
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

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      label,
      error = false,
      errorMessage,
      startIcon,
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
    const inputRef = useRef<HTMLInputElement>(null);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    const containerClasses = useMemo(
      () =>
        [
          CN.container,
          focused && "focused",
          error && "error",
          disabled && "disabled",
          readOnly && "read-only",
          startIcon && "has-start-icon",
          isPassword && "has-password-toggle",
          fullWidth && "full-width",
          className,
        ]
          .filter(Boolean)
          .join(" "),
      [focused, error, disabled, readOnly, startIcon, isPassword, fullWidth, className]
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

    const inputId = id ?? React.useId();
    const defaultValue = (props as { defaultValue?: string }).defaultValue;
    const [internalValue, setInternalValue] = useState(() =>
      props.value !== undefined ? String(props.value) : String(defaultValue ?? "")
    );
    const isControlled = props.value !== undefined;
    const showCount = Boolean(maxLength && showCharacterCount);
    const displayValue = isControlled ? String(props.value ?? "") : internalValue;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled && showCount) {
          setInternalValue(e.target.value);
        }
        props.onChange?.(e);
      },
      [isControlled, showCount, props.onChange]
    );

    const inputElement = (
      <input
        {...props}
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
            {label}
          </label>
        )}
        <div className={CN.wrapper}>
          {startIcon && <span className={CN.startIcon}>{startIcon}</span>}
          {inputElement}
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
  }
);

Input.displayName = "Input";
