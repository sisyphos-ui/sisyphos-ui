/**
 * PageSkeleton — preset layout skeletons for full pages.
 *
 * Same layout presets and section-toggle props as the React/Vue versions
 * (`default`, `cards`, `table`, `detail`). Mounts `<sui-skeleton>` and
 * `<sui-skeleton-text>` building blocks under the same class names so the
 * shared stylesheet works.
 */
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  signal,
} from "@angular/core";
import { Skeleton, type SkeletonAnimation } from "./skeleton.component";
import { SkeletonText } from "./skeleton-text.component";

export type PageSkeletonLayout = "default" | "cards" | "table" | "detail";

@Component({
  selector: "sui-page-skeleton",
  standalone: true,
  imports: [Skeleton, SkeletonText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="rootClasses()" role="status" aria-label="Loading page">
      @if (showHeader()) {
        <div class="sisyphos-page-skeleton-header">
          <sui-skeleton shape="circular" [width]="40" [height]="40" [animation]="animation()" />
          <div class="sisyphos-page-skeleton-header-text">
            <sui-skeleton width="40%" [height]="18" [animation]="animation()" />
            <sui-skeleton width="60%" [height]="12" [animation]="animation()" />
          </div>
        </div>
      }

      @if (layout() === 'default' || layout() === 'cards') {
        @if (cardCount() > 0) {
          <div
            class="sisyphos-page-skeleton-cards"
            [style.grid-template-columns]="cardsGridTemplate()"
          >
            @for (_ of cardIndexes(); track $index) {
              <div class="sisyphos-page-skeleton-card">
                <sui-skeleton width="40%" [height]="12" [animation]="animation()" />
                <sui-skeleton width="70%" [height]="24" [animation]="animation()" />
                <sui-skeleton width="30%" [height]="10" [animation]="animation()" />
              </div>
            }
          </div>
        }
      }

      @if (layout() === 'default' || layout() === 'table') {
        @if (tableRows() > 0) {
          <div class="sisyphos-page-skeleton-table">
            <div class="sisyphos-page-skeleton-table-header">
              @for (_ of columnIndexes(); track $index) {
                <sui-skeleton [height]="12" width="70%" [animation]="animation()" />
              }
            </div>
            @for (_ of rowIndexes(); track $index) {
              <div class="sisyphos-page-skeleton-table-row">
                @for (c of columnIndexes(); track c) {
                  <sui-skeleton
                    [height]="12"
                    [width]="cellWidth(c)"
                    [animation]="animation()"
                  />
                }
              </div>
            }
          </div>
        }
      }

      @if (layout() === 'detail') {
        <div class="sisyphos-page-skeleton-detail">
          <sui-skeleton [width]="160" [height]="120" [animation]="animation()" />
          <div class="sisyphos-page-skeleton-detail-body">
            <sui-skeleton width="50%" [height]="20" [animation]="animation()" />
            <sui-skeleton-text [lines]="4" [animation]="animation()" />
          </div>
        </div>
      }
    </div>
  `,
})
export class PageSkeleton {
  private readonly _layout = signal<PageSkeletonLayout>("default");
  private readonly _showHeader = signal(true);
  private readonly _cardCount = signal(3);
  private readonly _tableRows = signal(5);
  private readonly _tableColumns = signal(4);
  private readonly _animation = signal<SkeletonAnimation>("shimmer");

  readonly layout = this._layout.asReadonly();
  readonly showHeader = this._showHeader.asReadonly();
  readonly cardCount = this._cardCount.asReadonly();
  readonly tableRows = this._tableRows.asReadonly();
  readonly animation = this._animation.asReadonly();

  @Input("layout") set layoutInput(v: PageSkeletonLayout) { this._layout.set(v); }
  @Input("showHeader") set showHeaderInput(v: boolean) { this._showHeader.set(v); }
  @Input("cardCount") set cardCountInput(v: number) { this._cardCount.set(v); }
  @Input("tableRows") set tableRowsInput(v: number) { this._tableRows.set(v); }
  @Input("tableColumns") set tableColumnsInput(v: number) { this._tableColumns.set(v); }
  @Input("animation") set animationInput(v: SkeletonAnimation) { this._animation.set(v); }

  readonly rootClasses = computed(() => `sisyphos-page-skeleton ${this._layout()}`);
  readonly cardsGridTemplate = computed(
    () => `repeat(${this._cardCount()}, minmax(0, 1fr))`
  );

  readonly cardIndexes = computed(() => Array.from({ length: this._cardCount() }, (_, i) => i));
  readonly rowIndexes = computed(() => Array.from({ length: this._tableRows() }, (_, i) => i));
  readonly columnIndexes = computed(
    () => Array.from({ length: this._tableColumns() }, (_, i) => i)
  );

  /** Mirrors React's per-column width pattern. */
  cellWidth = (c: number): string => {
    const widths = ["90%", "65%", "80%", "45%"];
    return widths[c % widths.length]!;
  };
}
