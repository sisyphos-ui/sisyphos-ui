import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import Accordion from "./Accordion.vue";
import AccordionItem from "./AccordionItem.vue";
import AccordionTrigger from "./AccordionTrigger.vue";
import AccordionContent from "./AccordionContent.vue";

const Suite = defineComponent({
  components: { Accordion, AccordionItem, AccordionTrigger, AccordionContent },
  props: {
    multiple: { type: Boolean, default: false },
    defaultValue: { type: [String, Array], default: () => [] },
  },
  template: `
    <Accordion :multiple="multiple" :default-value="defaultValue">
      <AccordionItem value="a">
        <AccordionTrigger>A</AccordionTrigger>
        <AccordionContent>Content A</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>B</AccordionTrigger>
        <AccordionContent>Content B</AccordionContent>
      </AccordionItem>
    </Accordion>
  `,
});

describe("Accordion (Vue)", () => {
  it("opens an item on trigger click", async () => {
    const wrapper = mount(Suite);
    const triggers = wrapper.findAll("button.sisyphos-accordion-trigger");
    await triggers[0].trigger("click");
    expect(triggers[0].attributes("aria-expanded")).toBe("true");
  });

  it("single mode closes the previous item on opening another", async () => {
    const wrapper = mount(Suite);
    const triggers = wrapper.findAll("button.sisyphos-accordion-trigger");
    await triggers[0].trigger("click");
    await triggers[1].trigger("click");
    expect(triggers[0].attributes("aria-expanded")).toBe("false");
    expect(triggers[1].attributes("aria-expanded")).toBe("true");
  });

  it("multiple mode keeps both items open", async () => {
    const wrapper = mount(Suite, { props: { multiple: true } });
    const triggers = wrapper.findAll("button.sisyphos-accordion-trigger");
    await triggers[0].trigger("click");
    await triggers[1].trigger("click");
    expect(triggers[0].attributes("aria-expanded")).toBe("true");
    expect(triggers[1].attributes("aria-expanded")).toBe("true");
  });
});
