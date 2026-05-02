<script setup lang="ts">
/**
 * Spinner — Vue 3 binding. Inline SVG (no Firefox seam) + role="status".
 */
import { computed } from "vue";

interface Props {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Stroke color. `"inherit"` uses currentColor (useful inside buttons). */
  color?: "primary" | "success" | "error" | "warning" | "info" | "neutral" | "inherit";
  /** Ring thickness in px. Defaults to 3. */
  thickness?: number;
  /** `"ring"` (single arc) or `"double"` (outer + counter-rotating inner). */
  variant?: "ring" | "double";
  /** Accessible label announced to screen readers. Defaults to "Loading". */
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  color: "primary",
  thickness: 3,
  variant: "ring",
  label: "Loading",
});

const VIEWBOX = 50;
const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC_OUTER = CIRCUMFERENCE * 0.25;
const ARC_INNER = CIRCUMFERENCE * 0.3;

const rootClasses = computed(() => ["sisyphos-spinner", props.size, props.color, props.variant]);

const rootStyle = computed(() => ({
  ["--sisyphos-spinner-thickness" as string]: `${props.thickness}px`,
}));
</script>

<template>
  <span role="status" :aria-label="label" :class="rootClasses" :style="rootStyle">
    <svg
      class="sisyphos-spinner-svg"
      :viewBox="`0 0 ${VIEWBOX} ${VIEWBOX}`"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        class="sisyphos-spinner-arc"
        :cx="VIEWBOX / 2"
        :cy="VIEWBOX / 2"
        :r="RADIUS"
        fill="none"
        stroke-linecap="round"
        :stroke-dasharray="`${ARC_OUTER} ${CIRCUMFERENCE}`"
        :pathLength="CIRCUMFERENCE"
      />
    </svg>
    <svg
      v-if="variant === 'double'"
      class="sisyphos-spinner-svg sisyphos-spinner-svg--inner"
      :viewBox="`0 0 ${VIEWBOX} ${VIEWBOX}`"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        class="sisyphos-spinner-arc sisyphos-spinner-arc--inner"
        :cx="VIEWBOX / 2"
        :cy="VIEWBOX / 2"
        :r="RADIUS"
        fill="none"
        stroke-linecap="round"
        :stroke-dasharray="`${ARC_INNER} ${CIRCUMFERENCE}`"
        :pathLength="CIRCUMFERENCE"
      />
    </svg>
  </span>
</template>

<style src="./Spinner.scss"></style>
