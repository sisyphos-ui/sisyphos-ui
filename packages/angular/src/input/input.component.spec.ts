import { describe, it, expect } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Input } from "./input.component";
import { applyMask, unmask, getMaskPrefixLength, MASK_PRESETS } from "./mask";

describe("Input mask helpers", () => {
  it("applies digit tokens", () => {
    expect(applyMask("12345", "##/##")).toBe("12/34");
  });

  it("inserts literals automatically", () => {
    expect(applyMask("5551234567", "(###) ###-####")).toBe("(555) 123-4567");
  });

  it("resolves preset names", () => {
    expect(applyMask("5551234567", "tel-tr")).toBe("+90 (555) 123 45 67");
    expect(MASK_PRESETS["tel-tr"]).toBeDefined();
  });

  it("getMaskPrefixLength counts leading literals", () => {
    expect(getMaskPrefixLength("+90 ###")).toBe(4);
    expect(getMaskPrefixLength("###")).toBe(0);
  });

  it("unmask round-trips", () => {
    const m = "(###) ###-####";
    const masked = applyMask("5551234567", m);
    expect(unmask(masked, m)).toBe("5551234567");
  });
});

@Component({
  standalone: true,
  imports: [Input],
  template: `
    <sui-input
      [label]="label"
      [value]="value"
      (valueChange)="value = $event"
      [error]="error"
      [errorMessage]="errorMessage"
      [type]="type"
      [disabled]="disabled"
      [readOnly]="readOnly"
      [required]="required"
      [maxLength]="maxLength"
      [showCharacterCount]="showCount"
      [copyable]="copyable"
      [mask]="mask"
      (unmaskedChange)="lastUnmasked = $event"
    />
  `,
})
class Host {
  label?: string;
  value = "";
  error = false;
  errorMessage?: string;
  type = "text";
  disabled = false;
  readOnly = false;
  required = false;
  maxLength?: number;
  showCount = false;
  copyable = false;
  mask?: string;
  lastUnmasked = "";
}

describe("Input (Angular)", () => {
  it("renders the input wrapper and a label when provided", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.label = "Email";
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("input")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("label")?.textContent).toContain("Email");
  });

  it("links label htmlFor to input id", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.label = "Name";
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector("label") as HTMLLabelElement;
    const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
    expect(label.htmlFor).toBe(input.id);
  });

  it("two-way binds value", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value = "hello";
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe("hello");
    input.value = "world";
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe("world");
  });

  it("renders error message + role=alert when error=true", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.error = true;
    fixture.componentInstance.errorMessage = "Required";
    fixture.detectChanges();
    const err = fixture.nativeElement.querySelector("[role=alert]") as HTMLElement;
    expect(err).toBeTruthy();
    expect(err.textContent).toBe("Required");
  });

  it("aria-invalid is set when error=true", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.error = true;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
    expect(input.getAttribute("aria-invalid")).toBe("true");
  });

  it("disabled + readonly + required forwarded to native input", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.disabled = true;
    fixture.componentInstance.readOnly = true;
    fixture.componentInstance.required = true;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.readOnly).toBe(true);
    expect(input.required).toBe(true);
  });

  it("character count renders when showCharacterCount + maxLength", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.maxLength = 10;
    fixture.componentInstance.showCount = true;
    fixture.componentInstance.value = "hi";
    fixture.detectChanges();
    const count = fixture.nativeElement.querySelector(".sisyphos-input-character-count") as HTMLElement;
    expect(count?.textContent).toContain("2 / 10");
  });

  it("password type renders the visibility toggle and switches type", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.type = "password";
    fixture.detectChanges();
    const toggle = fixture.nativeElement.querySelector(".sisyphos-input-password-toggle") as HTMLButtonElement;
    expect(toggle).toBeTruthy();
    const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
    expect(input.type).toBe("password");
    toggle.click();
    fixture.detectChanges();
    expect(input.type).toBe("text");
  });

  it("copyable renders the copy button (replaced by check after click)", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.copyable = true;
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector(".sisyphos-input-copy-button") as HTMLButtonElement;
    expect(btn).toBeTruthy();
  });

  it("mask formats the displayed value and emits unmasked", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.mask = "##/##/####";
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
    input.value = "12252025";
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe("12/25/2025");
    expect(fixture.componentInstance.lastUnmasked).toBe("12252025");
  });
});
