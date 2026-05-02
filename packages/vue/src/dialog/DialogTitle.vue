<script setup lang="ts">
import { useDialog } from "./context";
const dialog = useDialog();
</script>
<template>
  <h2 :id="dialog.titleId" class="sisyphos-dialog-title"><slot /></h2>
</template>
