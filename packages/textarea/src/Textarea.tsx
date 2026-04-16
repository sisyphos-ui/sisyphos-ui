/**
 * Textarea — multiline text input with variants, sizes, optional auto-resize,
 * character counter, and error state. Works controlled or uncontrolled.
 */
import React, { useState, useRef, useMemo, useCallback, useId } from "react";
import { cx, mergeRefs } from "@sisyphos-ui/core/internal";
import { CN, DEFAULTS, type Scale } from "./constants";
import { useAutosize } from "./use-autosize";
import "./Textarea.scss";

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size" | "cols"> {
  variant?: "standard" | "outlined" | "underline";
  size?: Scale;
  radius?: Scale;
  /** Field label rendered as a `<label>` linked via `id`/`htmlFor`. */
  label?: string;
  /** Marks the field as invalid for styling and ARIA. */
  error?: boolean;
  /** Message rendered below the field when `error` is true. */
  errorMessage?: string;
  /** Show a `current / maxLength` counter. Requires `maxLength`. */
  showCharacterCount?: boolean;
  /** Auto-resize height to content, clamped between `minRows` and `maxRows`. */
  autoResize?: boolean;
  /** Minimum visible rows when `autoResize` is enabled. */
  minRows?: number;
  /** Maximum visible rows when `autoResize` is enabled. */
  maxRows?: number;
  /** Native CSS resize handle direction. */
  resize?: "none" | "vertical" | "horizontal" | "both";
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      error = false,
      errorMessage,
      variant = DEFAULTS.variant,
      size = DEFAULTS.size,
      radius = DEFAULTS.radius,
      maxLength,
      showCharacterCount = false,
      autoResize = false,
      minRows = DEFAULTS.minRows,
      maxRows,
      resize = DEFAULTS.resize as TextareaProps["resize"],
      fullWidth = false,
      disabled = false,
      readOnly = false,
      required = false,
      className = "",
      id,
      onFocus,
      onBlur,
      onChange,
      value: valueProp,
      defaultValue,
      ...rest
    },
    ref
  ) {
    const [focused, setFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const isControlled = valueProp !== undefined;
    const [internal, setInternal] = useState(() => String(defaultValue ?? ""));
    const displayValue = isControlled ? String(valueProp ?? "") : internal;

    const generatedId = useId();
    const fieldId = id ?? `sisyphos-textarea-${generatedId}`;
    const showCount = Boolean(maxLength && showCharacterCount);

    useAutosize(textareaRef, displayValue, { enabled: autoResize, minRows, maxRows });

    const containerClass = useMemo(
      () =>
        cx(
          CN.container,
          focused && "focused",
          error && "error",
          disabled && "disabled",
          readOnly && "read-only",
          fullWidth && "full-width",
          className
        ),
      [focused, error, disabled, readOnly, fullWidth, className]
    );

    const textareaClass = useMemo(
      () =>
        cx(CN.textarea, variant, CN.size(size), CN.radius(radius), error && "error"),
      [variant, size, radius, error]
    );

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setFocused(true);
        onFocus?.(e);
      },
      [onFocus]
    );
    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setFocused(false);
        onBlur?.(e);
      },
      [onBlur]
    );
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!isControlled) setInternal(e.target.value);
        onChange?.(e);
      },
      [isControlled, onChange]
    );

    const describedBy =
      [
        error && errorMessage ? `${fieldId}-error` : null,
        showCount ? `${fieldId}-count` : null,
      ]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div className={containerClass}>
        {label && (
          <label
            htmlFor={fieldId}
            className={cx(
              CN.label,
              focused && "focused",
              error && "error",
              disabled && "disabled",
              required && "required"
            )}
          >
            {label}
          </label>
        )}
        <textarea
          {...rest}
          ref={mergeRefs(textareaRef, ref)}
          id={fieldId}
          className={textareaClass}
          value={isControlled ? displayValue : undefined}
          defaultValue={isControlled ? undefined : defaultValue}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          maxLength={maxLength}
          style={{ resize, ...rest.style }}
          aria-invalid={error || undefined}
          aria-describedby={describedBy}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {error && errorMessage && (
          <span id={`${fieldId}-error`} className={CN.error} role="alert">
            {errorMessage}
          </span>
        )}
        {showCount && !error && (
          <span id={`${fieldId}-count`} className={CN.characterCount}>
            {displayValue.length} / {maxLength}
          </span>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
