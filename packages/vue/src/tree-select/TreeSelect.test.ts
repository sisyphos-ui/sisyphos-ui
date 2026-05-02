import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import TreeSelect from "./TreeSelect.vue";

const sample = [
  {
    id: "a",
    label: "Group A",
    children: [
      { id: "a1", label: "Item A1" },
      { id: "a2", label: "Item A2" },
    ],
  },
  { id: "b", label: "Item B" },
];

describe("TreeSelect (Vue)", () => {
  it("renders a combobox-style trigger and opens on click", async () => {
    const wrapper = mount(TreeSelect, {
      props: { nodes: sample },
      attachTo: document.body,
    });
    await wrapper.find(".sisyphos-tree-select-trigger").trigger("click");
    await flushPromises();
    expect(document.querySelector('[role="tree"]')).not.toBeNull();
    wrapper.unmount();
  });

  it("cascade toggles emit all descendant ids", async () => {
    const wrapper = mount(TreeSelect, {
      props: { nodes: sample, modelValue: [] },
      attachTo: document.body,
    });
    await wrapper.find(".sisyphos-tree-select-trigger").trigger("click");
    await flushPromises();
    const groupCheckbox = document.querySelector('[role="checkbox"]') as HTMLButtonElement;
    groupCheckbox.click();
    const emitted = wrapper.emitted("update:modelValue")?.at(-1)?.[0] as string[];
    expect(emitted).toEqual(expect.arrayContaining(["a", "a1", "a2"]));
    wrapper.unmount();
  });

  it("search auto-expands matched ancestors", async () => {
    const wrapper = mount(TreeSelect, {
      props: { nodes: sample },
      attachTo: document.body,
    });
    await wrapper.find(".sisyphos-tree-select-trigger").trigger("click");
    await flushPromises();
    const search = document.querySelector(".sisyphos-tree-select-search") as HTMLInputElement;
    search.value = "A1";
    search.dispatchEvent(new Event("input"));
    await flushPromises();
    const items = document.querySelectorAll('[role="checkbox"]');
    const labels = Array.from(items).map((it) => it.textContent?.trim());
    expect(labels.some((l) => l?.includes("Item A1"))).toBe(true);
    wrapper.unmount();
  });
});
