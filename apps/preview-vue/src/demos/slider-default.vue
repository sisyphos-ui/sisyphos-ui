<script setup lang="ts">
import { ref } from "vue";
import { Slider } from "@sisyphos-ui/vue";

const v = ref(50);
</script>

<template>
  <Slider v-model="v" ariaLabel="Volume" :showValue="true" />
</template>
