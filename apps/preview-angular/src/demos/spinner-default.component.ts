import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Spinner } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-spinner-default",
  imports: [Spinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display:flex;gap:16px;align-items:center">
      <sui-spinner size="sm" color="primary" />
      <sui-spinner size="md" color="info" />
      <sui-spinner variant="double" color="success" size="lg" />
    </div>
  `,
})
export class SpinnerDefaultDemo {}
