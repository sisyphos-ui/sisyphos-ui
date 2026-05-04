/**
 * TreeNodeRow — recursive renderer for a single tree node + its children.
 * Imports itself via `forwardRef` for the recursive template use.
 */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input as NgInput,
  Output,
  computed,
  forwardRef,
  signal,
} from "@angular/core";
import { nodeState } from "./utils";
import type { TreeNode, TreeNodeId } from "./types";

@Component({
  selector: "sui-tree-node-row",
  standalone: true,
  imports: [forwardRef(() => TreeNodeRow)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sisyphos-tree-node">
      <div [class]="rowClasses()" [style.padding-left.px]="level() * 20 + 8">
        @if (hasChildren()) {
          <button
            type="button"
            class="sisyphos-tree-expand"
            [attr.aria-label]="isOpen() ? 'Collapse' : 'Expand'"
            [attr.aria-expanded]="isOpen()"
            (click)="onToggleExpand($event)"
          >
            @if (isOpen()) {
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            } @else {
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            }
          </button>
        } @else {
          <span class="sisyphos-tree-expand-spacer"></span>
        }
        <button
          type="button"
          class="sisyphos-tree-toggle"
          role="checkbox"
          [attr.aria-checked]="state() === 'checked' ? 'true' : state() === 'partial' ? 'mixed' : 'false'"
          [disabled]="node().disabled"
          (click)="onToggle()"
        >
          <span [class]="checkboxClasses()">
            @if (state() === 'checked') {
              <svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true">
                <path d="M2 8l4 4 8-8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            }
            @if (state() === 'partial') {
              <span class="sisyphos-tree-partial"></span>
            }
          </span>
          <span class="sisyphos-tree-label" [title]="node().label">{{ node().label }}</span>
        </button>
      </div>
      @if (hasChildren() && isOpen()) {
        <div class="sisyphos-tree-children">
          @for (c of node().children; track c.id) {
            <sui-tree-node-row
              [node]="c"
              [level]="level() + 1"
              [selectedSet]="selectedSet()"
              [expanded]="expanded()"
              [searchActive]="searchActive()"
              (toggleNode)="toggleNode.emit($event)"
              (toggleExpand)="toggleExpand.emit($event)"
            />
          }
        </div>
      }
    </div>
  `,
})
export class TreeNodeRow {
  private readonly _node = signal<TreeNode>({ id: "", label: "" });
  private readonly _level = signal(0);
  private readonly _selectedSet = signal<Set<TreeNodeId>>(new Set());
  private readonly _expanded = signal<Record<string, boolean>>({});
  private readonly _searchActive = signal(false);

  readonly node = this._node.asReadonly();
  readonly level = this._level.asReadonly();
  readonly selectedSet = this._selectedSet.asReadonly();
  readonly expanded = this._expanded.asReadonly();
  readonly searchActive = this._searchActive.asReadonly();

  @NgInput("node") set nodeInput(v: TreeNode) { this._node.set(v); }
  @NgInput("level") set levelInput(v: number) { this._level.set(v); }
  @NgInput("selectedSet") set selectedSetInput(v: Set<TreeNodeId>) { this._selectedSet.set(v); }
  @NgInput("expanded") set expandedInput(v: Record<string, boolean>) { this._expanded.set(v); }
  @NgInput("searchActive") set searchActiveInput(v: boolean) { this._searchActive.set(v); }

  @Output() readonly toggleNode = new EventEmitter<TreeNode>();
  @Output() readonly toggleExpand = new EventEmitter<TreeNodeId>();

  readonly hasChildren = computed(() => Boolean(this._node().children?.length));

  /** While searching, all nodes auto-expand so matched ancestors are visible. */
  readonly isOpen = computed(() =>
    this._searchActive() ? true : Boolean(this._expanded()[String(this._node().id)])
  );

  readonly state = computed(() => nodeState(this._node(), this._selectedSet()));

  readonly rowClasses = computed(() =>
    [
      "sisyphos-tree-row",
      this.state() === "checked" && "checked",
      this.state() === "partial" && "partial",
      this._node().disabled && "disabled",
    ]
      .filter(Boolean)
      .join(" ")
  );

  readonly checkboxClasses = computed(() => `sisyphos-tree-checkbox ${this.state()}`);

  onToggle(): void {
    if (this._node().disabled) return;
    this.toggleNode.emit(this._node());
  }

  onToggleExpand(event: Event): void {
    event.stopPropagation();
    this.toggleExpand.emit(this._node().id);
  }
}
