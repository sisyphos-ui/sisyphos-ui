import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, ref } from "vue";
import RadioGroup from "./RadioGroup.vue";
import Radio from "./Radio.vue";

describe("Radio (Vue)", () => {
  it("renders options through `options` prop", () => {
    const wrapper = mount(RadioGroup, {
      props: {
        value: "a",
        options: [
          { value: "a", label: "A" },
          { value: "b", label: "B" },
        ],
      },
    });
    const radios = wrapper.findAll('input[type="radio"]');
    expect(radios.length).toBe(2);
    expect((radios[0].element as HTMLInputElement).checked).toBe(true);
  });

  it("emits update:value when an option is picked", async () => {
    const wrapper = mount(RadioGroup, {
      props: {
        value: "a",
        options: [
          { value: "a", label: "A" },
          { value: "b", label: "B" },
        ],
      },
    });
    await wrapper.findAll('input[type="radio"]')[1].trigger("change");
    expect(wrapper.emitted("update:value")?.[0]).toEqual(["b"]);
  });

  it("disabled group blocks selection", async () => {
    const wrapper = mount(RadioGroup, {
      props: {
        value: "a",
        disabled: true,
        options: [
          { value: "a", label: "A" },
          { value: "b", label: "B" },
        ],
      },
    });
    const inputs = wrapper.findAll('input[type="radio"]');
    expect((inputs[0].element as HTMLInputElement).disabled).toBe(true);
  });

  it("composes via slot with explicit Radio children", async () => {
    const Wrap = defineComponent({
      components: { RadioGroup, Radio },
      setup() {
        const v = ref<string>("a");
        return { v };
      },
      template: `
        <RadioGroup :value="v" @update:value="v = $event">
          <Radio value="a" label="A" />
          <Radio value="b" label="B" />
        </RadioGroup>
      `,
    });
    const wrapper = mount(Wrap);
    const inputs = wrapper.findAll('input[type="radio"]');
    expect(inputs.length).toBe(2);
    await inputs[1].trigger("change");
    await wrapper.vm.$nextTick();
    expect((inputs[1].element as HTMLInputElement).checked).toBe(true);
  });
});
