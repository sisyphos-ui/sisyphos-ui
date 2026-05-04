import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { Checkbox } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-checkbox-default",
  imports: [Checkbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<sui-checkbox [(checked)]="checked" label="I agree to the terms" />`,
})
export class CheckboxDefaultDemo {
  protected readonly checked = signal(true);
}
