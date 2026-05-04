<script setup lang="ts">
import { Textarea } from "@sisyphos-ui/vue";
</script>

<template>
  <Textarea label="Bio" placeholder="Tell us a bit about yourself…" :maxLength="140" :showCharacterCount="true" />
</template>
