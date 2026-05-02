import { onBeforeUnmount, onMounted, watch, type Ref } from "vue";

/**
 * Module-level stack of active Escape handlers, mirroring the React
 * implementation in `@sisyphos-ui/core/internal`. Only the topmost entry
 * receives the Escape event so nested overlays — e.g. a Popover opened
 * inside a Dialog — close one layer at a time.
 */
type EscapeHandler = (event: KeyboardEvent) => void;
const escapeStack: EscapeHandler[] = [];
let listenerInstalled = false;

function ensureGlobalListener() {
  if (listenerInstalled || typeof document === "undefined") return;
  listenerInstalled = true;
  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    const top = escapeStack[escapeStack.length - 1];
    if (top) top(event);
  });
}

/**
 * Vue composable equivalent of the React hook in core. Pushes a stable
 * wrapper onto the shared escape stack while `enabled` is truthy.
 */
export function useEscapeKey(onEscape: EscapeHandler, enabled: Ref<boolean> | boolean = true) {
  let registered = false;
  const stable: EscapeHandler = (event) => onEscape(event);

  function attach() {
    if (registered) return;
    ensureGlobalListener();
    escapeStack.push(stable);
    registered = true;
  }
  function detach() {
    if (!registered) return;
    const idx = escapeStack.lastIndexOf(stable);
    if (idx !== -1) escapeStack.splice(idx, 1);
    registered = false;
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
