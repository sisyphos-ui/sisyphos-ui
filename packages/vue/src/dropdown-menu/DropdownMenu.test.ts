import { describe, it, expect, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import DropdownMenu from "./DropdownMenu.vue";

describe("DropdownMenu (Vue)", () => {
  it("renders the menu when open=true", async () => {
    const items = [
      { label: "Edit", onSelect: () => {} },
      { type: "separator" as const },
      { label: "Delete", destructive: true, onSelect: () => {} },
    ];
    const wrapper = mount(DropdownMenu, {
      props: { items, open: true },
      slots: { default: "<button>Open menu</button>" },
      attachTo: document.body,
    });
    await flushPromises();
    const menu = document.querySelector('[role="menu"]');
    expect(menu).not.toBeNull();
    expect(menu!.querySelectorAll('[role="menuitem"]').length).toBe(2);
    wrapper.unmount();
  });

  it("renders an empty state when items=[] and emptyState is set", async () => {
    const wrapper = mount(DropdownMenu, {
      props: { items: [], open: true, emptyState: "No actions" },
      slots: { default: "<button>x</button>" },
      attachTo: document.body,
    });
    await flushPromises();
    expect(document.querySelector(".sisyphos-dropdown-empty")?.textContent).toBe("No actions");
    wrapper.unmount();
  });

  it("clicking an action fires onSelect and closes the menu", async () => {
    const onSelect = vi.fn();
    const wrapper = mount(DropdownMenu, {
      props: { items: [{ label: "Run", onSelect }], open: true },
      slots: { default: "<button>x</button>" },
      attachTo: document.body,
    });
    await flushPromises();
    (document.querySelector('[role="menuitem"]') as HTMLButtonElement).click();
    expect(onSelect).toHaveBeenCalled();
    expect(wrapper.emitted("update:open")?.[0]).toEqual([false]);
    wrapper.unmount();
  });

  it("disabled action does not fire onSelect", async () => {
    const onSelect = vi.fn();
    const wrapper = mount(DropdownMenu, {
      props: { items: [{ label: "Run", disabled: true, onSelect }], open: true },
      slots: { default: "<button>x</button>" },
      attachTo: document.body,
    });
    await flushPromises();
    (document.querySelector('[role="menuitem"]') as HTMLButtonElement).click();
    expect(onSelect).not.toHaveBeenCalled();
    wrapper.unmount();
  });
});
