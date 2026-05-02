import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Switch from "./Switch.vue";

describe("Switch (Vue)", () => {
  it("exposes role=switch and aria-checked", () => {
    const wrapper = mount(Switch, { props: { checked: true, ariaLabel: "x" } });
    const btn = wrapper.element as HTMLElement;
    expect(btn.getAttribute("role")).toBe("switch");
    expect(btn.getAttribute("aria-checked")).toBe("true");
  });

  it("emits update:checked on click", async () => {
    const wrapper = mount(Switch, { props: { checked: false, ariaLabel: "x" } });
    await wrapper.trigger("click");
    expect(wrapper.emitted("update:checked")?.[0]).toEqual([true]);
    expect(wrapper.emitted("change")?.[0]).toEqual([true]);
  });

  it("Space and Enter activate the switch", async () => {
    const wrapper = mount(Switch, { props: { checked: false, ariaLabel: "x" } });
    await wrapper.trigger("keydown", { key: " " });
    await wrapper.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:checked")?.length).toBe(2);
  });

  it("disabled blocks toggle", async () => {
    const wrapper = mount(Switch, { props: { checked: false, disabled: true, ariaLabel: "x" } });
    await wrapper.trigger("click");
    expect(wrapper.emitted("update:checked")).toBeUndefined();
  });
});
