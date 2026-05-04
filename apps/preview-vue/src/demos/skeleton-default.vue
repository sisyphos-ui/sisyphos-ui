<script setup lang="ts">
import { Skeleton } from "@sisyphos-ui/vue";
</script>

<template>
  <div style="display:flex; gap:12px; align-items:center;">
    <Skeleton shape="circular" :width="48" :height="48" />
    <div style="flex:1; display:grid; gap:8px;">
      <Skeleton width="60%" :height="16" />
      <Skeleton width="80%" :height="14" />
      <Skeleton width="40%" :height="14" />
    </div>
  </div>
</template>
