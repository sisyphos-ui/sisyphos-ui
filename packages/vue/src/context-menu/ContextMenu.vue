<script setup lang="ts">
/**
 * ContextMenu — Vue 3 binding. Right-click menu anchored at the pointer
 * position with viewport clamping, escape, and outside-click close.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from "vue";
import { useEscapeKey, useOutsideClick } from "../composables";
import type { ContextMenuAction, ContextMenuItem } from "./types";

interface Props {
  items: ContextMenuItem[];
  /** Distance in px from the viewport edges. */
  margin?: number;
  disabled?: boolean;
  emptyState?: string;
}

const props = withDefaults(defineProps<Props>(), {
  margin: 8,
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

const menuId = `sisyphos-context-menu-${useId()}`;
const triggerWrapperRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLDivElement | null>(null);

const open = ref(false);
const pos = ref<{ left: number; top: number } | null>(null);
const activeIndex = ref(-1);

const actionItems = computed(() =>
  props.items
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => (item.type ?? "action") === "action") as { item: ContextMenuAction; idx: number }[]
);

useEscapeKey(() => close(), open);
useOutsideClick([menuRef], () => close(), open);

function close() {
  open.value = false;
  emit("update:open", false);
  pos.value = null;
}

function selectAction(item: ContextMenuAction, e: Event) {
  if (item.disabled) return;
  item.onSelect(e);
  if (item.closeOnSelect !== false) close();
}

async function openAt(x: number, y: number) {
  open.value = true;
  emit("update:open", true);
  activeIndex.value = -1;
  await nextTick();
  const menu = menuRef.value;
  if (!menu) return;
  const w = menu.offsetWidth;
  const h = menu.offsetHeight;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const m = props.margin;
  let left = x;
  let top = y;
  if (left + w + m > vw) left = vw - w - m;
  if (top + h + m > vh) top = vh - h - m;
  if (left < m) left = m;
  if (top < m) top = m;
  pos.value = { left, top };
}

function onContextMenu(e: MouseEvent) {
  if (props.disabled) return;
  e.preventDefault();
  openAt(e.clientX, e.clientY);
}

function handleKeyDown(e: KeyboardEvent) {
  if (!open.value) return;
  const all = actionItems.value;
  if (all.length === 0) return;
  if (e.key === "ArrowDown") {
    e.preventDefault();
    activeIndex.value = (activeIndex.value + 1) % all.length;
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    activeIndex.value = (activeIndex.value - 1 + all.length) % all.length;
  } else if (e.key === "Enter" || e.key === " ") {
    if (activeIndex.value >= 0) {
      e.preventDefault();
      selectAction(all[activeIndex.value].item, e);
    }
  }
}

onMounted(() => {
  if (typeof document !== "undefined") document.addEventListener("keydown", handleKeyDown);
});
onBeforeUnmount(() => {
  if (typeof document !== "undefined") document.removeEventListener("keydown", handleKeyDown);
});

const menuStyle = computed(() => ({
  position: "fixed" as const,
  left: `${pos.value?.left ?? 0}px`,
  top: `${pos.value?.top ?? 0}px`,
  opacity: pos.value ? 1 : 0,
}));
</script>

<template>
  <span
    ref="triggerWrapperRef"
    class="sisyphos-context-menu-trigger"
    @contextmenu="onContextMenu"
  >
    <slot />
  </span>
  <Teleport to="body">
    <div
      v-if="open"
      ref="menuRef"
      :id="menuId"
      role="menu"
      class="sisyphos-context-menu"
      :style="menuStyle"
    >
      <template v-if="items.length === 0 && emptyState">
        <div class="sisyphos-context-menu-empty">{{ emptyState }}</div>
      </template>
      <template v-else>
        <template v-for="(item, idx) in items" :key="item.key ?? idx">
          <div
            v-if="item.type === 'separator'"
            class="sisyphos-context-menu-separator"
            role="separator"
          />
          <div v-else-if="item.type === 'label'" class="sisyphos-context-menu-label">
            {{ item.label }}
          </div>
          <button
            v-else
            type="button"
            role="menuitem"
            :class="[
              'sisyphos-context-menu-item',
              item.disabled && 'disabled',
              item.destructive && 'destructive',
              actionItems.findIndex((a) => a.idx === idx) === activeIndex && 'active',
            ]"
            :disabled="item.disabled"
            @click="selectAction(item, $event)"
          >
            <span v-if="item.icon" class="sisyphos-context-menu-item-icon">
              <slot name="icon" :item="item" />
            </span>
            <span class="sisyphos-context-menu-item-label">{{ item.label }}</span>
            <span v-if="item.shortcut" class="sisyphos-context-menu-item-shortcut">
              {{ item.shortcut }}
            </span>
          </button>
        </template>
      </template>
    </div>
  </Teleport>
</template>

<style src="./ContextMenu.scss"></style>
