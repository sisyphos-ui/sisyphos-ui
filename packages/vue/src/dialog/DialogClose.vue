<script setup lang="ts">
import { useDialog } from "./context";
const dialog = useDialog();
</script>
<template>
  <button type="button" class="sisyphos-dialog-close" @click="dialog.close()">
    <slot>Close</slot>
  </button>
</template>
