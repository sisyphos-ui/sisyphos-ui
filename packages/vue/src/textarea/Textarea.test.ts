import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Textarea from "./Textarea.vue";

describe("Textarea (Vue)", () => {
  it("emits update:modelValue while typing", async () => {
    const wrapper = mount(Textarea, { props: { modelValue: "" } });
    await wrapper.find("textarea").setValue("Hello\nworld");
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["Hello\nworld"]);
  });

  it("renders label and links via for/id", () => {
    const wrapper = mount(Textarea, { props: { modelValue: "", label: "Note", id: "note" } });
    expect(wrapper.find("label").attributes("for")).toBe("note");
    expect(wrapper.find("textarea").attributes("id")).toBe("note");
  });

  it("renders error message and aria-invalid", () => {
    const wrapper = mount(Textarea, {
      props: { modelValue: "", error: true, errorMessage: "Required" },
    });
    expect(wrapper.find('[role="alert"]').text()).toBe("Required");
    expect(wrapper.find("textarea").attributes("aria-invalid")).toBe("true");
  });

  it("shows character count when maxLength + showCharacterCount", () => {
    const wrapper = mount(Textarea, {
      props: { modelValue: "abc", maxLength: 10, showCharacterCount: true },
    });
    expect(wrapper.find(".sisyphos-textarea-character-count").text()).toBe("3 / 10");
  });
});
