/**
 * LoadingOverlay — centered spinner with optional label. Renders as a
 * fullscreen overlay (via CDK-style Teleport — here we use a structural
 * directive-free approach by appending to body), absolute overlay, or
 * inline. Matches the React/Vue API surface and class names.
 *
 * Note: for `fullscreen`, Angular's standard pattern is to render into the
 * component tree as `position: fixed`. The `Portal` package the React/Vue
 * versions use isn't required here because Angular components render where
 * they're declared, and `position: fixed` with high z-index achieves the
 * same effect for an overlay backdrop. Consumers needing strict body-mount
 * semantics can wrap with their own portal/CDK overlay.
 */
import { ChangeDetectionStrategy, Component, Input, computed, signal } from "@angular/core";
import { Spinner, type SpinnerColor, type SpinnerSize } from "./spinner.component";

export type LoadingOverlayVariant = "fullscreen" | "overlay" | "inline";

@Component({
  selector: "sui-loading-overlay",
  standalone: true,
  imports: [Spinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div [class]="rootClasses()" role="status" aria-live="polite">
        @if (variant() !== "inline") {
          <div class="sisyphos-loading-overlay-backdrop" aria-hidden="true"></div>
        }
        <div class="sisyphos-loading-overlay-content">
          <ng-content select="[icon]">
            <sui-spinner size="lg" [color]="spinnerColor()" />
          </ng-content>
          @if (text()) {
            <p class="sisyphos-loading-overlay-text">{{ text() }}</p>
          }
          <ng-content />
        </div>
      </div>
    }
  `,
})
export class LoadingOverlay {
  private readonly _variant = signal<LoadingOverlayVariant>("inline");
  private readonly _open = signal(true);
  private readonly _text = signal<string | undefined>(undefined);
  private readonly _blur = signal(true);
  private readonly _spinnerColor = signal<SpinnerColor>("primary");
  private readonly _spinnerSize = signal<SpinnerSize>("lg");

  readonly variant = this._variant.asReadonly();
  readonly open = this._open.asReadonly();
  readonly text = this._text.asReadonly();
  readonly spinnerColor = this._spinnerColor.asReadonly();

  @Input("variant") set variantInput(v: LoadingOverlayVariant) {
    this._variant.set(v);
  }
  @Input("open") set openInput(v: boolean) {
    this._open.set(v);
  }
  @Input("text") set textInput(v: string | undefined) {
    this._text.set(v);
  }
  @Input("blur") set blurInput(v: boolean) {
    this._blur.set(v);
  }
  @Input("spinnerColor") set spinnerColorInput(v: SpinnerColor) {
    this._spinnerColor.set(v);
  }
  @Input("spinnerSize") set spinnerSizeInput(v: SpinnerSize) {
    this._spinnerSize.set(v);
  }

  readonly rootClasses = computed(() =>
    ["sisyphos-loading-overlay", this._variant(), this._blur() && "blur"].filter(Boolean).join(" ")
  );
}
