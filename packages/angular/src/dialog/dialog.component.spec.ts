import { describe, it, expect } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Dialog } from "./dialog.component";
import {
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog-parts.component";

@Component({
  standalone: true,
  imports: [
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogBody,
    DialogFooter,
    DialogClose,
  ],
  template: `
    <sui-dialog
      [open]="open"
      (openChange)="open = $event"
      [showCloseButton]="showCloseButton"
      [closeOnBackdropClick]="closeOnBackdropClick"
      [closeOnEscape]="closeOnEscape"
    >
      <sui-dialog-header>
        <sui-dialog-title>Title here</sui-dialog-title>
      </sui-dialog-header>
      <sui-dialog-description>Body description</sui-dialog-description>
      <sui-dialog-body>
        <button class="first">First</button>
        <button class="second">Second</button>
      </sui-dialog-body>
      <sui-dialog-footer>
        <sui-dialog-close>Cancel</sui-dialog-close>
      </sui-dialog-footer>
    </sui-dialog>
  `,
})
class Host {
  open = false;
  showCloseButton = false;
  closeOnBackdropClick = true;
  closeOnEscape = true;
}

describe("Dialog (Angular)", () => {
  function tick(fixture: ReturnType<typeof TestBed.createComponent<Host>>) {
    fixture.detectChanges();
    // Allow queued microtasks (focus/initialization) to flush.
    return new Promise<void>((r) => queueMicrotask(() => r()));
  }

  it("does not render when closed", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("[role=dialog]")).toBeNull();
  });

  it("renders the dialog when open=true", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.open = true;
    await tick(fixture);
    const panel = fixture.nativeElement.querySelector("[role=dialog]") as HTMLElement;
    expect(panel).toBeTruthy();
    expect(panel.getAttribute("aria-modal")).toBe("true");
  });

  it("links aria-labelledby to dialog-title.id and aria-describedby to description.id", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.open = true;
    await tick(fixture);
    const panel = fixture.nativeElement.querySelector("[role=dialog]") as HTMLElement;
    const title = fixture.nativeElement.querySelector(".sisyphos-dialog-title") as HTMLElement;
    const desc = fixture.nativeElement.querySelector(".sisyphos-dialog-description") as HTMLElement;
    expect(panel.getAttribute("aria-labelledby")).toBe(title.id);
    expect(panel.getAttribute("aria-describedby")).toBe(desc.id);
  });

  it("backdrop mousedown closes when closeOnBackdropClick=true", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.open = true;
    await tick(fixture);
    const root = fixture.nativeElement.querySelector(".sisyphos-dialog-root") as HTMLElement;
    const ev = new MouseEvent("mousedown", { bubbles: true });
    Object.defineProperty(ev, "target", { value: root, configurable: true });
    Object.defineProperty(ev, "currentTarget", { value: root, configurable: true });
    root.dispatchEvent(ev);
    await tick(fixture);
    expect(fixture.componentInstance.open).toBe(false);
  });

  it("closeOnBackdropClick=false ignores backdrop", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.open = true;
    fixture.componentInstance.closeOnBackdropClick = false;
    await tick(fixture);
    const root = fixture.nativeElement.querySelector(".sisyphos-dialog-root") as HTMLElement;
    const ev = new MouseEvent("mousedown", { bubbles: true });
    Object.defineProperty(ev, "target", { value: root, configurable: true });
    Object.defineProperty(ev, "currentTarget", { value: root, configurable: true });
    root.dispatchEvent(ev);
    await tick(fixture);
    expect(fixture.componentInstance.open).toBe(true);
  });

  it("Escape closes when closeOnEscape=true", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.open = true;
    await tick(fixture);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await tick(fixture);
    expect(fixture.componentInstance.open).toBe(false);
  });

  it("closeOnEscape=false ignores Escape", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.open = true;
    fixture.componentInstance.closeOnEscape = false;
    await tick(fixture);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await tick(fixture);
    expect(fixture.componentInstance.open).toBe(true);
  });

  it("dialog-close button closes the dialog", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.open = true;
    await tick(fixture);
    const closeBtn = fixture.nativeElement.querySelector(
      ".sisyphos-dialog-close"
    ) as HTMLButtonElement;
    closeBtn.click();
    await tick(fixture);
    expect(fixture.componentInstance.open).toBe(false);
  });

  it("showCloseButton renders the auto close button", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.open = true;
    fixture.componentInstance.showCloseButton = true;
    await tick(fixture);
    expect(fixture.nativeElement.querySelector(".sisyphos-dialog-close--auto")).toBeTruthy();
  });

  it("locks body scroll when open and restores on close", async () => {
    document.body.style.overflow = "";
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.open = true;
    await tick(fixture);
    expect(document.body.style.overflow).toBe("hidden");
    fixture.componentInstance.open = false;
    await tick(fixture);
    expect(document.body.style.overflow).toBe("");
  });
});
