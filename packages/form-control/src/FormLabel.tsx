import React from "react";
import { cx } from "@sisyphos-ui/core/internal";
import { useFormControl } from "./context";

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  function FormLabel({ className, children, htmlFor, id, ...rest }, ref) {
    const ctx = useFormControl();
    return (
      <label
        ref={ref}
        id={id ?? ctx?.labelId}
        htmlFor={htmlFor ?? ctx?.id}
        className={cx("sisyphos-form-label", ctx?.disabled && "disabled", className)}
        {...rest}
      >
        {children}
        {ctx?.required && <span className="sisyphos-form-label-required" aria-hidden="true">*</span>}
      </label>
    );
  }
);

FormLabel.displayName = "FormLabel";
