import { describe, it, expect } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Command } from "./command.component";
import { CommandInput } from "./command-input.component";
import { CommandList } from "./command-list.component";
import { CommandEmpty } from "./command-empty.component";
import { CommandGroup } from "./command-group.component";
import { CommandItem } from "./command-item.component";

@Component({
  standalone: true,
  imports: [Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem],
  template: `
    <sui-command (select)="onSelect($event)">
      <sui-command-input placeholder="Find" />
      <sui-command-list>
        <sui-command-empty>Nothing matches</sui-command-empty>
        <sui-command-group heading="Suggestions">
          <sui-command-item value="calendar">Calendar</sui-command-item>
          <sui-command-item value="search">Search</sui-command-item>
          <sui-command-item value="settings" [disabled]="settingsDisabled">Settings</sui-command-item>
        </sui-command-group>
      </sui-command-list>
    </sui-command>
  `,
})
class Host {
  selected: string[] = [];
  settingsDisabled = false;
  onSelect = (v: string) => this.selected.push(v);
}

function tick() {
  return new Promise<void>((r) => queueMicrotask(() => r()));
}

describe("Command (Angular)", () => {
  it("renders the input, listbox, and items with proper roles", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await tick();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("[role=combobox]")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("[role=searchbox]")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("[role=listbox]")).toBeTruthy();
    const items = fixture.nativeElement.querySelectorAll("[role=option]");
    expect(items.length).toBe(3);
  });

  it("active item gets aria-selected=true", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await tick();
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll("[role=option]") as NodeListOf<HTMLElement>;
    expect(items[0].getAttribute("aria-selected")).toBe("true");
    expect(items[1].getAttribute("aria-selected")).toBeNull();
  });

  it("typing in the input filters items", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await tick();
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector("[role=searchbox]") as HTMLInputElement;
    input.value = "cal";
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll("[role=option]");
    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain("Calendar");
  });

  it("empty state shows when no matches", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await tick();
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector("[role=searchbox]") as HTMLInputElement;
    input.value = "zzz";
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("[role=note]")?.textContent).toContain(
      "Nothing matches"
    );
    expect(fixture.nativeElement.querySelectorAll("[role=option]").length).toBe(0);
  });

  it("ArrowDown then Enter selects the next item", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await tick();
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector("[role=searchbox]") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    fixture.detectChanges();
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.selected).toEqual(["search"]);
  });

  it("clicking an item fires (select) on the root with the item's value", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await tick();
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll("[role=option]") as NodeListOf<HTMLElement>;
    items[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selected).toEqual(["calendar"]);
  });

  it("disabled items are hidden from the matched set", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.settingsDisabled = true;
    fixture.detectChanges();
    await tick();
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll("[role=option]");
    expect(items.length).toBe(2);
    expect([...items].every((el) => !el.textContent?.includes("Settings"))).toBe(true);
  });

  it("Home and End jump to first / last matched item", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await tick();
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector("[role=searchbox]") as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    fixture.detectChanges();
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.selected[0]).toBe("settings");
  });
});
