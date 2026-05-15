import { describe, it, expect } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { NumberInput } from "./number-input.component";

@Component({
  standalone: true,
  imports: [NumberInput],
  template: `
    <sui-number-input
      [value]="value"
      (valueChange)="value = $event"
      [min]="min"
      [max]="max"
      [step]="step"
      [precision]="precision"
      [locale]="locale"
      [withStepper]="withStepper"
      [disabled]="disabled"
      [readOnly]="readOnly"
    />
  `,
})
class Host {
  value: number | null = null;
  min?: number;
  max?: number;
  step = 1;
  precision = 0;
  locale = "en-US";
  withStepper = true;
  disabled = false;
  readOnly = false;
}

describe("NumberInput (Angular)", () => {
  it("renders an input and stepper buttons by default", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("input")).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll(".sisyphos-number-input-step").length).toBe(2);
  });

  it("withStepper=false hides the stepper buttons", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.withStepper = false;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll(".sisyphos-number-input-step").length).toBe(0);
  });

  it("typing parses to a number and emits valueChange", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
    input.value = "42";
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe(42);
  });

  it("clamps to min on input", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.min = 0;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
    input.value = "-5";
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe(0);
  });

  it("clamps to max on input", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.max = 10;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
    input.value = "99";
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe(10);
  });

  it("step buttons increment / decrement", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value = 5;
    fixture.componentInstance.step = 2;
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll(".sisyphos-number-input-step");
    (buttons[0] as HTMLButtonElement).click(); // decrement
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe(3);
    (buttons[1] as HTMLButtonElement).click(); // increment
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe(5);
  });

  it("decrement is disabled at min, increment is disabled at max", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value = 0;
    fixture.componentInstance.min = 0;
    fixture.componentInstance.max = 10;
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll(
      ".sisyphos-number-input-step"
    ) as NodeListOf<HTMLButtonElement>;
    expect(buttons[0].disabled).toBe(true);
    expect(buttons[1].disabled).toBe(false);
    fixture.componentInstance.value = 10;
    fixture.detectChanges();
    expect(buttons[0].disabled).toBe(false);
    expect(buttons[1].disabled).toBe(true);
  });

  it("disabled prevents stepper actions", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value = 5;
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll(
      ".sisyphos-number-input-step"
    ) as NodeListOf<HTMLButtonElement>;
    expect(buttons[0].disabled).toBe(true);
    buttons[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe(5);
  });

  it("formats value with locale on blur", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value = 1234;
    fixture.componentInstance.locale = "en-US";
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
    // Trigger blur to run the formatter (effect fires async; blur is the
    // canonical formatting trigger).
    input.dispatchEvent(new Event("blur"));
    fixture.detectChanges();
    expect(input.value).toBe("1,234");
  });
});
