<script setup lang="ts">
import { ref } from "vue";
import { RadioGroup, Radio } from "@sisyphos-ui/vue";

const plan = ref<string | number>("pro");
</script>

<template>
  <RadioGroup label="Plan" v-model:value="plan" variant="card">
    <Radio value="free" label="Free" description="All the basics, forever." />
    <Radio value="pro" label="Pro" description="For growing teams." />
    <Radio value="enterprise" label="Enterprise" description="Dedicated support." />
  </RadioGroup>
</template>
