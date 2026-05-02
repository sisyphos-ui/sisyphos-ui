<script setup lang="ts">
/**
 * Avatar — Vue 3 binding. Image with graceful fallback to initials or
 * custom slot. Mirrors the React binding's `getInitials` rule exactly.
 */
import { computed, ref, watch } from "vue";

interface Props {
  /** Image source. Falls back to initials/slot when omitted or on load error. */
  src?: string;
  /** Alt text. Required when `src` is set for accessibility. */
  alt?: string;
  /** Display name — used to derive initials when `src` is missing/errored. */
  name?: string;
  /** Max initials derived from `name`. Defaults to 2. */
  initialsMax?: number;
  /** Override fallback content (string). Use the default slot for richer markup. */
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Semantic color applied to the fallback background. */
  color?: "primary" | "success" | "error" | "warning" | "info" | "neutral";
  /** Shape variant. `circular` (default), `rounded`, `square`. */
  shape?: "circular" | "rounded" | "square";
}

const props = withDefaults(defineProps<Props>(), {
  initialsMax: 2,
  size: "md",
  color: "neutral",
  shape: "circular",
});

function getInitials(name: string | undefined, max: number): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  return parts
    .slice(0, max)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

const imgFailed = ref(false);
watch(
  () => props.src,
  () => {
    imgFailed.value = false;
  }
);

const showImage = computed(() => Boolean(props.src) && !imgFailed.value);
const initials = computed(() => getInitials(props.name, props.initialsMax));

const rootClasses = computed(() => [
  "sisyphos-avatar",
  props.size,
  props.color,
  props.shape,
]);
</script>

<template>
  <span :class="rootClasses">
    <img
      v-if="showImage"
      class="sisyphos-avatar-image"
      :src="src"
      :alt="alt ?? name ?? ''"
      draggable="false"
      @error="imgFailed = true"
    />
    <span v-else class="sisyphos-avatar-fallback" :aria-label="alt ?? name">
      <slot>{{ fallback ?? initials }}</slot>
    </span>
  </span>
</template>

<style src="./Avatar.scss"></style>
