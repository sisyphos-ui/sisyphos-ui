import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { TreeSelect } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-tree-select-default",
  imports: [TreeSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<sui-tree-select label="Departments" [nodes]="tree" [(value)]="ids" />`,
})
export class TreeSelectDefaultDemo {
  protected readonly tree = [
    {
      id: "1",
      label: "Engineering",
      children: [
        { id: "1-1", label: "Web" },
        { id: "1-2", label: "Mobile" },
      ],
    },
    { id: "2", label: "Design" },
    { id: "3", label: "Product" },
  ];
  protected readonly ids = signal<string[]>([]);
}
