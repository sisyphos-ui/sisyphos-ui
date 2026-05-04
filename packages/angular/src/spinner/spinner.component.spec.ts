import { describe, it, expect } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Spinner } from "./spinner.component";
import { LoadingOverlay } from "./loading-overlay.component";

describe("Spinner (Angular)", () => {
  function setup(props: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Spinner);
    for (const [key, value] of Object.entries(props)) {
      if (value !== undefined) fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    const root = fixture.nativeElement.querySelector(".sisyphos-spinner") as HTMLElement;
    return { fixture, root };
  }

  it("has role=status and a default aria-label", () => {
    const { root } = setup();
    expect(root.getAttribute("role")).toBe("status");
    expect(root.getAttribute("aria-label")).toBe("Loading");
  });

  it("accepts a custom label", () => {
    const { root } = setup({ label: "Saving…" });
    expect(root.getAttribute("aria-label")).toBe("Saving…");
  });

  it("renders an inline SVG arc (not a bordered div)", () => {
    const { root } = setup();
    expect(root.querySelectorAll("svg").length).toBeGreaterThan(0);
    expect(root.querySelector(".sisyphos-spinner-arc")).toBeTruthy();
  });

  it("exposes thickness as a CSS custom property", () => {
    const { root } = setup({ thickness: 5 });
    expect(root.style.getPropertyValue("--sisyphos-spinner-thickness")).toBe("5px");
  });

  it("double variant renders two SVGs", () => {
    const { root } = setup({ variant: "double" });
    expect(root.querySelectorAll("svg").length).toBe(2);
    expect(root.querySelector(".sisyphos-spinner-svg--inner")).toBeTruthy();
  });

  it("ring variant renders only one SVG", () => {
    const { root } = setup({ variant: "ring" });
    expect(root.querySelectorAll("svg").length).toBe(1);
  });

  it("applies size + color + variant classes", () => {
    const { root } = setup({ size: "lg", color: "success", variant: "double" });
    expect(root.className).toContain("lg");
    expect(root.className).toContain("success");
    expect(root.className).toContain("double");
  });
});

describe("LoadingOverlay (Angular)", () => {
  function setup(props: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(LoadingOverlay);
    for (const [key, value] of Object.entries(props)) {
      if (value !== undefined) fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    return fixture;
  }

  it("renders by default (open=true)", () => {
    const fixture = setup();
    expect(fixture.nativeElement.querySelector(".sisyphos-loading-overlay")).toBeTruthy();
  });

  it("open=false renders nothing", () => {
    const fixture = setup({ open: false });
    expect(fixture.nativeElement.querySelector(".sisyphos-loading-overlay")).toBeNull();
  });

  it("inline variant has no backdrop", () => {
    const fixture = setup({ variant: "inline" });
    expect(fixture.nativeElement.querySelector(".sisyphos-loading-overlay-backdrop")).toBeNull();
  });

  it("overlay variant renders a backdrop", () => {
    const fixture = setup({ variant: "overlay" });
    expect(fixture.nativeElement.querySelector(".sisyphos-loading-overlay-backdrop")).toBeTruthy();
  });

  it("renders a default spinner inside", () => {
    const fixture = setup();
    expect(fixture.nativeElement.querySelector(".sisyphos-spinner")).toBeTruthy();
  });

  it("renders the optional text label", () => {
    const fixture = setup({ text: "Please wait…" });
    expect(fixture.nativeElement.querySelector(".sisyphos-loading-overlay-text")?.textContent).toBe(
      "Please wait…"
    );
  });

  it("aria-live=polite for status announcements", () => {
    const fixture = setup();
    const root = fixture.nativeElement.querySelector(".sisyphos-loading-overlay") as HTMLElement;
    expect(root.getAttribute("aria-live")).toBe("polite");
    expect(root.getAttribute("role")).toBe("status");
  });
});
