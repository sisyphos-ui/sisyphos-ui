import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { Radio, RadioGroup } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-radio-default",
  imports: [RadioGroup, Radio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sui-radio-group label="Plan" [(value)]="plan" variant="card">
      <sui-radio value="free" label="Free" description="All the basics, forever." />
      <sui-radio value="pro" label="Pro" description="For growing teams." />
      <sui-radio value="enterprise" label="Enterprise" description="Dedicated support." />
    </sui-radio-group>
  `,
})
export class RadioDefaultDemo {
  protected readonly plan = signal<string | number>("pro");
}
