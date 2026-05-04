import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Breadcrumb } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-breadcrumb-default",
  imports: [Breadcrumb],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<sui-breadcrumb [items]="items" />`,
})
export class BreadcrumbDefaultDemo {
  protected readonly items = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Sisyphos UI" },
  ];
}
