import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Chip,
  DatePicker,
  Dialog,
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Spinner,
  Switch,
  Table,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTrigger,
  Toaster,
  toast,
} from "@sisyphos-ui/angular";
import type { TableColumn } from "@sisyphos-ui/angular";

interface Row {
  id: number;
  name: string;
  role: string;
  status: string;
}

@Component({
  selector: "playground-app",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Avatar,
    Button,
    Card,
    CardBody,
    CardHeader,
    Checkbox,
    Chip,
    DatePicker,
    Dialog,
    DialogBody,
    DialogClose,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Spinner,
    Switch,
    Table,
    Tabs,
    TabsList,
    TabsPanel,
    TabsTrigger,
    Toaster,
  ],
  template: `
    <div class="page">
      <sui-toaster position="bottom-right" />

      <header class="hero">
        <sui-chip variant="soft" color="primary" size="sm">v1.0 — Angular 18 binding</sui-chip>
        <h1>Sisyphos UI — Angular</h1>
        <p>All sisyphos-ui components rendered through &#64;sisyphos-ui/angular.</p>
        <div class="hero-actions">
          <sui-button (buttonClick)="hi()">Try a toast</sui-button>
          <sui-button variant="outlined" (buttonClick)="dialogOpen.set(true)"
            >Open dialog</sui-button
          >
        </div>
      </header>

      <main class="page-body">
        <section class="showcase-section">
          <h2>Buttons</h2>
          <div class="row">
            <sui-button variant="contained">contained</sui-button>
            <sui-button variant="outlined">outlined</sui-button>
            <sui-button variant="soft">soft</sui-button>
            <sui-button variant="text">text</sui-button>
          </div>
          <div class="row">
            <sui-button color="primary">primary</sui-button>
            <sui-button color="success">success</sui-button>
            <sui-button color="error">error</sui-button>
            <sui-button color="warning">warning</sui-button>
            <sui-button color="info">info</sui-button>
          </div>
          <div class="row">
            <sui-button size="sm">small</sui-button>
            <sui-button>default</sui-button>
            <sui-button size="lg">large</sui-button>
            <sui-button [loading]="true">loading</sui-button>
            <sui-button [disabled]="true">disabled</sui-button>
          </div>
        </section>

        <section class="showcase-section">
          <h2>Form fields</h2>
          <div class="row">
            <sui-checkbox [(checked)]="checked" label="I agree to the terms" />
            <sui-switch [(checked)]="swChecked" ariaLabel="Notifications" />
          </div>
        </section>

        <section class="showcase-section">
          <h2>Card + avatar + spinner</h2>
          <sui-card>
            <sui-card-header>Profile</sui-card-header>
            <sui-card-body>
              <div class="row">
                <sui-avatar name="Volkan Günay" color="primary" />
                <sui-avatar name="Ada Lovelace" color="info" />
                <sui-avatar name="Grace Hopper" color="success" />
                <sui-spinner />
              </div>
            </sui-card-body>
          </sui-card>
        </section>

        <section class="showcase-section">
          <h2>Tabs</h2>
          <sui-tabs [(value)]="tab" variant="pill">
            <sui-tabs-list>
              <sui-tabs-trigger value="overview">Overview</sui-tabs-trigger>
              <sui-tabs-trigger value="activity">Activity</sui-tabs-trigger>
            </sui-tabs-list>
            <sui-tabs-panel value="overview">Overview content.</sui-tabs-panel>
            <sui-tabs-panel value="activity">Activity content.</sui-tabs-panel>
          </sui-tabs>
        </section>

        <section class="showcase-section">
          <h2>Data table</h2>
          <sui-table
            [data]="tableRows"
            [columns]="tableColumns"
            [rowKey]="rowKey"
            [striped]="true"
          />
        </section>

        <section class="showcase-section">
          <h2>DatePicker</h2>
          <sui-datepicker [(value)]="date" />
        </section>
      </main>

      <sui-dialog [open]="dialogOpen()" (openChange)="dialogOpen.set($event)" size="md">
        <sui-dialog-header>
          <sui-dialog-title>Ship it</sui-dialog-title>
          <sui-dialog-close />
        </sui-dialog-header>
        <sui-dialog-body>
          <sui-dialog-description>
            Every Sisyphos dialog traps focus, locks body scroll, and restores focus on close.
          </sui-dialog-description>
        </sui-dialog-body>
        <sui-dialog-footer>
          <sui-button variant="outlined" (buttonClick)="dialogOpen.set(false)">Cancel</sui-button>
          <sui-button (buttonClick)="ship()">Ship</sui-button>
        </sui-dialog-footer>
      </sui-dialog>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        font-family: system-ui, sans-serif;
      }
      .page {
        max-width: 960px;
        margin: 0 auto;
        padding: 32px;
      }
      .hero {
        padding: 48px 0;
      }
      .hero h1 {
        font-size: 32px;
        margin: 12px 0;
      }
      .hero-actions {
        display: flex;
        gap: 12px;
        margin-top: 16px;
      }
      .showcase-section {
        margin: 24px 0;
        padding: 24px;
        border-radius: 12px;
        background: #f9fafb;
      }
      .showcase-section h2 {
        font-size: 20px;
        margin: 0 0 12px;
      }
      .row {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        align-items: center;
        margin: 12px 0;
      }
    `,
  ],
})
export class AppComponent {
  protected readonly tab = signal("overview");
  protected readonly dialogOpen = signal(false);
  protected readonly checked = signal(true);
  protected readonly swChecked = signal(true);
  protected readonly date = signal<Date | null>(new Date());

  // The TableColumn generic resolves to `Record<string, unknown>` once
  // ng-packagr emits the Partial-Ivy d.ts (Angular 18 limitation), so we
  // type the runtime data with `as` casts at the binding boundary.
  protected readonly tableRows = [
    { id: 1, name: "Volkan Günay", role: "Engineer", status: "active" },
    { id: 2, name: "Ada Lovelace", role: "Mathematician", status: "active" },
    { id: 3, name: "Grace Hopper", role: "Compiler pioneer", status: "active" },
    { id: 4, name: "Alan Turing", role: "Cryptanalyst", status: "active" },
  ] as unknown as Record<string, unknown>[];
  protected readonly tableColumns = [
    { id: "name", header: "Name", accessor: "name", sortable: true },
    { id: "role", header: "Role", accessor: "role", sortable: true },
    { id: "status", header: "Status", accessor: "status" },
  ] as unknown as TableColumn<Record<string, unknown>>[];
  protected readonly rowKey = (r: Record<string, unknown>) => r["id"] as number;

  protected hi(): void {
    toast.success("Welcome to Sisyphos UI Angular");
  }
  protected ship(): void {
    this.dialogOpen.set(false);
    toast.success("Shipped");
  }
}
