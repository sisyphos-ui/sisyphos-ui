import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Chip } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-chip-default",
  imports: [Chip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="display:flex;gap:8px">
      <sui-chip variant="soft" color="primary">Featured</sui-chip>
      <sui-chip variant="soft" color="success">Active</sui-chip>
      <sui-chip variant="soft" color="warning">Pending</sui-chip>
    </div>
  `,
})
export class ChipDefaultDemo {}
