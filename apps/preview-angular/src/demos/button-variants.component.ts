import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Button } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-button-variants",
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <sui-button variant="contained">contained</sui-button>
      <sui-button variant="outlined">outlined</sui-button>
      <sui-button variant="soft">soft</sui-button>
      <sui-button variant="text">text</sui-button>
    </div>
  `,
})
export class ButtonVariantsDemo {}
