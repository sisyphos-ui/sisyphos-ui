/**
 * Toaster — Angular 18 standalone host for the toast queue.
 *
 * Mount once near the app root. Subscribes to the framework-agnostic toast
 * store and renders the active queue with auto-dismiss, pause-on-hover,
 * and stacking. The store API (`toast.success(...)`, `toast.dismiss(id)`,
 * `toast.clear()`) is identical to the React and Vue bindings.
 *
 * @example
 *   // app.component.html
 *   <sui-toaster position="top-right" [max]="3" />
 *
 *   // anywhere
 *   import { toast } from '@sisyphos-ui/angular';
 *   toast.success('Saved!');
 */
import type { OnDestroy } from "@angular/core";
import { ChangeDetectionStrategy, Component, Input, computed, signal } from "@angular/core";
import { toastStore, type ToastRecord, type ToastType } from "./store";

export type ToasterPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

const DEFAULT_DESCRIPTIONS: Record<ToastType, string> = {
  default: "",
  success: "✓",
  error: "✕",
  warning: "!",
  info: "i",
  loading: "…",
};

@Component({
  selector: "sui-toaster",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="rootClasses()" [style.gap.px]="gap()" [style.flex-direction]="flexDirection()">
      @for (record of visible(); track record.id) {
        <div
          [class]="'sisyphos-toast ' + record.type"
          [attr.role]="record.type === 'error' ? 'alert' : 'status'"
          [attr.aria-live]="record.type === 'error' ? 'assertive' : 'polite'"
          (mouseenter)="pause(record.id)"
          (mouseleave)="resume(record.id)"
        >
          <div class="sisyphos-toast-icon" aria-hidden="true">
            <span>{{ glyph(record.type) }}</span>
          </div>
          <div class="sisyphos-toast-body">
            @if (record.title) {
              <div class="sisyphos-toast-title">{{ record.title }}</div>
            }
            @if (record.description) {
              <div class="sisyphos-toast-description">{{ record.description }}</div>
            }
          </div>
          @if (record.dismissible) {
            <button
              type="button"
              class="sisyphos-toast-close"
              aria-label="Dismiss notification"
              (click)="dismiss(record.id)"
            >
              <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
                <path
                  d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  fill="currentColor"
                />
              </svg>
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class Toaster implements OnDestroy {
  private readonly _position = signal<ToasterPosition>("bottom-right");
  private readonly _max = signal(5);
  private readonly _gap = signal(8);
  private readonly _toasts = signal<ToastRecord[]>([]);

  readonly position = this._position.asReadonly();
  readonly max = this._max.asReadonly();
  readonly gap = this._gap.asReadonly();
  readonly toasts = this._toasts.asReadonly();

  @Input("position") set positionInput(v: ToasterPosition) {
    this._position.set(v);
  }
  @Input("max") set maxInput(v: number) {
    this._max.set(v);
  }
  @Input("gap") set gapInput(v: number) {
    this._gap.set(v);
  }

  readonly visible = computed(() => {
    const all = this._toasts();
    const m = this._max();
    return all.slice(-m);
  });

  readonly flexDirection = computed(() =>
    this._position().startsWith("top") ? "column" : "column-reverse"
  );

  readonly rootClasses = computed(() => `sisyphos-toaster ${this._position()}`);

  private unsubscribe?: () => void;
  private timers = new Map<string, ReturnType<typeof setTimeout>>();
  private paused = new Set<string>();

  constructor() {
    this.unsubscribe = toastStore.subscribe((toasts) => {
      // Diff with previous to know which toasts to start/stop timers for.
      const prevIds = new Set(this._toasts().map((t) => t.id));
      for (const t of toasts) {
        if (!prevIds.has(t.id)) this.scheduleAutoDismiss(t);
      }
      const newIds = new Set(toasts.map((t) => t.id));
      for (const id of this.timers.keys()) {
        if (!newIds.has(id)) {
          clearTimeout(this.timers.get(id)!);
          this.timers.delete(id);
          this.paused.delete(id);
        }
      }
      this._toasts.set(toasts);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe?.();
    for (const t of this.timers.values()) clearTimeout(t);
    this.timers.clear();
  }

  private scheduleAutoDismiss(record: ToastRecord): void {
    if (record.duration === Infinity) return;
    if (this.paused.has(record.id)) return;
    const timer = setTimeout(() => {
      this.timers.delete(record.id);
      toastStore.dismiss(record.id);
    }, record.duration);
    this.timers.set(record.id, timer);
  }

  pause(id: string): void {
    const t = this.timers.get(id);
    if (t) {
      clearTimeout(t);
      this.timers.delete(id);
    }
    this.paused.add(id);
  }

  resume(id: string): void {
    this.paused.delete(id);
    const record = this._toasts().find((r) => r.id === id);
    if (record) this.scheduleAutoDismiss(record);
  }

  dismiss(id: string): void {
    toastStore.dismiss(id);
  }

  /** Map a toast type to a default fallback glyph. */
  glyph(type: ToastType): string {
    return DEFAULT_DESCRIPTIONS[type] ?? "";
  }
}
