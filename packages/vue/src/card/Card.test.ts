import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import Card from "./Card.vue";
import CardHeader from "./CardHeader.vue";
import CardBody from "./CardBody.vue";
import CardFooter from "./CardFooter.vue";

describe("Card (Vue)", () => {
  it("renders default slot inside the surface", () => {
    const wrapper = mount(Card, { slots: { default: () => h("p", "Hello") } });
    expect(wrapper.find("p").text()).toBe("Hello");
  });

  it("applies variant + padding classes", () => {
    const wrapper = mount(Card, { props: { variant: "outlined", padding: "lg" } });
    const root = wrapper.element as HTMLElement;
    expect(root.classList.contains("outlined")).toBe(true);
    expect(root.classList.contains("padding-lg")).toBe(true);
  });

  it("interactive mode sets role=button + tabindex=0", () => {
    const wrapper = mount(Card, { props: { interactive: true } });
    const root = wrapper.element as HTMLElement;
    expect(root.getAttribute("role")).toBe("button");
    expect(root.getAttribute("tabindex")).toBe("0");
    expect(root.classList.contains("interactive")).toBe(true);
  });

  it("composes with Header / Body / Footer sub-components", () => {
    const Wrap = defineComponent({
      components: { Card, CardHeader, CardBody, CardFooter },
      template: `
        <Card>
          <CardHeader>H</CardHeader>
          <CardBody>B</CardBody>
          <CardFooter>F</CardFooter>
        </Card>
      `,
    });
    const wrapper = mount(Wrap);
    expect(wrapper.find(".sisyphos-card-header").text()).toBe("H");
    expect(wrapper.find(".sisyphos-card-body").text()).toBe("B");
    expect(wrapper.find(".sisyphos-card-footer").text()).toBe("F");
  });
});
