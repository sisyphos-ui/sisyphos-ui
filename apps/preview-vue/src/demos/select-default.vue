<script setup lang="ts">
import { ref } from "vue";
import { Select } from "@sisyphos-ui/vue";

const value = ref<string | number | null>("tr");
const options = [
  { value: "tr", label: "Türkiye" },
  { value: "us", label: "United States" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
];
</script>

<template>
  <Select label="Country" v-model="value" :searchable="true" :clearable="true" :options="options" />
</template>
