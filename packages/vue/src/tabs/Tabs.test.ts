import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import Tabs from "./Tabs.vue";
import TabsList from "./TabsList.vue";
import TabsTrigger from "./TabsTrigger.vue";
import TabsPanel from "./TabsPanel.vue";

const Suite = defineComponent({
  components: { Tabs, TabsList, TabsTrigger, TabsPanel },
  template: `
    <Tabs default-value="a">
      <TabsList>
        <TabsTrigger value="a">A</TabsTrigger>
        <TabsTrigger value="b">B</TabsTrigger>
        <TabsTrigger value="c">C</TabsTrigger>
      </TabsList>
      <TabsPanel value="a">Panel A</TabsPanel>
      <TabsPanel value="b">Panel B</TabsPanel>
      <TabsPanel value="c">Panel C</TabsPanel>
    </Tabs>
  `,
});

describe("Tabs (Vue)", () => {
  it("renders the default panel", () => {
    const wrapper = mount(Suite);
    expect(wrapper.find('[role="tabpanel"]').text()).toBe("Panel A");
  });

  it("clicking a trigger switches the active panel", async () => {
    const wrapper = mount(Suite);
    const triggers = wrapper.findAll('[role="tab"]');
    await triggers[1].trigger("click");
    expect(wrapper.find('[role="tabpanel"]').text()).toBe("Panel B");
  });

  it("ArrowRight cycles to the next tab", async () => {
    const wrapper = mount(Suite);
    const list = wrapper.find('[role="tablist"]');
    await list.trigger("keydown", { key: "ArrowRight" });
    expect(wrapper.find('[role="tabpanel"]').text()).toBe("Panel B");
  });

  it("Home jumps to the first tab", async () => {
    const wrapper = mount(Suite);
    const list = wrapper.find('[role="tablist"]');
    const triggers = wrapper.findAll('[role="tab"]');
    await triggers[2].trigger("click");
    expect(wrapper.find('[role="tabpanel"]').text()).toBe("Panel C");
    await list.trigger("keydown", { key: "Home" });
    expect(wrapper.find('[role="tabpanel"]').text()).toBe("Panel A");
  });
});
