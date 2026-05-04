import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Button, Toaster, toast } from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-toast-default",
  imports: [Toaster, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sui-toaster position="bottom-right" />
    <div style="display:flex; gap:8px; flex-wrap:wrap;">
      <sui-button (buttonClick)="ok()">Success</sui-button>
      <sui-button color="error" (buttonClick)="bad()">Error</sui-button>
      <sui-button color="warning" (buttonClick)="warn()">Warning</sui-button>
    </div>
  `,
})
export class ToastDefaultDemo {
  protected ok(): void { toast.success("Saved"); }
  protected bad(): void { toast.error("Something went wrong"); }
  protected warn(): void { toast.warning("Heads up"); }
}
