import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Select from "./Select.vue";

const opts = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
  { value: "c", label: "Cherry", disabled: true },
];

describe("Select (Vue)", () => {
  it("opens on trigger click and shows options", async () => {
    const wrapper = mount(Select, { props: { options: opts }, attachTo: document.body });
    await wrapper.find(".sisyphos-select-trigger").trigger("click");
    await flushPromises();
    const items = document.querySelectorAll('[role="option"]');
    expect(items.length).toBe(3);
    wrapper.unmount();
  });

  it("emits update:modelValue with selected value (single)", async () => {
    const wrapper = mount(Select, { props: { options: opts }, attachTo: document.body });
    await wrapper.find(".sisyphos-select-trigger").trigger("click");
    await flushPromises();
    (document.querySelectorAll('[role="option"]')[1] as HTMLButtonElement).click();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["b"]);
    wrapper.unmount();
  });

  it("multi-select toggles values in/out", async () => {
    const wrapper = mount(Select, {
      props: { options: opts, multiple: true, modelValue: [] },
      attachTo: document.body,
    });
    await wrapper.find(".sisyphos-select-trigger").trigger("click");
    await flushPromises();
    (document.querySelectorAll('[role="option"]')[0] as HTMLButtonElement).click();
    expect(wrapper.emitted("update:modelValue")?.at(-1)?.[0]).toEqual(["a"]);
    wrapper.unmount();
  });

  it("filters options when searchable + search query", async () => {
    const wrapper = mount(Select, {
      props: { options: opts, searchable: true },
      attachTo: document.body,
    });
    await wrapper.find(".sisyphos-select-trigger").trigger("click");
    await flushPromises();
    const search = document.querySelector(".sisyphos-select-search") as HTMLInputElement;
    search.value = "ban";
    search.dispatchEvent(new Event("input"));
    await flushPromises();
    expect(document.querySelectorAll('[role="option"]').length).toBe(1);
    wrapper.unmount();
  });

  it("disabled option ignores clicks", async () => {
    const wrapper = mount(Select, { props: { options: opts }, attachTo: document.body });
    await wrapper.find(".sisyphos-select-trigger").trigger("click");
    await flushPromises();
    (document.querySelectorAll('[role="option"]')[2] as HTMLButtonElement).click();
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    wrapper.unmount();
  });
});
