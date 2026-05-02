<script setup lang="ts">
/**
 * Tooltip — Vue 3 binding. Hover/focus tooltip mounted via `<Teleport>`
 * with auto-flip placement. Wraps a single anchor in the default slot
 * and wires `aria-describedby`.
 */
import { computePosition, type Placement } from "@sisyphos-ui/core/internal";
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from "vue";

interface Props {
  /** Tooltip content (string). Use the `content` slot for richer markup. */
  content?: string;
  /** Preferred placement; auto-flips to the opposite side if it doesn't fit. */
  placement?: Placement;
  offset?: number;
  /** Ms before showing. Defaults to 200. */
  openDelay?: number;
  /** Ms before hiding. Defaults to 100. */
  closeDelay?: number;
  arrow?: boolean;
  /** Controlled open state. */
  open?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placement: "top",
  offset: 8,
  openDelay: 200,
  closeDelay: 100,
  arrow: true,
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

const tooltipId = `sisyphos-tooltip-${useId()}`;
const anchorWrapperRef = ref<HTMLElement | null>(null);
const tooltipRef = ref<HTMLDivElement | null>(null);

const internalOpen = ref(false);
const isControlled = computed(() => props.open !== undefined);
const visible = computed(() => {
  const open = isControlled.value ? props.open! : internalOpen.value;
  return open && Boolean(props.content) && !props.disabled;
});

const pos = ref<{ left: number; top: number; placement: Placement } | null>(null);

let openTimer: ReturnType<typeof setTimeout> | null = null;
let closeTimer: ReturnType<typeof setTimeout> | null = null;
function clearTimers() {
  if (openTimer) clearTimeout(openTimer);
  if (closeTimer) clearTimeout(closeTimer);
  openTimer = null;
  closeTimer = null;
}

function cancelHide() {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
}

function setOpen(next: boolean) {
  if (!isControlled.value) internalOpen.value = next;
  emit("update:open", next);
}

function show() {
  clearTimers();
  if (props.disabled) return;
  openTimer = setTimeout(() => setOpen(true), props.openDelay);
}
function hide() {
  clearTimers();
  closeTimer = setTimeout(() => setOpen(false), props.closeDelay);
}

async function updatePosition() {
  if (!visible.value) return;
  await nextTick();
  const anchor = anchorWrapperRef.value?.firstElementChild as HTMLElement | null;
  const tooltip = tooltipRef.value;
  if (!anchor || !tooltip) return;
  const rect = anchor.getBoundingClientRect();
  pos.value = computePosition(
    rect,
    { width: tooltip.offsetWidth, height: tooltip.offsetHeight },
    props.placement,
    props.offset
  );
}

watch(visible, (v) => {
  if (v) updatePosition();
  else pos.value = null;
});

watch(
  () => [props.placement, props.offset, props.content] as const,
  () => {
    if (visible.value) updatePosition();
  }
);

function onWindowChange() {
  if (visible.value) updatePosition();
}

if (typeof window !== "undefined") {
  window.addEventListener("scroll", onWindowChange, true);
  window.addEventListener("resize", onWindowChange);
  onBeforeUnmount(() => {
    window.removeEventListener("scroll", onWindowChange, true);
    window.removeEventListener("resize", onWindowChange);
    clearTimers();
  });
}

const tooltipStyle = computed(() => ({
  position: "fixed" as const,
  left: `${pos.value?.left ?? 0}px`,
  top: `${pos.value?.top ?? 0}px`,
  opacity: pos.value ? 1 : 0,
}));

const tooltipClasses = computed(() => [
  "sisyphos-tooltip",
  pos.value?.placement ?? props.placement,
]);
</script>

<template>
  <span
    ref="anchorWrapperRef"
    class="sisyphos-tooltip-anchor"
    :aria-describedby="visible ? tooltipId : undefined"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />
  </span>
  <Teleport to="body">
    <div
      v-if="visible"
      ref="tooltipRef"
      :id="tooltipId"
      role="tooltip"
      :class="tooltipClasses"
      :style="tooltipStyle"
      @mouseenter="cancelHide"
      @mouseleave="hide"
    >
      <slot name="content">{{ content }}</slot>
      <span v-if="arrow" class="sisyphos-tooltip-arrow" aria-hidden="true" />
    </div>
  </Teleport>
</template>

<style src="./Tooltip.scss"></style>
