import { describe, it, expect } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Slider } from "./slider.component";

@Component({
  standalone: true,
  imports: [Slider],
  template: `
    <sui-slider
      [min]="min"
      [max]="max"
      [step]="step"
      [value]="value"
      (valueChange)="value = $event"
      [range]="range"
      [values]="values"
      (valuesChange)="values = $event"
      [disabled]="disabled"
      [showValue]="showValue"
    />
  `,
})
class Host {
  min = 0;
  max = 100;
  step = 1;
  value = 0;
  range = false;
  values: [number, number] = [0, 100];
  disabled = false;
  showValue = false;
}

describe("Slider (Angular) — single", () => {
  it("renders one thumb with role=slider and proper aria values", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value = 30;
    fixture.detectChanges();
    const thumbs = fixture.nativeElement.querySelectorAll("[role=slider]");
    expect(thumbs.length).toBe(1);
    const thumb = thumbs[0] as HTMLElement;
    expect(thumb.getAttribute("aria-valuenow")).toBe("30");
    expect(thumb.getAttribute("aria-valuemin")).toBe("0");
    expect(thumb.getAttribute("aria-valuemax")).toBe("100");
  });

  it("ArrowRight increments by step", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value = 30;
    fixture.componentInstance.step = 5;
    fixture.detectChanges();
    const thumb = fixture.nativeElement.querySelector("[role=slider]") as HTMLElement;
    thumb.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe(35);
  });

  it("ArrowLeft decrements by step", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value = 30;
    fixture.componentInstance.step = 5;
    fixture.detectChanges();
    const thumb = fixture.nativeElement.querySelector("[role=slider]") as HTMLElement;
    thumb.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe(25);
  });

  it("Home jumps to min, End jumps to max", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value = 50;
    fixture.detectChanges();
    const thumb = fixture.nativeElement.querySelector("[role=slider]") as HTMLElement;
    thumb.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe(0);
    thumb.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe(100);
  });

  it("disabled prevents keyboard activation", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value = 30;
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    const thumb = fixture.nativeElement.querySelector("[role=slider]") as HTMLElement;
    thumb.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe(30);
  });

  it("PageUp/PageDown move by 10 × step", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value = 50;
    fixture.componentInstance.step = 1;
    fixture.detectChanges();
    const thumb = fixture.nativeElement.querySelector("[role=slider]") as HTMLElement;
    thumb.dispatchEvent(new KeyboardEvent("keydown", { key: "PageUp", bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe(60);
    thumb.dispatchEvent(new KeyboardEvent("keydown", { key: "PageDown", bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe(50);
  });
});

describe("Slider (Angular) — range", () => {
  it("renders two thumbs", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.range = true;
    fixture.componentInstance.values = [20, 80];
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll("[role=slider]").length).toBe(2);
  });

  it("ArrowRight on min thumb advances within bounds", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.range = true;
    fixture.componentInstance.values = [20, 80];
    fixture.componentInstance.step = 5;
    fixture.detectChanges();
    const thumbs = fixture.nativeElement.querySelectorAll("[role=slider]");
    (thumbs[0] as HTMLElement).dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.values).toEqual([25, 80]);
  });

  it("aria-label can be a tuple", () => {
    @Component({
      standalone: true,
      imports: [Slider],
      template: `<sui-slider [range]="true" [values]="[10, 90]" [ariaLabel]="['Low', 'High']" />`,
    })
    class L {}
    const fixture = TestBed.createComponent(L);
    fixture.detectChanges();
    const thumbs = fixture.nativeElement.querySelectorAll("[role=slider]");
    expect(thumbs[0].getAttribute("aria-label")).toBe("Low");
    expect(thumbs[1].getAttribute("aria-label")).toBe("High");
  });
});
