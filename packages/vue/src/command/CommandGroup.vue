<template>
  <div class="sisyphos-command-group">
    <div v-if="heading" class="sisyphos-command-group-heading">{{ heading }}</div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ heading?: string }>();
</script>
