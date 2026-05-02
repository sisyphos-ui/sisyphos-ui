<script setup lang="ts">
/**
 * Carousel — Vue 3 binding. Slot-based content with autoplay, loop,
 * arrows, and dot navigation. Mirrors the React Carousel API shape.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

interface Props {
  /** Controlled active index. */
  index?: number;
  /** Default active index (uncontrolled). */
  defaultIndex?: number;
  /** Number of slides. Required so we can render dots / aria labels. */
  count: number;
  /** Auto-advance every `autoPlayInterval` ms. */
  autoPlay?: boolean;
  /** Time between auto-advances in ms. Defaults to 5000. */
  autoPlayInterval?: number;
  /** Wrap from last to first / first to last. */
  loop?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  /** Pause autoplay on hover / focus. */
  pauseOnHover?: boolean;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  defaultIndex: 0,
  autoPlay: false,
  autoPlayInterval: 5000,
  loop: true,
  showArrows: true,
  showDots: true,
  pauseOnHover: true,
  ariaLabel: "carousel",
});

const emit = defineEmits<{
  (e: "update:index", index: number): void;
  (e: "indexChange", index: number): void;
}>();

const internal = ref(props.defaultIndex);
const current = computed(() => props.index ?? internal.value);
const paused = ref(false);

function setIndex(next: number) {
  let normalized = next;
  if (normalized < 0) normalized = props.loop ? props.count - 1 : 0;
  if (normalized >= props.count) normalized = props.loop ? 0 : props.count - 1;
  if (props.index === undefined) internal.value = normalized;
  emit("update:index", normalized);
  emit("indexChange", normalized);
}

let timer: ReturnType<typeof setInterval> | null = null;
function startAuto() {
  stopAuto();
  if (!props.autoPlay || paused.value || props.count < 2) return;
  timer = setInterval(() => setIndex(current.value + 1), props.autoPlayInterval);
}
function stopAuto() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
onMounted(startAuto);
watch(
  () => [props.autoPlay, props.autoPlayInterval, props.count, paused.value, current.value],
  startAuto
);
onBeforeUnmount(stopAuto);

const trackStyle = computed(() => ({
  transform: `translateX(-${current.value * 100}%)`,
}));
</script>

<template>
  <div
    class="sisyphos-carousel"
    role="region"
    :aria-roledescription="ariaLabel"
    @mouseenter="pauseOnHover && (paused = true)"
    @mouseleave="pauseOnHover && (paused = false)"
    @focusin="pauseOnHover && (paused = true)"
    @focusout="pauseOnHover && (paused = false)"
  >
    <div class="sisyphos-carousel-viewport">
      <div class="sisyphos-carousel-track" :style="trackStyle">
        <slot />
      </div>
    </div>
    <button
      v-if="showArrows && count > 1"
      type="button"
      class="sisyphos-carousel-arrow start"
      aria-label="Previous slide"
      @click="setIndex(current - 1)"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M15 18L9 12L15 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <button
      v-if="showArrows && count > 1"
      type="button"
      class="sisyphos-carousel-arrow end"
      aria-label="Next slide"
      @click="setIndex(current + 1)"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M9 18L15 12L9 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <div v-if="showDots && count > 1" class="sisyphos-carousel-dots" role="tablist" aria-label="Slide selector">
      <button
        v-for="i in count"
        :key="i - 1"
        type="button"
        role="tab"
        :aria-selected="i - 1 === current"
        :aria-label="`Go to slide ${i}`"
        :class="['sisyphos-carousel-dot', i - 1 === current && 'active']"
        @click="setIndex(i - 1)"
      />
    </div>
  </div>
</template>

<style src="./Carousel.scss"></style>
