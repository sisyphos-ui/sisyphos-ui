<script setup lang="ts">
import { ref } from "vue";
import { TreeSelect } from "@sisyphos-ui/vue";

const tree = [
  {
    id: "1",
    label: "Engineering",
    children: [
      { id: "1-1", label: "Web" },
      { id: "1-2", label: "Mobile" },
    ],
  },
  { id: "2", label: "Design" },
  { id: "3", label: "Product" },
];
const ids = ref<string[]>([]);
</script>

<template>
  <TreeSelect label="Departments" :nodes="tree" v-model="ids" />
</template>
