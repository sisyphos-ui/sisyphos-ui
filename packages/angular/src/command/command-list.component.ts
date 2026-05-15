import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CommandCtx } from "./context";

@Component({
  selector: "sui-command-list",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [id]="ctx.listId()" role="listbox" class="sisyphos-command-list">
      <ng-content />
    </div>
  `,
})
export class CommandList {
  protected readonly ctx = inject(CommandCtx);
}
