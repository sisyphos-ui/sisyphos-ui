import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Toaster } from "./toaster.component";
import { toast, toastStore } from "./store";

describe("Toaster (Angular)", () => {
  beforeEach(() => {
    toastStore.clear();
    vi.useFakeTimers();
  });
  afterEach(() => {
    toastStore.clear();
    vi.useRealTimers();
  });

  it("renders nothing when the queue is empty", () => {
    const fixture = TestBed.createComponent(Toaster);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll(".sisyphos-toast").length).toBe(0);
  });

  it("renders a toast pushed via the store", () => {
    const fixture = TestBed.createComponent(Toaster);
    fixture.detectChanges();
    toast.success("Saved");
    fixture.detectChanges();
    const item = fixture.nativeElement.querySelector(".sisyphos-toast.success") as HTMLElement;
    expect(item).toBeTruthy();
    expect(item.querySelector(".sisyphos-toast-title")?.textContent).toBe("Saved");
    expect(item.getAttribute("aria-live")).toBe("polite");
  });

  it("error type uses role=alert and aria-live=assertive", () => {
    const fixture = TestBed.createComponent(Toaster);
    fixture.detectChanges();
    toast.error("Oops");
    fixture.detectChanges();
    const item = fixture.nativeElement.querySelector(".sisyphos-toast.error") as HTMLElement;
    expect(item.getAttribute("role")).toBe("alert");
    expect(item.getAttribute("aria-live")).toBe("assertive");
  });

  it("auto-dismisses after the configured duration", () => {
    const fixture = TestBed.createComponent(Toaster);
    fixture.detectChanges();
    toast.info("Hi", { duration: 2000 });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".sisyphos-toast")).toBeTruthy();
    vi.advanceTimersByTime(2000);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".sisyphos-toast")).toBeNull();
  });

  it("Infinity duration persists the toast", () => {
    const fixture = TestBed.createComponent(Toaster);
    fixture.detectChanges();
    toast("Sticky", { duration: Infinity });
    fixture.detectChanges();
    vi.advanceTimersByTime(60_000);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".sisyphos-toast")).toBeTruthy();
  });

  it("close button dismisses the toast", () => {
    const fixture = TestBed.createComponent(Toaster);
    fixture.detectChanges();
    toast("Hello");
    fixture.detectChanges();
    const close = fixture.nativeElement.querySelector(".sisyphos-toast-close") as HTMLButtonElement;
    expect(close).toBeTruthy();
    close.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".sisyphos-toast")).toBeNull();
  });

  it("dismissible=false hides the close button", () => {
    const fixture = TestBed.createComponent(Toaster);
    fixture.detectChanges();
    toast("No close", { dismissible: false, duration: Infinity });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".sisyphos-toast")).toBeTruthy();
    expect(fixture.nativeElement.querySelector(".sisyphos-toast-close")).toBeNull();
  });

  it("only renders up to `max` toasts", () => {
    const fixture = TestBed.createComponent(Toaster);
    fixture.componentRef.setInput("max", 2);
    fixture.detectChanges();
    toast("A", { duration: Infinity });
    toast("B", { duration: Infinity });
    toast("C", { duration: Infinity });
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll(".sisyphos-toast");
    expect(items.length).toBe(2);
    // Should keep the last 2 (B and C)
    expect(items[0].textContent).toContain("B");
    expect(items[1].textContent).toContain("C");
  });

  it("hover pauses the auto-dismiss timer", () => {
    const fixture = TestBed.createComponent(Toaster);
    fixture.detectChanges();
    toast("Watch me", { duration: 1000 });
    fixture.detectChanges();
    const item = fixture.nativeElement.querySelector(".sisyphos-toast") as HTMLElement;
    item.dispatchEvent(new Event("mouseenter"));
    vi.advanceTimersByTime(1000);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".sisyphos-toast")).toBeTruthy();
    item.dispatchEvent(new Event("mouseleave"));
    vi.advanceTimersByTime(1000);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".sisyphos-toast")).toBeNull();
  });

  it("reverses flex-direction for top positions", () => {
    const fixture = TestBed.createComponent(Toaster);
    fixture.componentRef.setInput("position", "top-right");
    fixture.detectChanges();
    const root = fixture.nativeElement.querySelector(".sisyphos-toaster") as HTMLElement;
    expect(root.style.flexDirection).toBe("column");
    fixture.componentRef.setInput("position", "bottom-left");
    fixture.detectChanges();
    expect(root.style.flexDirection).toBe("column-reverse");
  });
});

describe("toast store API", () => {
  beforeEach(() => toastStore.clear());

  it("toast.success/error/warning/info/loading set the type", () => {
    let lastType = "";
    const unsub = toastStore.subscribe((toasts) => {
      if (toasts.length) lastType = toasts[toasts.length - 1].type;
    });
    toast.success("a");
    expect(lastType).toBe("success");
    toast.error("b");
    expect(lastType).toBe("error");
    toast.warning("c");
    expect(lastType).toBe("warning");
    toast.info("d");
    expect(lastType).toBe("info");
    toast.loading("e");
    expect(lastType).toBe("loading");
    unsub();
  });

  it("returns the id and dismiss removes by id", () => {
    const id = toast("hello");
    let count = 0;
    const unsub = toastStore.subscribe((t) => {
      count = t.length;
    });
    expect(count).toBe(1);
    toast.dismiss(id);
    expect(count).toBe(0);
    unsub();
  });

  it("clear empties the queue", () => {
    toast("a");
    toast("b");
    toast("c");
    let count = 0;
    const unsub = toastStore.subscribe((t) => { count = t.length; });
    expect(count).toBe(3);
    toast.clear();
    expect(count).toBe(0);
    unsub();
  });
});
