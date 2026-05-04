import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { NumberInput } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-number-input-default",
  imports: [NumberInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<sui-number-input label="Quantity" [(value)]="n" [min]="1" [step]="1" />`,
})
export class NumberInputDefaultDemo {
  protected readonly n = signal(1);
}
