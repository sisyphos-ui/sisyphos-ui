<script setup lang="ts">
import { ref } from "vue";
import { Switch } from "@sisyphos-ui/vue";

const checked = ref(true);
</script>

<template>
  <Switch v-model:checked="checked" aria-label="Notifications" />
</template>
