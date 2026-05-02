import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Avatar from "./Avatar.vue";

describe("Avatar (Vue)", () => {
  it("renders an image when src is provided", () => {
    const wrapper = mount(Avatar, { props: { src: "/x.png", alt: "User" } });
    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("/x.png");
    expect(img.attributes("alt")).toBe("User");
  });

  it("falls back to derived initials when only name is provided", () => {
    const wrapper = mount(Avatar, { props: { name: "Volkan Günay" } });
    expect(wrapper.find(".sisyphos-avatar-fallback").text()).toBe("VG");
  });

  it("falls back to initials on image error", async () => {
    const wrapper = mount(Avatar, { props: { src: "/bad.png", name: "Ada Lovelace" } });
    await wrapper.find("img").trigger("error");
    expect(wrapper.find("img").exists()).toBe(false);
    expect(wrapper.find(".sisyphos-avatar-fallback").text()).toBe("AL");
  });

  it("applies size, color, and shape classes", () => {
    const wrapper = mount(Avatar, {
      props: { name: "X", size: "lg", color: "success", shape: "square" },
    });
    const root = wrapper.element as HTMLElement;
    expect(root.classList.contains("lg")).toBe(true);
    expect(root.classList.contains("success")).toBe(true);
    expect(root.classList.contains("square")).toBe(true);
  });

  it("default slot wins over derived initials", () => {
    const wrapper = mount(Avatar, { props: { name: "X" }, slots: { default: () => "🐙" } });
    expect(wrapper.find(".sisyphos-avatar-fallback").text()).toBe("🐙");
  });
});
