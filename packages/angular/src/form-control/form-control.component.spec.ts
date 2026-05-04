import { describe, it, expect } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { FormControl } from "./form-control.component";
import {
  FormErrorText,
  FormHelperText,
  FormLabel,
} from "./form-control-parts.component";

describe("FormControl (Angular)", () => {
  @Component({
    standalone: true,
    imports: [FormControl, FormLabel, FormHelperText, FormErrorText],
    template: `
      <sui-form-control
        [id]="id"
        [error]="error"
        [required]="required"
        [disabled]="disabled"
      >
        <sui-form-label>Email</sui-form-label>
        <input class="control" type="email" />
        <sui-form-helper-text>We won't share it.</sui-form-helper-text>
        <sui-form-error-text>Email is invalid.</sui-form-error-text>
      </sui-form-control>
    `,
  })
  class Host {
    id?: string;
    error = false;
    required = false;
    disabled = false;
  }

  it("auto-generates an id and links label htmlFor → input id pattern", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector("label") as HTMLLabelElement;
    expect(label.htmlFor).toBeTruthy();
    expect(label.htmlFor).toMatch(/^sisyphos-field-/);
  });

  it("respects an explicitly provided id", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.id = "my-field";
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector("label") as HTMLLabelElement;
    expect(label.htmlFor).toBe("my-field");
  });

  it("required=true renders the required indicator", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.required = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".sisyphos-form-label-required")).toBeTruthy();
  });

  it("shows helper text when no error is set", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".sisyphos-form-helper-text")?.textContent).toContain(
      "We won't share it."
    );
    expect(fixture.nativeElement.querySelector(".sisyphos-form-error-text")).toBeNull();
  });

  it("hides helper and shows error when error=true", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.error = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".sisyphos-form-helper-text")).toBeNull();
    const err = fixture.nativeElement.querySelector(".sisyphos-form-error-text") as HTMLElement;
    expect(err).toBeTruthy();
    expect(err.getAttribute("role")).toBe("alert");
  });

  it("applies error/disabled classes on the root", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.error = true;
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    const root = fixture.nativeElement.querySelector(".sisyphos-form-control") as HTMLElement;
    expect(root.className).toContain("error");
    expect(root.className).toContain("disabled");
  });

  it("FormErrorText renders standalone (outside a FormControl)", () => {
    const fixture = TestBed.createComponent(FormErrorText);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("[role=alert]")).toBeTruthy();
  });
});
