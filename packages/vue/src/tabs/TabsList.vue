<script setup lang="ts">
import { useTabs } from "./context";

const tabs = useTabs();

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
  <div role="tablist" :aria-orientation="tabs.orientation" class="sisyphos-tabs-list" @keydown="handleKeyDown">
    <slot />
  </div>
</template>
