/**
 * Spinner — Angular 18 standalone circular progress indicator.
 *
 * Inline SVG (avoids Firefox's anti-aliasing seam on `border-radius: 50%`
 * borders). Carries `role="status"` + an `aria-label` for screen readers.
 * Class names and SVG geometry match the React/Vue versions exactly so the
 * shared stylesheet works without changes.
 */
import { ChangeDetectionStrategy, Component, Input, computed, signal } from "@angular/core";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SpinnerColor =
  | "neutral"
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "inherit";
export type SpinnerVariant = "ring" | "double";

const VIEWBOX = 50;
const CENTER = VIEWBOX / 2;
const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC_OUTER = CIRCUMFERENCE * 0.25;
const ARC_INNER = CIRCUMFERENCE * 0.3;

@Component({
  selector: "sui-spinner",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [class]="rootClasses()"
      [style.--sisyphos-spinner-thickness.px]="thickness()"
      role="status"
      [attr.aria-label]="label()"
    >
      <svg
        class="sisyphos-spinner-svg"
        [attr.viewBox]="viewBox"
        aria-hidden="true"
        focusable="false"
      >
        <circle
          class="sisyphos-spinner-arc"
          [attr.cx]="center"
          [attr.cy]="center"
          [attr.r]="r"
          fill="none"
          stroke-linecap="round"
          [attr.stroke-dasharray]="dashOuter"
          [attr.pathLength]="circumference"
        />
      </svg>
      @if (variant() === "double") {
        <svg
          class="sisyphos-spinner-svg sisyphos-spinner-svg--inner"
          [attr.viewBox]="viewBox"
          aria-hidden="true"
          focusable="false"
        >
          <circle
            class="sisyphos-spinner-arc sisyphos-spinner-arc--inner"
            [attr.cx]="center"
            [attr.cy]="center"
            [attr.r]="r"
            fill="none"
            stroke-linecap="round"
            [attr.stroke-dasharray]="dashInner"
            [attr.pathLength]="circumference"
          />
        </svg>
      }
    </span>
  `,
})
export class Spinner {
  private readonly _size = signal<SpinnerSize>("md");
  private readonly _color = signal<SpinnerColor>("primary");
  private readonly _thickness = signal<number>(3);
  private readonly _variant = signal<SpinnerVariant>("ring");
  private readonly _label = signal<string>("Loading");

  readonly variant = this._variant.asReadonly();
  readonly thickness = this._thickness.asReadonly();
  readonly label = this._label.asReadonly();

  @Input("size") set sizeInput(v: SpinnerSize) {
    this._size.set(v);
  }
  @Input("color") set colorInput(v: SpinnerColor) {
    this._color.set(v);
  }
  @Input("thickness") set thicknessInput(v: number) {
    this._thickness.set(v);
  }
  @Input("variant") set variantInput(v: SpinnerVariant) {
    this._variant.set(v);
  }
  @Input("label") set labelInput(v: string) {
    this._label.set(v);
  }

  readonly viewBox = `0 0 ${VIEWBOX} ${VIEWBOX}`;
  readonly center = CENTER;
  readonly r = RADIUS;
  readonly circumference = CIRCUMFERENCE;
  readonly dashOuter = `${ARC_OUTER} ${CIRCUMFERENCE}`;
  readonly dashInner = `${ARC_INNER} ${CIRCUMFERENCE}`;

  readonly rootClasses = computed(
    () => `sisyphos-spinner ${this._size()} ${this._color()} ${this._variant()}`
  );
}
