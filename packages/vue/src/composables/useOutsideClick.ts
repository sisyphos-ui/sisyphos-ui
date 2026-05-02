import { onBeforeUnmount, onMounted, watch, type Ref } from "vue";

/**
 * Vue composable that fires `handler` when a mousedown happens outside
 * of every supplied element. Equivalent to `useOutsideClick` in
 * `@sisyphos-ui/core/internal`.
 */
export function useOutsideClick(
  refs: Ref<HTMLElement | null>[],
  handler: (event: MouseEvent) => void,
  enabled: Ref<boolean> | boolean = true
) {
  let attached = false;

  function listener(event: MouseEvent) {
    const target = event.target as Node | null;
    if (!target) return;
    for (const r of refs) {
      const el = r.value;
      if (el && el.contains(target)) return;
    }
    handler(event);
  }

  function attach() {
    if (attached || typeof document === "undefined") return;
    document.addEventListener("mousedown", listener);
    attached = true;
  }
  function detach() {
    if (!attached) return;
    document.removeEventListener("mousedown", listener);
    attached = false;
  }

  if (typeof enabled === "boolean") {
    if (enabled) onMounted(attach);
    onBeforeUnmount(detach);
  } else {
    onMounted(() => {
      if (enabled.value) attach();
    });
    watch(enabled, (v) => {
      if (v) attach();
      else detach();
    });
    onBeforeUnmount(detach);
  }
}
