<script setup lang="ts">
import { computed } from "vue";
import { useCommand } from "./context";

const command = useCommand();
const visible = computed(() => command.visibleValues.value.length === 0);
</script>

<template>
  <div v-if="visible" class="sisyphos-command-empty"><slot /></div>
</template>
