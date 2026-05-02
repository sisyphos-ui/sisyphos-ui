import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Checkbox from "./Checkbox.vue";

describe("Checkbox (Vue binding over @sisyphos-ui/core helper)", () => {
  it("renders unchecked by default", () => {
    const wrapper = mount(Checkbox, { props: { checked: false, label: "Accept terms" } });
    const input = wrapper.get("input").element as HTMLInputElement;
    expect(input.checked).toBe(false);
  });

  it("reflects the checked prop", () => {
    const wrapper = mount(Checkbox, { props: { checked: true, label: "On" } });
    const input = wrapper.get("input").element as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it("indeterminate exposes aria-checked='mixed' and the DOM flag", async () => {
    const wrapper = mount(Checkbox, {
      props: { checked: false, indeterminate: true, label: "All" },
    });
    const input = wrapper.get("input").element as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    expect(input.getAttribute("aria-checked")).toBe("mixed");
  });

  it("emits update:checked=true when an indeterminate box is toggled", async () => {
    const wrapper = mount(Checkbox, {
      props: { checked: false, indeterminate: true, label: "All" },
    });
    await wrapper.get("input").trigger("change");
    expect(wrapper.emitted("update:checked")).toEqual([[true]]);
    expect(wrapper.emitted("change")).toEqual([[true]]);
  });

  it("emits update:checked with the toggled value when not indeterminate", async () => {
    const wrapper = mount(Checkbox, { props: { checked: false, label: "Toggle" } });
    await wrapper.get("input").trigger("change");
    expect(wrapper.emitted("update:checked")?.[0]).toEqual([true]);
  });

  it("does not emit when disabled", async () => {
    const onChange = vi.fn();
    const wrapper = mount(Checkbox, {
      props: { checked: false, disabled: true, label: "x" },
      attrs: { "onUpdate:checked": onChange },
    });
    await wrapper.get("input").trigger("change");
    expect(onChange).not.toHaveBeenCalled();
  });
});
