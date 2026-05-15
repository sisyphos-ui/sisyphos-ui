import { describe, it, expect, vi } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Chip } from "./chip.component";

describe("Chip (Angular)", () => {
  function setup(props: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Chip);
    for (const [key, value] of Object.entries(props)) {
      if (value !== undefined) fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    const root = fixture.nativeElement.querySelector(".sisyphos-chip") as HTMLElement;
    return { fixture, root };
  }

  it("renders with default classes (soft, primary, md, radius-full)", () => {
    const { root } = setup();
    expect(root).toBeTruthy();
    expect(root.className).toContain("soft");
    expect(root.className).toContain("primary");
    expect(root.className).toContain("md");
    expect(root.className).toContain("radius-full");
  });

  it("non-interactive chip has no role/tabindex", () => {
    const { root } = setup();
    expect(root.getAttribute("role")).toBeNull();
    expect(root.getAttribute("tabindex")).toBeNull();
  });

  it("clickable chip becomes a button (role + tabindex 0)", () => {
    const { root } = setup({ clickable: true });
    expect(root.getAttribute("role")).toBe("button");
    expect(root.getAttribute("tabindex")).toBe("0");
    expect(root.className).toContain("clickable");
  });

  it("disabled clickable chip is NOT interactive", () => {
    const { root } = setup({ clickable: true, disabled: true });
    expect(root.getAttribute("role")).toBeNull();
    expect(root.getAttribute("tabindex")).toBeNull();
    expect(root.className).toContain("disabled");
    expect(root.getAttribute("aria-disabled")).toBe("true");
  });

  it("emits chipClick on click when interactive", () => {
    const { fixture, root } = setup({ clickable: true });
    const clicks: Event[] = [];
    fixture.componentInstance.chipClick.subscribe((e) => clicks.push(e));
    root.click();
    expect(clicks.length).toBe(1);
  });

  it("does not emit chipClick when not clickable", () => {
    const { fixture, root } = setup();
    const clicks: Event[] = [];
    fixture.componentInstance.chipClick.subscribe((e) => clicks.push(e));
    root.click();
    expect(clicks.length).toBe(0);
  });

  it("Enter and Space activate an interactive chip", () => {
    const { fixture, root } = setup({ clickable: true });
    const clicks: Event[] = [];
    fixture.componentInstance.chipClick.subscribe((e) => clicks.push(e));
    root.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    root.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
    expect(clicks.length).toBe(2);
  });

  it("deletable adds delete button + .has-delete class", () => {
    const { fixture, root } = setup({ deletable: true });
    const button = fixture.nativeElement.querySelector(
      "button.sisyphos-chip-delete"
    ) as HTMLButtonElement;
    expect(button).toBeTruthy();
    expect(button.getAttribute("aria-label")).toBe("Remove");
    expect(root.className).toContain("has-delete");
  });

  it("clicking delete button emits (delete) and stops propagation", () => {
    const { fixture } = setup({ deletable: true, clickable: true });
    const onChipClick = vi.fn();
    const onDelete = vi.fn();
    fixture.componentInstance.chipClick.subscribe(onChipClick);
    fixture.componentInstance.delete.subscribe(onDelete);
    const button = fixture.nativeElement.querySelector(
      "button.sisyphos-chip-delete"
    ) as HTMLButtonElement;
    button.click();
    expect(onDelete).toHaveBeenCalledTimes(1);
    // Delete button click should NOT propagate to chip click
    expect(onChipClick).not.toHaveBeenCalled();
  });

  it("disabled prevents delete emit", () => {
    const { fixture } = setup({ deletable: true, disabled: true });
    const onDelete = vi.fn();
    fixture.componentInstance.delete.subscribe(onDelete);
    const button = fixture.nativeElement.querySelector(
      "button.sisyphos-chip-delete"
    ) as HTMLButtonElement;
    button.click();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("custom deleteAriaLabel is forwarded", () => {
    const { fixture } = setup({ deletable: true, deleteAriaLabel: "Filtreyi kaldır" });
    const button = fixture.nativeElement.querySelector(
      "button.sisyphos-chip-delete"
    ) as HTMLButtonElement;
    expect(button.getAttribute("aria-label")).toBe("Filtreyi kaldır");
  });

  it("applies size + variant + color classes", () => {
    const { root } = setup({ size: "lg", variant: "outlined", color: "success" });
    expect(root.className).toContain("lg");
    expect(root.className).toContain("outlined");
    expect(root.className).toContain("success");
  });

  it("non-full radius applies as radius-<value>", () => {
    const { root } = setup({ radius: "sm" });
    expect(root.className).toContain("radius-sm");
    expect(root.className).not.toContain("radius-full");
  });
});

describe("Chip — projected slots", () => {
  @Component({
    standalone: true,
    imports: [Chip],
    template: `
      <sui-chip>
        <span chip-avatar class="my-av">VG</span>
        Volkan Günay
      </sui-chip>

      <sui-chip>
        <svg chip-start-icon class="start"></svg>
        Hello
        <svg chip-end-icon class="end"></svg>
      </sui-chip>
    `,
  })
  class Host {}

  it("projects label content into the label container", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const labels = fixture.nativeElement.querySelectorAll(".sisyphos-chip-label");
    expect(labels[0].textContent?.trim()).toBe("Volkan Günay");
  });

  it("projects avatar slot when present", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const avatar = fixture.nativeElement.querySelector(".sisyphos-chip-avatar .my-av");
    expect(avatar).toBeTruthy();
  });

  it("projects start/end icon slots into their respective containers", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const start = fixture.nativeElement.querySelector(".sisyphos-chip-icon--start .start");
    const end = fixture.nativeElement.querySelector(".sisyphos-chip-icon--end .end");
    expect(start).toBeTruthy();
    expect(end).toBeTruthy();
  });
});
