<script setup lang="ts">
/**
 * Alert — Vue 3 binding. Static inline callout with semantic colors,
 * default icons, optional close button, and optional auto-dismiss.
 */
import { computed, onMounted, onUnmounted, watch } from "vue";

interface Props {
  variant?: "contained" | "outlined" | "soft";
  color?: "primary" | "success" | "error" | "warning" | "info";
  title?: string;
  description?: string;
  /** When set, auto-dismiss after this many ms (requires `closable` and `onClose`). */
  autoCloseDuration?: number;
  /** When true, renders a close button that emits `close`. */
  closable?: boolean;
  /** aria-label for the close button. */
  closeAriaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "soft",
  color: "info",
  closable: false,
  closeAriaLabel: "Close",
});

const emit = defineEmits<{
  (e: "close"): void;
}>();

const role = computed(() => (props.color === "error" ? "alert" : "status"));

const rootClasses = computed(() => ["sisyphos-alert", props.variant, props.color]);

let autoCloseTimer: ReturnType<typeof setTimeout> | null = null;
function startAutoClose() {
  if (autoCloseTimer) clearTimeout(autoCloseTimer);
  if (props.autoCloseDuration && props.closable) {
    autoCloseTimer = setTimeout(() => emit("close"), props.autoCloseDuration);
  }
}
onMounted(startAutoClose);
watch(() => props.autoCloseDuration, startAutoClose);
onUnmounted(() => {
  if (autoCloseTimer) clearTimeout(autoCloseTimer);
});
</script>

<template>
  <div :role="role" :class="rootClasses">
    <span v-if="$slots.icon" class="sisyphos-alert-icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <div class="sisyphos-alert-content">
      <div v-if="title || $slots.title" class="sisyphos-alert-title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="description || $slots.description" class="sisyphos-alert-description">
        <slot name="description">{{ description }}</slot>
      </div>
      <slot />
      <div v-if="$slots.actions" class="sisyphos-alert-actions">
        <slot name="actions" />
      </div>
    </div>
    <button
      v-if="closable"
      type="button"
      class="sisyphos-alert-close"
      :aria-label="closeAriaLabel"
      @click="emit('close')"
    >
      <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
        <path
          d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
          fill="currentColor"
        />
      </svg>
    </button>
  </div>
</template>

<style src="./Alert.scss"></style>
