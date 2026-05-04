/**
 * Select — Angular 18 standalone single- or multi-value combobox.
 *
 * Optional search, clearable, creatable, infinite scroll. Mirrors the
 * React/Vue versions: same class names, same keyboard navigation
 * (Arrow keys, Home/End, Enter, Escape), same ARIA combobox + listbox.
 *
 * @example
 *   <sui-select [options]="opts" [(value)]="picked" placeholder="Pick one" />
 *   <sui-select [options]="opts" [(values)]="picked" multiple searchable />
 */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  computed,
  effect,
  signal,
} from "@angular/core";
import { computePosition, type Placement } from "@sisyphos-ui/core/internal";
import type { SelectOption, SelectValue } from "./types";

let selectCounter = 0;

@Component({
  selector: "sui-select",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="rootClasses()">
      @if (label()) {
        <label [class]="labelClasses()">{{ label() }}</label>
      }
      <div
        #trigger
        class="sisyphos-select-control"
        [class.open]="open()"
        [class.has-value]="hasValue()"
        role="combobox"
        [attr.aria-expanded]="open()"
        aria-haspopup="listbox"
        [attr.aria-controls]="open() ? listboxId : null"
        [attr.aria-disabled]="disabled() || null"
        [attr.aria-invalid]="error() || null"
        [tabindex]="disabled() ? -1 : 0"
        (click)="onTriggerClick()"
        (keydown)="onTriggerKeydown($event)"
      >
        <div class="sisyphos-select-value">
          @if (multiple() && selectedValues().length > 0) {
            <div class="sisyphos-select-tags">
              @for (v of selectedValues(); track v) {
                <span class="sisyphos-select-tag" [title]="labelOf(v)">
                  {{ labelOf(v) }}
                  <button
                    type="button"
                    class="sisyphos-select-tag-delete"
                    [attr.aria-label]="'Remove ' + labelOf(v)"
                    [disabled]="disabled()"
                    (click)="removeTag(v, $event)"
                  >×</button>
                </span>
              }
            </div>
          } @else if (singleLabel()) {
            <span class="sisyphos-select-single">{{ singleLabel() }}</span>
          } @else {
            <span class="sisyphos-select-placeholder">{{ placeholder() }}</span>
          }
        </div>
        @if (clearable() && hasValue() && !disabled()) {
          <button
            type="button"
            aria-label="Clear selection"
            class="sisyphos-select-clear"
            (click)="onClear($event)"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
            </svg>
          </button>
        }
        <span class="sisyphos-select-chevron">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"
               [style.transform]="open() ? 'rotate(180deg)' : null"
               [style.transition]="'transform 150ms'">
            <path d="M7 10l5 5 5-5z" fill="currentColor" />
          </svg>
        </span>
      </div>

      @if (open()) {
        <ul
          #list
          [id]="listboxId"
          role="listbox"
          [attr.aria-multiselectable]="multiple() || null"
          [class]="listClasses()"
          [style.position]="'fixed'"
          [style.left.px]="pos()?.left ?? 0"
          [style.top.px]="pos()?.top ?? 0"
          [style.min-width.px]="pos()?.width ?? 0"
          [style.opacity]="pos() ? 1 : 0"
          [style.z-index]="1100"
          (scroll)="onScroll($event)"
        >
          @if (searchable() || creatable()) {
            <li class="sisyphos-select-search-row">
              <input
                #searchInput
                class="sisyphos-select-search"
                type="text"
                [placeholder]="creatable() ? 'Type to add…' : 'Search…'"
                [value]="search()"
                (input)="onSearchInput($event)"
                (keydown)="onTriggerKeydown($event)"
              />
            </li>
          }
          @if (filtered().length === 0 && !loading()) {
            <li class="sisyphos-select-empty">No options</li>
          }
          @for (opt of filtered(); track opt.value; let i = $index) {
            <li
              role="option"
              [attr.aria-selected]="isSelected(opt.value)"
              [attr.aria-disabled]="opt.disabled || null"
              [class]="optionClasses(opt, i)"
              (mouseenter)="setActive(i)"
              (click)="onOptionClick(opt)"
            >
              @if (opt.icon) {
                <span class="sisyphos-select-option-icon">{{ opt.icon }}</span>
              }
              <span class="sisyphos-select-option-body">
                <span class="sisyphos-select-option-label">{{ opt.label }}</span>
                @if (opt.description) {
                  <span class="sisyphos-select-option-description">{{ opt.description }}</span>
                }
              </span>
              @if (isSelected(opt.value)) {
                <span class="sisyphos-select-option-check" aria-hidden="true">✓</span>
              }
            </li>
          }
          @if (loading()) {
            <li class="sisyphos-select-loading">
              <span class="sisyphos-select-loading-spinner" aria-hidden="true"></span>
              <span>Loading…</span>
            </li>
          }
        </ul>
      }

      @if (error() && errorMessage()) {
        <span class="sisyphos-select-error" role="alert">{{ errorMessage() }}</span>
      } @else if (helperText()) {
        <span class="sisyphos-select-helper">{{ helperText() }}</span>
      }
    </div>
  `,
})
export class Select implements OnDestroy {
  readonly listboxId = `sisyphos-select-${++selectCounter}`;

  // Inputs ─────────────────────────────────────────────────────────────
  private readonly _options = signal<SelectOption[]>([]);
  private readonly _value = signal<SelectValue | null>(null);
  private readonly _values = signal<SelectValue[]>([]);
  private readonly _multiple = signal(false);
  private readonly _placeholder = signal<string>("Select…");
  private readonly _label = signal<string | undefined>(undefined);
  private readonly _helperText = signal<string | undefined>(undefined);
  private readonly _error = signal(false);
  private readonly _errorMessage = signal<string | undefined>(undefined);
  private readonly _disabled = signal(false);
  private readonly _required = signal(false);
  private readonly _size = signal<"xs" | "sm" | "md" | "lg" | "xl">("md");
  private readonly _radius = signal<"none" | "sm" | "md" | "lg" | "full">("sm");
  private readonly _fullWidth = signal(false);
  private readonly _searchable = signal(false);
  private readonly _clearable = signal(false);
  private readonly _creatable = signal(false);
  private readonly _loading = signal(false);
  private readonly _hasMore = signal<boolean | undefined>(undefined);
  private readonly _placement = signal<Placement>("bottom-start");

  // Internal state ─────────────────────────────────────────────────────
  private readonly _open = signal(false);
  private readonly _search = signal("");
  private readonly _activeIndex = signal(-1);
  protected readonly pos = signal<{ left: number; top: number; placement: Placement; width: number } | null>(null);

  // Public read API ────────────────────────────────────────────────────
  readonly options = this._options.asReadonly();
  readonly multiple = this._multiple.asReadonly();
  readonly placeholder = this._placeholder.asReadonly();
  readonly label = this._label.asReadonly();
  readonly helperText = this._helperText.asReadonly();
  readonly error = this._error.asReadonly();
  readonly errorMessage = this._errorMessage.asReadonly();
  readonly disabled = this._disabled.asReadonly();
  readonly required = this._required.asReadonly();
  readonly searchable = this._searchable.asReadonly();
  readonly clearable = this._clearable.asReadonly();
  readonly creatable = this._creatable.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly open = this._open.asReadonly();
  readonly search = this._search.asReadonly();
  readonly activeIndex = this._activeIndex.asReadonly();

  @Input("options") set optionsInput(v: SelectOption[]) { this._options.set(v ?? []); }
  /** Single-mode value. Use only when `multiple=false`. */
  @Input("value") set valueInput(v: SelectValue | null | undefined) {
    if (v !== undefined) this._value.set(v);
  }
  /** Multi-mode values. Use only when `multiple=true`. */
  @Input("values") set valuesInput(v: SelectValue[] | undefined) {
    if (v !== undefined) this._values.set(v ?? []);
  }
  @Input("multiple") set multipleInput(v: boolean) { this._multiple.set(v); }
  @Input("placeholder") set placeholderInput(v: string) { this._placeholder.set(v); }
  @Input("label") set labelInput(v: string | undefined) { this._label.set(v); }
  @Input("helperText") set helperTextInput(v: string | undefined) { this._helperText.set(v); }
  @Input("error") set errorInput(v: boolean) { this._error.set(v); }
  @Input("errorMessage") set errorMessageInput(v: string | undefined) { this._errorMessage.set(v); }
  @Input("disabled") set disabledInput(v: boolean) { this._disabled.set(v); }
  @Input("required") set requiredInput(v: boolean) { this._required.set(v); }
  @Input("size") set sizeInput(v: "xs" | "sm" | "md" | "lg" | "xl") { this._size.set(v); }
  @Input("radius") set radiusInput(v: "none" | "sm" | "md" | "lg" | "full") { this._radius.set(v); }
  @Input("fullWidth") set fullWidthInput(v: boolean) { this._fullWidth.set(v); }
  @Input("searchable") set searchableInput(v: boolean) { this._searchable.set(v); }
  @Input("clearable") set clearableInput(v: boolean) { this._clearable.set(v); }
  @Input("creatable") set creatableInput(v: boolean) { this._creatable.set(v); }
  @Input("loading") set loadingInput(v: boolean) { this._loading.set(v); }
  @Input("hasMore") set hasMoreInput(v: boolean | undefined) { this._hasMore.set(v); }
  @Input("placement") set placementInput(v: Placement) { this._placement.set(v); }

  /** Two-way bindings — single & multi modes use separate output names. */
  @Output() readonly valueChange = new EventEmitter<SelectValue | null>();
  @Output() readonly valuesChange = new EventEmitter<SelectValue[]>();
  @Output() readonly searchChange = new EventEmitter<string>();
  @Output() readonly loadMore = new EventEmitter<void>();

  @ViewChild("trigger") triggerRef?: ElementRef<HTMLDivElement>;
  @ViewChild("list") listRef?: ElementRef<HTMLUListElement>;
  @ViewChild("searchInput") searchInputRef?: ElementRef<HTMLInputElement>;

  readonly selectedValues = computed<SelectValue[]>(() => {
    if (this._multiple()) return this._values();
    const v = this._value();
    return v != null && v !== "" ? [v] : [];
  });

  readonly hasValue = computed(() => this.selectedValues().length > 0);

  readonly singleLabel = computed(() => {
    if (this._multiple()) return null;
    const v = this.selectedValues()[0];
    if (v === undefined) return null;
    return this._options().find((o) => o.value === v)?.label ?? String(v);
  });

  readonly filtered = computed<SelectOption[]>(() => {
    const all = this._options();
    if (!this._searchable() || !this._search()) return all;
    const term = this._search().toLowerCase();
    return all.filter((o) => o.label.toLowerCase().includes(term));
  });

  readonly rootClasses = computed(() =>
    [
      "sisyphos-select",
      this._size(),
      `radius-${this._radius()}`,
      this._disabled() && "disabled",
      this._error() && "error",
      this._fullWidth() && "full-width",
    ]
      .filter(Boolean)
      .join(" ")
  );

  readonly labelClasses = computed(() =>
    [
      "sisyphos-select-label",
      this._error() && "error",
      this._required() && "required",
    ]
      .filter(Boolean)
      .join(" ")
  );

  readonly listClasses = computed(() =>
    `sisyphos-select-list ${this.pos()?.placement ?? this._placement()}`
  );

  isSelected(v: SelectValue): boolean {
    return this.selectedValues().includes(v);
  }

  optionClasses(opt: SelectOption, i: number): string {
    return [
      "sisyphos-select-option",
      this.isSelected(opt.value) && "selected",
      opt.disabled && "disabled",
      i === this._activeIndex() && "active",
    ]
      .filter(Boolean)
      .join(" ");
  }

  labelOf(v: SelectValue): string {
    return this._options().find((o) => o.value === v)?.label ?? String(v);
  }

  private resizeListener?: () => void;
  private scrollListener?: () => void;

  constructor() {
    effect(() => {
      if (this._open()) {
        queueMicrotask(() => requestAnimationFrame(() => this.reposition()));
        this.installScrollListeners();
        if (this._searchable()) {
          queueMicrotask(() => this.searchInputRef?.nativeElement.focus());
        }
      } else {
        this.pos.set(null);
        this._search.set("");
        this._activeIndex.set(-1);
        this.removeScrollListeners();
      }
    });
  }

  ngOnDestroy(): void { this.removeScrollListeners(); }

  // ── Trigger ──────────────────────────────────────────────────────────

  onTriggerClick(): void {
    if (this._disabled()) return;
    this.setOpen(!this._open());
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (!this._open() && (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      this.setOpen(true);
      return;
    }
    if (!this._open()) return;
    const opts = this.filtered();
    if (event.key === "ArrowDown") {
      event.preventDefault();
      this._activeIndex.set(Math.min(opts.length - 1, this._activeIndex() + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      this._activeIndex.set(Math.max(0, this._activeIndex() - 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      this._activeIndex.set(0);
    } else if (event.key === "End") {
      event.preventDefault();
      this._activeIndex.set(opts.length - 1);
    } else if (event.key === "Enter") {
      const opt = opts[this._activeIndex()];
      if (opt && !opt.disabled) {
        event.preventDefault();
        this.selectValue(opt.value);
      } else if (this._creatable() && this._multiple() && this._search().trim()) {
        event.preventDefault();
        const term = this._search().trim();
        const curr = this._values();
        if (!curr.includes(term)) {
          const next = [...curr, term];
          this._values.set(next);
          this.valuesChange.emit(next);
        }
        this._search.set("");
      }
    }
  }

  // ── Selection ────────────────────────────────────────────────────────

  selectValue(v: SelectValue): void {
    if (this._multiple()) {
      const curr = this._values();
      const next = curr.includes(v) ? curr.filter((x) => x !== v) : [...curr, v];
      this._values.set(next);
      this.valuesChange.emit(next);
    } else {
      this._value.set(v);
      this.valueChange.emit(v);
      this.setOpen(false);
    }
  }

  onOptionClick(opt: SelectOption): void {
    if (opt.disabled) return;
    this.selectValue(opt.value);
  }

  removeTag(v: SelectValue, event: MouseEvent): void {
    event.stopPropagation();
    if (this._disabled()) return;
    const next = this._values().filter((x) => x !== v);
    this._values.set(next);
    this.valuesChange.emit(next);
  }

  onClear(event: MouseEvent): void {
    event.stopPropagation();
    if (this._disabled()) return;
    if (this._multiple()) {
      this._values.set([]);
      this.valuesChange.emit([]);
    } else {
      this._value.set(null);
      this.valueChange.emit(null);
    }
  }

  onSearchInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this._search.set(v);
    this.searchChange.emit(v);
    this._activeIndex.set(0);
  }

  onScroll(event: Event): void {
    if (this._loading() || this._hasMore() === false) return;
    const el = event.currentTarget as HTMLUListElement;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 24) this.loadMore.emit();
  }

  setActive(i: number): void {
    if (i !== this._activeIndex()) this._activeIndex.set(i);
  }

  setOpen(next: boolean): void {
    if (this._open() === next) return;
    this._open.set(next);
  }

  // ── Document listeners ───────────────────────────────────────────────

  @HostListener("document:keydown.escape")
  onEscape(): void {
    if (this._open()) this.setOpen(false);
  }

  @HostListener("document:mousedown", ["$event"])
  onDocumentMousedown(event: MouseEvent): void {
    if (!this._open()) return;
    const tgt = event.target as Node | null;
    if (this.triggerRef?.nativeElement.contains(tgt as Node)) return;
    if (this.listRef?.nativeElement.contains(tgt as Node)) return;
    this.setOpen(false);
  }

  // ── Positioning ──────────────────────────────────────────────────────

  private reposition(): void {
    const anchor = this.triggerRef?.nativeElement;
    const list = this.listRef?.nativeElement;
    if (!anchor || !list) return;
    const a = anchor.getBoundingClientRect();
    const size = { width: list.offsetWidth, height: list.offsetHeight };
    const p = computePosition(a, size, this._placement(), 4);
    this.pos.set({ ...p, width: a.width });
  }

  private installScrollListeners(): void {
    this.scrollListener = () => this.reposition();
    this.resizeListener = () => this.reposition();
    window.addEventListener("scroll", this.scrollListener, true);
    window.addEventListener("resize", this.resizeListener);
  }

  private removeScrollListeners(): void {
    if (this.scrollListener) {
      window.removeEventListener("scroll", this.scrollListener, true);
      this.scrollListener = undefined;
    }
    if (this.resizeListener) {
      window.removeEventListener("resize", this.resizeListener);
      this.resizeListener = undefined;
    }
  }
}
