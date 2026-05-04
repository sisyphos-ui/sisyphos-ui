import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Button, DropdownMenu } from "@sisyphos-ui/angular";
import type { DropdownMenuItem } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-dropdown-menu-default",
  imports: [DropdownMenu, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sui-dropdown-menu [items]="items">
      <sui-button variant="outlined">Actions ▾</sui-button>
    </sui-dropdown-menu>
  `,
})
export class DropdownMenuDefaultDemo {
  protected readonly items: DropdownMenuItem[] = [
    { label: "Edit", onSelect: () => alert("Edit") },
    { label: "Duplicate", onSelect: () => alert("Duplicate") },
    { type: "separator" },
    { label: "Delete", destructive: true, onSelect: () => alert("Deleted") },
  ];
}
