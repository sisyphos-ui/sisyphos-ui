<script setup lang="ts">
/**
 * EmptyState — Vue 3 binding. Slots for icon / title / description /
 * actions plus three layout dimensions (size, variant, bordered).
 */
import { computed } from "vue";

interface Props {
  /** Title rendered as a heading. Use the `title` slot for richer markup. */
  title?: string;
  /** Description rendered as a paragraph. Use the `description` slot for richer markup. */
  description?: string;
  size?: "sm" | "md" | "lg";
  /** Dashed border + subtle background. Defaults to `false`. */
  bordered?: boolean;
  /** Layout mode. `block` (default) is vertical, `inline` is a compact row. */
  variant?: "block" | "inline";
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  bordered: false,
  variant: "block",
});

const rootClasses = computed(() => [
  "sisyphos-empty-state",
  props.size,
  props.variant,
  props.bordered && "bordered",
]);
</script>

<template>
  <div role="status" :class="rootClasses">
    <div v-if="$slots.icon" class="sisyphos-empty-state-icon" aria-hidden="true">
      <slot name="icon" />
    </div>
    <h3 v-if="title || $slots.title" class="sisyphos-empty-state-title">
      <slot name="title">{{ title }}</slot>
    </h3>
    <p v-if="description || $slots.description" class="sisyphos-empty-state-description">
      <slot name="description">{{ description }}</slot>
    </p>
    <slot />
    <div v-if="$slots.actions" class="sisyphos-empty-state-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style src="./EmptyState.scss"></style>
