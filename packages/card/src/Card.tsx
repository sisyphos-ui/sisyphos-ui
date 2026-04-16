/**
 * Card — surface container. Use on its own for simple content or compose with
 * `Card.Header`, `Card.Body`, and `Card.Footer` for structured layouts.
 */
import React from "react";
import { cx } from "@sisyphos-ui/core/internal";
import "./Card.scss";

export type CardVariant = "elevated" | "outlined" | "filled";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  /** Body padding when the compound slots are not used. */
  padding?: CardPadding;
  /** Marks the whole card as focusable/clickable (role="button", tabIndex=0). */
  interactive?: boolean;
}

interface CardComponent extends React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>> {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
}

const CardRoot = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = "elevated", padding = "md", interactive = false, className, children, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={cx("sisyphos-card", variant, `padding-${padding}`, interactive && "interactive", className)}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? "button" : undefined}
      {...rest}
    >
      {children}
    </div>
  );
});

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function CardHeader(
  { className, children, ...rest },
  ref
) {
  return (
    <header ref={ref} className={cx("sisyphos-card-header", className)} {...rest}>
      {children}
    </header>
  );
});

const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function CardBody(
  { className, children, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cx("sisyphos-card-body", className)} {...rest}>
      {children}
    </div>
  );
});

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function CardFooter(
  { className, children, ...rest },
  ref
) {
  return (
    <footer ref={ref} className={cx("sisyphos-card-footer", className)} {...rest}>
      {children}
    </footer>
  );
});

CardRoot.displayName = "Card";
CardHeader.displayName = "Card.Header";
CardBody.displayName = "Card.Body";
CardFooter.displayName = "Card.Footer";

export const Card = CardRoot as CardComponent;
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
