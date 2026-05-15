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
  <h3 class="sisyphos-accordion-heading">
    <button
      type="button"
      :id="item.triggerId"
      :aria-controls="item.contentId"
      :aria-expanded="open"
      :disabled="disabled"
      :class="['sisyphos-accordion-trigger', open && 'open']"
      @click="activate"
    >
      <span class="sisyphos-accordion-trigger-label">
        <slot />
      </span>
      <span
        :class="['sisyphos-accordion-trigger-icon', open && 'rotated']"
        aria-hidden="true"
      >
        <slot name="icon">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M7 10l5 5 5-5z" fill="currentColor" />
          </svg>
        </slot>
      </span>
    </button>
  </h3>
</template>
