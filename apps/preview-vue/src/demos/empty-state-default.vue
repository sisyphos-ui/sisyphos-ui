<script setup lang="ts">
import { EmptyState, Button } from "@sisyphos-ui/vue";
</script>

<template>
  <EmptyState
    :bordered="true"
    title="Nothing here yet"
    description="Once you create an item it'll show up here."
  >
    <template #actions>
      <Button>New item</Button>
    </template>
  </EmptyState>
</template>
