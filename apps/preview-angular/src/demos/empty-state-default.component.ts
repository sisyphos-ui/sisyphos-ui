import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Button, EmptyState } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-empty-state-default",
  imports: [EmptyState, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sui-empty-state
      [bordered]="true"
      title="Nothing here yet"
      description="Once you create an item it'll show up here."
    >
      <sui-button empty-actions>New item</sui-button>
    </sui-empty-state>
  `,
})
export class EmptyStateDefaultDemo {}
