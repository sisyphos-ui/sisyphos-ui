import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Button, TooltipDirective } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-tooltip-default",
  imports: [Button, TooltipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span sui-tooltip="⌘K to search">
      <sui-button variant="outlined">Hover me</sui-button>
    </span>
  `,
})
export class TooltipDefaultDemo {}
