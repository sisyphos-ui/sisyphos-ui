<script setup lang="ts">
/**
 * Button — Vue 3 binding. Variant + color + size + loading + icons +
 * polymorphic href. Class names, ARIA, and visual structure mirror the
 * React and Angular bindings.
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
  loadingPosition?: "start" | "center" | "end";
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

// In `center` loading mode the spinner replaces the label, matching React.
const showText = computed(() => !props.loading || props.loadingPosition !== "center");

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

const spinnerClass = (position: "start" | "center" | "end") =>
  `sisyphos-button-loading-spinner sisyphos-button-loading-spinner--${position}`;
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
    <span v-if="loading && loadingPosition === 'start'" :class="spinnerClass('start')" aria-hidden="true">
      <svg class="sisyphos-button-loading-spinner-svg" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-dasharray="32"
          stroke-dashoffset="12"
        />
      </svg>
    </span>
    <span
      v-if="!loading && $slots.startIcon"
      class="sisyphos-button-icon sisyphos-button-icon--start"
    >
      <slot name="startIcon" />
    </span>
    <span v-if="showText" class="sisyphos-button-text">
      <slot />
    </span>
    <span v-if="loading && loadingPosition === 'center'" :class="spinnerClass('center')" aria-hidden="true">
      <svg class="sisyphos-button-loading-spinner-svg" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-dasharray="32"
          stroke-dashoffset="12"
        />
      </svg>
    </span>
    <span v-if="loading && loadingPosition === 'end'" :class="spinnerClass('end')" aria-hidden="true">
      <svg class="sisyphos-button-loading-spinner-svg" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-dasharray="32"
          stroke-dashoffset="12"
        />
      </svg>
    </span>
    <span
      v-if="!loading && $slots.endIcon"
      class="sisyphos-button-icon sisyphos-button-icon--end"
    >
      <slot name="endIcon" />
    </span>
  </component>
</template>

<style src="./Button.scss"></style>
