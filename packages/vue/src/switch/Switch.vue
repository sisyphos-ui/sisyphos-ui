<script setup lang="ts">
/**
 * Switch — Vue 3 binding. Always controlled; toggle dispatched as
 * `update:checked` (v-model:checked) plus a sibling `change` event.
 */
import { computed } from "vue";

interface Props {
  /** Current checked state. */
  checked: boolean;
  /** Semantic color used when checked. */
  color?: "neutral" | "primary" | "success" | "error" | "warning" | "info";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  /** Required when no adjacent visible label exists. */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  color: "primary",
  size: "md",
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:checked", checked: boolean): void;
  (e: "change", checked: boolean): void;
}>();

const switchClasses = computed(() => [
  "sisyphos-switch",
  props.color,
  props.size,
  props.checked ? "checked" : "unchecked",
  props.disabled && "disabled",
]);

function toggle() {
  if (props.disabled) return;
  const next = !props.checked;
  emit("update:checked", next);
  emit("change", next);
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    toggle();
  }
}
</script>

<template>
  <button
    type="button"
    role="switch"
    :class="switchClasses"
    :aria-checked="checked"
    :aria-label="ariaLabel"
    :aria-disabled="disabled || undefined"
    :disabled="disabled"
    @click="toggle"
    @keydown="handleKeyDown"
  >
    <span class="sisyphos-switch-track">
      <span class="sisyphos-switch-thumb"></span>
    </span>
  </button>
</template>

<style src="./Switch.scss"></style>
