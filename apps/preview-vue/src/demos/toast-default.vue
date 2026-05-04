<script setup lang="ts">
import { Toaster, toast, Button } from "@sisyphos-ui/vue";
</script>

<template>
  <div>
    <Toaster position="bottom-right" />
    <div style="display:flex; gap:8px; flex-wrap:wrap;">
      <Button @click="toast.success('Saved')">Success</Button>
      <Button color="error" @click="toast.error('Something went wrong')">Error</Button>
      <Button color="warning" @click="toast.warning('Heads up')">Warning</Button>
    </div>
  </div>
</template>
