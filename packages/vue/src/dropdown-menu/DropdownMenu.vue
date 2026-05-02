<script setup lang="ts">
/**
 * DropdownMenu — Vue 3 binding. Click trigger + portal-mounted menu list
 * with keyboard navigation, escape, and outside-click close.
 */
import { computePosition, type Placement } from "@sisyphos-ui/core/internal";
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from "vue";
import { useEscapeKey, useOutsideClick } from "../composables";
import type { DropdownMenuAction, DropdownMenuItem } from "./types";

interface Props {
  items: DropdownMenuItem[];
  placement?: Placement;
  offset?: number;
  open?: boolean;
  defaultOpen?: boolean;
  /** Called when scrolling reaches the end (within `scrollEndThreshold` px). */
  scrollEndThreshold?: number;
  maxHeight?: number | string;
  emptyState?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placement: "bottom-start",
  offset: 6,
  defaultOpen: false,
  scrollEndThreshold: 24,
});

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "scrollEnd"): void;
}>();

const menuId = `sisyphos-dropdown-menu-${useId()}`;
const anchorWrapperRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLDivElement | null>(null);

const internalOpen = ref(props.defaultOpen);
const isControlled = computed(() => props.open !== undefined);
const isOpen = computed(() => (isControlled.value ? props.open! : internalOpen.value));
const visible = computed(() => isOpen.value && !props.disabled);

const pos = ref<{ left: number; top: number; placement: Placement } | null>(null);
const activeIndex = ref(-1);

const actionItems = computed(() =>
  props.items
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => (item.type ?? "action") === "action") as { item: DropdownMenuAction; idx: number }[]
);

function setOpen(next: boolean) {
  if (!isControlled.value) internalOpen.value = next;
  emit("update:open", next);
  if (next) {
    activeIndex.value = -1;
  }
}

useEscapeKey(() => setOpen(false), visible);
useOutsideClick([anchorWrapperRef, menuRef], () => setOpen(false), visible);

async function updatePosition() {
  if (!visible.value) return;
  await nextTick();
  const anchor = anchorWrapperRef.value?.firstElementChild as HTMLElement | null;
  const menu = menuRef.value;
  if (!anchor || !menu) return;
  const rect = anchor.getBoundingClientRect();
  pos.value = computePosition(
    rect,
    { width: menu.offsetWidth, height: menu.offsetHeight },
    props.placement,
    props.offset
  );
}

watch(visible, (v) => {
  if (v) updatePosition();
  else pos.value = null;
});

function onAnchorClick() {
  if (props.disabled) return;
  setOpen(!isOpen.value);
}

function selectAction(item: DropdownMenuAction, e: Event) {
  if (item.disabled) return;
  item.onSelect(e);
  if (item.closeOnSelect !== false) setOpen(false);
}

function handleKeyDown(e: KeyboardEvent) {
  if (!visible.value) return;
  const all = actionItems.value;
  if (all.length === 0) return;
  if (e.key === "ArrowDown") {
    e.preventDefault();
    activeIndex.value = (activeIndex.value + 1) % all.length;
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    activeIndex.value = (activeIndex.value - 1 + all.length) % all.length;
  } else if (e.key === "Home") {
    e.preventDefault();
    activeIndex.value = 0;
  } else if (e.key === "End") {
    e.preventDefault();
    activeIndex.value = all.length - 1;
  } else if (e.key === "Enter" || e.key === " ") {
    if (activeIndex.value >= 0) {
      e.preventDefault();
      selectAction(all[activeIndex.value].item, e);
    }
  }
}

function onScroll(e: Event) {
  const el = e.target as HTMLElement;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - props.scrollEndThreshold) {
    emit("scrollEnd");
  }
}

const menuStyle = computed(() => ({
  position: "fixed" as const,
  left: `${pos.value?.left ?? 0}px`,
  top: `${pos.value?.top ?? 0}px`,
  opacity: pos.value ? 1 : 0,
  maxHeight: typeof props.maxHeight === "number" ? `${props.maxHeight}px` : props.maxHeight,
}));

const menuClasses = computed(() => ["sisyphos-dropdown-menu", pos.value?.placement ?? props.placement]);

if (typeof window !== "undefined") {
  const onWindowChange = () => visible.value && updatePosition();
  window.addEventListener("scroll", onWindowChange, true);
  window.addEventListener("resize", onWindowChange);
  onBeforeUnmount(() => {
    window.removeEventListener("scroll", onWindowChange, true);
    window.removeEventListener("resize", onWindowChange);
  });
}
</script>

<template>
  <span
    ref="anchorWrapperRef"
    class="sisyphos-dropdown-anchor"
    aria-haspopup="menu"
    :aria-expanded="isOpen || undefined"
    :aria-controls="visible ? menuId : undefined"
    @click="onAnchorClick"
    @keydown="handleKeyDown"
  >
    <slot />
  </span>
  <Teleport to="body">
    <div
      v-if="visible"
      ref="menuRef"
      :id="menuId"
      role="menu"
      :class="menuClasses"
      :style="menuStyle"
      @scroll="onScroll"
      @keydown="handleKeyDown"
    >
      <template v-if="items.length === 0 && emptyState">
        <div class="sisyphos-dropdown-empty">{{ emptyState }}</div>
      </template>
      <template v-else>
        <template v-for="(item, idx) in items" :key="item.key ?? idx">
          <div v-if="item.type === 'separator'" class="sisyphos-dropdown-separator" role="separator" />
          <div v-else-if="item.type === 'label'" class="sisyphos-dropdown-label">
            {{ item.label }}
          </div>
          <button
            v-else
            type="button"
            role="menuitem"
            :class="[
              'sisyphos-dropdown-item',
              item.disabled && 'disabled',
              item.destructive && 'destructive',
              actionItems.findIndex((a) => a.idx === idx) === activeIndex && 'active',
            ]"
            :disabled="item.disabled"
            @click="selectAction(item, $event)"
          >
            <span v-if="item.icon" class="sisyphos-dropdown-item-icon"><slot name="icon" :item="item" /></span>
            <span class="sisyphos-dropdown-item-label">{{ item.label }}</span>
            <span v-if="item.shortcut" class="sisyphos-dropdown-item-shortcut">{{ item.shortcut }}</span>
          </button>
        </template>
      </template>
    </div>
  </Teleport>
</template>

<style src="./DropdownMenu.scss"></style>
