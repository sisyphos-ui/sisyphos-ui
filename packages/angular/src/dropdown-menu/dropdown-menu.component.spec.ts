import { describe, it, expect, vi } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { DropdownMenu } from "./dropdown-menu.component";
import type { DropdownMenuItem } from "./types";

@Component({
  standalone: true,
  imports: [DropdownMenu],
  template: `
    <sui-dropdown-menu [items]="items" [open]="open" (openChange)="open = $event">
      <button class="trigger">Open</button>
    </sui-dropdown-menu>
    <button class="outside">Outside</button>
  `,
})
class Host {
  items: DropdownMenuItem[] = [];
  open = false;
}

const editFn = vi.fn();
const deleteFn = vi.fn();

const sampleItems: DropdownMenuItem[] = [
  { type: "label", label: "Actions" },
  { label: "Edit", onSelect: editFn, icon: "✎", shortcut: "⌘E" },
  { type: "separator" },
  { label: "Delete", onSelect: deleteFn, destructive: true },
  { label: "Disabled", onSelect: vi.fn(), disabled: true },
];

describe("DropdownMenu (Angular)", () => {
  it("renders no menu when closed", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items = sampleItems;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("[role=menu]")).toBeNull();
  });

  it("trigger click opens the menu and toggles aria-expanded", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items = sampleItems;
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector(".sisyphos-dropdown-anchor") as HTMLElement;
    expect(anchor.getAttribute("aria-expanded")).toBeNull();
    (fixture.nativeElement.querySelector(".trigger") as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("[role=menu]")).toBeTruthy();
    expect(anchor.getAttribute("aria-expanded")).toBe("true");
  });

  it("renders items, separators, and labels with the right roles", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items = sampleItems;
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll("[role=menuitem]").length).toBe(3);
    expect(fixture.nativeElement.querySelectorAll("[role=separator]").length).toBe(1);
    expect(fixture.nativeElement.querySelectorAll(".sisyphos-dropdown-menu-label").length).toBe(1);
  });

  it("disabled items get aria-disabled and are not selectable", () => {
    editFn.mockReset();
    const disabledFn = vi.fn();
    const items: DropdownMenuItem[] = [
      { label: "Edit", onSelect: editFn },
      { label: "Disabled", onSelect: disabledFn, disabled: true },
    ];
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items = items;
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    const lis = fixture.nativeElement.querySelectorAll(
      "[role=menuitem]"
    ) as NodeListOf<HTMLLIElement>;
    expect(lis[1].getAttribute("aria-disabled")).toBe("true");
    lis[1].click();
    expect(disabledFn).not.toHaveBeenCalled();
  });

  it("selecting a non-destructive item calls onSelect and closes the menu", () => {
    editFn.mockReset();
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items = sampleItems;
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    const lis = fixture.nativeElement.querySelectorAll(
      "[role=menuitem]"
    ) as NodeListOf<HTMLLIElement>;
    // First menuitem is Edit (after the label li)
    lis[0].click();
    fixture.detectChanges();
    expect(editFn).toHaveBeenCalled();
    expect(fixture.componentInstance.open).toBe(false);
  });

  it("destructive flag adds .destructive class", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items = sampleItems;
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    const destructive = fixture.nativeElement.querySelector(".destructive") as HTMLElement;
    expect(destructive).toBeTruthy();
    expect(destructive.textContent).toContain("Delete");
  });

  it("ArrowDown advances activeIndex through enabled actions only", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items = sampleItems;
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    fixture.detectChanges();
    const cmp = fixture.debugElement.children[0].componentInstance as DropdownMenu;
    expect(cmp.activeIndex()).toBe(1); // Edit (first enabled action)
    const list = fixture.nativeElement.querySelector("[role=menu]") as HTMLElement;
    list.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    fixture.detectChanges();
    expect(cmp.activeIndex()).toBe(3); // Delete (next enabled, skipping separator + label)
    list.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    fixture.detectChanges();
    expect(cmp.activeIndex()).toBe(1); // Wraps back to Edit
  });

  it("Home / End jump to the first / last enabled action", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items = sampleItems;
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    fixture.detectChanges();
    const cmp = fixture.debugElement.children[0].componentInstance as DropdownMenu;
    const list = fixture.nativeElement.querySelector("[role=menu]") as HTMLElement;
    list.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    fixture.detectChanges();
    expect(cmp.activeIndex()).toBe(3);
    list.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
    fixture.detectChanges();
    expect(cmp.activeIndex()).toBe(1);
  });

  it("Escape closes the menu", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items = sampleItems;
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    fixture.detectChanges();
    expect(fixture.componentInstance.open).toBe(false);
  });

  it("clicking outside closes the menu", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.items = sampleItems;
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    const outside = fixture.nativeElement.querySelector(".outside") as HTMLButtonElement;
    outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.open).toBe(false);
  });

  it("empty items + hasEmpty=true shows the empty slot", () => {
    @Component({
      standalone: true,
      imports: [DropdownMenu],
      template: `
        <sui-dropdown-menu [items]="[]" [open]="true" [hasEmpty]="true">
          <button>T</button>
          <span menu-empty>Nothing to show</span>
        </sui-dropdown-menu>
      `,
    })
    class EmptyHost {}
    const fixture = TestBed.createComponent(EmptyHost);
    fixture.detectChanges();
    const empty = fixture.nativeElement.querySelector(".sisyphos-dropdown-menu-empty");
    expect(empty?.textContent).toContain("Nothing to show");
  });
});
