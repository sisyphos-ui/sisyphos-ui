import { describe, it, expect } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { DatePicker } from "./datepicker.component";
import { formatDate, sameDay, withTime } from "./format";

describe("DatePicker format helpers", () => {
  it("formatDate handles tokens", () => {
    const d = new Date(2024, 0, 15, 9, 5);
    expect(formatDate(d, "dd.MM.yyyy")).toBe("15.01.2024");
    expect(formatDate(d, "yyyy-MM-dd HH:mm")).toBe("2024-01-15 09:05");
  });

  it("sameDay compares y/m/d only", () => {
    expect(sameDay(new Date(2024, 0, 1, 0, 0), new Date(2024, 0, 1, 23, 59))).toBe(true);
    expect(sameDay(new Date(2024, 0, 1), new Date(2024, 0, 2))).toBe(false);
  });

  it("withTime returns a copy with patched HH/mm and zeroed seconds", () => {
    const d = new Date(2024, 0, 1, 12, 30, 45, 999);
    const next = withTime(d, 9, 5);
    expect(next.getHours()).toBe(9);
    expect(next.getMinutes()).toBe(5);
    expect(next.getSeconds()).toBe(0);
    expect(next.getMilliseconds()).toBe(0);
    // original untouched
    expect(d.getHours()).toBe(12);
  });
});

@Component({
  standalone: true,
  imports: [DatePicker],
  template: `
    <sui-datepicker
      [label]="label"
      [value]="value"
      (valueChange)="value = $event"
      [isRange]="isRange"
      [values]="values"
      (valuesChange)="values = $event"
      [disabled]="disabled"
      [allowClear]="allowClear"
      [error]="error"
      [errorMessage]="errorMessage"
    />
  `,
})
class Host {
  label?: string;
  value: Date | null = null;
  isRange = false;
  values: [Date | null, Date | null] = [null, null];
  disabled = false;
  allowClear = false;
  error = false;
  errorMessage?: string;
}

describe("DatePicker (Angular)", () => {
  it("renders the trigger with calendar icon and a placeholder", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector(".sisyphos-datepicker-trigger") as HTMLElement;
    expect(trigger).toBeTruthy();
    expect(fixture.nativeElement.querySelector(".sisyphos-datepicker-input")).toBeTruthy();
  });

  it("displays the formatted single value", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value = new Date(2024, 0, 15);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector(".sisyphos-datepicker-input") as HTMLInputElement;
    expect(input.value).toBe("15.01.2024");
  });

  it("displays a range value in the trigger", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.isRange = true;
    fixture.componentInstance.values = [new Date(2024, 0, 10), new Date(2024, 0, 20)];
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector(".sisyphos-datepicker-input") as HTMLInputElement;
    expect(input.value).toBe("10.01.2024 - 20.01.2024");
  });

  it("opens the dropdown when the trigger is clicked", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector(".sisyphos-datepicker-trigger") as HTMLElement;
    trigger.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("[role=dialog]")).toBeTruthy();
  });

  it("disabled prevents opening", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector(".sisyphos-datepicker-trigger") as HTMLElement;
    trigger.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("[role=dialog]")).toBeNull();
  });

  it("clear button empties single value", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value = new Date(2024, 0, 15);
    fixture.componentInstance.allowClear = true;
    fixture.detectChanges();
    const clear = fixture.nativeElement.querySelector(".sisyphos-datepicker-clear") as HTMLButtonElement;
    expect(clear).toBeTruthy();
    clear.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBeNull();
  });

  it("clear button empties range values", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.isRange = true;
    fixture.componentInstance.values = [new Date(2024, 0, 10), new Date(2024, 0, 20)];
    fixture.componentInstance.allowClear = true;
    fixture.detectChanges();
    const clear = fixture.nativeElement.querySelector(".sisyphos-datepicker-clear") as HTMLButtonElement;
    clear.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.values).toEqual([null, null]);
  });

  it("error renders alert message", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.error = true;
    fixture.componentInstance.errorMessage = "Pick a date";
    fixture.detectChanges();
    const err = fixture.nativeElement.querySelector("[role=alert]") as HTMLElement;
    expect(err.textContent).toBe("Pick a date");
  });

  it("Escape closes the dropdown", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector(".sisyphos-datepicker-trigger") as HTMLElement).click();
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("[role=dialog]")).toBeNull();
  });

  it("clicking a day in the days view selects it", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value = new Date(2024, 0, 15);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector(".sisyphos-datepicker-trigger") as HTMLElement).click();
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll(".sisyphos-datepicker-day");
    // Find the button labelled "20" — should be in the current month (Jan).
    const target = Array.from(buttons).find(
      (b) => (b as HTMLButtonElement).textContent?.trim() === "20" && !(b as HTMLButtonElement).className.includes("other-month")
    ) as HTMLButtonElement | undefined;
    expect(target).toBeTruthy();
    target!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value).not.toBeNull();
    expect(fixture.componentInstance.value!.getDate()).toBe(20);
  });

  it("header title cycles days → months → years views", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector(".sisyphos-datepicker-trigger") as HTMLElement).click();
    fixture.detectChanges();
    const title = fixture.nativeElement.querySelector(".sisyphos-datepicker-header-title") as HTMLButtonElement;
    expect(fixture.nativeElement.querySelector(".sisyphos-datepicker-days")).toBeTruthy();
    title.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".sisyphos-datepicker-months")).toBeTruthy();
    title.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".sisyphos-datepicker-years")).toBeTruthy();
  });

  it("showTime renders the time picker", () => {
    @Component({
      standalone: true,
      imports: [DatePicker],
      template: `<sui-datepicker [showTime]="true" [value]="value" />`,
    })
    class T { value = new Date(2024, 0, 1, 9, 30); }
    const fixture = TestBed.createComponent(T);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector(".sisyphos-datepicker-trigger") as HTMLElement).click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".sisyphos-datepicker-time")).toBeTruthy();
  });
});
