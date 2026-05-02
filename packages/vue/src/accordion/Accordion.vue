<script setup lang="ts">
/**
 * Accordion — Vue 3 binding. Provides multi-expand-aware open/close logic
 * via provide/inject; per-item state lives in `AccordionItem`.
 */
import { provide, ref, useId, watch } from "vue";
import { AccordionKey } from "./context";

interface Props {
  /** Controlled list of expanded values. Pass single string or array depending on `multiple`. */
  value?: string | string[];
  /** Initial expanded value(s) when uncontrolled. */
  defaultValue?: string | string[];
  /** When true, multiple items can be open simultaneously. */
  multiple?: boolean;
}

const props = withDefaults(defineProps<Props>(), { multiple: false });

const emit = defineEmits<{
  (e: "update:value", value: string | string[]): void;
  (e: "valueChange", value: string | string[]): void;
}>();

const baseId = `sisyphos-accordion-${useId()}`;

function normalize(v: string | string[] | undefined): string[] {
  if (v === undefined) return [];
  return Array.isArray(v) ? [...v] : [v];
}

const internal = ref<string[]>(normalize(props.defaultValue));
const current = ref<string[]>(props.value !== undefined ? normalize(props.value) : internal.value);

watch(
  () => props.value,
  (v) => {
    if (v !== undefined) current.value = normalize(v);
  }
);

function isOpen(v: string) {
  return current.value.includes(v);
}

function toggle(v: string) {
  let next: string[];
  if (props.multiple) {
    next = isOpen(v) ? current.value.filter((x) => x !== v) : [...current.value, v];
  } else {
    next = isOpen(v) ? [] : [v];
  }
  if (props.value === undefined) {
    internal.value = next;
    current.value = next;
  }
  const emitted = props.multiple ? next : (next[0] ?? "");
  emit("update:value", emitted);
  emit("valueChange", emitted);
}

provide(AccordionKey, { baseId, isOpen, toggle, multiple: props.multiple });
</script>

<template>
  <div class="sisyphos-accordion">
    <slot />
  </div>
</template>

<style src="./Accordion.scss"></style>
