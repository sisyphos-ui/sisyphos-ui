<script setup lang="ts">
import { ref } from "vue";
import { FileUpload } from "@sisyphos-ui/vue";
import type { UploadedFile } from "@sisyphos-ui/vue";

const files = ref<UploadedFile[]>([]);
</script>

<template>
  <FileUpload
    v-model="files"
    label="Profile photo"
    accept="image/*"
    :maxSize="2 * 1024 * 1024"
  />
</template>
