<script setup lang="ts">
/**
 * Skeleton — Vue 3 binding. Loading placeholder with shape + animation.
 */
import { computed } from "vue";

interface Props {
  shape?: "rectangular" | "circular" | "text";
  animation?: "shimmer" | "pulse" | "none";
  width?: number | string;
  height?: number | string;
  radius?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  shape: "rectangular",
  animation: "shimmer",
});

function toSize(v: number | string | undefined): string | undefined {
  if (v === undefined) return undefined;
  return typeof v === "number" ? `${v}px` : v;
}

const rootClasses = computed(() => [
  "sisyphos-skeleton",
  `shape-${props.shape}`,
  `animation-${props.animation}`,
]);

const rootStyle = computed(() => {
  const style: Record<string, string | undefined> = {
    width: toSize(props.width),
    height: toSize(props.height) ?? (props.shape === "text" ? "1em" : undefined),
    borderRadius: props.shape === "circular" ? "50%" : toSize(props.radius),
  };
  // Remove undefined entries so Vue doesn't emit empty inline-style attrs.
  for (const key of Object.keys(style)) if (style[key] === undefined) delete style[key];
  return style;
});
</script>

<template>
  <span aria-hidden="true" :class="rootClasses" :style="rootStyle">
    <slot />
  </span>
</template>

<style src="./Skeleton.scss"></style>
