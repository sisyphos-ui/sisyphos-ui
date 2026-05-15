import { describe, it, expect } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Select } from "./select.component";
import type { SelectOption } from "./types";

const opts: SelectOption[] = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
  { value: "c", label: "Cherry", disabled: true },
];

@Component({
  standalone: true,
  imports: [Select],
  template: `
    <sui-select
      [options]="options"
      [multiple]="multiple"
      [value]="value"
      (valueChange)="value = $event"
      [values]="values"
      (valuesChange)="values = $event"
      [searchable]="searchable"
      [clearable]="clearable"
    />
  `,
})
class Host {
  options: SelectOption[] = opts;
  multiple = false;
  value: string | number | null = null;
  values: (string | number)[] = [];
  searchable = false;
  clearable = false;
}

describe("Select (Angular) — single", () => {
  it("renders the trigger with role=combobox and placeholder", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector("[role=combobox]") as HTMLElement;
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(fixture.nativeElement.querySelector(".sisyphos-select-placeholder")?.textContent).toBe(
      "Select…"
    );
  });

  it("opens the listbox on trigger click and emits aria-expanded=true", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector("[role=combobox]") as HTMLElement;
    trigger.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("[role=listbox]")).toBeTruthy();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("clicking an option selects it and closes the menu", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector("[role=combobox]") as HTMLElement).click();
    fixture.detectChanges();
    const options = fixture.nativeElement.querySelectorAll(
      "[role=option]"
    ) as NodeListOf<HTMLLIElement>;
    options[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe("b");
    expect(fixture.nativeElement.querySelector("[role=listbox]")).toBeNull();
  });

  it("disabled option cannot be selected", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector("[role=combobox]") as HTMLElement).click();
    fixture.detectChanges();
    const options = fixture.nativeElement.querySelectorAll(
      "[role=option]"
    ) as NodeListOf<HTMLLIElement>;
    options[2].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBeNull();
  });

  it("renders the selected label when value is set", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value = "b";
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".sisyphos-select-single")?.textContent).toBe(
      "Banana"
    );
  });

  it("clearable shows the clear button when a value is set", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value = "a";
    fixture.componentInstance.clearable = true;
    fixture.detectChanges();
    const clear = fixture.nativeElement.querySelector(
      ".sisyphos-select-clear"
    ) as HTMLButtonElement;
    expect(clear).toBeTruthy();
    clear.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBeNull();
  });

  it("Escape closes the listbox", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector("[role=combobox]") as HTMLElement).click();
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("[role=listbox]")).toBeNull();
  });

  it("ArrowDown then Enter selects an option", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const cmp = fixture.debugElement.children[0].componentInstance as Select;
    const trigger = fixture.nativeElement.querySelector("[role=combobox]") as HTMLElement;
    // First ArrowDown opens the menu (since closed at start)
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    fixture.detectChanges();
    expect(cmp.open()).toBe(true);
    // Subsequent ArrowDowns walk through the options
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    fixture.detectChanges();
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    fixture.detectChanges();
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe("b");
  });
});

describe("Select (Angular) — multiple", () => {
  it("clicking an option toggles it; menu stays open", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.multiple = true;
    fixture.detectChanges();
    (fixture.nativeElement.querySelector("[role=combobox]") as HTMLElement).click();
    fixture.detectChanges();
    const options = fixture.nativeElement.querySelectorAll(
      "[role=option]"
    ) as NodeListOf<HTMLLIElement>;
    options[0].click();
    fixture.detectChanges();
    options[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.values).toEqual(["a", "b"]);
    expect(fixture.nativeElement.querySelector("[role=listbox]")).toBeTruthy();
    options[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.values).toEqual(["b"]);
  });

  it("renders chips for selected values", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.multiple = true;
    fixture.componentInstance.values = ["a", "b"];
    fixture.detectChanges();
    const tags = fixture.nativeElement.querySelectorAll(".sisyphos-select-tag");
    expect(tags.length).toBe(2);
  });

  it("tag delete button removes that value", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.multiple = true;
    fixture.componentInstance.values = ["a", "b"];
    fixture.detectChanges();
    const deletes = fixture.nativeElement.querySelectorAll(".sisyphos-select-tag-delete");
    (deletes[0] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.values).toEqual(["b"]);
  });
});

describe("Select (Angular) — searchable", () => {
  it("filters options by search input", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.searchable = true;
    fixture.detectChanges();
    (fixture.nativeElement.querySelector("[role=combobox]") as HTMLElement).click();
    fixture.detectChanges();
    const search = fixture.nativeElement.querySelector(
      ".sisyphos-select-search"
    ) as HTMLInputElement;
    search.value = "ban";
    search.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    const options = fixture.nativeElement.querySelectorAll("[role=option]");
    expect(options.length).toBe(1);
    expect(options[0].textContent).toContain("Banana");
  });
});
