import { describe, it, expect } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Popover } from "./popover.component";

@Component({
  standalone: true,
  imports: [Popover],
  template: `
    <sui-popover
      [trigger]="trigger"
      [open]="open"
      (openChange)="open = $event"
      [closeOnEscape]="closeOnEscape"
      [closeOnOutsideClick]="closeOnOutsideClick"
    >
      <button class="trigger">Open</button>
      <div popover-content class="content">Hello</div>
    </sui-popover>
    <button class="outside">Outside</button>
  `,
})
class Host {
  trigger: "click" | "hover" | "manual" = "click";
  open = false;
  closeOnEscape = true;
  closeOnOutsideClick = true;
}

describe("Popover (Angular)", () => {
  it("does not render the panel when closed", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("[role=dialog]")).toBeNull();
  });

  it("clicking the trigger toggles open", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector(".trigger") as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.open).toBe(true);
    expect(fixture.nativeElement.querySelector("[role=dialog]")).toBeTruthy();
    trigger.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.open).toBe(false);
  });

  it("renders the panel content via the popover-content slot", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    const panel = fixture.nativeElement.querySelector("[role=dialog]") as HTMLElement;
    expect(panel.textContent).toContain("Hello");
  });

  it("anchor wrapper sets aria-haspopup and aria-expanded", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector(".sisyphos-popover-anchor") as HTMLElement;
    expect(anchor.getAttribute("aria-haspopup")).toBe("dialog");
    expect(anchor.getAttribute("aria-expanded")).toBeNull();
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    expect(anchor.getAttribute("aria-expanded")).toBe("true");
  });

  it("Escape closes when closeOnEscape=true", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    fixture.detectChanges();
    expect(fixture.componentInstance.open).toBe(false);
  });

  it("closeOnEscape=false ignores Escape", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.open = true;
    fixture.componentInstance.closeOnEscape = false;
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    fixture.detectChanges();
    expect(fixture.componentInstance.open).toBe(true);
  });

  it("clicking outside closes when closeOnOutsideClick=true", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    const outside = fixture.nativeElement.querySelector(".outside") as HTMLButtonElement;
    outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.open).toBe(false);
  });

  it("clicking inside the panel does not close", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector(".content") as HTMLElement;
    content.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.open).toBe(true);
  });

  it("manual trigger does not respond to clicks", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.trigger = "manual";
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector(".trigger") as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.open).toBe(false);
  });

  it("hover trigger opens with mouseenter", async () => {
    @Component({
      standalone: true,
      imports: [Popover],
      template: `
        <sui-popover trigger="hover" [openDelay]="0" [closeDelay]="0">
          <button class="trigger">T</button>
          <div popover-content>Hi</div>
        </sui-popover>
      `,
    })
    class HoverHost {}

    const fixture = TestBed.createComponent(HoverHost);
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector(".sisyphos-popover-anchor") as HTMLElement;
    anchor.dispatchEvent(new MouseEvent("mouseenter"));
    await new Promise((r) => setTimeout(r, 5));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("[role=dialog]")).toBeTruthy();
  });
});
