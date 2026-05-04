import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Alert } from "./alert.component";

function setup(props: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(Alert);
  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined) fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  const root = fixture.nativeElement.querySelector(".sisyphos-alert") as HTMLElement;
  return { fixture, root };
}

describe("Alert (Angular)", () => {
  it("renders with default variant=soft, color=info, role=status", () => {
    const { root } = setup();
    expect(root).toBeTruthy();
    expect(root.className).toContain("soft");
    expect(root.className).toContain("info");
    expect(root.getAttribute("role")).toBe("status");
  });

  it("color=error switches the inferred role to alert", () => {
    const { root } = setup({ color: "error" });
    expect(root.getAttribute("role")).toBe("alert");
  });

  it("explicit role overrides the inferred one", () => {
    const { root } = setup({ color: "error", role: "alertdialog" });
    expect(root.getAttribute("role")).toBe("alertdialog");
  });

  it("renders title and description text", () => {
    const fixture = setup({ title: "Saved", description: "Document saved." });
    const title = fixture.fixture.nativeElement.querySelector(".sisyphos-alert-title") as HTMLElement;
    const desc = fixture.fixture.nativeElement.querySelector(".sisyphos-alert-description") as HTMLElement;
    expect(title.textContent).toBe("Saved");
    expect(desc.textContent).toBe("Document saved.");
  });

  it("renders the default semantic icon based on color", () => {
    const fixture = setup({ color: "success" });
    expect(fixture.fixture.nativeElement.querySelector(".sisyphos-alert-icon svg")).toBeTruthy();
  });

  it("hideIcon=true hides the icon container", () => {
    const fixture = setup({ hideIcon: true });
    expect(fixture.fixture.nativeElement.querySelector(".sisyphos-alert-icon")).toBeNull();
  });

  it("closable=true renders the close button with default aria-label", () => {
    const fixture = setup({ closable: true });
    const btn = fixture.fixture.nativeElement.querySelector(
      ".sisyphos-alert-close"
    ) as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.getAttribute("aria-label")).toBe("Close");
  });

  it("close button emits (close)", () => {
    const fixture = setup({ closable: true });
    const onClose = vi.fn();
    fixture.fixture.componentInstance.close.subscribe(onClose);
    const btn = fixture.fixture.nativeElement.querySelector(
      ".sisyphos-alert-close"
    ) as HTMLButtonElement;
    btn.click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("custom closeAriaLabel is forwarded", () => {
    const fixture = setup({ closable: true, closeAriaLabel: "Kapat" });
    const btn = fixture.fixture.nativeElement.querySelector(
      ".sisyphos-alert-close"
    ) as HTMLButtonElement;
    expect(btn.getAttribute("aria-label")).toBe("Kapat");
  });

  it("applies variant class to root", () => {
    const { root } = setup({ variant: "outlined", color: "warning" });
    expect(root.className).toContain("outlined");
    expect(root.className).toContain("warning");
  });
});

describe("Alert auto-close", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("emits (close) after autoCloseDuration ms", () => {
    const fixture = setup({ autoCloseDuration: 1000 });
    const onClose = vi.fn();
    fixture.fixture.componentInstance.close.subscribe(onClose);
    expect(onClose).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1000);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not auto-close when autoCloseDuration is undefined", () => {
    const fixture = setup();
    const onClose = vi.fn();
    fixture.fixture.componentInstance.close.subscribe(onClose);
    vi.advanceTimersByTime(5000);
    expect(onClose).not.toHaveBeenCalled();
  });
});
