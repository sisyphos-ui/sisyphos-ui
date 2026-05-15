/**
 * Card — Angular 18 standalone surface container.
 *
 * Use on its own for simple content or compose with `<sui-card-header>`,
 * `<sui-card-body>`, `<sui-card-footer>` for structured layouts. The
 * compound API mirrors `Card.Header / Card.Body / Card.Footer` from the React
 * binding — Angular doesn't have static class members for components, so each
 * slot is its own standalone component.
 *
 * Usage:
 *   <sui-card variant="elevated" padding="md">
 *     <sui-card-header>Title</sui-card-header>
 *     <sui-card-body>...</sui-card-body>
 *     <sui-card-footer>...</sui-card-footer>
 *   </sui-card>
 */
import { ChangeDetectionStrategy, Component, Input, computed, signal } from "@angular/core";

export type CardVariant = "elevated" | "outlined" | "filled";
export type CardPadding = "none" | "sm" | "md" | "lg";

@Component({
  selector: "sui-card",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="rootClasses()"
      [attr.tabindex]="interactive() ? 0 : null"
      [attr.role]="interactive() ? 'button' : null"
    >
      <ng-content />
    </div>
  `,
})
export class Card {
  private readonly _variant = signal<CardVariant>("elevated");
  private readonly _padding = signal<CardPadding>("md");
  private readonly _interactive = signal(false);

  readonly variant = this._variant.asReadonly();
  readonly padding = this._padding.asReadonly();
  readonly interactive = this._interactive.asReadonly();

  @Input("variant") set variantInput(v: CardVariant) {
    this._variant.set(v);
  }
  @Input("padding") set paddingInput(v: CardPadding) {
    this._padding.set(v);
  }
  @Input("interactive") set interactiveInput(v: boolean) {
    this._interactive.set(v);
  }

  readonly rootClasses = computed(() =>
    [
      "sisyphos-card",
      this._variant(),
      `padding-${this._padding()}`,
      this._interactive() && "interactive",
    ]
      .filter(Boolean)
      .join(" ")
  );
}

@Component({
  selector: "sui-card-header",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<header class="sisyphos-card-header"><ng-content /></header>`,
})
export class CardHeader {}

@Component({
  selector: "sui-card-body",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="sisyphos-card-body"><ng-content /></div>`,
})
export class CardBody {}

@Component({
  selector: "sui-card-footer",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<footer class="sisyphos-card-footer"><ng-content /></footer>`,
})
export class CardFooter {}
