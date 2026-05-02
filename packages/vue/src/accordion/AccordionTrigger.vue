<script setup lang="ts">
import { computed } from "vue";
import { useAccordion, useAccordionItem } from "./context";

interface Props {
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), { disabled: false });

const accordion = useAccordion();
const item = useAccordionItem();

const open = computed(() => accordion.isOpen(item.value));

function activate() {
  if (props.disabled) return;
  accordion.toggle(item.value);
}
</script>

<template>
  <button
    type="button"
    :id="item.triggerId"
    :aria-controls="item.contentId"
    :aria-expanded="open"
    :disabled="disabled"
    :class="['sisyphos-accordion-trigger', open && 'active']"
    @click="activate"
  >
    <slot />
  </button>
</template>
