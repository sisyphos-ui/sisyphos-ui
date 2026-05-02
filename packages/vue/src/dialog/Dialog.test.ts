import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, ref } from "vue";
import Dialog from "./Dialog.vue";
import DialogHeader from "./DialogHeader.vue";
import DialogTitle from "./DialogTitle.vue";
import DialogBody from "./DialogBody.vue";

const Suite = defineComponent({
  components: { Dialog, DialogHeader, DialogTitle, DialogBody },
  setup() {
    const open = ref(false);
    return { open };
  },
  template: `
    <button class="trigger" @click="open = true">Open</button>
    <Dialog :open="open" @update:open="open = $event">
      <DialogHeader>
        <DialogTitle>My dialog</DialogTitle>
      </DialogHeader>
      <DialogBody>Body content</DialogBody>
    </Dialog>
  `,
});

describe("Dialog (Vue)", () => {
  it("renders only when open=true", async () => {
    const wrapper = mount(Suite, { attachTo: document.body });
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    await wrapper.find("button.trigger").trigger("click");
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    expect(document.querySelector('[role="dialog"]')?.textContent).toContain("Body content");
    wrapper.unmount();
  });

  it("emits update:open=false on Escape when closeOnEscape=true", async () => {
    const onUpdateOpen = vi.fn();
    const wrapper = mount(Dialog, {
      props: { open: true },
      attrs: { "onUpdate:open": onUpdateOpen },
      slots: { default: "<div>Body</div>" },
      attachTo: document.body,
    });
    await new Promise((r) => setTimeout(r, 0));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(onUpdateOpen).toHaveBeenCalledWith(false);
    wrapper.unmount();
  });

  it("aria-labelledby points to DialogTitle id", async () => {
    const wrapper = mount(Suite, { attachTo: document.body });
    await wrapper.find("button.trigger").trigger("click");
    const dialogEl = document.querySelector('[role="dialog"]') as HTMLElement;
    const labelId = dialogEl.getAttribute("aria-labelledby");
    expect(labelId).toBeTruthy();
    expect(document.getElementById(labelId!)?.textContent).toBe("My dialog");
    wrapper.unmount();
  });
});
