import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { Slider } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-slider-default",
  imports: [Slider],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<sui-slider [(value)]="v" ariaLabel="Volume" [showValue]="true" />`,
})
export class SliderDefaultDemo {
  protected readonly v = signal(50);
}
