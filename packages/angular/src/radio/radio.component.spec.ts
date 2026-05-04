import { describe, it, expect } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Radio } from "./radio.component";
import { RadioGroup, type RadioOption } from "./radio-group.component";

describe("RadioGroup (Angular) — composition", () => {
  @Component({
    standalone: true,
    imports: [RadioGroup, Radio],
    template: `
      <sui-radio-group [(value)]="value" label="Fruit" [size]="size">
        <sui-radio value="apple" label="Apple" />
        <sui-radio value="banana" label="Banana" />
        <sui-radio value="cherry" label="Cherry" [disabled]="cherryDisabled" />
      </sui-radio-group>
    `,
  })
  class Host {
    value: string | number | undefined = undefined;
    size: "xs" | "sm" | "md" | "lg" | "xl" = "md";
    cherryDisabled = false;
  }

  it("renders one role=radio input per child", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('input[type="radio"]');
    expect(inputs.length).toBe(3);
  });

  it("renders the label inside the role=radiogroup wrapper", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('[role="radiogroup"]') as HTMLElement;
    expect(group).toBeTruthy();
    expect(group.getAttribute("aria-label")).toBe("Fruit");
  });

  it("clicking a radio selects it via two-way binding", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('input[type="radio"]');
    inputs[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe("banana");
    expect((inputs[1] as HTMLInputElement).checked).toBe(true);
  });

  it("only one option can be selected at a time", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('input[type="radio"]');
    inputs[0].click();
    fixture.detectChanges();
    inputs[2] && (inputs[2] as HTMLInputElement).click();
    // cherry is disabled by default? No — cherryDisabled is false initially
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe("cherry");
    expect((inputs[0] as HTMLInputElement).checked).toBe(false);
  });

  it("disabled radio cannot be selected by click", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.cherryDisabled = true;
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('input[type="radio"]');
    (inputs[2] as HTMLInputElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBeUndefined();
  });

  it("share name attribute via DI", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('input[type="radio"]');
    const names = Array.from(inputs).map((i) => (i as HTMLInputElement).name);
    expect(new Set(names).size).toBe(1);
    expect(names[0]).toMatch(/^sisyphos-radio-/);
  });
});

describe("RadioGroup (Angular) — options array", () => {
  @Component({
    standalone: true,
    imports: [RadioGroup],
    template: `<sui-radio-group [(value)]="value" [options]="options" />`,
  })
  class Host {
    value: string | number | undefined = "b";
    options: RadioOption[] = [
      { value: "a", label: "A" },
      { value: "b", label: "B" },
      { value: "c", label: "C" },
    ];
  }

  it("renders one radio per option", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const radios = fixture.nativeElement.querySelectorAll('input[type="radio"]');
    expect(radios.length).toBe(3);
  });

  it("preselects the matching option from value", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const radios = Array.from(
      fixture.nativeElement.querySelectorAll('input[type="radio"]')
    ) as HTMLInputElement[];
    expect(radios[0].checked).toBe(false);
    expect(radios[1].checked).toBe(true);
    expect(radios[2].checked).toBe(false);
  });
});

describe("RadioGroup error/required ARIA", () => {
  @Component({
    standalone: true,
    imports: [RadioGroup],
    template: `
      <sui-radio-group
        label="Plan"
        [required]="true"
        [error]="error"
        errorMessage="Pick one"
        [options]="opts"
      />
    `,
  })
  class Host {
    error = false;
    opts: RadioOption[] = [{ value: "free", label: "Free" }];
  }

  it("aria-required is set on the radiogroup", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('[role="radiogroup"]') as HTMLElement;
    expect(group.getAttribute("aria-required")).toBe("true");
  });

  it("error renders an alert message and aria-invalid", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.error = true;
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector('[role="radiogroup"]') as HTMLElement;
    expect(group.getAttribute("aria-invalid")).toBe("true");
    const alert = fixture.nativeElement.querySelector('[role="alert"]') as HTMLElement;
    expect(alert.textContent?.trim()).toBe("Pick one");
  });
});
