/**
 * TreeSelect — Angular 18 standalone hierarchical multi-select with search,
 * cascade selection, and partial state for parent nodes. Mirrors the
 * React/Vue versions exactly: same class names, same node shape, same
 * `descendantIds` / `nodeState` rules from the shared `utils`.
 */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input as NgInput,
  OnDestroy,
  Output,
  ViewChild,
  computed,
  effect,
  signal,
} from "@angular/core";
import { computePosition, type Placement } from "@sisyphos-ui/core/internal";
import { TreeNodeRow } from "./tree-node-row.component";
import {
  descendantIds,
  filterTree,
  findNode,
  nodeState,
} from "./utils";
import type { TreeNode, TreeNodeId } from "./types";

let treeCounter = 0;

@Component({
  selector: "sui-tree-select",
  standalone: true,
  imports: [TreeNodeRow],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="rootClasses()">
      @if (label()) {
        <label [class]="labelClasses()">{{ label() }}</label>
      }
      <div
        #trigger
        [class]="triggerClasses()"
        role="combobox"
        aria-haspopup="tree"
        [attr.aria-expanded]="open()"
        [attr.aria-controls]="open() ? listboxId : null"
        [tabindex]="disabled() ? -1 : 0"
        (click)="toggleOpen()"
      >
        <div class="sisyphos-tree-select-value">
          @if (selectedItems().length === 0) {
            <span class="sisyphos-tree-select-placeholder">
              {{ triggerLabel() ?? placeholder() }}
            </span>
          } @else {
            <div class="sisyphos-tree-select-tags">
              @for (t of visibleTags(); track t.id) {
                <span class="sisyphos-tree-select-tag" [title]="t.label">{{ t.label }}</span>
              }
              @if (overflow() > 0) {
                <span class="sisyphos-tree-select-tag more">+{{ overflow() }}</span>
              }
            </div>
          }
        </div>
        @if (clearable() && selectedItems().length > 0 && !disabled()) {
          <button
            type="button"
            class="sisyphos-tree-select-clear"
            aria-label="Clear all"
            (click)="clearAll($event)"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
            </svg>
          </button>
        }
        <span class="sisyphos-tree-select-chevron">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"
               [style.transform]="open() ? 'rotate(180deg)' : null"
               [style.transition]="'transform 150ms'">
            <path d="M7 10l5 5 5-5z" fill="currentColor" />
          </svg>
        </span>
      </div>

      @if (open()) {
        <div
          #list
          [id]="listboxId"
          role="tree"
          class="sisyphos-tree-select-dropdown"
          [style.position]="'fixed'"
          [style.left.px]="pos()?.left ?? 0"
          [style.top.px]="pos()?.top ?? 0"
          [style.min-width.px]="pos()?.width ?? 0"
          [style.opacity]="pos() ? 1 : 0"
          [style.z-index]="1100"
        >
          @if (searchable()) {
            <div class="sisyphos-tree-select-search">
              <input
                #searchInput
                type="text"
                [placeholder]="searchPlaceholder()"
                [value]="search()"
                (input)="onSearchInput($event)"
              />
            </div>
          }
          <div class="sisyphos-tree-select-content">
            @if (filtered().length === 0) {
              <div class="sisyphos-tree-select-empty">No results</div>
            } @else {
              @for (n of filtered(); track n.id) {
                <sui-tree-node-row
                  [node]="n"
                  [level]="0"
                  [selectedSet]="selectedSet()"
                  [expanded]="expanded()"
                  [searchActive]="!!search()"
                  (toggleNode)="onToggleNode($event)"
                  (toggleExpand)="onToggleExpand($event)"
                />
              }
            }
          </div>
        </div>
      }

      @if (error() && errorMessage()) {
        <span class="sisyphos-tree-select-error" role="alert">{{ errorMessage() }}</span>
      }
    </div>
  `,
})
export class TreeSelect implements OnDestroy {
  readonly listboxId = `sisyphos-tree-${++treeCounter}`;

  private readonly _nodes = signal<TreeNode[]>([]);
  private readonly _value = signal<TreeNodeId[]>([]);
  private readonly _label = signal<string | undefined>(undefined);
  private readonly _placeholder = signal<string>("Select…");
  private readonly _triggerLabel = signal<string | undefined>(undefined);
  private readonly _error = signal(false);
  private readonly _errorMessage = signal<string | undefined>(undefined);
  private readonly _disabled = signal(false);
  private readonly _required = signal(false);
  private readonly _searchable = signal(true);
  private readonly _searchPlaceholder = signal<string>("Search…");
  private readonly _clearable = signal(false);
  private readonly _fullWidth = signal(false);
  private readonly _size = signal<"sm" | "md" | "lg">("md");
  private readonly _cascade = signal(true);
  private readonly _maxTagCount = signal(3);
  private readonly _placement = signal<Placement>("bottom-start");

  private readonly _open = signal(false);
  private readonly _search = signal("");
  private readonly _expanded = signal<Record<string, boolean>>({});
  protected readonly pos = signal<{ left: number; top: number; placement: Placement; width: number } | null>(null);

  readonly value = this._value.asReadonly();
  readonly label = this._label.asReadonly();
  readonly placeholder = this._placeholder.asReadonly();
  readonly triggerLabel = this._triggerLabel.asReadonly();
  readonly error = this._error.asReadonly();
  readonly errorMessage = this._errorMessage.asReadonly();
  readonly disabled = this._disabled.asReadonly();
  readonly searchable = this._searchable.asReadonly();
  readonly searchPlaceholder = this._searchPlaceholder.asReadonly();
  readonly clearable = this._clearable.asReadonly();
  readonly open = this._open.asReadonly();
  readonly search = this._search.asReadonly();
  readonly expanded = this._expanded.asReadonly();

  @NgInput("nodes") set nodesInput(v: TreeNode[]) { this._nodes.set(v ?? []); }
  @NgInput("value") set valueInput(v: TreeNodeId[] | undefined) {
    if (v !== undefined) this._value.set(v);
  }
  @NgInput("label") set labelInput(v: string | undefined) { this._label.set(v); }
  @NgInput("placeholder") set placeholderInput(v: string) { this._placeholder.set(v); }
  @NgInput("triggerLabel") set triggerLabelInput(v: string | undefined) {
    this._triggerLabel.set(v);
  }
  @NgInput("error") set errorInput(v: boolean) { this._error.set(v); }
  @NgInput("errorMessage") set errorMessageInput(v: string | undefined) {
    this._errorMessage.set(v);
  }
  @NgInput("disabled") set disabledInput(v: boolean) { this._disabled.set(v); }
  @NgInput("required") set requiredInput(v: boolean) { this._required.set(v); }
  @NgInput("searchable") set searchableInput(v: boolean) { this._searchable.set(v); }
  @NgInput("searchPlaceholder") set searchPlaceholderInput(v: string) {
    this._searchPlaceholder.set(v);
  }
  @NgInput("clearable") set clearableInput(v: boolean) { this._clearable.set(v); }
  @NgInput("fullWidth") set fullWidthInput(v: boolean) { this._fullWidth.set(v); }
  @NgInput("size") set sizeInput(v: "sm" | "md" | "lg") { this._size.set(v); }
  @NgInput("cascade") set cascadeInput(v: boolean) { this._cascade.set(v); }
  @NgInput("maxTagCount") set maxTagCountInput(v: number) { this._maxTagCount.set(v); }
  @NgInput("placement") set placementInput(v: Placement) { this._placement.set(v); }

  @Output() readonly valueChange = new EventEmitter<TreeNodeId[]>();

  @ViewChild("trigger") triggerRef?: ElementRef<HTMLDivElement>;
  @ViewChild("list") listRef?: ElementRef<HTMLDivElement>;
  @ViewChild("searchInput") searchInputRef?: ElementRef<HTMLInputElement>;

  readonly selectedSet = computed(() => new Set<TreeNodeId>(this._value()));

  readonly selectedItems = computed<TreeNode[]>(() => {
    const out: TreeNode[] = [];
    for (const id of this._value()) {
      const n = findNode(this._nodes(), id);
      if (n) out.push(n);
    }
    return out;
  });

  readonly visibleTags = computed(() => this.selectedItems().slice(0, this._maxTagCount()));
  readonly overflow = computed(() => this.selectedItems().length - this.visibleTags().length);

  readonly filtered = computed(() => filterTree(this._nodes(), this._search()));

  readonly rootClasses = computed(() =>
    [
      "sisyphos-tree-select",
      this._size(),
      this._error() && "error",
      this._disabled() && "disabled",
      this._fullWidth() && "full-width",
    ]
      .filter(Boolean)
      .join(" ")
  );

  readonly labelClasses = computed(() =>
    [
      "sisyphos-tree-select-label",
      this._error() && "error",
      this._required() && "required",
    ]
      .filter(Boolean)
      .join(" ")
  );

  readonly triggerClasses = computed(() =>
    [
      "sisyphos-tree-select-trigger",
      this._open() && "open",
    ]
      .filter(Boolean)
      .join(" ")
  );

  private resizeListener?: () => void;
  private scrollListener?: () => void;

  constructor() {
    effect(() => {
      if (this._open()) {
        if (this._searchable()) queueMicrotask(() => this.searchInputRef?.nativeElement.focus());
        queueMicrotask(() => requestAnimationFrame(() => this.reposition()));
        this.installScrollListeners();
      } else {
        this.pos.set(null);
        this._search.set("");
        this.removeScrollListeners();
      }
    });
  }

  ngOnDestroy(): void { this.removeScrollListeners(); }

  // ── trigger + dropdown ───────────────────────────────────────────────

  toggleOpen(): void {
    if (this._disabled()) return;
    this._open.set(!this._open());
  }

  onSearchInput(event: Event): void {
    this._search.set((event.target as HTMLInputElement).value);
  }

  // ── selection ────────────────────────────────────────────────────────

  onToggleNode(node: TreeNode): void {
    if (node.disabled) return;
    const ids = this._cascade() ? descendantIds(node) : [node.id];
    const current = this._value();
    const set = this.selectedSet();
    const isSelected = nodeState(node, set) === "checked";
    const next = isSelected
      ? current.filter((id) => !ids.includes(id))
      : Array.from(new Set([...current, ...ids]));
    this._value.set(next);
    this.valueChange.emit(next);
  }

  onToggleExpand(id: TreeNodeId): void {
    this._expanded.update((prev) => ({ ...prev, [String(id)]: !prev[String(id)] }));
  }

  clearAll(event: MouseEvent): void {
    event.stopPropagation();
    this._value.set([]);
    this.valueChange.emit([]);
  }

  // ── outside-click + escape ───────────────────────────────────────────

  @HostListener("document:keydown.escape")
  onEscape(): void {
    if (this._open()) this._open.set(false);
  }

  @HostListener("document:mousedown", ["$event"])
  onDocumentMousedown(event: MouseEvent): void {
    if (!this._open()) return;
    const tgt = event.target as Node | null;
    if (this.triggerRef?.nativeElement.contains(tgt as Node)) return;
    if (this.listRef?.nativeElement.contains(tgt as Node)) return;
    this._open.set(false);
  }

  // ── positioning ──────────────────────────────────────────────────────

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
