import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Button, Popover } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-popover-default",
  imports: [Popover, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sui-popover>
      <sui-button variant="outlined">Open popover</sui-button>
      <div popover-content style="padding:12px; max-width:240px;">
        Popovers carry rich interactive content with focus management.
      </div>
    </sui-popover>
  `,
})
export class PopoverDefaultDemo {}
