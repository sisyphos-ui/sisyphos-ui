import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { Select } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-select-default",
  imports: [Select],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sui-select
      label="Country"
      [(value)]="value"
      [searchable]="true"
      [clearable]="true"
      [options]="options"
    />
  `,
})
export class SelectDefaultDemo {
  protected readonly value = signal<string | number | null>("tr");
  protected readonly options = [
    { value: "tr", label: "Türkiye" },
    { value: "us", label: "United States" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France" },
    { value: "jp", label: "Japan" },
  ];
}
