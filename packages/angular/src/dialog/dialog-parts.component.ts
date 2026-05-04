/**
 * Dialog compound parts — Header, Title, Description, Body, Footer, Close.
 * Each is a tiny standalone component matching the React `<Dialog.Header>`,
 * `<Dialog.Title>`, etc. API so the same composition reads natively in
 * Angular templates.
 */
import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from "@angular/core";
import { DialogCtx } from "./context";

@Component({
  selector: "sui-dialog-header",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<header class="sisyphos-dialog-header"><ng-content /></header>`,
})
export class DialogHeader {}

@Component({
  selector: "sui-dialog-title",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h2 [id]="ctx.titleId()" class="sisyphos-dialog-title"><ng-content /></h2>`,
})
export class DialogTitle {
  protected readonly ctx = inject(DialogCtx);
}

@Component({
  selector: "sui-dialog-description",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p [id]="ctx.descriptionId()" class="sisyphos-dialog-description"><ng-content /></p>`,
})
export class DialogDescription {
  protected readonly ctx = inject(DialogCtx);
}

@Component({
  selector: "sui-dialog-body",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="sisyphos-dialog-body"><ng-content /></div>`,
})
export class DialogBody {}

@Component({
  selector: "sui-dialog-footer",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="sisyphos-dialog-footer"><ng-content /></div>`,
})
export class DialogFooter {}

@Component({
  selector: "sui-dialog-close",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="sisyphos-dialog-close"
      [attr.aria-label]="'Close'"
      (click)="ctx.close()"
    >
      <ng-content>
        <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
          <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
        </svg>
      </ng-content>
    </button>
  `,
})
export class DialogClose {
  protected readonly ctx = inject(DialogCtx);
}
