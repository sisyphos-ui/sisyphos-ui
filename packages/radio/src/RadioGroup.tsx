/**
 * RadioGroup — coordinates selection state and shared options (name, size,
 * color, variant) for nested `<Radio>` children.
 *
 * Works as controlled (`value`) or uncontrolled (`defaultValue`). Either pass
 * `<Radio>` children for full composition, or a flat `options` array for a
 * quick one-line form field.
 */
import React, { useState, useCallback, useMemo, useId } from "react";
import { cx } from "@sisyphos-ui/core/internal";
import type { Scale, SemanticColor } from "@sisyphos-ui/core/internal";
import { RadioGroupContext } from "./context";
import { Radio } from "./Radio";
import "./Radio.scss";

export interface RadioOption {
  value: string | number;
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** Shared `name` for the underlying inputs. Auto-generated when omitted. */
  name?: string;
  /** Selected value (controlled). */
  value?: string | number;
  /** Initial selected value (uncontrolled). */
  defaultValue?: string | number;
  /** Called with the new value when the selection changes. */
  onChange?: (value: string | number) => void;
  disabled?: boolean;
  required?: boolean;
  /** Group label rendered above the options. */
  label?: string;
  /** Marks the group as invalid for styling and ARIA. */
  error?: boolean;
  /** Message rendered below the group when `error` is true. */
  errorMessage?: string;
  /** Layout direction for the options. */
  direction?: "horizontal" | "vertical";
  size?: Scale;
  color?: SemanticColor;
  /** Visual style applied to each option. */
  variant?: "standard" | "card" | "list";
  /**
   * Flat option array — a convenience alternative to composing `<Radio>`
   * children. When provided, options render automatically.
   */
  options?: RadioOption[];
  /** Shows a trailing "+ add option" button below the options. */
  allowAddOption?: boolean;
  /** Fired when the add-option button is activated. */
  onAddOption?: () => void;
  /** Label for the add-option button. Defaults to `"Add option"`. */
  addOptionLabel?: React.ReactNode;
  children?: React.ReactNode;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup(
    {
      name: nameProp,
      value: valueProp,
      defaultValue,
      onChange,
      disabled = false,
      required = false,
      label,
      error = false,
      errorMessage,
      direction = "vertical",
      size = "md",
      color = "primary",
      variant = "standard",
      options,
      allowAddOption = false,
      onAddOption,
      addOptionLabel = "Add option",
      className,
      children,
      ...rest
    },
    ref
  ) {
    const reactId = useId();
    const name = nameProp ?? `sisyphos-radio-${reactId}`;
    const isControlled = valueProp !== undefined;
    const [internal, setInternal] = useState<string | number | undefined>(defaultValue);
    const value = isControlled ? valueProp : internal;

    const handleChange = useCallback(
      (next: string | number) => {
        if (!isControlled) setInternal(next);
        onChange?.(next);
      },
      [isControlled, onChange]
    );

    const ctx = useMemo(
      () => ({ name, value, onChange: handleChange, disabled, size, color, variant }),
      [name, value, handleChange, disabled, size, color, variant]
    );

    return (
      <div
        ref={ref}
        className={cx("sisyphos-radio-group", className)}
        {...rest}
      >
        {label && (
          <div
            className={cx(
              "sisyphos-radio-group-label",
              error && "error",
              required && "required"
            )}
          >
            {label}
          </div>
        )}
        <div
          role="radiogroup"
          aria-label={label}
          aria-required={required || undefined}
          aria-invalid={error || undefined}
          className={cx("sisyphos-radio-options", direction)}
        >
          <RadioGroupContext.Provider value={ctx}>
            {options
              ? options.map((o) => (
                  <Radio
                    key={String(o.value)}
                    value={o.value}
                    label={o.label}
                    description={o.description}
                    icon={o.icon}
                    disabled={o.disabled}
                  />
                ))
              : children}
          </RadioGroupContext.Provider>
        </div>
        {allowAddOption && (
          <button
            type="button"
            className="sisyphos-radio-add-option"
            onClick={onAddOption}
            disabled={disabled}
          >
            <span aria-hidden="true">+</span>
            <span>{addOptionLabel}</span>
          </button>
        )}
        {error && errorMessage && (
          <span className="sisyphos-radio-group-error" role="alert">
            {errorMessage}
          </span>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";
