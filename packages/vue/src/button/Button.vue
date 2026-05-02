<script setup lang="ts">
/**
 * Button — Vue 3 binding. Variant + color + size + loading + icons +
 * polymorphic href. Dropdown menu is deferred to Session 4 (depends on
 * the upcoming overlay primitives).
 */
import { computed } from "vue";

interface Props {
  variant?: "contained" | "outlined" | "text" | "soft";
  color?: "primary" | "success" | "error" | "warning" | "info";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  radius?: "xs" | "sm" | "md" | "lg" | "full";
  /** When set, renders an anchor instead of a button. */
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  loadingPosition?: "start" | "end";
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "contained",
  color: "primary",
  size: "md",
  type: "button",
  disabled: false,
  loading: false,
  loadingPosition: "start",
  fullWidth: false,
});

const tag = computed(() => (props.href ? "a" : "button"));

const isDisabled = computed(() => props.disabled || props.loading);

const rootClasses = computed(() => [
  "sisyphos-button",
  props.variant,
  props.color,
  props.size,
  props.radius && `radius-${props.radius}`,
  props.fullWidth && "full-width",
  props.loading && "loading",
  isDisabled.value && "disabled",
]);
</script>

<template>
  <component
    :is="tag"
    :class="rootClasses"
    :type="tag === 'button' ? type : undefined"
    :href="href"
    :disabled="tag === 'button' ? isDisabled : undefined"
    :aria-disabled="isDisabled || undefined"
    :aria-busy="loading || undefined"
  >
    <span
      v-if="loading && loadingPosition === 'start'"
      class="sisyphos-button-spinner"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" width="1em" height="1em">
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-dasharray="40"
          stroke-dashoffset="20"
        />
      </svg>
    </span>
    <span v-if="$slots.startIcon" class="sisyphos-button-icon sisyphos-button-icon-start">
      <slot name="startIcon" />
    </span>
    <span class="sisyphos-button-label">
      <slot />
    </span>
    <span v-if="$slots.endIcon" class="sisyphos-button-icon sisyphos-button-icon-end">
      <slot name="endIcon" />
    </span>
    <span
      v-if="loading && loadingPosition === 'end'"
      class="sisyphos-button-spinner"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" width="1em" height="1em">
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-dasharray="40"
          stroke-dashoffset="20"
        />
      </svg>
    </span>
  </component>
</template>

<style src="./Button.scss"></style>
