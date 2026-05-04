/**
 * Carousel — Angular 18 standalone sliding content area.
 *
 * Optional autoplay (paused on hover/focus), navigation arrows, dot
 * indicators, arrow-key navigation. Mirrors React/Vue API; slides are
 * provided as an array `[items]` plus a single `<ng-template>` used to
 * render each — Angular's idiomatic data-driven projection. Class names
 * and ARIA mirror the React version exactly.
 *
 * @example
 *   <sui-carousel [items]="photos" autoPlay [autoPlayInterval]="3000">
 *     <ng-template let-photo let-i="index">
 *       <img [src]="photo.url" [alt]="photo.alt" />
 *     </ng-template>
 *   </sui-carousel>
 */
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  computed,
  effect,
  signal,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

@Component({
  selector: "sui-carousel",
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (count() > 0) {
      <div
        role="region"
        [attr.aria-roledescription]="ariaLabel()"
        [tabindex]="0"
        class="sisyphos-carousel"
        (keydown)="handleKeydown($event)"
        (mouseenter)="onHoverEnter()"
        (mouseleave)="onHoverLeave()"
        (focusin)="onHoverEnter()"
        (focusout)="onHoverLeave()"
      >
        <div class="sisyphos-carousel-viewport">
          <div class="sisyphos-carousel-track" [style.transform]="trackTransform()">
            @for (item of items(); track $index; let i = $index) {
              <div
                class="sisyphos-carousel-slide"
                role="group"
                aria-roledescription="slide"
                [attr.aria-label]="(i + 1) + ' of ' + count()"
                [attr.aria-hidden]="i !== current()"
              >
                <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item, index: i }" />
              </div>
            }
          </div>
          @if (showArrows() && hasMultiple()) {
            <button
              type="button"
              class="sisyphos-carousel-arrow prev"
              aria-label="Previous slide"
              [disabled]="!loop() && current() === 0"
              (click)="prev()"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M15 18L9 12L15 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              class="sisyphos-carousel-arrow next"
              aria-label="Next slide"
              [disabled]="!loop() && current() === count() - 1"
              (click)="next()"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path d="M9 18L15 12L9 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          }
        </div>
        @if (showDots() && hasMultiple()) {
          <div class="sisyphos-carousel-dots" role="tablist" aria-label="Slide selector">
            @for (item of items(); track $index; let i = $index) {
              <button
                type="button"
                role="tab"
                [attr.aria-selected]="i === current()"
                [attr.aria-label]="'Go to slide ' + (i + 1)"
                [class]="'sisyphos-carousel-dot' + (i === current() ? ' active' : '')"
                (click)="goTo(i)"
              ></button>
            }
          </div>
        }
      </div>
    }
  `,
})
export class Carousel implements AfterContentInit, OnDestroy {
  @ContentChild(TemplateRef) itemTemplate: TemplateRef<{ $implicit: unknown; index: number }> | null = null;

  private readonly _items = signal<readonly unknown[]>([]);
  private readonly _index = signal(0);
  private readonly _autoPlay = signal(false);
  private readonly _autoPlayInterval = signal(5000);
  private readonly _loop = signal(true);
  private readonly _showArrows = signal(true);
  private readonly _showDots = signal(true);
  private readonly _pauseOnHover = signal(true);
  private readonly _ariaLabel = signal<string>("carousel");
  private readonly _paused = signal(false);

  readonly items = this._items.asReadonly();
  readonly current = this._index.asReadonly();
  readonly autoPlay = this._autoPlay.asReadonly();
  readonly autoPlayInterval = this._autoPlayInterval.asReadonly();
  readonly loop = this._loop.asReadonly();
  readonly showArrows = this._showArrows.asReadonly();
  readonly showDots = this._showDots.asReadonly();
  readonly pauseOnHover = this._pauseOnHover.asReadonly();
  readonly ariaLabel = this._ariaLabel.asReadonly();

  @Input("items") set itemsInput(v: readonly unknown[]) { this._items.set(v ?? []); }
  @Input("index") set indexInput(v: number | undefined) {
    if (v !== undefined) this._index.set(v);
  }
  @Input("defaultIndex") set defaultIndexInput(v: number | undefined) {
    if (v !== undefined && this._index() === 0) this._index.set(v);
  }
  @Input("autoPlay") set autoPlayInput(v: boolean) { this._autoPlay.set(v); }
  @Input("autoPlayInterval") set autoPlayIntervalInput(v: number) { this._autoPlayInterval.set(v); }
  @Input("loop") set loopInput(v: boolean) { this._loop.set(v); }
  @Input("showArrows") set showArrowsInput(v: boolean) { this._showArrows.set(v); }
  @Input("showDots") set showDotsInput(v: boolean) { this._showDots.set(v); }
  @Input("pauseOnHover") set pauseOnHoverInput(v: boolean) { this._pauseOnHover.set(v); }
  @Input("ariaLabel") set ariaLabelInput(v: string) { this._ariaLabel.set(v); }

  /** Two-way `[(index)]` sugar. */
  @Output() readonly indexChange = new EventEmitter<number>();

  readonly count = computed(() => this._items().length);
  readonly hasMultiple = computed(() => this.count() > 1);
  readonly trackTransform = computed(() => `translateX(-${this._index() * 100}%)`);

  private timer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Re-arm autoplay whenever inputs that affect it change.
    effect(() => {
      const run = this._autoPlay() && !this._paused() && this.count() > 1;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      if (run) {
        this.timer = setInterval(() => this.next(), this._autoPlayInterval());
      }
    });
  }

  ngAfterContentInit(): void {
    // Template ref is now resolvable — no-op, but lifecycle hook is here in
    // case future consumers want to plug into it.
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  goTo(target: number): void {
    const c = this.count();
    if (c === 0) return;
    if (!this._loop() && (target < 0 || target >= c)) return;
    const clamped = ((target % c) + c) % c;
    this._index.set(clamped);
    this.indexChange.emit(clamped);
  }

  next(): void {
    this.goTo(this._index() + 1);
  }

  prev(): void {
    this.goTo(this._index() - 1);
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      this.next();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      this.prev();
    }
  }

  onHoverEnter(): void {
    if (this._pauseOnHover()) this._paused.set(true);
  }

  onHoverLeave(): void {
    if (this._pauseOnHover()) this._paused.set(false);
  }
}
