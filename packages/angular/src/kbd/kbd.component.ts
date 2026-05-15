/**
 * Kbd — Angular 18 standalone keyboard-key/shortcut renderer.
 *
 * Three input modes (pick one):
 *   - free-form children projected via `<ng-content>` (single `<kbd>`)
 *   - `keys` array — each gets its own `<kbd>` with an optional separator
 *   - `shortcut` string like "cmd+k" or "ctrl shift p" — parsed into keys
 *
 * Platform-aware: `mod` resolves to ⌘ on macOS, ⌃ elsewhere. `cmd`, `ctrl`,
 * `alt`, `shift`, arrow keys, etc. are normalized to glyphs via KEY_GLYPHS.
 *
 * Mirrors the React/Vue versions exactly — same class names, same shortcut
 * grammar, same glyph map.
 */
import { ChangeDetectionStrategy, Component, Input, computed, signal } from "@angular/core";
import { isMac, normalizeKey, parseShortcut } from "./glyphs";

export type KbdSize = "xs" | "sm" | "md" | "lg" | "xl";
export type KbdVariant = "outlined" | "soft";

@Component({
  selector: "sui-kbd",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (resolvedKeys().length === 0) {
      <kbd [class]="rootClasses()">
        <ng-content />
      </kbd>
    } @else {
      <span [class]="rootClasses()" role="group">
        @for (raw of resolvedKeys(); track $index; let i = $index) {
          @if (i > 0 && separator()) {
            <span class="sisyphos-kbd-separator" aria-hidden="true">{{ separator() }}</span>
          }
          <kbd class="sisyphos-kbd-key">{{ glyphFor(raw) }}</kbd>
        }
      </span>
    }
  `,
})
export class Kbd {
  private readonly _variant = signal<KbdVariant>("outlined");
  private readonly _size = signal<KbdSize>("sm");
  private readonly _keys = signal<string[] | undefined>(undefined);
  private readonly _shortcut = signal<string | undefined>(undefined);
  private readonly _separator = signal<string | undefined>(undefined);

  readonly separator = this._separator.asReadonly();

  @Input("variant") set variantInput(v: KbdVariant) {
    this._variant.set(v);
  }
  @Input("size") set sizeInput(v: KbdSize) {
    this._size.set(v);
  }
  @Input("keys") set keysInput(v: string[] | undefined) {
    this._keys.set(v);
  }
  @Input("shortcut") set shortcutInput(v: string | undefined) {
    this._shortcut.set(v);
  }
  @Input("separator") set separatorInput(v: string | undefined) {
    this._separator.set(v);
  }

  readonly resolvedKeys = computed<string[]>(() => {
    const k = this._keys();
    if (k && k.length > 0) return k;
    const s = this._shortcut();
    if (s) return parseShortcut(s);
    return [];
  });

  readonly rootClasses = computed(() => `sisyphos-kbd ${this._variant()} ${this._size()}`);

  /** Lazy mac detection — kept on the instance so SSR-friendly hosts can
   * override globalThis.navigator before render without re-evaluating per call. */
  private readonly mac = isMac();

  glyphFor(raw: string): string {
    return normalizeKey(raw, this.mac);
  }
}
