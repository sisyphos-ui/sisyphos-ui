import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Input } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-input-default",
  imports: [Input],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<sui-input label="Email" type="email" placeholder="name@example.com" />`,
})
export class InputDefaultDemo {}
