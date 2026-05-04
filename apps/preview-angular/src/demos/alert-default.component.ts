import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Alert } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-alert-default",
  imports: [Alert],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sui-alert color="success" title="All set" description="Your settings have been saved." />
  `,
})
export class AlertDefaultDemo {}
