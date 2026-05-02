<script setup lang="ts">
import { computed, provide } from "vue";
import { useAccordion, AccordionItemKey } from "./context";

interface Props {
  value: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), { disabled: false });

const accordion = useAccordion();
const open = computed(() => accordion.isOpen(props.value));

const triggerId = computed(() => `${accordion.baseId}-trigger-${props.value}`);
const contentId = computed(() => `${accordion.baseId}-content-${props.value}`);

provide(AccordionItemKey, {
  get value() {
    return props.value;
  },
  get triggerId() {
    return triggerId.value;
  },
  get contentId() {
    return contentId.value;
  },
} as never);
</script>

<template>
  <div :class="['sisyphos-accordion-item', open && 'open', disabled && 'disabled']">
    <slot :open="open" />
  </div>
</template>
