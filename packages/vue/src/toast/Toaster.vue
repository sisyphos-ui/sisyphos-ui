<script setup lang="ts">
/**
 * Toaster — Vue 3 binding. Subscribes to the framework-agnostic
 * toastStore and renders the active queue via `<Teleport to="body">`.
 *
 * Mount one `<Toaster />` near the root of your app, then call the
 * imperative `toast()` API from anywhere.
 */
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { toastStore, type ToastRecord } from "./store";

export type ToasterPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

interface Props {
  position?: ToasterPosition;
  /** Maximum number of toasts visible at once. Older toasts are kept queued. */
  max?: number;
  /** Vertical gap between toasts in px. */
  gap?: number;
}

const props = withDefaults(defineProps<Props>(), {
  position: "bottom-right",
  max: 5,
  gap: 8,
});

const toasts = ref<ToastRecord[]>([]);
let unsubscribe: (() => void) | null = null;
const timers = new Map<string, ReturnType<typeof setTimeout>>();

function scheduleDismiss(t: ToastRecord) {
  if (timers.has(t.id)) return;
  if (!Number.isFinite(t.duration)) return;
  const timer = setTimeout(() => toastStore.dismiss(t.id), t.duration);
  timers.set(t.id, timer);
}

onMounted(() => {
  unsubscribe = toastStore.subscribe((next) => {
    // Schedule dismiss for any newly-arrived toast.
    for (const t of next) scheduleDismiss(t);
    // Cancel timers for toasts that no longer exist.
    for (const [id, timer] of timers) {
      if (!next.some((t) => t.id === id)) {
        clearTimeout(timer);
        timers.delete(id);
      }
    }
    toasts.value = next;
  });
});
onBeforeUnmount(() => {
  unsubscribe?.();
  for (const timer of timers.values()) clearTimeout(timer);
  timers.clear();
});

const visible = computed(() => toasts.value.slice(-props.max));

const containerStyle = computed(() => ({ gap: `${props.gap}px` }));
</script>

<template>
  <Teleport to="body">
    <div
      :class="['sisyphos-toaster', position]"
      :style="containerStyle"
      role="region"
      aria-label="Notifications"
    >
      <div
        v-for="t in visible"
        :key="t.id"
        :class="['sisyphos-toast', t.type]"
        role="status"
        :aria-live="t.type === 'error' ? 'assertive' : 'polite'"
      >
        <div class="sisyphos-toast-body">
          <div v-if="t.title" class="sisyphos-toast-title">{{ t.title }}</div>
          <div v-if="t.description" class="sisyphos-toast-description">{{ t.description }}</div>
        </div>
        <button
          v-if="t.dismissible"
          type="button"
          class="sisyphos-toast-close"
          aria-label="Dismiss"
          @click="toastStore.dismiss(t.id)"
        >
          <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
            <path
              d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style src="./Toast.scss"></style>
