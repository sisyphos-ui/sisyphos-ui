/**
 * Command — keyboard-first command palette. Compound API:
 *
 *   <sui-command (selectItem)="run($event)">
 *     <sui-command-input placeholder="Type a command…" />
 *     <sui-command-list>
 *       <sui-command-empty>No results.</sui-command-empty>
 *       <sui-command-group heading="Suggestions">
 *         <sui-command-item value="calendar" (select)="goCalendar()">
 *           Calendar
 *         </sui-command-item>
 *       </sui-command-group>
 *     </sui-command-list>
 *   </sui-command>
 *
 * Filtering is case-insensitive substring match against each Item's `value`
 * (or its projected text content). The active item is tracked at the root
 * so Arrow keys on the input drive navigation across visible items.
 */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  signal,
} from "@angular/core";
import { CommandCtx, type CommandContextValue, matches } from "./context";

let cmdCounter = 0;

@Component({
  selector: "sui-command",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CommandCtx, useExisting: Command }],
  template: `
    <div
      class="sisyphos-command"
      role="combobox"
      aria-expanded="true"
      aria-haspopup="listbox"
      [attr.aria-owns]="listId()"
      [attr.aria-label]="label()"
    >
      <ng-content />
    </div>
  `,
})
export class Command implements CommandContextValue {
  private readonly _id = ++cmdCounter;
  private readonly _inputId = signal<string>(`sisyphos-command-input-${this._id}`);
  private readonly _listId = signal<string>(`sisyphos-command-list-${this._id}`);
  private readonly _label = signal<string>("Command menu");
  private readonly _search = signal<string>("");
  private readonly _activeId = signal<string | null>(null);
  private readonly registry = new Map<string, () => string>();
  private readonly registryVersion = signal(0);

  readonly inputId = this._inputId.asReadonly();
  readonly listId = this._listId.asReadonly();
  readonly label = this._label.asReadonly();
  readonly search = this._search.asReadonly();
  readonly activeId = this._activeId.asReadonly();

  @Input("value") set valueInput(v: string | undefined) {
    if (v !== undefined) this._search.set(v);
  }
  @Input("defaultValue") set defaultValueInput(v: string) {
    if (this._search() === "") this._search.set(v ?? "");
  }
  @Input("label") set labelInput(v: string) { this._label.set(v); }

  /** Two-way `[(value)]` for the search input. */
  @Output() readonly valueChange = new EventEmitter<string>();
  /** Fired when an item is activated (click or Enter). Public event — distinct
   * from the `selectItem(id)` method called internally by Item children. */
  @Output() readonly select = new EventEmitter<string>();

  /** Recomputes whenever search or registry changes. */
  readonly matchedIds = computed<string[]>(() => {
    void this.registryVersion(); // tracks registration changes
    const q = this._search();
    const out: string[] = [];
    for (const [id, getValue] of this.registry) {
      if (matches(getValue(), q)) out.push(id);
    }
    return out;
  });

  setSearch(next: string): void {
    if (this._search() === next) return;
    this._search.set(next);
    this.valueChange.emit(next);
    // Prefer to keep activeId on the first match if the current is no longer matched.
    const ids = this.matchedIds();
    const curr = this._activeId();
    if (!curr || !ids.includes(curr)) this._activeId.set(ids[0] ?? null);
  }

  setActiveId(id: string | null): void {
    if (this._activeId() === id) return;
    this._activeId.set(id);
  }

  registerItem(id: string, getValue: () => string): () => void {
    this.registry.set(id, getValue);
    this.registryVersion.update((v) => v + 1);
    // If no active id yet, seed from the first match — registration time is
    // the only point we know which item to spotlight initially.
    queueMicrotask(() => {
      if (this._activeId() === null) {
        const ids = this.matchedIds();
        if (ids.length) this._activeId.set(ids[0]!);
      }
    });
    return () => {
      this.registry.delete(id);
      this.registryVersion.update((v) => v + 1);
      if (this._activeId() === id) {
        const ids = this.matchedIds();
        this._activeId.set(ids[0] ?? null);
      }
    };
  }

  /** Implements CommandContextValue.selectItem — invoked by `<sui-command-item>`. */
  selectItem(id: string): void {
    const getValue = this.registry.get(id);
    this.select.emit(getValue ? getValue() : id);
  }
}
