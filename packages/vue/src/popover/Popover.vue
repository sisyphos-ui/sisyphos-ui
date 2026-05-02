<script setup lang="ts">
/**
 * Popover — Vue 3 binding. Click-toggle (or hover) panel mounted via
 * `<Teleport>` with auto-flip placement. Use `Tooltip` for short hints
 * and `Popover` for richer interactive content.
 */
import { computePosition, type Placement } from "@sisyphos-ui/core/internal";
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from "vue";
import { useEscapeKey, useOutsideClick } from "../composables";

interface Props {
  placement?: Placement;
  offset?: number;
  /** `"click"` | `"hover"` | `"manual"`. */
  trigger?: "click" | "hover" | "manual";
  openDelay?: number;
  closeDelay?: number;
  arrow?: boolean;
  open?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placement: "bottom",
  offset: 8,
  trigger: "click",
  openDelay: 100,
  closeDelay: 100,
  arrow: false,
  closeOnEscape: true,
  closeOnOutsideClick: true,
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

const popoverId = `sisyphos-popover-${useId()}`;
const anchorWrapperRef = ref<HTMLElement | null>(null);
const popoverRef = ref<HTMLDivElement | null>(null);

const internalOpen = ref(false);
const isControlled = computed(() => props.open !== undefined);
const isOpen = computed(() => (isControlled.value ? props.open! : internalOpen.value));

const visible = computed(() => isOpen.value && !props.disabled);
const pos = ref<{ left: number; top: number; placement: Placement } | null>(null);

let openTimer: ReturnType<typeof setTimeout> | null = null;
let closeTimer: ReturnType<typeof setTimeout> | null = null;
function clearTimers() {
  if (openTimer) clearTimeout(openTimer);
  if (closeTimer) clearTimeout(closeTimer);
  openTimer = null;
  closeTimer = null;
}

function setOpen(next: boolean) {
  if (!isControlled.value) internalOpen.value = next;
  emit("update:open", next);
}

function toggle() {
  if (props.disabled) return;
  setOpen(!isOpen.value);
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

useEscapeKey(
  () => {
    if (props.closeOnEscape) setOpen(false);
  },
  visible
);
useOutsideClick(
  [anchorWrapperRef, popoverRef],
  () => {
    if (props.closeOnOutsideClick) setOpen(false);
  },
  visible
);

async function updatePosition() {
  if (!visible.value) return;
  await nextTick();
  const anchor = anchorWrapperRef.value?.firstElementChild as HTMLElement | null;
  const popover = popoverRef.value;
  if (!anchor || !popover) return;
  const rect = anchor.getBoundingClientRect();
  pos.value = computePosition(
    rect,
    { width: popover.offsetWidth, height: popover.offsetHeight },
    props.placement,
    props.offset
  );
}

watch(visible, (v) => {
  if (v) updatePosition();
  else pos.value = null;
});

watch(() => [props.placement, props.offset] as const, () => visible.value && updatePosition());

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

const popoverStyle = computed(() => ({
  position: "fixed" as const,
  left: `${pos.value?.left ?? 0}px`,
  top: `${pos.value?.top ?? 0}px`,
  opacity: pos.value ? 1 : 0,
}));

const popoverClasses = computed(() => [
  "sisyphos-popover",
  pos.value?.placement ?? props.placement,
]);

function onAnchorClick() {
  if (props.trigger === "click") toggle();
}
function onAnchorEnter() {
  if (props.trigger === "hover") show();
}
function onAnchorLeave() {
  if (props.trigger === "hover") hide();
}
</script>

<template>
  <span
    ref="anchorWrapperRef"
    class="sisyphos-popover-anchor"
    :aria-haspopup="trigger === 'click' ? 'dialog' : undefined"
    :aria-expanded="isOpen || undefined"
    :aria-controls="visible ? popoverId : undefined"
    @click="onAnchorClick"
    @mouseenter="onAnchorEnter"
    @mouseleave="onAnchorLeave"
  >
    <slot />
  </span>
  <Teleport to="body">
    <div
      v-if="visible"
      ref="popoverRef"
      :id="popoverId"
      role="dialog"
      :class="popoverClasses"
      :style="popoverStyle"
    >
      <slot name="content" />
      <span v-if="arrow" class="sisyphos-popover-arrow" aria-hidden="true" />
    </div>
  </Teleport>
</template>

<style src="./Popover.scss"></style>
