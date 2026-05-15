/**
 * CommandItem — registers itself with the parent Command on init and
 * unregisters on destroy. Hidden when not currently matched by the search
 * query (the React/Vue versions do the same).
 *
 * Registration happens in `ngOnInit` rather than `ngAfterViewInit` because
 * the item's visibility depends on being in the matched-ids list — which
 * requires registration first. The Angular binding asks consumers to pass
 * an explicit `value` (with a label fallback) instead of reading projected
 * text content, since the projected DOM doesn't exist when the item is
 * hidden.
 */
import type { ElementRef, OnDestroy, OnInit } from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { CommandCtx } from "./context";

let itemCounter = 0;

@Component({
  selector: "sui-command-item",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div
        #itemEl
        [id]="id"
        role="option"
        [attr.aria-selected]="isActive() || null"
        [attr.data-active]="isActive() || null"
        [class]="rootClasses()"
        (mouseenter)="ctx.setActiveId(id)"
        (click)="onClick()"
      >
        <ng-content />
      </div>
    }
  `,
})
export class CommandItem implements OnInit, OnDestroy {
  protected readonly ctx = inject(CommandCtx);
  readonly id = `sisyphos-command-item-${++itemCounter}`;

  private readonly _value = signal<string>("");
  private readonly _label = signal<string>("");
  private readonly _disabled = signal(false);

  @Input("value") set valueInput(v: string) {
    this._value.set(v);
  }
  /** Searchable label, used when `value` isn't given. Defaults to `value`. */
  @Input("label") set labelInput(v: string) {
    this._label.set(v);
  }
  @Input("disabled") set disabledInput(v: boolean) {
    this._disabled.set(v);
  }

  /** Fired when this item is activated (click or Enter via root). */
  @Output() readonly select = new EventEmitter<void>();

  @ViewChild("itemEl") itemRef?: ElementRef<HTMLDivElement>;

  readonly isActive = computed(() => this.ctx.activeId() === this.id);
  readonly visible = computed(() => this.ctx.matchedIds().includes(this.id) && !this._disabled());

  readonly rootClasses = computed(() =>
    ["sisyphos-command-item", this.isActive() && "active", this._disabled() && "disabled"]
      .filter(Boolean)
      .join(" ")
  );

  private unregister?: () => void;

  constructor() {
    // Auto-scroll the active item into view when it becomes active.
    effect(() => {
      if (!this.isActive()) return;
      const el = this.itemRef?.nativeElement;
      if (el && typeof el.scrollIntoView === "function") {
        el.scrollIntoView({ block: "nearest" });
      }
    });
  }

  ngOnInit(): void {
    this.unregister = this.ctx.registerItem(
      this.id,
      () => this._value() || this._label() || this.itemRef?.nativeElement.textContent || ""
    );
  }

  ngOnDestroy(): void {
    this.unregister?.();
  }

  onClick(): void {
    if (this._disabled()) return;
    this.select.emit();
    this.ctx.selectItem(this.id);
  }
}
