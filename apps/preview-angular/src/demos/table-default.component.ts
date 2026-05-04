import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Table } from "@sisyphos-ui/angular";
import type { TableColumn } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-table-default",
  imports: [Table],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sui-table [data]="data" [columns]="columns" [rowKey]="rowKey" [striped]="true" />
  `,
})
export class TableDefaultDemo {
  // Generic erasure on ng-packagr Partial-Ivy d.ts emit (Angular 18) —
  // cast at the binding boundary so consumers see the same pattern.
  protected readonly data = [
    { id: 1, name: "Volkan Günay", role: "Engineer", status: "active" },
    { id: 2, name: "Ada Lovelace", role: "Mathematician", status: "active" },
    { id: 3, name: "Grace Hopper", role: "Compiler pioneer", status: "active" },
    { id: 4, name: "Alan Turing", role: "Cryptanalyst", status: "active" },
  ] as unknown as Record<string, unknown>[];
  protected readonly columns = [
    { id: "name", header: "Name", accessor: "name", sortable: true },
    { id: "role", header: "Role", accessor: "role", sortable: true },
    { id: "status", header: "Status", accessor: "status" },
  ] as unknown as TableColumn<Record<string, unknown>>[];
  protected readonly rowKey = (r: Record<string, unknown>) => r["id"] as number;
}
