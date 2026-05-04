import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Alert,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  CardHeader,
  CardBody,
  Checkbox,
  Chip,
  DatePicker,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DropdownMenu,
  EmptyState,
  Input,
  Popover,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Slider,
  Spinner,
  Switch,
  Table,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsPanel,
  Textarea,
  Toaster,
  Tooltip,
  toast,
} from "@sisyphos-ui/angular";
import type { TableColumn, DropdownMenuItem } from "@sisyphos-ui/angular";

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
    CommonModule,
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
    Alert,
    Avatar,
    Breadcrumb,
    Button,
    Card,
    CardHeader,
    CardBody,
    Checkbox,
    Chip,
    DatePicker,
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogDescription,
    DialogFooter,
    DialogClose,
    DropdownMenu,
    EmptyState,
    Input,
    Popover,
    Radio,
    RadioGroup,
    Select,
    Skeleton,
    Slider,
    Spinner,
    Switch,
    Table,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsPanel,
    Textarea,
    Toaster,
    Tooltip,
  ],
  template: `
    <div class="page">
      <sui-toaster position="bottom-right" />

      <header class="hero">
        <sui-chip variant="soft" color="primary" size="sm">v1.0 — Angular 18 binding</sui-chip>
        <h1>Sisyphos UI — Angular</h1>
        <p>All sisyphos-ui components rendered through @sisyphos-ui/angular.</p>
        <div class="hero-actions">
          <sui-button (buttonClick)="hi()">Try a toast</sui-button>
          <sui-button variant="outlined" (buttonClick)="dialogOpen.set(true)">Open dialog</sui-button>
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
          <div class="grid-2">
            <sui-input label="Email" type="email" placeholder="name@example.com" />
            <sui-input label="Password" type="password" />
            <sui-textarea label="Bio" placeholder="Tell us a bit…" [maxLength]="140" [showCharacterCount]="true" />
            <sui-select
              label="Country"
              [(value)]="country"
              [clearable]="true"
              [searchable]="true"
              [options]="countries"
            />
          </div>
          <div class="row">
            <sui-checkbox [(checked)]="checked" label="I agree to the terms" />
            <sui-switch [(checked)]="swChecked" ariaLabel="Notifications" />
          </div>
          <sui-radio-group label="Plan" [(value)]="plan" variant="card">
            <sui-radio value="free" label="Free" description="All the basics, forever." />
            <sui-radio value="pro" label="Pro" description="For growing teams." />
            <sui-radio value="enterprise" label="Enterprise" description="Dedicated support." />
          </sui-radio-group>
        </section>

        <section class="showcase-section">
          <h2>Feedback</h2>
          <div class="row">
            <sui-button (buttonClick)="ok()">Success toast</sui-button>
            <sui-button color="error" (buttonClick)="bad()">Error toast</sui-button>
          </div>
          <div class="grid-2">
            <sui-alert color="success" title="All set" description="Your settings have been saved." />
            <sui-alert color="warning" title="Storage almost full" description="Upgrade or clean up." />
          </div>
          <sui-card>
            <sui-card-header>Loading state</sui-card-header>
            <sui-card-body>
              <div style="display:flex;gap:12px;align-items:center">
                <sui-skeleton shape="circular" [width]="48" [height]="48" />
                <div style="flex:1;display:grid;gap:8px">
                  <sui-skeleton width="60%" [height]="16" />
                  <sui-skeleton width="80%" [height]="14" />
                  <sui-skeleton width="40%" [height]="14" />
                </div>
              </div>
            </sui-card-body>
          </sui-card>
          <sui-empty-state
            [bordered]="true"
            title="Nothing here yet"
            description="Once you create an item it'll show up here."
          >
            <sui-button empty-actions>New item</sui-button>
          </sui-empty-state>
        </section>

        <section class="showcase-section">
          <h2>Overlays</h2>
          <div class="row">
            <span sui-tooltip="⌘K to search">
              <sui-button variant="outlined">Hover me</sui-button>
            </span>
            <sui-popover>
              <sui-button variant="outlined">Popover</sui-button>
              <div popover-content>Popovers carry rich interactive content.</div>
            </sui-popover>
            <sui-dropdown-menu [items]="menuItems">
              <sui-button variant="outlined">Actions ▾</sui-button>
            </sui-dropdown-menu>
            <sui-button (buttonClick)="dialogOpen.set(true)">Open dialog</sui-button>
          </div>
        </section>

        <section class="showcase-section">
          <h2>Navigation & data</h2>
          <sui-breadcrumb [items]="crumbs" />
          <sui-tabs [(value)]="tab" variant="pill">
            <sui-tabs-list>
              <sui-tabs-trigger value="overview">Overview</sui-tabs-trigger>
              <sui-tabs-trigger value="activity">Activity</sui-tabs-trigger>
              <sui-tabs-trigger value="settings">Settings</sui-tabs-trigger>
            </sui-tabs-list>
            <sui-tabs-panel value="overview">Overview content.</sui-tabs-panel>
            <sui-tabs-panel value="activity">Activity content.</sui-tabs-panel>
            <sui-tabs-panel value="settings">Settings content.</sui-tabs-panel>
          </sui-tabs>
          <sui-slider [(value)]="volume" ariaLabel="Volume" [showValue]="true" />
          <div class="row">
            <sui-avatar name="Volkan Günay" color="primary" />
            <sui-avatar name="Ada Lovelace" color="info" />
            <sui-avatar name="Grace Hopper" color="success" />
            <sui-spinner />
            <sui-spinner variant="double" color="info" size="lg" />
          </div>
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

        <section class="showcase-section">
          <h2>Disclosure</h2>
          <sui-accordion defaultValue="install">
            <sui-accordion-item value="install">
              <sui-accordion-trigger>How do I install it?</sui-accordion-trigger>
              <sui-accordion-content>
                <code>pnpm add &#64;sisyphos-ui/angular</code> and import the stylesheet once.
              </sui-accordion-content>
            </sui-accordion-item>
            <sui-accordion-item value="theme">
              <sui-accordion-trigger>Can I theme it?</sui-accordion-trigger>
              <sui-accordion-content>Yes — every token is a CSS variable.</sui-accordion-content>
            </sui-accordion-item>
          </sui-accordion>
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
      :host { display: block; font-family: system-ui, sans-serif; }
      .page { max-width: 960px; margin: 0 auto; padding: 32px; }
      .hero { padding: 48px 0; }
      .hero h1 { font-size: 32px; margin: 12px 0; }
      .hero-actions { display: flex; gap: 12px; margin-top: 16px; }
      .showcase-section { margin: 24px 0; padding: 24px; border-radius: 12px; background: #f9fafb; }
      .showcase-section h2 { font-size: 20px; margin: 0 0 12px; }
      .row { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; margin: 12px 0; }
      .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 12px 0; }
    `,
  ],
})
export class AppComponent {
  protected readonly tab = signal("overview");
  protected readonly dialogOpen = signal(false);
  protected readonly checked = signal(true);
  protected readonly swChecked = signal(true);
  protected readonly plan = signal<string | number>("pro");
  protected readonly country = signal<string | number | null>("tr");
  protected readonly volume = signal<number>(50);
  protected readonly date = signal<Date | null>(new Date());

  protected readonly countries = [
    { value: "tr", label: "Türkiye" },
    { value: "us", label: "United States" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France" },
  ];

  protected readonly menuItems: DropdownMenuItem[] = [
    { label: "Edit", onSelect: () => toast("Edit") },
    { label: "Duplicate", onSelect: () => toast("Duplicate") },
    { type: "separator" },
    { label: "Delete", destructive: true, onSelect: () => toast.error("Deleted") },
  ];

  protected readonly crumbs = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Sisyphos UI" },
  ];

  protected readonly tableRows: Row[] = [
    { id: 1, name: "Volkan Günay", role: "Engineer", status: "active" },
    { id: 2, name: "Ada Lovelace", role: "Mathematician", status: "active" },
    { id: 3, name: "Grace Hopper", role: "Compiler pioneer", status: "active" },
    { id: 4, name: "Alan Turing", role: "Cryptanalyst", status: "active" },
  ];
  protected readonly tableColumns: TableColumn<Row>[] = [
    { id: "name", header: "Name", accessor: "name", sortable: true },
    { id: "role", header: "Role", accessor: "role", sortable: true },
    { id: "status", header: "Status", accessor: "status" },
  ];
  protected readonly rowKey = (r: Row) => r.id;

  protected hi(): void {
    toast.success("Welcome to Sisyphos UI Angular");
  }
  protected ok(): void {
    toast.success("Saved");
  }
  protected bad(): void {
    toast.error("Something went wrong");
  }
  protected ship(): void {
    this.dialogOpen.set(false);
    toast.success("Shipped");
  }
}
