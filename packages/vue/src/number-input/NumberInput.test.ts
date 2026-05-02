import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, ref } from "vue";
import NumberInput from "./NumberInput.vue";

describe("NumberInput (Vue)", () => {
  it("emits update:modelValue when typing parseable input", async () => {
    const wrapper = mount(NumberInput, { props: { modelValue: null, locale: "en-US" } });
    await wrapper.find("input").setValue("42");
    expect(wrapper.emitted("update:modelValue")?.at(-1)?.[0]).toBe(42);
  });

  it("clamps to min/max", async () => {
    const wrapper = mount(NumberInput, {
      props: { modelValue: null, min: 0, max: 10, locale: "en-US" },
    });
    await wrapper.find("input").setValue("99");
    expect(wrapper.emitted("update:modelValue")?.at(-1)?.[0]).toBe(10);
  });

  it("stepper buttons increment/decrement by step (with v-model)", async () => {
    const Wrap = defineComponent({
      components: { NumberInput },
      setup() {
        const v = ref<number | null>(5);
        return { v };
      },
      template: `<NumberInput :modelValue="v" @update:modelValue="v = $event" :step="2" locale="en-US" />`,
    });
    const wrapper = mount(Wrap);
    await wrapper.find(".sisyphos-number-input-step.up").trigger("click");
    expect(wrapper.vm.v).toBe(7);
    await wrapper.find(".sisyphos-number-input-step.down").trigger("click");
    expect(wrapper.vm.v).toBe(5);
  });

  it("disabled blocks stepper", () => {
    const wrapper = mount(NumberInput, { props: { modelValue: 5, disabled: true } });
    expect(
      (wrapper.find(".sisyphos-number-input-step.up").element as HTMLButtonElement).disabled
    ).toBe(true);
  });
});
