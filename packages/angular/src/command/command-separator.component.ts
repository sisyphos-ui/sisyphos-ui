import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "sui-command-separator",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div role="separator" class="sisyphos-command-separator"></div>`,
})
export class CommandSeparator {}
