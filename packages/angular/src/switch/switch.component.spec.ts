import { describe, it, expect } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Switch } from "./switch.component";

function setup(props: { checked?: boolean; [k: string]: unknown } = {}) {
  const fixture = TestBed.createComponent(Switch);
  const { checked = false, ...rest } = props;
  fixture.componentInstance.checked.set(checked);
  for (const [key, value] of Object.entries(rest)) {
    if (value !== undefined) fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  const button = fixture.nativeElement.querySelector("button[role=switch]") as HTMLButtonElement;
  return { fixture, button };
}

describe("Switch (Angular)", () => {
  it("renders a role=switch button", () => {
    const { button } = setup();
    expect(button).toBeTruthy();
    expect(button.getAttribute("type")).toBe("button");
  });

  it("aria-checked reflects checked state", () => {
    const { button: off } = setup({ checked: false });
    expect(off.getAttribute("aria-checked")).toBe("false");
    const { button: on } = setup({ checked: true });
    expect(on.getAttribute("aria-checked")).toBe("true");
  });

  it("click toggles checked", () => {
    const { fixture, button } = setup({ checked: false });
    button.click();
    expect(fixture.componentInstance.checked()).toBe(true);
  });

  it("Enter and Space toggle when focused", () => {
    const { fixture, button } = setup({ checked: false });
    button.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(fixture.componentInstance.checked()).toBe(true);
    button.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
    expect(fixture.componentInstance.checked()).toBe(false);
  });

  it("disabled prevents toggle on click", () => {
    const { fixture, button } = setup({ checked: false, disabled: true });
    button.click();
    expect(fixture.componentInstance.checked()).toBe(false);
  });

  it("disabled adds aria-disabled and tabindex=-1", () => {
    const { button } = setup({ disabled: true });
    expect(button.getAttribute("aria-disabled")).toBe("true");
    expect(button.getAttribute("tabindex")).toBe("-1");
    expect(button.disabled).toBe(true);
  });

  it("aria-label is forwarded", () => {
    const { button } = setup({ "aria-label": "Notifications" });
    expect(button.getAttribute("aria-label")).toBe("Notifications");
  });

  it("applies color + size + checked classes on the root", () => {
    const { button } = setup({ checked: true, color: "success", size: "lg" });
    expect(button.className).toContain("success");
    expect(button.className).toContain("lg");
    expect(button.className).toContain("checked");
  });
});
