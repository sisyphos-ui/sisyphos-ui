import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Kbd } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-kbd-default",
  imports: [Kbd],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display:flex; gap:12px; align-items:center;">
      <sui-kbd shortcut="cmd+k" />
      <sui-kbd shortcut="shift+enter" />
      <sui-kbd shortcut="esc" />
    </div>
  `,
})
export class KbdDefaultDemo {}
