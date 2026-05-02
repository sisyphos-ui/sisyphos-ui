import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Breadcrumb from "./Breadcrumb.vue";

describe("Breadcrumb (Vue)", () => {
  it("renders a list of items inside <nav aria-label='breadcrumb'>", () => {
    const wrapper = mount(Breadcrumb, {
      props: { items: [{ label: "Home", href: "/" }, { label: "Settings" }] },
    });
    expect((wrapper.element as HTMLElement).tagName).toBe("NAV");
    expect((wrapper.element as HTMLElement).getAttribute("aria-label")).toBe("breadcrumb");
    expect(wrapper.findAll("li.sisyphos-breadcrumb-item").length).toBe(2);
  });

  it("marks the last item with aria-current='page'", () => {
    const wrapper = mount(Breadcrumb, {
      props: { items: [{ label: "Home", href: "/" }, { label: "Settings" }] },
    });
    const current = wrapper.find('[aria-current="page"]');
    expect(current.text()).toContain("Settings");
  });

  it("renders an anchor when an item has href", () => {
    const wrapper = mount(Breadcrumb, {
      props: { items: [{ label: "Home", href: "/x" }, { label: "Last" }] },
    });
    const a = wrapper.find("a.sisyphos-breadcrumb-link");
    expect(a.attributes("href")).toBe("/x");
  });

  it("renders a <button> when only onClick is supplied", async () => {
    const onClick = vi.fn();
    const wrapper = mount(Breadcrumb, {
      props: { items: [{ label: "Home", onClick }, { label: "Last" }] },
    });
    const btn = wrapper.find("button.sisyphos-breadcrumb-link");
    await btn.trigger("click");
    expect(onClick).toHaveBeenCalled();
  });

  it("collapses middle items into an ellipsis when over maxItems", () => {
    const wrapper = mount(Breadcrumb, {
      props: {
        maxItems: 3,
        itemsBeforeCollapse: 1,
        itemsAfterCollapse: 1,
        items: [{ label: "A" }, { label: "B" }, { label: "C" }, { label: "D" }, { label: "E" }],
      },
    });
    expect(wrapper.find(".sisyphos-breadcrumb-ellipsis").exists()).toBe(true);
    const items = wrapper.findAll(".sisyphos-breadcrumb-item");
    expect(items.length).toBe(2); // first + last
  });
});
