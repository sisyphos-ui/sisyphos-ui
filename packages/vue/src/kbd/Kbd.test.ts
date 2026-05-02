import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Kbd from "./Kbd.vue";

describe("Kbd (Vue)", () => {
  it("renders default-slot content as a single <kbd>", () => {
    const wrapper = mount(Kbd, { slots: { default: "K" } });
    const kbds = wrapper.findAll("kbd");
    expect(kbds.length).toBe(1);
    expect(kbds[0].text()).toBe("K");
  });

  it("`keys` array renders one <kbd> per key in a role=group", () => {
    const wrapper = mount(Kbd, { props: { keys: ["ctrl", "shift", "p"] } });
    expect((wrapper.element as HTMLElement).getAttribute("role")).toBe("group");
    const keys = wrapper.findAll("kbd");
    expect(keys.length).toBe(3);
    expect(keys[0].text()).toBe("⌃");
    expect(keys[1].text()).toBe("⇧");
    expect(keys[2].text()).toBe("P");
  });

  it("`shortcut` string is parsed on + or whitespace", () => {
    const wrapper = mount(Kbd, { props: { shortcut: "cmd+k" } });
    const keys = wrapper.findAll("kbd");
    expect(keys.length).toBe(2);
    expect(keys[0].text()).toBe("⌘");
    expect(keys[1].text()).toBe("K");
  });

  it("renders the separator between keys when multiple", () => {
    const wrapper = mount(Kbd, { props: { keys: ["cmd", "k"], separator: "+" } });
    expect(wrapper.find(".sisyphos-kbd-separator").text()).toBe("+");
  });
});
