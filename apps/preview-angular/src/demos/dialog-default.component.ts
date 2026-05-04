import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import {
  Button,
  Dialog,
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@sisyphos-ui/angular";

@Component({
  standalone: true,
  selector: "demo-dialog-default",
  imports: [
    Button,
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogBody,
    DialogDescription,
    DialogFooter,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <sui-button (buttonClick)="open.set(true)">Open dialog</sui-button>
    <sui-dialog [open]="open()" (openChange)="open.set($event)" size="md">
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
        <sui-button variant="outlined" (buttonClick)="open.set(false)">Cancel</sui-button>
        <sui-button (buttonClick)="open.set(false)">Ship</sui-button>
      </sui-dialog-footer>
    </sui-dialog>
  `,
})
export class DialogDefaultDemo {
  protected readonly open = signal(false);
}
