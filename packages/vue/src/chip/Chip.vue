<script setup lang="ts">
/**
 * Chip — Vue 3 binding. Compact label with optional avatar/icon slots and
 * an independent delete button. The delete click does not bubble to the
 * chip itself.
 */
import { computed } from "vue";

interface Props {
  variant?: "contained" | "outlined" | "soft";
  color?: "primary" | "success" | "error" | "warning" | "info";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Border radius. Defaults to `full` (pill). */
  radius?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  disabled?: boolean;
  /** When set, the chip itself becomes activatable (button semantics + Enter/Space). */
  clickable?: boolean;
  /** Whether a delete button is rendered. Toggles via `onDelete` listener too. */
  deletable?: boolean;
  /** aria-label for the delete button. Defaults to "Remove". */
  deleteAriaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "contained",
  color: "primary",
  size: "md",
  radius: "full",
  disabled: false,
  clickable: false,
  deletable: false,
  deleteAriaLabel: "Remove",
});

const emit = defineEmits<{
  (e: "click", event: MouseEvent | KeyboardEvent): void;
  (e: "delete", event: MouseEvent): void;
}>();

const isInteractive = computed(() => props.clickable && !props.disabled);
const hasDelete = computed(() => props.deletable);

const rootClasses = computed(() => [
  "sisyphos-chip",
  props.variant,
  props.color,
  props.size,
  props.radius === "full" ? "radius-full" : `radius-${props.radius}`,
  props.disabled && "disabled",
  isInteractive.value && "clickable",
  hasDelete.value && "has-delete",
]);

function handleClick(event: MouseEvent) {
  if (!isInteractive.value) return;
  emit("click", event);
}

function handleKeyDown(event: KeyboardEvent) {
  if (!isInteractive.value) return;
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    emit("click", event);
  }
}

function handleDelete(event: MouseEvent) {
  event.stopPropagation();
  if (props.disabled) return;
  emit("delete", event);
}
</script>

<template>
  <div
    :class="rootClasses"
    :role="isInteractive ? 'button' : undefined"
    :tabindex="isInteractive ? 0 : undefined"
    :aria-disabled="disabled || undefined"
    @click="handleClick"
    @keydown="handleKeyDown"
  >
    <span v-if="$slots.avatar" class="sisyphos-chip-avatar">
      <slot name="avatar" />
    </span>
    <span v-else-if="$slots.startIcon" class="sisyphos-chip-icon sisyphos-chip-icon-start">
      <slot name="startIcon" />
    </span>
    <span class="sisyphos-chip-label">
      <slot />
    </span>
    <span
      v-if="$slots.endIcon && !hasDelete"
      class="sisyphos-chip-icon sisyphos-chip-icon-end"
    >
      <slot name="endIcon" />
    </span>
    <button
      v-if="hasDelete"
      type="button"
      class="sisyphos-chip-delete"
      :aria-label="deleteAriaLabel"
      :disabled="disabled"
      @click="handleDelete"
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

<style src="./Chip.scss"></style>
