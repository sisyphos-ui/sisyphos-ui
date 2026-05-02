import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import Carousel from "./Carousel.vue";

const Suite = defineComponent({
  components: { Carousel },
  template: `
    <Carousel :count="3" :autoPlay="false">
      <div>One</div><div>Two</div><div>Three</div>
    </Carousel>
  `,
});

describe("Carousel (Vue)", () => {
  it("renders dots and arrow controls when count > 1", () => {
    const wrapper = mount(Suite);
    expect(wrapper.findAll(".sisyphos-carousel-dot").length).toBe(3);
    expect(wrapper.findAll(".sisyphos-carousel-arrow").length).toBe(2);
  });

  it("clicking next arrow advances the index", async () => {
    const wrapper = mount(Suite);
    await wrapper.find(".sisyphos-carousel-arrow.end").trigger("click");
    expect(wrapper.findAll(".sisyphos-carousel-dot")[1].attributes("aria-selected")).toBe("true");
  });

  it("loops past the last slide back to the first when loop=true", async () => {
    const wrapper = mount(Suite);
    const next = wrapper.find(".sisyphos-carousel-arrow.end");
    await next.trigger("click");
    await next.trigger("click");
    await next.trigger("click");
    expect(wrapper.findAll(".sisyphos-carousel-dot")[0].attributes("aria-selected")).toBe("true");
  });

  it("autoPlay advances on the configured interval", () => {
    vi.useFakeTimers();
    try {
      const wrapper = mount(Carousel, {
        props: { count: 3, autoPlay: true, autoPlayInterval: 1000, pauseOnHover: false },
        slots: { default: "<div>x</div>" },
      });
      expect(wrapper.findAll(".sisyphos-carousel-dot")[0].attributes("aria-selected")).toBe("true");
      vi.advanceTimersByTime(1000);
      expect(wrapper.emitted("update:index")?.[0]).toEqual([1]);
    } finally {
      vi.useRealTimers();
    }
  });
});
