import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { h } from "vue";
import EmptyState from "./EmptyState.vue";

describe("EmptyState (Vue)", () => {
  it("renders title and description from props", () => {
    const wrapper = mount(EmptyState, {
      props: { title: "No data", description: "Try adjusting filters" },
    });
    expect(wrapper.find(".sisyphos-empty-state-title").text()).toBe("No data");
    expect(wrapper.find(".sisyphos-empty-state-description").text()).toBe("Try adjusting filters");
  });

  it("uses role=status so screen readers announce the empty state", () => {
    const wrapper = mount(EmptyState, { props: { title: "x" } });
    expect((wrapper.element as HTMLElement).getAttribute("role")).toBe("status");
  });

  it("applies size, variant, and bordered classes", () => {
    const wrapper = mount(EmptyState, {
      props: { size: "lg", variant: "inline", bordered: true, title: "x" },
    });
    const root = wrapper.element as HTMLElement;
    expect(root.classList.contains("lg")).toBe(true);
    expect(root.classList.contains("inline")).toBe(true);
    expect(root.classList.contains("bordered")).toBe(true);
  });

  it("renders icon and actions slots", () => {
    const wrapper = mount(EmptyState, {
      props: { title: "x" },
      slots: {
        icon: () => h("svg", { "data-testid": "icon" }),
        actions: () => h("button", "Retry"),
      },
    });
    expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true);
    expect(wrapper.find(".sisyphos-empty-state-actions button").text()).toBe("Retry");
  });
});
