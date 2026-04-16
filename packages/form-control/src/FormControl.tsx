/**
 * FormControl — compound wrapper that coordinates id/ARIA wiring between
 * `FormLabel`, the input element, `FormHelperText`, and `FormErrorText`.
 *
 * @example
 *   <FormControl required error={!!err}>
 *     <FormLabel>Email</FormLabel>
 *     <input {...register("email")} />
 *     <FormHelperText>We'll never share it.</FormHelperText>
 *     <FormErrorText>{err}</FormErrorText>
 *   </FormControl>
 */
import React, { useId, useMemo, type ReactNode } from "react";
import { cx } from "@sisyphos-ui/core/internal";
import { FormControlContext } from "./context";
import "./FormControl.scss";

export interface FormControlProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  /** Stable id for the input element. Auto-generated when omitted. */
  id?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

export const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  function FormControl(
    {
      id: idProp,
      disabled = false,
      required = false,
      readOnly = false,
      error = false,
      fullWidth = false,
      className,
      children,
      ...rest
    },
    ref
  ) {
    const reactId = useId();
    const id = idProp ?? `sisyphos-field-${reactId}`;

    const ctx = useMemo(
      () => ({
        id,
        labelId: `${id}-label`,
        helperId: `${id}-helper`,
        errorId: `${id}-error`,
        disabled,
        required,
        readOnly,
        error,
        describedBy: error ? `${id}-error` : `${id}-helper`,
      }),
      [id, disabled, required, readOnly, error]
    );

    return (
      <FormControlContext.Provider value={ctx}>
        <div
          ref={ref}
          className={cx(
            "sisyphos-form-control",
            error && "error",
            disabled && "disabled",
            fullWidth && "full-width",
            className
          )}
          {...rest}
        >
          {children}
        </div>
      </FormControlContext.Provider>
    );
  }
);

FormControl.displayName = "FormControl";
