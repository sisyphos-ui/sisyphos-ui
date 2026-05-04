import React from "react";
import { cx } from "@sisyphos-ui/core/internal";
import { useFormControl } from "./context";

export interface FormHelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const FormHelperText = React.forwardRef<HTMLParagraphElement, FormHelperTextProps>(
  function FormHelperText({ className, children, id, ...rest }, ref) {
    const ctx = useFormControl();
    if (ctx?.error) return null;
    return (
      <p
        ref={ref}
        id={id ?? ctx?.helperId}
        className={cx("sisyphos-form-helper-text", className)}
        {...rest}
      >
        {children}
      </p>
    );
  }
);

FormHelperText.displayName = "FormHelperText";

export interface FormErrorTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const FormErrorText = React.forwardRef<HTMLParagraphElement, FormErrorTextProps>(
  function FormErrorText({ className, children, id, ...rest }, ref) {
    const ctx = useFormControl();
    if (ctx && !ctx.error) return null;
    return (
      <p
        ref={ref}
        id={id ?? ctx?.errorId}
        role="alert"
        className={cx("sisyphos-form-error-text", className)}
        {...rest}
      >
        {children}
      </p>
    );
  }
);

FormErrorText.displayName = "FormErrorText";
