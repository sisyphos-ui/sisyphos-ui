import { describe, it, expect } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { EmptyState } from "./empty-state.component";

describe("EmptyState (Angular)", () => {
  function setup(props: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(EmptyState);
    for (const [key, value] of Object.entries(props)) {
      if (value !== undefined) fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    return fixture;
  }

  it("renders the root with role=status and default classes", () => {
    const fixture = setup();
    const root = fixture.nativeElement.querySelector(".sisyphos-empty-state") as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.getAttribute("role")).toBe("status");
    expect(root.className).toContain("md");
    expect(root.className).toContain("block");
    expect(root.className).not.toContain("bordered");
  });

  it("renders title and description text", () => {
    const fixture = setup({ title: "No items", description: "Add one to get started." });
    const title = fixture.nativeElement.querySelector(".sisyphos-empty-state-title") as HTMLElement;
    const desc = fixture.nativeElement.querySelector(".sisyphos-empty-state-description") as HTMLElement;
    expect(title.tagName).toBe("H3");
    expect(title.textContent).toBe("No items");
    expect(desc.tagName).toBe("P");
    expect(desc.textContent).toBe("Add one to get started.");
  });

  it("omits title/description elements when not provided", () => {
    const fixture = setup();
    expect(fixture.nativeElement.querySelector(".sisyphos-empty-state-title")).toBeNull();
    expect(fixture.nativeElement.querySelector(".sisyphos-empty-state-description")).toBeNull();
  });

  it("applies size + variant + bordered classes", () => {
    const fixture = setup({ size: "lg", variant: "inline", bordered: true });
    const root = fixture.nativeElement.querySelector(".sisyphos-empty-state") as HTMLElement;
    expect(root.className).toContain("lg");
    expect(root.className).toContain("inline");
    expect(root.className).toContain("bordered");
  });
});

describe("EmptyState — projected slots", () => {
  @Component({
    standalone: true,
    imports: [EmptyState],
    template: `
      <sui-empty-state title="No data">
        <svg empty-icon class="my-icon"></svg>
        <button empty-actions>Retry</button>
      </sui-empty-state>
    `,
  })
  class Host {}

  it("projects icon slot into the icon container with aria-hidden", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const iconContainer = fixture.nativeElement.querySelector(
      ".sisyphos-empty-state-icon"
    ) as HTMLElement;
    expect(iconContainer.getAttribute("aria-hidden")).toBe("true");
    expect(iconContainer.querySelector(".my-icon")).toBeTruthy();
  });

  it("projects actions slot into the actions container", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const actions = fixture.nativeElement.querySelector(
      ".sisyphos-empty-state-actions"
    ) as HTMLElement;
    expect(actions.querySelector("button")?.textContent).toBe("Retry");
  });
});
