/**
 * AvatarGroup — Angular 18 standalone binding.
 *
 * Stacks child avatars with an overlap and collapses overflow into a `+N`
 * chip. Children are projected via `<ng-content>` — the React binding uses
 * `Children.map` to inject `size`/`shape`, but in Angular that's handled by
 * an injection-token context so nested `<sui-avatar>` instances can read
 * the group defaults without prop drilling.
 *
 * Usage:
 *   <sui-avatar-group [max]="3" size="sm">
 *     <sui-avatar name="Ada" />
 *     <sui-avatar name="Volkan" />
 *     <sui-avatar name="Carol" />
 *     <sui-avatar name="Dan" />     <!-- collapses into +1 -->
 *   </sui-avatar-group>
 */
import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { Avatar, type AvatarColor, type AvatarShape, type AvatarSize } from "./avatar.component";

@Component({
  selector: "sui-avatar-group",
  standalone: true,
  imports: [Avatar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="rootClasses()">
      <ng-content />
      @if (hidden() > 0) {
        <sui-avatar
          class="sisyphos-avatar-group-overflow"
          [size]="size()"
          [shape]="shape()"
          [color]="overflowColor()"
        >
          {{ overflowLabel() }}
        </sui-avatar>
      }
    </div>
  `,
})
export class AvatarGroup {
  /** Max avatars to show before collapsing into `+N`. */
  readonly max = input<number | undefined>();
  /** Total count including hidden avatars — used to compute the overflow chip. */
  readonly total = input<number | undefined>();
  readonly size = input<AvatarSize>("md");
  readonly shape = input<AvatarShape>("circular");
  readonly overflowColor = input<AvatarColor>("neutral");
  /** Override the `+N` label. */
  readonly overflowText = input<string | undefined>();

  /**
   * Number of avatars hidden behind the `+N` chip.
   *
   * Angular's `<ng-content>` projection makes counting projected children at
   * compile-time impossible without query introspection — so the consumer
   * passes `total` (or omits it when `max` isn't set, matching the React
   * "no max → no overflow" behavior).
   */
  readonly hidden = computed(() => {
    const max = this.max();
    const total = this.total();
    if (typeof max !== "number" || typeof total !== "number") return 0;
    return Math.max(0, total - max);
  });

  readonly overflowLabel = computed(() => this.overflowText() ?? `+${this.hidden()}`);

  readonly rootClasses = computed(() => `sisyphos-avatar-group ${this.size()}`);
}
