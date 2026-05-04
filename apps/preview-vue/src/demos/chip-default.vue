<script setup lang="ts">
import { Chip } from "@sisyphos-ui/vue";
</script>

<template>
  <div style="display: flex; gap: 8px;">
    <Chip variant="soft" color="primary">Featured</Chip>
    <Chip variant="soft" color="success">Active</Chip>
    <Chip variant="soft" color="warning">Pending</Chip>
  </div>
</template>
