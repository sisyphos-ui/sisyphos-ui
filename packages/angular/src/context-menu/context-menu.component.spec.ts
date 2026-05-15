import { describe, it, expect, vi } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { ContextMenu } from "./context-menu.component";
import type { ContextMenuItem } from "./types";

@Component({
  standalone: true,
  imports: [ContextMenu],
  template: `
    <sui-context-menu [items]="items" [disabled]="disabled" (openChange)="onOpenChange($event)">
      <div class="zone">Right click me</div>
    </sui-context-menu>
    <button class="outside">Outside</button>
  `,
})
class Host {
  items: ContextMenuItem[] = [];
  disabled = false;
  openEvents: boolean[] = [];
  onOpenChange = (v: boolean) => this.openEvents.push(v);
}

const editFn = vi.fn();
const deleteFn = vi.fn();

const sample: ContextMenuItem[] = [
  { label: "Edit", onSelect: editFn },
  { type: "separator" },
  { label: "Delete", onSelect: deleteFn, destructive: true },
];

function rightClick(el: HTMLElement, x = 100, y = 100) {
  const ev = new MouseEvent("contextmenu", {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
  });
  el.dispatchEvent(ev);
  return ev;
}

describe("ContextMenu (Angular)", () => {
  it("does not render the menu before contextmenu event", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items = sample;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("[role=menu]")).toBeNull();
  });

  it("right-click opens the menu and emits openChange(true)", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items = sample;
    fixture.detectChanges();
    const zone = fixture.nativeElement.querySelector(".zone") as HTMLElement;
    rightClick(zone);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("[role=menu]")).toBeTruthy();
    expect(fixture.componentInstance.openEvents).toContain(true);
  });

  it("preventDefault is called on the contextmenu event", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items = sample;
    fixture.detectChanges();
    const zone = fixture.nativeElement.querySelector(".zone") as HTMLElement;
    const ev = rightClick(zone);
    fixture.detectChanges();
    expect(ev.defaultPrevented).toBe(true);
  });

  it("disabled blocks the menu from opening", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items = sample;
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    const zone = fixture.nativeElement.querySelector(".zone") as HTMLElement;
    rightClick(zone);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("[role=menu]")).toBeNull();
  });

  it("renders items, separators, and roles", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items = sample;
    fixture.detectChanges();
    rightClick(fixture.nativeElement.querySelector(".zone") as HTMLElement);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll("[role=menuitem]").length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll("[role=separator]").length).toBe(1);
  });

  it("clicking an item calls onSelect and closes", () => {
    editFn.mockReset();
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items = sample;
    fixture.detectChanges();
    rightClick(fixture.nativeElement.querySelector(".zone") as HTMLElement);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll(
      "[role=menuitem]"
    ) as NodeListOf<HTMLLIElement>;
    items[0].click();
    fixture.detectChanges();
    expect(editFn).toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector("[role=menu]")).toBeNull();
  });

  it("Escape closes the menu", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items = sample;
    fixture.detectChanges();
    rightClick(fixture.nativeElement.querySelector(".zone") as HTMLElement);
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("[role=menu]")).toBeNull();
  });

  it("mousedown outside closes the menu", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items = sample;
    fixture.detectChanges();
    rightClick(fixture.nativeElement.querySelector(".zone") as HTMLElement);
    fixture.detectChanges();
    const outside = fixture.nativeElement.querySelector(".outside") as HTMLElement;
    outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("[role=menu]")).toBeNull();
  });

  it("ArrowDown advances activeIndex through enabled actions", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items = sample;
    fixture.detectChanges();
    rightClick(fixture.nativeElement.querySelector(".zone") as HTMLElement);
    fixture.detectChanges();
    const cmp = fixture.debugElement.children[0].componentInstance as ContextMenu;
    expect(cmp.activeIndex()).toBe(0);
    const list = fixture.nativeElement.querySelector("[role=menu]") as HTMLElement;
    list.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    fixture.detectChanges();
    expect(cmp.activeIndex()).toBe(2); // separator at 1 skipped
  });
});
