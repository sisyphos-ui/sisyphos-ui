import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Button } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-button-default",
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<sui-button>Click me</sui-button>`,
})
export class ButtonDefaultDemo {}
