<script setup lang="ts">
/**
 * Card — Vue 3 binding. Surface container with optional sub-components
 * `CardHeader`, `CardBody`, `CardFooter` for structured layouts.
 */
import { computed } from "vue";

interface Props {
  variant?: "elevated" | "outlined" | "filled";
  /** Body padding when the compound sub-components are not used. */
  padding?: "none" | "sm" | "md" | "lg";
  /** Marks the whole card as focusable/clickable (role="button", tabIndex=0). */
  interactive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "elevated",
  padding: "md",
  interactive: false,
});

const rootClasses = computed(() => [
  "sisyphos-card",
  props.variant,
  `padding-${props.padding}`,
  props.interactive && "interactive",
]);
</script>

<template>
  <div
    :class="rootClasses"
    :role="interactive ? 'button' : undefined"
    :tabindex="interactive ? 0 : undefined"
  >
    <slot />
  </div>
</template>

<style src="./Card.scss"></style>
