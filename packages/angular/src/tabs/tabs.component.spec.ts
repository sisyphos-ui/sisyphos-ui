import { describe, it, expect } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Tabs } from "./tabs.component";
import { TabsList } from "./tabs-list.component";
import { TabsTrigger } from "./tabs-trigger.component";
import { TabsPanel } from "./tabs-panel.component";

@Component({
  standalone: true,
  imports: [Tabs, TabsList, TabsTrigger, TabsPanel],
  template: `
    <sui-tabs [value]="value" (valueChange)="value = $event" [orientation]="orientation">
      <sui-tabs-list>
        <sui-tabs-trigger value="a">Apple</sui-tabs-trigger>
        <sui-tabs-trigger value="b">Banana</sui-tabs-trigger>
        <sui-tabs-trigger value="c" [disabled]="cDisabled">Cherry</sui-tabs-trigger>
      </sui-tabs-list>
      <sui-tabs-panel value="a">A panel</sui-tabs-panel>
      <sui-tabs-panel value="b">B panel</sui-tabs-panel>
      <sui-tabs-panel value="c">C panel</sui-tabs-panel>
    </sui-tabs>
  `,
})
class Host {
  value = "a";
  orientation: "horizontal" | "vertical" = "horizontal";
  cDisabled = false;
}

describe("Tabs (Angular)", () => {
  it("renders one role=tab per trigger and one role=tabpanel per panel", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('[role="tab"]').length).toBe(3);
    expect(fixture.nativeElement.querySelectorAll('[role="tabpanel"]').length).toBe(3);
  });

  it("active tab has aria-selected=true and tabindex=0", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    expect(tabs[0].getAttribute("tabindex")).toBe("0");
    expect(tabs[1].getAttribute("aria-selected")).toBe("false");
    expect(tabs[1].getAttribute("tabindex")).toBe("-1");
  });

  it("clicking a trigger updates the active value (two-way binding)", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]');
    (tabs[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe("b");
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
  });

  it("disabled trigger is not selectable", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.cDisabled = true;
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]');
    (tabs[2] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe("a");
  });

  it("hides inactive panels via the hidden attribute (forceMount=true default)", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const panels = fixture.nativeElement.querySelectorAll(
      '[role="tabpanel"]'
    ) as NodeListOf<HTMLElement>;
    expect(panels[0].hasAttribute("hidden")).toBe(false);
    expect(panels[1].hasAttribute("hidden")).toBe(true);
    expect(panels[2].hasAttribute("hidden")).toBe(true);
  });

  it("ArrowRight cycles to next trigger and ArrowLeft to previous", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const list = fixture.nativeElement.querySelector('[role="tablist"]') as HTMLElement;
    list.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe("b");
    list.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe("a");
  });

  it("Home jumps to first, End jumps to last", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value = "b";
    fixture.detectChanges();
    const list = fixture.nativeElement.querySelector('[role="tablist"]') as HTMLElement;
    list.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe("c");
    list.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe("a");
  });

  it("vertical orientation switches arrow keys to up/down", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.orientation = "vertical";
    fixture.detectChanges();
    const list = fixture.nativeElement.querySelector('[role="tablist"]') as HTMLElement;
    expect(list.getAttribute("aria-orientation")).toBe("vertical");
    list.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe("b");
  });

  it("links trigger.aria-controls to the matching panel.id", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const triggers = fixture.nativeElement.querySelectorAll('[role="tab"]');
    const panels = fixture.nativeElement.querySelectorAll('[role="tabpanel"]');
    for (let i = 0; i < 3; i++) {
      expect(triggers[i].getAttribute("aria-controls")).toBe(panels[i].id);
    }
  });
});

describe("Tabs forceMount=false", () => {
  @Component({
    standalone: true,
    imports: [Tabs, TabsList, TabsTrigger, TabsPanel],
    template: `
      <sui-tabs value="a">
        <sui-tabs-list>
          <sui-tabs-trigger value="a">A</sui-tabs-trigger>
          <sui-tabs-trigger value="b">B</sui-tabs-trigger>
        </sui-tabs-list>
        <sui-tabs-panel value="a" [forceMount]="false">A</sui-tabs-panel>
        <sui-tabs-panel value="b" [forceMount]="false">B</sui-tabs-panel>
      </sui-tabs>
    `,
  })
  class Host {}

  it("inactive panels are unmounted when forceMount=false", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('[role="tabpanel"]').length).toBe(1);
  });
});
