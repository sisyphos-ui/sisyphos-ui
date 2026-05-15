<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { useTabs } from "./context";

const tabs = useTabs();
const listRef = ref<HTMLDivElement | null>(null);
const indicator = ref<{ x: number; y: number; width: number; height: number } | null>(null);

function measureIndicator() {
  const list = listRef.value;
  if (!list) return;
  const active = list.querySelector<HTMLButtonElement>(
    `[data-sisyphos-tab-value="${tabs.value.value}"]`
  );
  if (!active) {
    indicator.value = null;
    return;
  }
  const aRect = active.getBoundingClientRect();
  const lRect = list.getBoundingClientRect();
  indicator.value = {
    x: aRect.left - lRect.left + list.scrollLeft,
    y: aRect.top - lRect.top + list.scrollTop,
    width: aRect.width,
    height: aRect.height,
  };
}

let observer: ResizeObserver | null = null;
watch(
  listRef,
  (el) => {
    observer?.disconnect();
    observer = null;
    if (!el) return;
    measureIndicator();
    if (typeof ResizeObserver === "undefined") return;
    observer = new ResizeObserver(() => measureIndicator());
    observer.observe(el);
  },
  { flush: "post" }
);
watch(() => tabs.value.value, () => measureIndicator(), { flush: "post" });
onBeforeUnmount(() => observer?.disconnect());

function handleKeyDown(e: KeyboardEvent) {
  const all = tabs.values();
  if (all.length === 0) return;
  const idx = all.indexOf(tabs.value.value);
  let nextIdx = idx;
  const horizontal = tabs.orientation === "horizontal";
  if ((horizontal && e.key === "ArrowRight") || (!horizontal && e.key === "ArrowDown")) {
    e.preventDefault();
    nextIdx = (idx + 1) % all.length;
  } else if ((horizontal && e.key === "ArrowLeft") || (!horizontal && e.key === "ArrowUp")) {
    e.preventDefault();
    nextIdx = (idx - 1 + all.length) % all.length;
  } else if (e.key === "Home") {
    e.preventDefault();
    nextIdx = 0;
  } else if (e.key === "End") {
    e.preventDefault();
    nextIdx = all.length - 1;
  } else {
    return;
  }
  tabs.setValue(all[nextIdx]);
  tabs.focusValue(all[nextIdx]);
}
</script>

<template>
  <div
    ref="listRef"
    role="tablist"
    :aria-orientation="tabs.orientation"
    class="sisyphos-tabs-list"
    @keydown="handleKeyDown"
  >
    <span
      v-if="indicator"
      class="sisyphos-tabs-indicator"
      :style="{
        transform: `translate(${indicator.x}px, ${indicator.y}px)`,
        width: `${indicator.width}px`,
        height: `${indicator.height}px`,
      }"
      aria-hidden="true"
    />
    <slot />
  </div>
</template>
