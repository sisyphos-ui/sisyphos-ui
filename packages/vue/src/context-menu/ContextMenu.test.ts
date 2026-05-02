import { describe, it, expect, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import ContextMenu from "./ContextMenu.vue";

describe("ContextMenu (Vue)", () => {
  it("opens at the pointer on right-click", async () => {
    const wrapper = mount(ContextMenu, {
      props: { items: [{ label: "Run", onSelect: () => {} }] },
      slots: { default: "<div class='target'>Right-click</div>" },
      attachTo: document.body,
    });
    await wrapper.find(".sisyphos-context-menu-trigger").trigger("contextmenu", {
      clientX: 50,
      clientY: 50,
    });
    await flushPromises();
    const menu = document.querySelector('[role="menu"]');
    expect(menu).not.toBeNull();
    expect(menu!.querySelector('[role="menuitem"]')?.textContent).toContain("Run");
    wrapper.unmount();
  });

  it("disabled does not open the menu", async () => {
    const wrapper = mount(ContextMenu, {
      props: { items: [{ label: "Run", onSelect: () => {} }], disabled: true },
      slots: { default: "<div class='target'>x</div>" },
      attachTo: document.body,
    });
    await wrapper.find(".sisyphos-context-menu-trigger").trigger("contextmenu");
    await flushPromises();
    expect(document.querySelector('[role="menu"]')).toBeNull();
    wrapper.unmount();
  });

  it("clicking an action fires onSelect", async () => {
    const onSelect = vi.fn();
    const wrapper = mount(ContextMenu, {
      props: { items: [{ label: "Run", onSelect }] },
      slots: { default: "<div class='target'>x</div>" },
      attachTo: document.body,
    });
    await wrapper.find(".sisyphos-context-menu-trigger").trigger("contextmenu");
    await flushPromises();
    (document.querySelector('[role="menuitem"]') as HTMLButtonElement).click();
    expect(onSelect).toHaveBeenCalled();
    wrapper.unmount();
  });
});
