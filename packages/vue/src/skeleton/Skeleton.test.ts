import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Skeleton from "./Skeleton.vue";

describe("Skeleton (Vue)", () => {
  it("renders with default rectangular shape and shimmer animation", () => {
    const wrapper = mount(Skeleton);
    const root = wrapper.element as HTMLElement;
    expect(root.classList.contains("shape-rectangular")).toBe(true);
    expect(root.classList.contains("animation-shimmer")).toBe(true);
  });

  it("circular shape forces border-radius 50%", () => {
    const wrapper = mount(Skeleton, { props: { shape: "circular" } });
    expect((wrapper.element as HTMLElement).style.borderRadius).toBe("50%");
  });

  it("forwards width and height as inline styles (px when numeric)", () => {
    const wrapper = mount(Skeleton, { props: { width: 120, height: "2em" } });
    const root = wrapper.element as HTMLElement;
    expect(root.style.width).toBe("120px");
    expect(root.style.height).toBe("2em");
  });

  it("text shape defaults height to 1em when none provided", () => {
    const wrapper = mount(Skeleton, { props: { shape: "text" } });
    expect((wrapper.element as HTMLElement).style.height).toBe("1em");
  });

  it("aria-hidden so the placeholder isn't announced", () => {
    const wrapper = mount(Skeleton);
    expect((wrapper.element as HTMLElement).getAttribute("aria-hidden")).toBe("true");
  });
});
