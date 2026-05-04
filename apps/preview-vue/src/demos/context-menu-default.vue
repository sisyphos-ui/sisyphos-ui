<script setup lang="ts">
import { ContextMenu } from "@sisyphos-ui/vue";

const items = [
  { label: "Open", onSelect: () => alert("Open") },
  { label: "Rename", onSelect: () => alert("Rename") },
  { type: "separator" as const },
  { label: "Delete", destructive: true, onSelect: () => alert("Deleted") },
];
</script>

<template>
  <ContextMenu :items="items">
    <div
      style="padding:24px; border:1px dashed #c4cdd5; border-radius:8px; text-align:center; color:#637381; user-select:none;"
    >
      Right-click me
    </div>
  </ContextMenu>
</template>
