import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ContextMenu } from "@sisyphos-ui/angular";
import type { DropdownMenuItem } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-context-menu-default",
  imports: [ContextMenu],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sui-context-menu [items]="items">
      <div
        style="padding:24px; border:1px dashed #c4cdd5; border-radius:8px; text-align:center; color:#637381; user-select:none;"
      >
        Right-click me
      </div>
    </sui-context-menu>
  `,
})
export class ContextMenuDefaultDemo {
  protected readonly items: DropdownMenuItem[] = [
    { label: "Open", onSelect: () => alert("Open") },
    { label: "Rename", onSelect: () => alert("Rename") },
    { type: "separator" },
    { label: "Delete", destructive: true, onSelect: () => alert("Deleted") },
  ];
}
