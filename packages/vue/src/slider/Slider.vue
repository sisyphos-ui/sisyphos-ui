<script setup lang="ts">
/**
 * Slider — Vue 3 binding. Single thumb (number) or range ([min, max]),
 * mouse + touch + keyboard support, step snapping.
 */
import { computed, ref } from "vue";

interface Props {
  modelValue?: number | [number, number];
  min?: number;
  max?: number;
  step?: number;
  /** Range mode — modelValue must be a tuple. */
  range?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "success" | "error" | "warning" | "info";
  showValue?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  ariaLabelMin?: string;
  ariaLabelMax?: string;
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  range: false,
  size: "md",
  color: "primary",
  showValue: false,
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: number | [number, number]): void;
}>();

const trackRef = ref<HTMLDivElement | null>(null);
const dragging = ref<"single" | "min" | "max" | null>(null);

const single = computed<number>(() =>
  props.range ? 0 : (props.modelValue as number) ?? props.min
);
const minVal = computed<number>(() =>
  props.range ? (props.modelValue as [number, number])?.[0] ?? props.min : props.min
);
const maxVal = computed<number>(() =>
  props.range ? (props.modelValue as [number, number])?.[1] ?? props.max : props.max
);

function snap(v: number): number {
  const stepped = Math.round((v - props.min) / props.step) * props.step + props.min;
  return Math.min(props.max, Math.max(props.min, stepped));
}

function pct(v: number): number {
  return ((v - props.min) / (props.max - props.min)) * 100;
}

function setSingle(v: number) {
  emit("update:modelValue", snap(v));
}
function setRange(next: [number, number]) {
  const sorted: [number, number] = next[0] <= next[1] ? next : [next[1], next[0]];
  emit("update:modelValue", [snap(sorted[0]), snap(sorted[1])]);
}

function pointerToValue(clientX: number): number {
  const track = trackRef.value;
  if (!track) return props.min;
  const rect = track.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  return props.min + ratio * (props.max - props.min);
}

function startDrag(target: "single" | "min" | "max", e: PointerEvent) {
  if (props.disabled) return;
  dragging.value = target;
  (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
}
function onPointerMove(e: PointerEvent) {
  if (!dragging.value || props.disabled) return;
  const v = pointerToValue(e.clientX);
  if (dragging.value === "single") setSingle(v);
  else if (dragging.value === "min") setRange([v, maxVal.value]);
  else if (dragging.value === "max") setRange([minVal.value, v]);
}
function onPointerUp() {
  dragging.value = null;
}

function onKey(target: "single" | "min" | "max", e: KeyboardEvent) {
  if (props.disabled) return;
  let delta = 0;
  if (e.key === "ArrowRight" || e.key === "ArrowUp") delta = props.step;
  else if (e.key === "ArrowLeft" || e.key === "ArrowDown") delta = -props.step;
  else if (e.key === "PageUp") delta = props.step * 10;
  else if (e.key === "PageDown") delta = -props.step * 10;
  else if (e.key === "Home") {
    if (target === "single") setSingle(props.min);
    else if (target === "min") setRange([props.min, maxVal.value]);
    else setRange([minVal.value, props.min]);
    e.preventDefault();
    return;
  } else if (e.key === "End") {
    if (target === "single") setSingle(props.max);
    else if (target === "min") setRange([props.max, maxVal.value]);
    else setRange([minVal.value, props.max]);
    e.preventDefault();
    return;
  } else {
    return;
  }
  e.preventDefault();
  if (target === "single") setSingle(single.value + delta);
  else if (target === "min") setRange([minVal.value + delta, maxVal.value]);
  else setRange([minVal.value, maxVal.value + delta]);
}

const rootClasses = computed(() => [
  "sisyphos-slider",
  props.size,
  props.color,
  props.disabled && "disabled",
  props.range && "range",
]);
</script>

<template>
  <div :class="rootClasses">
    <div
      ref="trackRef"
      class="sisyphos-slider-track"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <div
        v-if="!range"
        class="sisyphos-slider-fill"
        :style="{ width: `${pct(single)}%` }"
      />
      <div
        v-else
        class="sisyphos-slider-fill"
        :style="{
          left: `${pct(minVal)}%`,
          width: `${pct(maxVal) - pct(minVal)}%`,
        }"
      />
      <button
        v-if="!range"
        type="button"
        class="sisyphos-slider-thumb"
        role="slider"
        :aria-valuenow="single"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-label="ariaLabel"
        :aria-disabled="disabled || undefined"
        :tabindex="disabled ? -1 : 0"
        :style="{ left: `${pct(single)}%` }"
        @pointerdown="(e) => startDrag('single', e as PointerEvent)"
        @keydown="(e) => onKey('single', e)"
      />
      <template v-else>
        <button
          type="button"
          class="sisyphos-slider-thumb sisyphos-slider-thumb-min"
          role="slider"
          :aria-valuenow="minVal"
          :aria-valuemin="min"
          :aria-valuemax="max"
          :aria-label="ariaLabelMin ?? 'Minimum'"
          :tabindex="disabled ? -1 : 0"
          :style="{ left: `${pct(minVal)}%` }"
          @pointerdown="(e) => startDrag('min', e as PointerEvent)"
          @keydown="(e) => onKey('min', e)"
        />
        <button
          type="button"
          class="sisyphos-slider-thumb sisyphos-slider-thumb-max"
          role="slider"
          :aria-valuenow="maxVal"
          :aria-valuemin="min"
          :aria-valuemax="max"
          :aria-label="ariaLabelMax ?? 'Maximum'"
          :tabindex="disabled ? -1 : 0"
          :style="{ left: `${pct(maxVal)}%` }"
          @pointerdown="(e) => startDrag('max', e as PointerEvent)"
          @keydown="(e) => onKey('max', e)"
        />
      </template>
    </div>
    <div v-if="showValue" class="sisyphos-slider-value">
      <template v-if="!range">{{ single }}</template>
      <template v-else>{{ minVal }} – {{ maxVal }}</template>
    </div>
  </div>
</template>

<style src="./Slider.scss"></style>
