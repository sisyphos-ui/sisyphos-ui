<script setup lang="ts">
import { ref } from "vue";
import { DatePicker } from "@sisyphos-ui/vue";

const date = ref<Date | null>(new Date());
</script>

<template>
  <DatePicker label="Birthday" v-model="date" />
</template>
