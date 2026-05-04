<script setup lang="ts">
import { DropdownMenu, Button } from "@sisyphos-ui/vue";

const items = [
  { label: "Edit", onSelect: () => alert("Edit") },
  { label: "Duplicate", onSelect: () => alert("Duplicate") },
  { type: "separator" as const },
  { label: "Delete", destructive: true, onSelect: () => alert("Deleted") },
];
</script>

<template>
  <DropdownMenu :items="items">
    <Button variant="outlined">Actions ▾</Button>
  </DropdownMenu>
</template>
