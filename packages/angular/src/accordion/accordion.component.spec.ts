import { describe, it, expect } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Accordion } from "./accordion.component";
import { AccordionItem } from "./accordion-item.component";
import { AccordionTrigger } from "./accordion-trigger.component";
import { AccordionContent } from "./accordion-content.component";

describe("Accordion (Angular) — single mode", () => {
  @Component({
    standalone: true,
    imports: [Accordion, AccordionItem, AccordionTrigger, AccordionContent],
    template: `
      <sui-accordion [value]="active" (valueChange)="active = $event">
        <sui-accordion-item value="a">
          <sui-accordion-trigger>A</sui-accordion-trigger>
          <sui-accordion-content>A body</sui-accordion-content>
        </sui-accordion-item>
        <sui-accordion-item value="b">
          <sui-accordion-trigger>B</sui-accordion-trigger>
          <sui-accordion-content>B body</sui-accordion-content>
        </sui-accordion-item>
      </sui-accordion>
    `,
  })
  class Host {
    active: string | null = null;
  }

  it("renders a button per trigger and a region per content", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll("button[aria-expanded]").length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll("[role=region]").length).toBe(2);
  });

  it("clicking a trigger opens its item", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const triggers = fixture.nativeElement.querySelectorAll(
      "button[aria-expanded]"
    ) as NodeListOf<HTMLButtonElement>;
    triggers[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.active).toBe("a");
    expect(triggers[0].getAttribute("aria-expanded")).toBe("true");
  });

  it("opening a different trigger closes the previous (single mode)", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.active = "a";
    fixture.detectChanges();
    const triggers = fixture.nativeElement.querySelectorAll(
      "button[aria-expanded]"
    ) as NodeListOf<HTMLButtonElement>;
    triggers[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.active).toBe("b");
    expect(triggers[0].getAttribute("aria-expanded")).toBe("false");
    expect(triggers[1].getAttribute("aria-expanded")).toBe("true");
  });

  it("clicking the open trigger again closes it (returns null)", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.active = "a";
    fixture.detectChanges();
    const triggers = fixture.nativeElement.querySelectorAll(
      "button[aria-expanded]"
    ) as NodeListOf<HTMLButtonElement>;
    triggers[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.active).toBeNull();
  });

  it("hides closed content via the `hidden` attribute", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.active = "a";
    fixture.detectChanges();
    const regions = fixture.nativeElement.querySelectorAll(
      "[role=region]"
    ) as NodeListOf<HTMLElement>;
    expect(regions[0].hasAttribute("hidden")).toBe(false);
    expect(regions[1].hasAttribute("hidden")).toBe(true);
  });

  it("links trigger.aria-controls to its content.id", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const triggers = fixture.nativeElement.querySelectorAll("button[aria-expanded]");
    const regions = fixture.nativeElement.querySelectorAll("[role=region]");
    for (let i = 0; i < 2; i++) {
      expect(triggers[i].getAttribute("aria-controls")).toBe(regions[i].id);
    }
  });
});

describe("Accordion (Angular) — multi mode", () => {
  @Component({
    standalone: true,
    imports: [Accordion, AccordionItem, AccordionTrigger, AccordionContent],
    template: `
      <sui-accordion [multiple]="true" [values]="active" (valuesChange)="active = $event">
        <sui-accordion-item value="a">
          <sui-accordion-trigger>A</sui-accordion-trigger>
          <sui-accordion-content>A body</sui-accordion-content>
        </sui-accordion-item>
        <sui-accordion-item value="b">
          <sui-accordion-trigger>B</sui-accordion-trigger>
          <sui-accordion-content>B body</sui-accordion-content>
        </sui-accordion-item>
        <sui-accordion-item value="c">
          <sui-accordion-trigger>C</sui-accordion-trigger>
          <sui-accordion-content>C body</sui-accordion-content>
        </sui-accordion-item>
      </sui-accordion>
    `,
  })
  class Host {
    active: string[] = [];
  }

  it("can open multiple items at once", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const triggers = fixture.nativeElement.querySelectorAll(
      "button[aria-expanded]"
    ) as NodeListOf<HTMLButtonElement>;
    triggers[0].click();
    fixture.detectChanges();
    triggers[2].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.active.sort()).toEqual(["a", "c"]);
  });

  it("toggling an open item removes it from the active list", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.active = ["a", "b"];
    fixture.detectChanges();
    const triggers = fixture.nativeElement.querySelectorAll(
      "button[aria-expanded]"
    ) as NodeListOf<HTMLButtonElement>;
    triggers[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.active).toEqual(["b"]);
  });
});

describe("Accordion forceMount=false", () => {
  @Component({
    standalone: true,
    imports: [Accordion, AccordionItem, AccordionTrigger, AccordionContent],
    template: `
      <sui-accordion>
        <sui-accordion-item value="a">
          <sui-accordion-trigger>A</sui-accordion-trigger>
          <sui-accordion-content [forceMount]="false">A body</sui-accordion-content>
        </sui-accordion-item>
      </sui-accordion>
    `,
  })
  class Host {}

  it("does not render closed content when forceMount=false", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("[role=region]")).toBeNull();
    const trigger = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("[role=region]")).toBeTruthy();
  });
});
