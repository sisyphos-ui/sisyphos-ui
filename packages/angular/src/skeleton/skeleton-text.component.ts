/**
 * SkeletonText — Angular 18 standalone N-line text skeleton. The last line
 * is narrower (60%) by default so the placeholder resembles a paragraph.
 *
 * Mirrors the React/Vue versions; computes line widths the same way.
 */
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  signal,
} from "@angular/core";
import { Skeleton, type SkeletonAnimation } from "./skeleton.component";

@Component({
  selector: "sui-skeleton-text",
  standalone: true,
  imports: [Skeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sisyphos-skeleton-text" [style.gap]="gap()">
      @for (i of indexes(); track i) {
        <sui-skeleton
          shape="text"
          [animation]="animation()"
          [height]="lineHeight()"
          [width]="lineWidth(i)"
        />
      }
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      div.sisyphos-skeleton-text { display: flex; flex-direction: column; }
    `,
  ],
})
export class SkeletonText {
  private readonly _lines = signal(3);
  private readonly _animation = signal<SkeletonAnimation>("shimmer");
  private readonly _lastNarrow = signal(true);
  private readonly _lineHeight = signal<number | string>("1em");
  private readonly _gap = signal<number | string>("0.5em");

  readonly animation = this._animation.asReadonly();
  readonly lineHeight = this._lineHeight.asReadonly();
  readonly gap = computed(() => {
    const v = this._gap();
    return typeof v === "number" ? `${v}px` : v;
  });

  @Input("lines") set linesInput(v: number) { this._lines.set(v); }
  @Input("animation") set animationInput(v: SkeletonAnimation) { this._animation.set(v); }
  @Input("lastNarrow") set lastNarrowInput(v: boolean) { this._lastNarrow.set(v); }
  @Input("lineHeight") set lineHeightInput(v: number | string) { this._lineHeight.set(v); }
  @Input("gap") set gapInput(v: number | string) { this._gap.set(v); }

  readonly indexes = computed(() => Array.from({ length: this._lines() }, (_, i) => i));

  lineWidth = (i: number): string =>
    this._lastNarrow() && i === this._lines() - 1 ? "60%" : "100%";
}
