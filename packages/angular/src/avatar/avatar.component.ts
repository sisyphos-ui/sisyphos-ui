/**
 * Avatar — Angular 18 standalone binding.
 *
 * Image with graceful fallback to initials or projected content. Mirrors the
 * React/Vue bindings' `getInitials` rule and class names exactly so the same
 * stylesheet works for all three.
 *
 * Usage:
 *   <sui-avatar src="/me.jpg" alt="Volkan" name="Volkan Günay" />
 *   <sui-avatar name="Ada Lovelace" color="primary" />
 *   <sui-avatar name="John">
 *     <svg ...><!-- custom fallback --></svg>
 *   </sui-avatar>
 *
 * Implementation note: inputs are wired via aliased @Input setters that update
 * internal signals. This keeps every prop reactive (computeds, effects) while
 * remaining compatible with the AnalogJS+Vitest test runner — `input()`
 * signals are not picked up in that JIT environment.
 */
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  effect,
  signal,
  untracked,
} from "@angular/core";
import { getInitials } from "./initials";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarColor = "neutral" | "primary" | "success" | "error" | "warning" | "info";
export type AvatarShape = "circular" | "rounded" | "square";

@Component({
  selector: "sui-avatar",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="rootClasses()">
      @if (showImage()) {
        <img
          class="sisyphos-avatar-image"
          [src]="src()"
          [alt]="alt() ?? name() ?? ''"
          draggable="false"
          (error)="onImageError()"
        />
      } @else {
        <span class="sisyphos-avatar-fallback" [attr.aria-label]="alt() ?? name() ?? null">
          <ng-content>{{ fallback() ?? initials() }}</ng-content>
        </span>
      }
    </span>
  `,
})
export class Avatar {
  private readonly _src = signal<string | undefined>(undefined);
  private readonly _alt = signal<string | undefined>(undefined);
  private readonly _name = signal<string | undefined>(undefined);
  private readonly _initialsMax = signal<number>(2);
  private readonly _fallback = signal<string | undefined>(undefined);
  private readonly _size = signal<AvatarSize>("md");
  private readonly _color = signal<AvatarColor>("neutral");
  private readonly _shape = signal<AvatarShape>("circular");

  readonly src = this._src.asReadonly();
  readonly alt = this._alt.asReadonly();
  readonly name = this._name.asReadonly();
  readonly initialsMax = this._initialsMax.asReadonly();
  readonly fallback = this._fallback.asReadonly();
  readonly size = this._size.asReadonly();
  readonly color = this._color.asReadonly();
  readonly shape = this._shape.asReadonly();

  @Input("src") set srcInput(v: string | undefined) {
    this._src.set(v);
  }
  @Input("alt") set altInput(v: string | undefined) {
    this._alt.set(v);
  }
  @Input("name") set nameInput(v: string | undefined) {
    this._name.set(v);
  }
  @Input("initialsMax") set initialsMaxInput(v: number) {
    this._initialsMax.set(v);
  }
  @Input("fallback") set fallbackInput(v: string | undefined) {
    this._fallback.set(v);
  }
  @Input("size") set sizeInput(v: AvatarSize) {
    this._size.set(v);
  }
  @Input("color") set colorInput(v: AvatarColor) {
    this._color.set(v);
  }
  @Input("shape") set shapeInput(v: AvatarShape) {
    this._shape.set(v);
  }

  /** Tracks image load failures so we can fall back to initials. */
  private readonly imgFailed = signal(false);

  readonly initials = computed(() => getInitials(this._name(), this._initialsMax()));

  readonly showImage = computed(() => Boolean(this._src()) && !this.imgFailed());

  readonly rootClasses = computed(
    () => `sisyphos-avatar ${this._size()} ${this._color()} ${this._shape()}`
  );

  constructor() {
    // Reset failure flag whenever the source URL changes — matches React's
    // `useEffect([src])` and Vue's `watch(() => props.src)` semantics.
    effect(() => {
      // Track src; reset imgFailed without retracking it.
      void this._src();
      untracked(() => this.imgFailed.set(false));
    });
  }

  onImageError(): void {
    this.imgFailed.set(true);
  }
}
