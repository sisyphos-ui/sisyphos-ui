import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { CommandCtx } from "./context";

@Component({
  selector: "sui-command-empty",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="sisyphos-command-empty" role="note">
        <ng-content />
      </div>
    }
  `,
})
export class CommandEmpty {
  protected readonly ctx = inject(CommandCtx);
  readonly visible = computed(() => this.ctx.matchedIds().length === 0);
}
