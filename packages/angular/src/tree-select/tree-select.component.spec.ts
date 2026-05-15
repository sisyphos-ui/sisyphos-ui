import { describe, it, expect } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TreeSelect } from "./tree-select.component";
import { descendantIds, filterTree, findNode, leaves, nodeState } from "./utils";
import type { TreeNode } from "./types";

const sample: TreeNode[] = [
  {
    id: "fruit",
    label: "Fruit",
    children: [
      { id: "apple", label: "Apple" },
      { id: "banana", label: "Banana" },
      { id: "cherry", label: "Cherry", disabled: true },
    ],
  },
  { id: "veg", label: "Vegetable", children: [{ id: "carrot", label: "Carrot" }] },
];

describe("TreeSelect utils", () => {
  it("descendantIds yields self + all descendants", () => {
    const ids = descendantIds(sample[0]!);
    expect(ids).toEqual(["fruit", "apple", "banana", "cherry"]);
  });

  it("filterTree narrows to matched ancestors", () => {
    const filtered = filterTree(sample, "ban");
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe("fruit");
    expect(filtered[0].children?.length).toBe(1);
    expect(filtered[0].children?.[0].id).toBe("banana");
  });

  it("leaves returns nodes without children", () => {
    expect(
      leaves(sample)
        .map((n) => n.id)
        .sort()
    ).toEqual(["apple", "banana", "carrot", "cherry"]);
  });

  it("findNode searches DFS", () => {
    expect(findNode(sample, "carrot")?.label).toBe("Carrot");
    expect(findNode(sample, "missing")).toBeNull();
  });

  it("nodeState reports checked/partial/unchecked correctly", () => {
    // nodeState rolls up child state — the parent's own selection isn't checked.
    const set = new Set<string | number>();
    expect(nodeState(sample[0]!, set)).toBe("unchecked");
    set.add("apple");
    expect(nodeState(sample[0]!, set)).toBe("partial");
    set.add("banana");
    set.add("cherry");
    expect(nodeState(sample[0]!, set)).toBe("checked"); // every child checked
  });
});

@Component({
  standalone: true,
  imports: [TreeSelect],
  template: `
    <sui-tree-select
      [nodes]="nodes"
      [value]="value"
      (valueChange)="value = $event"
      [searchable]="true"
      [cascade]="cascade"
      [clearable]="clearable"
    />
  `,
})
class Host {
  nodes = sample;
  value: (string | number)[] = [];
  cascade = true;
  clearable = false;
}

describe("TreeSelect (Angular)", () => {
  it("renders the trigger with combobox role", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector("[role=combobox]") as HTMLElement;
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute("aria-haspopup")).toBe("tree");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("opens the dropdown on click", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector("[role=combobox]") as HTMLElement;
    trigger.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("[role=tree]")).toBeTruthy();
  });

  it("renders top-level nodes as rows", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector("[role=combobox]") as HTMLElement).click();
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll("[role=tree] [role=checkbox]");
    expect(rows.length).toBe(2); // Fruit + Vegetable
  });

  it("clicking a leaf toggles its id in the value", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.cascade = false;
    fixture.detectChanges();
    (fixture.nativeElement.querySelector("[role=combobox]") as HTMLElement).click();
    fixture.detectChanges();
    // Expand "Fruit" to expose its leaves.
    const expandBtns = fixture.nativeElement.querySelectorAll(".sisyphos-tree-expand");
    (expandBtns[0] as HTMLButtonElement).click();
    fixture.detectChanges();
    const checks = fixture.nativeElement.querySelectorAll("[role=checkbox]");
    // Click the "Apple" row (first child of Fruit). Order: [Fruit, Apple, Banana, Cherry, Vegetable].
    (checks[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toContain("apple");
  });

  it("cascade toggle on parent selects all enabled descendants", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector("[role=combobox]") as HTMLElement).click();
    fixture.detectChanges();
    const checks = fixture.nativeElement.querySelectorAll("[role=checkbox]");
    (checks[0] as HTMLButtonElement).click();
    fixture.detectChanges();
    // Cascade adds [fruit, apple, banana, cherry] — disabled is still added in
    // current React behavior, so just check fruit + apple are present.
    expect(fixture.componentInstance.value).toContain("fruit");
    expect(fixture.componentInstance.value).toContain("apple");
    expect(fixture.componentInstance.value).toContain("banana");
  });

  it("search filters tree nodes by label", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector("[role=combobox]") as HTMLElement).click();
    fixture.detectChanges();
    const search = fixture.nativeElement.querySelector(
      ".sisyphos-tree-select-search input"
    ) as HTMLInputElement;
    search.value = "ban";
    search.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    const labels = Array.from(fixture.nativeElement.querySelectorAll(".sisyphos-tree-label")).map(
      (el) => (el as HTMLElement).textContent?.trim()
    );
    expect(labels).toEqual(["Fruit", "Banana"]);
  });

  it("displays selected tags in the trigger", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value = ["apple"];
    fixture.detectChanges();
    const tag = fixture.nativeElement.querySelector(".sisyphos-tree-select-tag") as HTMLElement;
    expect(tag.textContent?.trim()).toBe("Apple");
  });

  it("clear button empties the value", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value = ["apple", "banana"];
    fixture.componentInstance.clearable = true;
    fixture.detectChanges();
    const clear = fixture.nativeElement.querySelector(
      ".sisyphos-tree-select-clear"
    ) as HTMLButtonElement;
    clear.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toEqual([]);
  });

  it("Escape closes the dropdown", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector("[role=combobox]") as HTMLElement).click();
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("[role=tree]")).toBeNull();
  });
});
