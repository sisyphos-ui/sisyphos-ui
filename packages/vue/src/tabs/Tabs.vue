<script setup lang="ts">
/**
 * Tabs — Vue 3 binding. Compound API rendered as `<Tabs>` + `<TabsList>` +
 * `<TabsTrigger>` + `<TabsPanel>`. Provides shared baseId + value via
 * provide/inject so siblings stay decoupled.
 */
import { provide, ref, useId, watch } from "vue";
import { TabsKey, type TabsOrientation } from "./context";

interface Props {
  /** Controlled active tab. */
  value?: string;
  /** Initial active tab when uncontrolled. */
  defaultValue?: string;
  orientation?: TabsOrientation;
  fullWidth?: boolean;
  variant?: "underline" | "pill" | "soft";
  size?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  orientation: "horizontal",
  fullWidth: false,
  variant: "underline",
  size: "md",
});

const emit = defineEmits<{
  (e: "update:value", value: string): void;
  (e: "valueChange", value: string): void;
}>();

const baseId = `sisyphos-tabs-${useId()}`;
const internal = ref<string>(props.defaultValue ?? "");
const value = ref<string>(props.value ?? internal.value);

watch(
  () => props.value,
  (v) => {
    if (v !== undefined) value.value = v;
  }
);

function setValue(next: string) {
  if (props.value === undefined) {
    internal.value = next;
    value.value = next;
  }
  emit("update:value", next);
  emit("valueChange", next);
}

const triggers = new Map<string, HTMLButtonElement>();
function registerTrigger(v: string, el: HTMLButtonElement | null) {
  if (el) triggers.set(v, el);
  else triggers.delete(v);
}
function values(): string[] {
  return Array.from(triggers.keys());
}
function focusValue(v: string) {
  triggers.get(v)?.focus();
}

provide(TabsKey, {
  baseId,
  value,
  setValue,
  orientation: props.orientation,
  registerTrigger,
  focusValue,
  values,
});
</script>

<template>
  <div :class="['sisyphos-tabs', orientation, variant, size, fullWidth && 'full-width']">
    <slot />
  </div>
</template>

<style src="./Tabs.scss"></style>
