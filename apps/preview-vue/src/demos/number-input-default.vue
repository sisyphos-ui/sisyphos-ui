<script setup lang="ts">
import { ref } from "vue";
import { NumberInput } from "@sisyphos-ui/vue";

const n = ref(1);
</script>

<template>
  <NumberInput label="Quantity" v-model="n" :min="1" :step="1" />
</template>
