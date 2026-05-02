import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { defineComponent, ref, nextTick } from "vue";
import Popover from "./Popover.vue";

describe("Popover (Vue)", () => {
  it("renders the panel when controlled open=true", async () => {
    const wrapper = mount(Popover, {
      props: { open: true },
      slots: { default: "<button>Open</button>", content: "Panel" },
      attachTo: document.body,
    });
    await flushPromises();
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog!.textContent).toContain("Panel");
    wrapper.unmount();
  });

  it("emits update:open=true when the anchor is clicked (uncontrolled)", async () => {
    const Suite = defineComponent({
      components: { Popover },
      setup() {
        const open = ref<boolean | undefined>(undefined);
        return { open };
      },
      template: `
        <Popover @update:open="open = $event">
          <template #default><button>Open</button></template>
          <template #content>Panel</template>
        </Popover>
      `,
    });
    const wrapper = mount(Suite, { attachTo: document.body });
    await wrapper.find(".sisyphos-popover-anchor").trigger("click");
    await nextTick();
    expect(wrapper.vm.open).toBe(true);
    wrapper.unmount();
  });

  it("disabled prop blocks rendering even when open=true", async () => {
    const wrapper = mount(Popover, {
      props: { open: true, disabled: true },
      slots: { default: "<button>x</button>", content: "Panel" },
      attachTo: document.body,
    });
    await flushPromises();
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    wrapper.unmount();
  });
});
