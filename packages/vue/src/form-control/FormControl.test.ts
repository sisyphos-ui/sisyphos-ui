import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { h } from "vue";
import FormControl from "./FormControl.vue";
import FormLabel from "./FormLabel.vue";
import FormHelperText from "./FormHelperText.vue";
import FormErrorText from "./FormErrorText.vue";

describe("FormControl (Vue)", () => {
  it("links label → input via `for` and auto-generated id", () => {
    const wrapper = mount(FormControl, {
      slots: {
        default: () => [
          h(FormLabel, () => "Email"),
          h("input", { type: "email" }),
          h(FormHelperText, () => "We won't share it."),
        ],
      },
    });
    const label = wrapper.find("label").element as HTMLLabelElement;
    expect(label.htmlFor).toBeTruthy();
    expect(label.htmlFor.startsWith("sisyphos-field-")).toBe(true);
  });

  it("respects a user-provided id", () => {
    const wrapper = mount(FormControl, {
      props: { id: "my-field" },
      slots: { default: () => h(FormLabel, () => "Email") },
    });
    const label = wrapper.find("label").element as HTMLLabelElement;
    expect(label.htmlFor).toBe("my-field");
  });

  it("renders the required indicator when `required`", () => {
    const wrapper = mount(FormControl, {
      props: { required: true },
      slots: { default: () => h(FormLabel, () => "Display name") },
    });
    expect(wrapper.find(".sisyphos-form-label-required").exists()).toBe(true);
  });

  it("shows FormHelperText when no error is set", () => {
    const wrapper = mount(FormControl, {
      slots: {
        default: () => [
          h(FormLabel, () => "Email"),
          h(FormHelperText, () => "Used for confirmation only."),
          h(FormErrorText, () => "This field is required."),
        ],
      },
    });
    expect(wrapper.text()).toContain("Used for confirmation only.");
    expect(wrapper.text()).not.toContain("This field is required.");
  });

  it("hides helper and shows error when `error` is true", () => {
    const wrapper = mount(FormControl, {
      props: { error: true },
      slots: {
        default: () => [
          h(FormLabel, () => "Email"),
          h(FormHelperText, () => "Used for confirmation only."),
          h(FormErrorText, () => "This field is required."),
        ],
      },
    });
    expect(wrapper.text()).not.toContain("Used for confirmation only.");
    const err = wrapper.find('[role="alert"]');
    expect(err.exists()).toBe(true);
    expect(err.text()).toBe("This field is required.");
  });

  it("applies error/disabled/full-width className on the root", () => {
    const wrapper = mount(FormControl, {
      props: { error: true, disabled: true, fullWidth: true },
      slots: { default: () => h(FormLabel, () => "X") },
    });
    const root = wrapper.find(".sisyphos-form-control");
    expect(root.classes()).toContain("error");
    expect(root.classes()).toContain("disabled");
    expect(root.classes()).toContain("full-width");
  });

  it("FormErrorText renders standalone when used outside FormControl", () => {
    const wrapper = mount(FormErrorText, { slots: { default: () => "Standalone error" } });
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    expect(wrapper.text()).toBe("Standalone error");
  });

  it("provides reactive context — error toggle updates child render", async () => {
    const wrapper = mount(FormControl, {
      props: { error: false },
      slots: {
        default: () => [
          h(FormHelperText, () => "Helper visible"),
          h(FormErrorText, () => "Error hidden"),
        ],
      },
    });
    expect(wrapper.text()).toContain("Helper visible");
    await wrapper.setProps({ error: true });
    expect(wrapper.text()).not.toContain("Helper visible");
    expect(wrapper.text()).toContain("Error hidden");
  });
});
