import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Input from "./Input.vue";

describe("Input (Vue)", () => {
  it("emits update:modelValue while typing", async () => {
    const wrapper = mount(Input, { props: { modelValue: "", label: "Name" } });
    const input = wrapper.find("input");
    await input.setValue("Volkan");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["Volkan"]);
  });

  it("renders the error message and sets aria-invalid", () => {
    const wrapper = mount(Input, {
      props: { modelValue: "", label: "x", error: true, errorMessage: "Required" },
    });
    expect(wrapper.find('[role="alert"]').text()).toBe("Required");
    expect(wrapper.find("input").attributes("aria-invalid")).toBe("true");
  });

  it("character count appears when maxLength + showCharacterCount", () => {
    const wrapper = mount(Input, {
      props: { modelValue: "abc", label: "x", maxLength: 10, showCharacterCount: true },
    });
    expect(wrapper.find(".sisyphos-input-character-count").text()).toBe("3 / 10");
  });

  it("formats typed input against the supplied mask", async () => {
    const wrapper = mount(Input, { props: { modelValue: "", label: "Phone", mask: "tel-tr" } });
    await wrapper.find("input").setValue("5321112233");
    const last = wrapper.emitted("update:modelValue")?.at(-1)?.[0] as string;
    expect(last).toBe("+90 (532) 111 22 33");
  });

  it("respects disabled", () => {
    const wrapper = mount(Input, { props: { modelValue: "", label: "x", disabled: true } });
    expect((wrapper.find("input").element as HTMLInputElement).disabled).toBe(true);
  });
});
