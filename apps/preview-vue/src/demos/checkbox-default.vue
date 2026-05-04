<script setup lang="ts">
import { ref } from "vue";
import { Checkbox } from "@sisyphos-ui/vue";

const checked = ref(true);
</script>

<template>
  <Checkbox v-model:checked="checked" label="I agree to the terms" />
</template>
