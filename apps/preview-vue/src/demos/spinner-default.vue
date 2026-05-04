<script setup lang="ts">
import { Spinner } from "@sisyphos-ui/vue";
</script>

<template>
  <div style="display: flex; gap: 16px; align-items: center;">
    <Spinner size="sm" color="primary" />
    <Spinner size="md" color="info" />
    <Spinner variant="double" color="success" size="lg" />
  </div>
</template>
