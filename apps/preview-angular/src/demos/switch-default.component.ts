import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { Switch } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-switch-default",
  imports: [Switch],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<sui-switch [(checked)]="checked" ariaLabel="Notifications" />`,
})
export class SwitchDefaultDemo {
  protected readonly checked = signal(true);
}
