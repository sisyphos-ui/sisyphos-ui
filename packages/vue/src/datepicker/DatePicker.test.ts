import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import DatePicker from "./DatePicker.vue";

describe("DatePicker (Vue)", () => {
  it("renders trigger with placeholder", () => {
    const wrapper = mount(DatePicker, { props: {}, attachTo: document.body });
    expect(wrapper.find(".sisyphos-datepicker-trigger").exists()).toBe(true);
    expect(wrapper.find(".sisyphos-datepicker-input").exists()).toBe(true);
    wrapper.unmount();
  });

  it("opens calendar on click", async () => {
    const wrapper = mount(DatePicker, { props: {}, attachTo: document.body });
    await wrapper.find(".sisyphos-datepicker-trigger").trigger("click");
    await flushPromises();
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    wrapper.unmount();
  });

  it("shows label when provided", () => {
    const wrapper = mount(DatePicker, { props: { label: "Birth Date" } });
    expect(wrapper.find("label").text()).toBe("Birth Date");
  });

  it("shows error message when error=true and errorMessage set", () => {
    const wrapper = mount(DatePicker, { props: { error: true, errorMessage: "Required" } });
    expect(wrapper.find('[role="alert"]').text()).toBe("Required");
  });

  it("disabled prevents opening", async () => {
    const wrapper = mount(DatePicker, { props: { disabled: true }, attachTo: document.body });
    await wrapper.find(".sisyphos-datepicker-trigger").trigger("click");
    await flushPromises();
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    wrapper.unmount();
  });

  it("displays formatted date from modelValue", () => {
    const date = new Date(2024, 0, 15); // Jan 15 2024
    const wrapper = mount(DatePicker, { props: { modelValue: date } });
    const input = wrapper.find(".sisyphos-datepicker-input");
    expect((input.element as HTMLInputElement).value).toBe("15.01.2024");
  });

  it("range mode displays range string", () => {
    const start = new Date(2024, 0, 10);
    const end = new Date(2024, 0, 20);
    const wrapper = mount(DatePicker, {
      props: { isRange: true, modelValue: [start, end] },
    });
    const input = wrapper.find(".sisyphos-datepicker-input");
    expect((input.element as HTMLInputElement).value).toBe("10.01.2024 - 20.01.2024");
  });

  it("clear button appears when allowClear and value set", () => {
    const date = new Date(2024, 0, 15);
    const wrapper = mount(DatePicker, { props: { modelValue: date, allowClear: true } });
    expect(wrapper.find(".sisyphos-datepicker-clear").exists()).toBe(true);
  });

  it("emits null on clear", async () => {
    const date = new Date(2024, 0, 15);
    const wrapper = mount(DatePicker, { props: { modelValue: date, allowClear: true } });
    await wrapper.find(".sisyphos-datepicker-clear").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.[0]?.[0]).toBeNull();
  });
});
