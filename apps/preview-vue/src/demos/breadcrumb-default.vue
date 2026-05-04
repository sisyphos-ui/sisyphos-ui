<script setup lang="ts">
import { Breadcrumb } from "@sisyphos-ui/vue";

const items = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Sisyphos UI" },
];
</script>

<template>
  <Breadcrumb :items="items" />
</template>
