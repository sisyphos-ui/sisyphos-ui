<script setup lang="ts">
import { computed } from "vue";
import { useAccordion, useAccordionItem } from "./context";

const accordion = useAccordion();
const item = useAccordionItem();
const open = computed(() => accordion.isOpen(item.value));
</script>

<template>
  <div
    v-show="open"
    :id="item.contentId"
    :aria-labelledby="item.triggerId"
    role="region"
    class="sisyphos-accordion-content"
  >
    <slot />
  </div>
</template>
