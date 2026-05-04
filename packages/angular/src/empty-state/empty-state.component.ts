/**
 * EmptyState — Angular 18 standalone placeholder for zero-data views.
 *
 * Slots match the React/Vue API: icon + title + description + actions.
 * Title and description are exposed as `@Input()` strings (the common case);
 * for rich content, project elements with the `[empty-icon]` or
 * `[empty-actions]` attribute selectors:
 *
 *   <sui-empty-state title="No invoices" description="Try again later.">
 *     <svg empty-icon>...</svg>
 *     <button empty-actions>Refresh</button>
 *   </sui-empty-state>
 *
 * The unmarked default slot is rendered between description and actions —
 * useful for an explicit message or extra paragraphs.
 */
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  signal,
} from "@angular/core";

export type EmptyStateSize = "sm" | "md" | "lg";
export type EmptyStateVariant = "block" | "inline";

@Component({
  selector: "sui-empty-state",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="rootClasses()" role="status">
      <div class="sisyphos-empty-state-icon" aria-hidden="true">
        <ng-content select="[empty-icon]" />
      </div>
      @if (title()) {
        <h3 class="sisyphos-empty-state-title">{{ title() }}</h3>
      }
      @if (description()) {
        <p class="sisyphos-empty-state-description">{{ description() }}</p>
      }
      <ng-content />
      <div class="sisyphos-empty-state-actions">
        <ng-content select="[empty-actions]" />
      </div>
    </div>
  `,
  styles: [
    `
      .sisyphos-empty-state-icon:empty,
      .sisyphos-empty-state-actions:empty {
        display: none;
      }
    `,
  ],
})
export class EmptyState {
  private readonly _title = signal<string | undefined>(undefined);
  private readonly _description = signal<string | undefined>(undefined);
  private readonly _size = signal<EmptyStateSize>("md");
  private readonly _variant = signal<EmptyStateVariant>("block");
  private readonly _bordered = signal(false);

  readonly title = this._title.asReadonly();
  readonly description = this._description.asReadonly();

  @Input("title") set titleInput(v: string | undefined) { this._title.set(v); }
  @Input("description") set descriptionInput(v: string | undefined) { this._description.set(v); }
  @Input("size") set sizeInput(v: EmptyStateSize) { this._size.set(v); }
  @Input("variant") set variantInput(v: EmptyStateVariant) { this._variant.set(v); }
  @Input("bordered") set borderedInput(v: boolean) { this._bordered.set(v); }

  readonly rootClasses = computed(() =>
    [
      "sisyphos-empty-state",
      this._size(),
      this._variant(),
      this._bordered() && "bordered",
    ]
      .filter(Boolean)
      .join(" ")
  );
}
