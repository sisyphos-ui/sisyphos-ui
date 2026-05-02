import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Alert from "./Alert.vue";

describe("Alert (Vue)", () => {
  it("renders title and description", () => {
    const wrapper = mount(Alert, {
      props: { title: "Heads up", description: "Something happened" },
    });
    expect(wrapper.find(".sisyphos-alert-title").text()).toBe("Heads up");
    expect(wrapper.find(".sisyphos-alert-description").text()).toBe("Something happened");
  });

  it("uses role=alert when color is error, role=status otherwise", () => {
    const a = mount(Alert, { props: { color: "error", title: "x" } });
    expect((a.element as HTMLElement).getAttribute("role")).toBe("alert");
    const b = mount(Alert, { props: { color: "info", title: "x" } });
    expect((b.element as HTMLElement).getAttribute("role")).toBe("status");
  });

  it("emits close when the close button is clicked", async () => {
    const wrapper = mount(Alert, { props: { closable: true, title: "x" } });
    await wrapper.find("button.sisyphos-alert-close").trigger("click");
    expect(wrapper.emitted("close")?.length).toBe(1);
  });

  it("auto-dismisses after autoCloseDuration when closable", () => {
    vi.useFakeTimers();
    try {
      const wrapper = mount(Alert, {
        props: { closable: true, autoCloseDuration: 500, title: "x" },
      });
      expect(wrapper.emitted("close")).toBeUndefined();
      vi.advanceTimersByTime(500);
      expect(wrapper.emitted("close")?.length).toBe(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
