import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Tooltip from "./Tooltip.vue";

describe("Tooltip (Vue)", () => {
  it("renders the tooltip when controlled open=true", async () => {
    const wrapper = mount(Tooltip, {
      props: { open: true, content: "Hello" },
      slots: { default: "<button>Hover me</button>" },
      attachTo: document.body,
    });
    await flushPromises();
    const tip = document.querySelector('[role="tooltip"]');
    expect(tip).not.toBeNull();
    expect(tip!.textContent).toContain("Hello");
    wrapper.unmount();
  });

  it("falsy content keeps the tooltip hidden even when open=true", async () => {
    const wrapper = mount(Tooltip, {
      props: { open: true, content: "" },
      slots: { default: "<button>x</button>" },
      attachTo: document.body,
    });
    await flushPromises();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    wrapper.unmount();
  });

  it("disabled keeps the tooltip hidden", async () => {
    const wrapper = mount(Tooltip, {
      props: { open: true, content: "Hi", disabled: true },
      slots: { default: "<button>x</button>" },
      attachTo: document.body,
    });
    await flushPromises();
    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    wrapper.unmount();
  });
});
