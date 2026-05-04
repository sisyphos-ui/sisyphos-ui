import { describe, it, expect } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Textarea } from "./textarea.component";

@Component({
  standalone: true,
  imports: [Textarea],
  template: `
    <sui-textarea
      [label]="label"
      [value]="value"
      (valueChange)="value = $event"
      [error]="error"
      [errorMessage]="errorMessage"
      [maxLength]="maxLength"
      [showCharacterCount]="showCount"
      [disabled]="disabled"
      [readOnly]="readOnly"
      [required]="required"
    />
  `,
})
class Host {
  label?: string;
  value = "";
  error = false;
  errorMessage?: string;
  maxLength?: number;
  showCount = false;
  disabled = false;
  readOnly = false;
  required = false;
}

describe("Textarea (Angular)", () => {
  it("renders the textarea with optional label", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.label = "Comments";
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("textarea")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("label")?.textContent).toContain("Comments");
  });

  it("two-way binds value", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value = "hi";
    fixture.detectChanges();
    const ta = fixture.nativeElement.querySelector("textarea") as HTMLTextAreaElement;
    expect(ta.value).toBe("hi");
    ta.value = "world";
    ta.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe("world");
  });

  it("error message renders with role=alert", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.error = true;
    fixture.componentInstance.errorMessage = "Required";
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("[role=alert]")?.textContent).toBe("Required");
  });

  it("character count renders when enabled", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.maxLength = 50;
    fixture.componentInstance.showCount = true;
    fixture.componentInstance.value = "hello";
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector(".sisyphos-textarea-character-count")?.textContent
    ).toContain("5 / 50");
  });

  it("disabled + readonly + required forwarded", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.disabled = true;
    fixture.componentInstance.readOnly = true;
    fixture.componentInstance.required = true;
    fixture.detectChanges();
    const ta = fixture.nativeElement.querySelector("textarea") as HTMLTextAreaElement;
    expect(ta.disabled).toBe(true);
    expect(ta.readOnly).toBe(true);
    expect(ta.required).toBe(true);
  });

  it("links label htmlFor to textarea id", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.label = "X";
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector("label") as HTMLLabelElement;
    const ta = fixture.nativeElement.querySelector("textarea") as HTMLTextAreaElement;
    expect(label.htmlFor).toBe(ta.id);
  });
});
