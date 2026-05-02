import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Slider from "./Slider.vue";

describe("Slider (Vue)", () => {
  it("renders single thumb with role=slider and aria values", () => {
    const wrapper = mount(Slider, { props: { modelValue: 30, min: 0, max: 100 } });
    const thumb = wrapper.find('[role="slider"]');
    expect(thumb.attributes("aria-valuenow")).toBe("30");
    expect(thumb.attributes("aria-valuemin")).toBe("0");
    expect(thumb.attributes("aria-valuemax")).toBe("100");
  });

  it("ArrowRight steps the value up", async () => {
    const wrapper = mount(Slider, { props: { modelValue: 30, step: 5 } });
    await wrapper.find('[role="slider"]').trigger("keydown", { key: "ArrowRight" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)?.[0]).toBe(35);
  });

  it("Home jumps to min, End jumps to max", async () => {
    const wrapper = mount(Slider, { props: { modelValue: 50, min: 0, max: 100 } });
    await wrapper.find('[role="slider"]').trigger("keydown", { key: "End" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)?.[0]).toBe(100);
    await wrapper.find('[role="slider"]').trigger("keydown", { key: "Home" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)?.[0]).toBe(0);
  });

  it("range mode renders two thumbs", () => {
    const wrapper = mount(Slider, {
      props: { modelValue: [20, 80], range: true, min: 0, max: 100 },
    });
    expect(wrapper.findAll('[role="slider"]').length).toBe(2);
  });

  it("disabled prevents keyboard updates", async () => {
    const wrapper = mount(Slider, { props: { modelValue: 30, disabled: true } });
    await wrapper.find('[role="slider"]').trigger("keydown", { key: "ArrowRight" });
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });
});
