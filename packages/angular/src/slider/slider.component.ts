/**
 * Slider — Angular 18 standalone single-thumb or range slider.
 *
 * Single mode: `[(value)]="n"` (number).
 * Range mode: `[(values)]="[a, b]"` (tuple) with `range="true"`.
 *
 * Mouse + touch + keyboard (Arrow / Page / Home / End). Mirrors the
 * React/Vue versions: same class names, same step-snapping, same minGap.
 */
import type { ElementRef, OnDestroy } from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  computed,
  signal,
} from "@angular/core";

let sliderCounter = 0;

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function snap(value: number, min: number, step: number): number {
  return Math.round((value - min) / step) * step + min;
}

@Component({
  selector: "sui-slider",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="rootClasses()">
      @if (showValue() && range()) {
        <div class="sisyphos-slider-values">
          <span>{{ formatValueOf(0) }}</span>
          <span>{{ formatValueOf(1) }}</span>
        </div>
      }
      @if (showValue() && !range()) {
        <div class="sisyphos-slider-values single">
          <span [style.margin-left]="'calc(' + startPct() + '% - 16px)'">{{
            formatValueOf(0)
          }}</span>
        </div>
      }
      <div #track class="sisyphos-slider-track" (mousedown)="onTrackMousedown($event)">
        <div
          class="sisyphos-slider-progress"
          [style.left]="range() ? startPct() + '%' : '0'"
          [style.width]="range() ? endPct() - startPct() + '%' : endPct() + '%'"
        ></div>
        @if (!range()) {
          <button
            type="button"
            [id]="labelIds[0]"
            role="slider"
            [attr.aria-valuemin]="min()"
            [attr.aria-valuemax]="max()"
            [attr.aria-valuenow]="current()[0]"
            [attr.aria-label]="ariaLabelOf(0)"
            [attr.aria-disabled]="disabled() || null"
            [tabindex]="disabled() ? -1 : 0"
            [disabled]="disabled()"
            class="sisyphos-slider-thumb"
            [style.left]="startPct() + '%'"
            (mousedown)="onThumbDown(0, $event)"
            (touchstart)="onThumbDown(0, $event)"
            (keydown)="onThumbKeydown(0, $event)"
          ></button>
        } @else {
          <button
            type="button"
            [id]="labelIds[0]"
            role="slider"
            [attr.aria-valuemin]="min()"
            [attr.aria-valuemax]="current()[1] - minGap()"
            [attr.aria-valuenow]="current()[0]"
            [attr.aria-label]="ariaLabelOf(0) || 'Minimum'"
            [attr.aria-disabled]="disabled() || null"
            [tabindex]="disabled() ? -1 : 0"
            [disabled]="disabled()"
            class="sisyphos-slider-thumb"
            [style.left]="startPct() + '%'"
            (mousedown)="onThumbDown(0, $event)"
            (touchstart)="onThumbDown(0, $event)"
            (keydown)="onThumbKeydown(0, $event)"
          ></button>
          <button
            type="button"
            [id]="labelIds[1]"
            role="slider"
            [attr.aria-valuemin]="current()[0] + minGap()"
            [attr.aria-valuemax]="max()"
            [attr.aria-valuenow]="current()[1]"
            [attr.aria-label]="ariaLabelOf(1) || 'Maximum'"
            [attr.aria-disabled]="disabled() || null"
            [tabindex]="disabled() ? -1 : 0"
            [disabled]="disabled()"
            class="sisyphos-slider-thumb"
            [style.left]="endPct() + '%'"
            (mousedown)="onThumbDown(1, $event)"
            (touchstart)="onThumbDown(1, $event)"
            (keydown)="onThumbKeydown(1, $event)"
          ></button>
        }
      </div>
    </div>
  `,
})
export class Slider implements OnDestroy {
  private readonly _id = ++sliderCounter;
  readonly labelIds: [string, string] = [
    `sisyphos-slider-${this._id}-thumb-0`,
    `sisyphos-slider-${this._id}-thumb-1`,
  ];

  private readonly _min = signal(0);
  private readonly _max = signal(100);
  private readonly _step = signal(1);
  private readonly _disabled = signal(false);
  private readonly _size = signal<"sm" | "md" | "lg">("md");
  private readonly _color = signal<"primary" | "success" | "error" | "warning" | "info">("primary");
  private readonly _showValue = signal(false);
  private readonly _formatValue = signal<(v: number) => string>((v) => String(v));
  private readonly _ariaLabel = signal<string | [string, string] | undefined>(undefined);
  private readonly _range = signal(false);
  private readonly _minGap = signal(0);

  /** Internal tuple. In single mode both indices share the same value. */
  private readonly _tuple = signal<[number, number]>([0, 0]);

  readonly min = this._min.asReadonly();
  readonly max = this._max.asReadonly();
  readonly step = this._step.asReadonly();
  readonly disabled = this._disabled.asReadonly();
  readonly range = this._range.asReadonly();
  readonly minGap = this._minGap.asReadonly();
  readonly showValue = this._showValue.asReadonly();
  readonly current = this._tuple.asReadonly();

  @Input("min") set minInput(v: number) {
    this._min.set(v);
  }
  @Input("max") set maxInput(v: number) {
    this._max.set(v);
  }
  @Input("step") set stepInput(v: number) {
    this._step.set(v);
  }
  @Input("disabled") set disabledInput(v: boolean) {
    this._disabled.set(v);
  }
  @Input("size") set sizeInput(v: "sm" | "md" | "lg") {
    this._size.set(v);
  }
  @Input("color") set colorInput(v: "primary" | "success" | "error" | "warning" | "info") {
    this._color.set(v);
  }
  @Input("showValue") set showValueInput(v: boolean) {
    this._showValue.set(v);
  }
  @Input("formatValue") set formatValueInput(fn: (v: number) => string) {
    if (typeof fn === "function") this._formatValue.set(fn);
  }
  @Input("ariaLabel") set ariaLabelInput(v: string | [string, string] | undefined) {
    this._ariaLabel.set(v);
  }
  @Input("range") set rangeInput(v: boolean) {
    this._range.set(v);
  }
  @Input("minGap") set minGapInput(v: number) {
    this._minGap.set(v);
  }

  /** Single-mode value. */
  @Input("value") set valueInput(v: number | undefined) {
    if (v === undefined) return;
    if (!this._range()) this._tuple.set([v, v]);
  }
  /** Range-mode values. */
  @Input("values") set valuesInput(v: [number, number] | undefined) {
    if (v && this._range()) this._tuple.set([v[0], v[1]]);
  }

  @Output() readonly valueChange = new EventEmitter<number>();
  @Output() readonly valuesChange = new EventEmitter<[number, number]>();

  @ViewChild("track") trackRef?: ElementRef<HTMLDivElement>;

  private dragIdx: 0 | 1 | null = null;
  private moveHandler?: (e: MouseEvent | TouchEvent) => void;
  private upHandler?: () => void;

  readonly startPct = computed(() => this.pct(this._tuple()[0]));
  readonly endPct = computed(() =>
    this._range() ? this.pct(this._tuple()[1]) : this.pct(this._tuple()[0])
  );

  readonly rootClasses = computed(() =>
    [
      "sisyphos-slider",
      this._size(),
      this._color(),
      this._disabled() && "disabled",
      this._range() && "range",
    ]
      .filter(Boolean)
      .join(" ")
  );

  ngOnDestroy(): void {
    this.detachDocListeners();
  }

  pct(v: number): number {
    return ((v - this._min()) / (this._max() - this._min())) * 100;
  }

  formatValueOf(idx: 0 | 1): string {
    return this._formatValue()(this._tuple()[idx]);
  }

  ariaLabelOf(idx: 0 | 1): string | undefined {
    const a = this._ariaLabel();
    if (Array.isArray(a)) return a[idx];
    return a;
  }

  private valueFromClientX(clientX: number): number {
    const el = this.trackRef?.nativeElement;
    if (!el) return this._min();
    const rect = el.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    const raw = this._min() + ratio * (this._max() - this._min());
    return clamp(snap(raw, this._min(), this._step()), this._min(), this._max());
  }

  private updateThumb(idx: 0 | 1, value: number): void {
    const [a, b] = this._tuple();
    let next: [number, number];
    if (!this._range()) {
      next = [value, value];
    } else if (idx === 0) {
      next = [Math.min(value, b - this._minGap()), b];
    } else {
      next = [a, Math.max(value, a + this._minGap())];
    }
    if (next[0] === a && next[1] === b) return;
    this._tuple.set(next);
    if (this._range()) this.valuesChange.emit(next);
    else this.valueChange.emit(next[0]);
  }

  // ── Pointer / track handlers ──────────────────────────────────────────

  onTrackMousedown(event: MouseEvent): void {
    if (this._disabled()) return;
    const v = this.valueFromClientX(event.clientX);
    if (!this._range()) {
      this.updateThumb(0, v);
      return;
    }
    const [a, b] = this._tuple();
    const idx: 0 | 1 = Math.abs(v - a) <= Math.abs(v - b) ? 0 : 1;
    this.updateThumb(idx, v);
  }

  onThumbDown(idx: 0 | 1, event: MouseEvent | TouchEvent): void {
    if (this._disabled()) return;
    event.preventDefault();
    this.dragIdx = idx;
    this.attachDocListeners();
  }

  onThumbKeydown(idx: 0 | 1, event: KeyboardEvent): void {
    if (this._disabled()) return;
    let delta = 0;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") delta = this._step();
    else if (event.key === "ArrowLeft" || event.key === "ArrowDown") delta = -this._step();
    else if (event.key === "PageUp") delta = this._step() * 10;
    else if (event.key === "PageDown") delta = -this._step() * 10;
    else if (event.key === "Home") {
      event.preventDefault();
      const target = !this._range()
        ? this._min()
        : idx === 0
          ? this._min()
          : this._tuple()[0] + this._minGap();
      this.updateThumb(idx, target);
      return;
    } else if (event.key === "End") {
      event.preventDefault();
      const target = !this._range()
        ? this._max()
        : idx === 1
          ? this._max()
          : this._tuple()[1] - this._minGap();
      this.updateThumb(idx, target);
      return;
    } else {
      return;
    }
    event.preventDefault();
    this.updateThumb(idx, this._tuple()[idx] + delta);
  }

  private attachDocListeners(): void {
    this.moveHandler = (e: MouseEvent | TouchEvent) => {
      if (this.dragIdx === null) return;
      const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
      const v = this.valueFromClientX(clientX);
      this.updateThumb(this.dragIdx, v);
    };
    this.upHandler = () => {
      this.dragIdx = null;
      this.detachDocListeners();
    };
    window.addEventListener("mousemove", this.moveHandler);
    window.addEventListener("touchmove", this.moveHandler);
    window.addEventListener("mouseup", this.upHandler);
    window.addEventListener("touchend", this.upHandler);
  }

  private detachDocListeners(): void {
    if (this.moveHandler) {
      window.removeEventListener("mousemove", this.moveHandler);
      window.removeEventListener("touchmove", this.moveHandler);
      this.moveHandler = undefined;
    }
    if (this.upHandler) {
      window.removeEventListener("mouseup", this.upHandler);
      window.removeEventListener("touchend", this.upHandler);
      this.upHandler = undefined;
    }
  }
}
