<script setup lang="ts">
import { Popover, Button } from "@sisyphos-ui/vue";
</script>

<template>
  <Popover>
    <Button variant="outlined">Open popover</Button>
    <template #content>
      <div style="padding:12px; max-width:240px;">Popovers carry rich interactive content with focus management.</div>
    </template>
  </Popover>
</template>
