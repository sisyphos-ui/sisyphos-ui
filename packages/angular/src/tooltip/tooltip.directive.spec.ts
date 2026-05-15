import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TooltipDirective } from "./tooltip.directive";

@Component({
  standalone: true,
  imports: [TooltipDirective],
  template: `
    <button
      [sui-tooltip]="text"
      [placement]="placement"
      [openDelay]="openDelay"
      [closeDelay]="closeDelay"
      [disabled]="disabled"
    >
      Trigger
    </button>
  `,
})
class Host {
  text: string | null = "Save changes";
  placement: "top" | "bottom" | "left" | "right" = "top";
  openDelay = 0;
  closeDelay = 0;
  disabled = false;
}

describe("Tooltip (Angular directive)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    document.querySelectorAll(".sisyphos-tooltip").forEach((el) => el.remove());
  });

  function setup(props: Partial<Host> = {}) {
    const fixture = TestBed.createComponent(Host);
    Object.assign(fixture.componentInstance, props);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    return { fixture, button };
  }

  it("does not render the tooltip until the host is hovered", () => {
    setup();
    expect(document.querySelector(".sisyphos-tooltip")).toBeNull();
  });

  it("mouseenter shows the tooltip after openDelay", () => {
    const { fixture, button } = setup({ openDelay: 200 });
    button.dispatchEvent(new Event("mouseenter"));
    fixture.detectChanges();
    vi.advanceTimersByTime(199);
    fixture.detectChanges();
    expect(document.querySelector(".sisyphos-tooltip")).toBeNull();
    vi.advanceTimersByTime(2);
    fixture.detectChanges();
    expect(document.querySelector(".sisyphos-tooltip")).toBeTruthy();
  });

  it("mouseleave hides the tooltip after closeDelay", () => {
    const { fixture, button } = setup({ openDelay: 0, closeDelay: 100 });
    button.dispatchEvent(new Event("mouseenter"));
    fixture.detectChanges();
    vi.advanceTimersByTime(0);
    fixture.detectChanges();
    expect(document.querySelector(".sisyphos-tooltip")).toBeTruthy();
    button.dispatchEvent(new Event("mouseleave"));
    fixture.detectChanges();
    vi.advanceTimersByTime(101);
    fixture.detectChanges();
    expect(document.querySelector(".sisyphos-tooltip")).toBeNull();
  });

  it("focus shows the tooltip; blur hides it", () => {
    const { fixture, button } = setup({ openDelay: 0, closeDelay: 0 });
    button.dispatchEvent(new Event("focus"));
    fixture.detectChanges();
    vi.advanceTimersByTime(0);
    fixture.detectChanges();
    expect(document.querySelector(".sisyphos-tooltip")).toBeTruthy();
    button.dispatchEvent(new Event("blur"));
    fixture.detectChanges();
    vi.advanceTimersByTime(0);
    fixture.detectChanges();
    expect(document.querySelector(".sisyphos-tooltip")).toBeNull();
  });

  it("renders the tooltip text and role", () => {
    const { fixture, button } = setup({ text: "Hello world", openDelay: 0 });
    button.dispatchEvent(new Event("mouseenter"));
    fixture.detectChanges();
    vi.advanceTimersByTime(0);
    fixture.detectChanges();
    const tip = document.querySelector(".sisyphos-tooltip") as HTMLElement;
    expect(tip).toBeTruthy();
    expect(tip.getAttribute("role")).toBe("tooltip");
    expect(tip.textContent).toContain("Hello world");
  });

  it("wires aria-describedby on the host while visible", () => {
    const { fixture, button } = setup({ openDelay: 0 });
    expect(button.getAttribute("aria-describedby")).toBeNull();
    button.dispatchEvent(new Event("mouseenter"));
    fixture.detectChanges();
    vi.advanceTimersByTime(0);
    fixture.detectChanges();
    const tip = document.querySelector(".sisyphos-tooltip") as HTMLElement;
    expect(button.getAttribute("aria-describedby")).toContain(tip.id);
  });

  it("disabled prevents the tooltip from opening", () => {
    const { fixture, button } = setup({ disabled: true, openDelay: 0 });
    button.dispatchEvent(new Event("mouseenter"));
    fixture.detectChanges();
    vi.advanceTimersByTime(0);
    fixture.detectChanges();
    expect(document.querySelector(".sisyphos-tooltip")).toBeNull();
  });

  it("empty content keeps the tooltip closed", () => {
    const { fixture, button } = setup({ text: "", openDelay: 0 });
    button.dispatchEvent(new Event("mouseenter"));
    fixture.detectChanges();
    vi.advanceTimersByTime(0);
    fixture.detectChanges();
    expect(document.querySelector(".sisyphos-tooltip")).toBeNull();
  });

  it("Escape closes the tooltip immediately", () => {
    const { fixture, button } = setup({ openDelay: 0, closeDelay: 200 });
    button.dispatchEvent(new Event("mouseenter"));
    fixture.detectChanges();
    vi.advanceTimersByTime(0);
    fixture.detectChanges();
    expect(document.querySelector(".sisyphos-tooltip")).toBeTruthy();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    fixture.detectChanges();
    expect(document.querySelector(".sisyphos-tooltip")).toBeNull();
  });

  it("removes the element when the host is destroyed", () => {
    const { fixture, button } = setup({ openDelay: 0, closeDelay: 0 });
    button.dispatchEvent(new Event("mouseenter"));
    fixture.detectChanges();
    vi.advanceTimersByTime(0);
    fixture.detectChanges();
    expect(document.querySelector(".sisyphos-tooltip")).toBeTruthy();
    fixture.destroy();
    expect(document.querySelector(".sisyphos-tooltip")).toBeNull();
  });
});
