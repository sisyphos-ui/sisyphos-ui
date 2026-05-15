/**
 * Skeleton — Angular 18 standalone placeholder block. Three shapes
 * (rectangular, circular, text) and three animations (shimmer, pulse, none).
 *
 * Mirrors the React/Vue bindings exactly: same class names, same default
 * sizing rules (text shape gets `height: 1em`; circular shape forces
 * `border-radius: 50%`).
 */
import { ChangeDetectionStrategy, Component, Input, computed, signal } from "@angular/core";

export type SkeletonShape = "rectangular" | "circular" | "text";
export type SkeletonAnimation = "shimmer" | "pulse" | "none";

function toSize(v: number | string | undefined): string | undefined {
  if (v === undefined || v === null) return undefined;
  return typeof v === "number" ? `${v}px` : v;
}

@Component({
  selector: "sui-skeleton",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [class]="rootClasses()"
      [style.width]="resolvedWidth()"
      [style.height]="resolvedHeight()"
      [style.border-radius]="resolvedRadius()"
      aria-hidden="true"
      data-testid="sisyphos-skeleton"
    >
      <ng-content />
    </span>
  `,
})
export class Skeleton {
  private readonly _shape = signal<SkeletonShape>("rectangular");
  private readonly _animation = signal<SkeletonAnimation>("shimmer");
  private readonly _width = signal<number | string | undefined>(undefined);
  private readonly _height = signal<number | string | undefined>(undefined);
  private readonly _radius = signal<number | string | undefined>(undefined);

  readonly shape = this._shape.asReadonly();
  readonly animation = this._animation.asReadonly();

  @Input("shape") set shapeInput(v: SkeletonShape) {
    this._shape.set(v);
  }
  @Input("animation") set animationInput(v: SkeletonAnimation) {
    this._animation.set(v);
  }
  @Input("width") set widthInput(v: number | string | undefined) {
    this._width.set(v);
  }
  @Input("height") set heightInput(v: number | string | undefined) {
    this._height.set(v);
  }
  @Input("radius") set radiusInput(v: number | string | undefined) {
    this._radius.set(v);
  }

  readonly rootClasses = computed(() => `sisyphos-skeleton ${this._shape()} ${this._animation()}`);

  readonly resolvedWidth = computed(() => toSize(this._width()) ?? null);

  readonly resolvedHeight = computed(() => {
    const explicit = toSize(this._height());
    if (explicit !== undefined) return explicit;
    return this._shape() === "text" ? "1em" : null;
  });

  readonly resolvedRadius = computed(() => {
    if (this._shape() === "circular") return "50%";
    return toSize(this._radius()) ?? null;
  });
}
