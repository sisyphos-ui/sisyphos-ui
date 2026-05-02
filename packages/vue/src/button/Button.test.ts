import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Button from "./Button.vue";

describe("Button (Vue)", () => {
  it("renders as a <button> by default", () => {
    const wrapper = mount(Button, { slots: { default: "Save" } });
    expect((wrapper.element as HTMLElement).tagName).toBe("BUTTON");
    expect(wrapper.text()).toBe("Save");
  });

  it("renders as an <a> when href is provided", () => {
    const wrapper = mount(Button, { props: { href: "/x" }, slots: { default: "Go" } });
    expect((wrapper.element as HTMLElement).tagName).toBe("A");
    expect(wrapper.attributes("href")).toBe("/x");
  });

  it("loading sets aria-busy and disables the button", () => {
    const wrapper = mount(Button, { props: { loading: true }, slots: { default: "x" } });
    const root = wrapper.element as HTMLButtonElement;
    expect(root.getAttribute("aria-busy")).toBe("true");
    expect(root.disabled).toBe(true);
    expect(wrapper.find(".sisyphos-button-spinner").exists()).toBe(true);
  });

  it("variant + color + size apply as classes", () => {
    const wrapper = mount(Button, {
      props: { variant: "outlined", color: "success", size: "lg" },
      slots: { default: "x" },
    });
    const root = wrapper.element as HTMLElement;
    expect(root.classList.contains("outlined")).toBe(true);
    expect(root.classList.contains("success")).toBe(true);
    expect(root.classList.contains("lg")).toBe(true);
  });
});
