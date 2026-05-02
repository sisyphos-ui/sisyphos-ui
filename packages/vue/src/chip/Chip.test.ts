import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Chip from "./Chip.vue";

describe("Chip (Vue)", () => {
  it("renders the default slot as the label", () => {
    const wrapper = mount(Chip, { slots: { default: "Hello" } });
    expect(wrapper.find(".sisyphos-chip-label").text()).toBe("Hello");
  });

  it("emits click only when `clickable` is true", async () => {
    const wrapper = mount(Chip, { slots: { default: "x" } });
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toBeUndefined();

    const clickable = mount(Chip, { props: { clickable: true }, slots: { default: "x" } });
    await clickable.trigger("click");
    expect(clickable.emitted("click")?.length).toBe(1);
  });

  it("Enter / Space activate when clickable", async () => {
    const wrapper = mount(Chip, { props: { clickable: true }, slots: { default: "x" } });
    await wrapper.trigger("keydown", { key: "Enter" });
    await wrapper.trigger("keydown", { key: " " });
    expect(wrapper.emitted("click")?.length).toBe(2);
  });

  it("delete button emits delete and stops bubbling to the chip", async () => {
    const wrapper = mount(Chip, {
      props: { clickable: true, deletable: true },
      slots: { default: "x" },
    });
    await wrapper.find("button.sisyphos-chip-delete").trigger("click");
    expect(wrapper.emitted("delete")?.length).toBe(1);
    expect(wrapper.emitted("click")).toBeUndefined();
  });

  it("disabled chip does not emit click or delete", async () => {
    const wrapper = mount(Chip, {
      props: { clickable: true, deletable: true, disabled: true },
      slots: { default: "x" },
    });
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toBeUndefined();
    await wrapper.find("button.sisyphos-chip-delete").trigger("click");
    expect(wrapper.emitted("delete")).toBeUndefined();
  });
});
