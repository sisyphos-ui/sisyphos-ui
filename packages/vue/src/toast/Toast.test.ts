import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Toaster from "./Toaster.vue";
import { toast, toastStore } from "./store";

beforeEach(() => {
  toastStore.clear();
});

describe("Toast (Vue)", () => {
  it("renders a toast added via toast()", async () => {
    const wrapper = mount(Toaster, { attachTo: document.body });
    toast("Hello");
    await flushPromises();
    expect(document.querySelector(".sisyphos-toast")?.textContent).toContain("Hello");
    wrapper.unmount();
  });

  it("error type sets aria-live='assertive'", async () => {
    const wrapper = mount(Toaster, { attachTo: document.body });
    toast.error("Something broke");
    await flushPromises();
    const t = document.querySelector(".sisyphos-toast");
    expect(t?.getAttribute("aria-live")).toBe("assertive");
    wrapper.unmount();
  });

  it("auto-dismisses after duration", async () => {
    vi.useFakeTimers();
    try {
      const wrapper = mount(Toaster, { attachTo: document.body });
      toast("Hi", { duration: 100 });
      await flushPromises();
      expect(document.querySelectorAll(".sisyphos-toast").length).toBe(1);
      vi.advanceTimersByTime(120);
      await flushPromises();
      expect(document.querySelectorAll(".sisyphos-toast").length).toBe(0);
      wrapper.unmount();
    } finally {
      vi.useRealTimers();
    }
  });

  it("clicking dismiss removes the toast", async () => {
    const wrapper = mount(Toaster, { attachTo: document.body });
    toast("X", { duration: Infinity });
    await flushPromises();
    (document.querySelector(".sisyphos-toast-close") as HTMLButtonElement).click();
    await flushPromises();
    expect(document.querySelectorAll(".sisyphos-toast").length).toBe(0);
    wrapper.unmount();
  });

  it("dedupes by id (subsequent calls update the same record)", async () => {
    const wrapper = mount(Toaster, { attachTo: document.body });
    const id = toast("First", { id: "same", duration: Infinity });
    expect(id).toBe("same");
    toast("Second", { id: "same", duration: Infinity });
    await flushPromises();
    const toasts = document.querySelectorAll(".sisyphos-toast");
    expect(toasts.length).toBe(1);
    expect(toasts[0].textContent).toContain("Second");
    wrapper.unmount();
  });
});
