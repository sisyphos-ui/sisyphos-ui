/**
 * Radio — single radio option. Must be rendered inside a `<RadioGroup>` to
 * coordinate selection, name, size, color, and variant.
 */
import React, { useCallback } from "react";
import { cx } from "@sisyphos-ui/core/internal";
import { useRadioGroup } from "./context";

export interface RadioProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "type" | "value" | "onChange"
> {
  /** Value submitted when this option is selected. */
  value: string | number;
  /** Primary label rendered next to the control. */
  label?: React.ReactNode;
  /** Secondary text rendered below the label. */
  description?: React.ReactNode;
  /** Leading icon rendered before the label. */
  icon?: React.ReactNode;
  disabled?: boolean;
  /** Content revealed only when this option is selected. */
  children?: React.ReactNode;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    value,
    label,
    description,
    icon,
    disabled: disabledProp = false,
    className,
    children,
    id,
    ...rest
  },
  ref
) {
  const group = useRadioGroup();
  const disabled = disabledProp || group.disabled;
  const checked = group.value === value;

  const handleChange = useCallback(() => {
    if (disabled) return;
    group.onChange(value);
  }, [disabled, group, value]);

  const wrapperTag = group.variant;

  return (
    <label
      className={cx(
        "sisyphos-radio",
        wrapperTag,
        group.size,
        group.color,
        checked && "checked",
        disabled && "disabled",
        className
      )}
    >
      <span className="sisyphos-radio-row">
        <input
          {...rest}
          ref={ref}
          id={id}
          type="radio"
          name={group.name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          className="sisyphos-radio-input"
        />
        <span className="sisyphos-radio-control" aria-hidden="true">
          <span className="sisyphos-radio-inner" />
        </span>
        {(label || description || icon) && (
          <span className="sisyphos-radio-content">
            {icon && <span className="sisyphos-radio-icon">{icon}</span>}
            <span className="sisyphos-radio-text">
              {label && <span className="sisyphos-radio-label">{label}</span>}
              {description && <span className="sisyphos-radio-description">{description}</span>}
            </span>
          </span>
        )}
      </span>
      {checked && children && (
        <span className="sisyphos-radio-nested" onClick={(e) => e.stopPropagation()}>
          {children}
        </span>
      )}
    </label>
  );
});

Radio.displayName = "Radio";
