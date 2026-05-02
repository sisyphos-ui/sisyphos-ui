import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { defineComponent } from "vue";
import Command from "./Command.vue";
import CommandInput from "./CommandInput.vue";
import CommandList from "./CommandList.vue";
import CommandItem from "./CommandItem.vue";
import CommandEmpty from "./CommandEmpty.vue";

const Suite = defineComponent({
  components: { Command, CommandInput, CommandList, CommandItem, CommandEmpty },
  template: `
    <Command>
      <CommandInput placeholder="Search…" />
      <CommandList>
        <CommandItem value="apple">Apple</CommandItem>
        <CommandItem value="banana">Banana</CommandItem>
        <CommandItem value="cherry">Cherry</CommandItem>
        <CommandEmpty>No results</CommandEmpty>
      </CommandList>
    </Command>
  `,
});

describe("Command (Vue)", () => {
  it("renders all items when query is empty", async () => {
    const wrapper = mount(Suite);
    await flushPromises();
    const items = wrapper.findAll('[role="option"]');
    expect(items.length).toBe(3);
  });

  it("filters items by substring of label", async () => {
    const wrapper = mount(Suite);
    await flushPromises();
    const input = wrapper.find('input[role="searchbox"]');
    await input.setValue("ban");
    await flushPromises();
    const items = wrapper.findAll('[role="option"]');
    expect(items.length).toBe(1);
    expect(items[0].text()).toBe("Banana");
  });

  it("renders the empty state when no items match", async () => {
    const wrapper = mount(Suite);
    await flushPromises();
    const input = wrapper.find('input[role="searchbox"]');
    await input.setValue("zzzz");
    await flushPromises();
    expect(wrapper.find(".sisyphos-command-empty").text()).toBe("No results");
  });

  it("Enter selects the active item", async () => {
    const wrapper = mount(Suite, { attachTo: document.body });
    await flushPromises();
    const root = wrapper.find(".sisyphos-command");
    await root.trigger("keydown", { key: "ArrowDown" });
    await root.trigger("keydown", { key: "Enter" });
    // After ArrowDown the first item is active and Enter selects it.
    // Suite doesn't bind v-model so we check internal active via DOM.
    expect(wrapper.findAll('[role="option"]')[0].attributes("aria-selected")).toBe("true");
    wrapper.unmount();
  });
});
