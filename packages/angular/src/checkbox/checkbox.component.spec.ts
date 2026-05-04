/**
 * Checkbox tests — full DOM-render coverage via the @Input/setter+signal
 * hybrid pattern. Behavior parity with the React and Vue suites.
 */
import { describe, it, expect } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Checkbox } from "./checkbox.component";

function setup(props: { checked?: boolean; [k: string]: unknown } = {}) {
  const fixture = TestBed.createComponent(Checkbox);
  const { checked = false, ...rest } = props;
  fixture.componentInstance.checked.set(checked);
  for (const [key, value] of Object.entries(rest)) {
    if (value !== undefined) fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  const native = fixture.nativeElement.querySelector(
    "input[type=checkbox]"
  ) as HTMLInputElement;
  const label = fixture.nativeElement.querySelector("label") as HTMLLabelElement;
  return { fixture, native, label };
}

describe("Checkbox (Angular)", () => {
  it("renders an unchecked native input by default", () => {
    const { native } = setup();
    expect(native).toBeTruthy();
    expect(native.checked).toBe(false);
  });

  it("reflects checked=true on the native input", () => {
    const { native } = setup({ checked: true });
    expect(native.checked).toBe(true);
  });

  it("renders the label slot", () => {
    const { fixture } = setup({ label: "Accept terms" });
    expect(fixture.nativeElement.textContent).toContain("Accept terms");
  });

  it("toggle from false to true on click", () => {
    const { fixture, native } = setup({ checked: false });
    native.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.checked()).toBe(true);
  });

  it("disabled prevents toggling", () => {
    const { fixture, native } = setup({ checked: false, disabled: true });
    native.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.checked()).toBe(false);
  });

  it("indeterminate is mirrored to the native input DOM property", () => {
    const { native } = setup({ indeterminate: true });
    expect(native.indeterminate).toBe(true);
    expect(native.getAttribute("aria-checked")).toBe("mixed");
  });

  it("toggling an indeterminate box promotes to checked=true", () => {
    const { fixture, native } = setup({ checked: false, indeterminate: true });
    native.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.checked()).toBe(true);
  });

  it("applies size + color + radius classes to the host label", () => {
    const { label } = setup({ size: "lg", color: "success", radius: "full" });
    expect(label.className).toContain("lg");
    expect(label.className).toContain("success");
    expect(label.className).toContain("radius-full");
  });

  it("forwards the name attribute to the native input", () => {
    const { native } = setup({ name: "agree" });
    expect(native.getAttribute("name")).toBe("agree");
  });

  it("aria-label is forwarded when provided", () => {
    const { native } = setup({ "aria-label": "Accept TOS" });
    expect(native.getAttribute("aria-label")).toBe("Accept TOS");
  });
});
