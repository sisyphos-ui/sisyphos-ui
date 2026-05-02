import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Spinner from "./Spinner.vue";

describe("Spinner (Vue)", () => {
  it("exposes role=status and a default aria-label", () => {
    const wrapper = mount(Spinner);
    const root = wrapper.element as HTMLElement;
    expect(root.getAttribute("role")).toBe("status");
    expect(root.getAttribute("aria-label")).toBe("Loading");
  });

  it("accepts a custom label", () => {
    const wrapper = mount(Spinner, { props: { label: "Yükleniyor" } });
    expect((wrapper.element as HTMLElement).getAttribute("aria-label")).toBe("Yükleniyor");
  });

  it("applies size and color classes", () => {
    const wrapper = mount(Spinner, { props: { size: "lg", color: "success" } });
    const root = wrapper.element as HTMLElement;
    expect(root.classList.contains("lg")).toBe(true);
    expect(root.classList.contains("success")).toBe(true);
  });

  it("renders a second SVG arc for variant='double'", () => {
    const wrapper = mount(Spinner, { props: { variant: "double" } });
    const svgs = wrapper.findAll("svg");
    expect(svgs.length).toBe(2);
  });

  it("threads thickness through the CSS variable", () => {
    const wrapper = mount(Spinner, { props: { thickness: 5 } });
    const root = wrapper.element as HTMLElement;
    expect(root.style.getPropertyValue("--sisyphos-spinner-thickness")).toBe("5px");
  });
});
