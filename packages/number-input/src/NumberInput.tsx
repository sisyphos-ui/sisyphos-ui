/**
 * NumberInput — numeric input with locale-aware formatting, optional stepper
 * buttons, prefix/suffix slots, and `min`/`max`/`step` constraints.
 *
 * Works controlled (`value`) or uncontrolled (`defaultValue`).
 */
import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { cx, mergeRefs } from "@sisyphos-ui/core/internal";
import "./NumberInput.scss";

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "type" | "size" | "min" | "max" | "step" | "prefix"> {
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Decimal places. Default 0. */
  precision?: number;
  /** Locale for `Intl.NumberFormat`. Default `tr-TR`. */
  locale?: string;
  /** Custom Intl.NumberFormat options (overrides precision when set). */
  numberFormatOptions?: Intl.NumberFormatOptions;
  /** Render +/- stepper buttons. Default `true`. */
  withStepper?: boolean;
  /** Element rendered before the input (icon, label). */
  prefix?: React.ReactNode;
  /** Element rendered after the input — currency, unit, etc. */
  suffix?: React.ReactNode;
  variant?: "standard" | "outlined" | "underline";
  size?: "sm" | "md" | "lg";
  label?: string;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  fullWidth?: boolean;
}

function clamp(n: number, min?: number, max?: number): number {
  let v = n;
  if (min !== undefined && v < min) v = min;
  if (max !== undefined && v > max) v = max;
  return v;
}

function buildFormatter(locale: string, precision: number, opts?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(
    locale,
    opts ?? { minimumFractionDigits: precision, maximumFractionDigits: precision }
  );
}

/** Strip everything except digits, "-", and the locale's decimal separator. */
function parseLocaleNumber(input: string, locale: string): number | null {
  if (input == null || input === "") return null;
  const example = (1234.5).toLocaleString(locale);
  // Derive the locale decimal separator from a formatted sample: "...5" where
  // the character right before the trailing "5" is the separator we want.
  const decimalSeparator = example.charAt(example.length - 2);
  const cleaned = input
    .replace(new RegExp(`[^\\d\\-${decimalSeparator === "." ? "." : "," }]`, "g"), "")
    .replace(decimalSeparator, ".");
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  {
    value: valueProp,
    defaultValue,
    onChange,
    min,
    max,
    step = 1,
    precision = 0,
    locale = "tr-TR",
    numberFormatOptions,
    withStepper = true,
    prefix,
    suffix,
    variant = "outlined",
    size = "md",
    label,
    error = false,
    errorMessage,
    required = false,
    fullWidth = false,
    disabled = false,
    readOnly = false,
    placeholder = "0",
    className,
    id,
    onFocus,
    onBlur,
    ...rest
  },
  ref
) {
  const reactId = useId();
  const fieldId = id ?? `sisyphos-number-${reactId}`;

  const isControlled = valueProp !== undefined;
  const [internal, setInternal] = useState<number | null>(defaultValue ?? null);
  const current = isControlled ? (valueProp ?? null) : internal;

  const formatter = useMemo(
    () => buildFormatter(locale, precision, numberFormatOptions),
    [locale, precision, numberFormatOptions]
  );

  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState<string>(() =>
    current === null ? "" : formatter.format(current)
  );
  const innerRef = useRef<HTMLInputElement | null>(null);

  // Re-format the visible text when the field isn't focused or the value
  // changes from outside.
  useEffect(() => {
    if (!focused) setDraft(current === null ? "" : formatter.format(current));
  }, [current, formatter, focused]);

  const emit = useCallback(
    (next: number | null) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft(e.target.value);
    const parsed = parseLocaleNumber(e.target.value, locale);
    if (parsed === null) {
      emit(null);
      return;
    }
    emit(clamp(parsed, min, max));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
    if (current !== null) setDraft(formatter.format(current));
  };
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  };

  const stepBy = (delta: number) => () => {
    if (disabled || readOnly) return;
    const base = current ?? 0;
    emit(clamp(base + delta, min, max));
  };

  const decrementDisabled = disabled || (min !== undefined && (current ?? 0) <= min);
  const incrementDisabled = disabled || (max !== undefined && (current ?? 0) >= max);

  return (
    <div
      className={cx(
        "sisyphos-number-input",
        size,
        variant,
        focused && "focused",
        error && "error",
        disabled && "disabled",
        fullWidth && "full-width",
        className
      )}
    >
      {label && (
        <label htmlFor={fieldId} className={cx("sisyphos-number-input-label", error && "error", required && "required")}>
          {label}
        </label>
      )}
      <div
        className={cx(
          "sisyphos-number-input-wrapper",
          withStepper && "has-stepper",
          Boolean(suffix) && "has-suffix",
          Boolean(prefix) && "has-prefix"
        )}
      >
        {withStepper && (
          <button
            type="button"
            className="sisyphos-number-input-step decrement"
            onClick={stepBy(-step)}
            disabled={decrementDisabled}
            aria-label="Decrement"
            tabIndex={-1}
          >
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
              <path d="M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
        {prefix && <span className="sisyphos-number-input-prefix">{prefix}</span>}
        <input
          {...rest}
          ref={mergeRefs(innerRef, ref)}
          id={fieldId}
          type="text"
          inputMode={precision > 0 ? "decimal" : "numeric"}
          className="sisyphos-number-input-field"
          value={draft}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={error || undefined}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {suffix && <span className="sisyphos-number-input-suffix">{suffix}</span>}
        {withStepper && (
          <button
            type="button"
            className="sisyphos-number-input-step increment"
            onClick={stepBy(step)}
            disabled={incrementDisabled}
            aria-label="Increment"
            tabIndex={-1}
          >
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
              <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
      {error && errorMessage && (
        <span className="sisyphos-number-input-error" role="alert">{errorMessage}</span>
      )}
    </div>
  );
});

NumberInput.displayName = "NumberInput";
