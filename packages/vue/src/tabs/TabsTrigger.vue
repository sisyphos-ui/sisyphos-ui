<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useTabs } from "./context";

interface Props {
  value: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), { disabled: false });

const tabs = useTabs();
const elRef = ref<HTMLButtonElement | null>(null);

const selected = computed(() => tabs.value.value === props.value);
const triggerId = computed(() => `${tabs.baseId}-trigger-${props.value}`);
const panelId = computed(() => `${tabs.baseId}-panel-${props.value}`);

onMounted(() => tabs.registerTrigger(props.value, elRef.value));
watch(
  () => props.value,
  (next, prev) => {
    if (prev) tabs.registerTrigger(prev, null);
    tabs.registerTrigger(next, elRef.value);
  }
);
onBeforeUnmount(() => tabs.registerTrigger(props.value, null));

function activate() {
  if (props.disabled) return;
  tabs.setValue(props.value);
}
</script>

<template>
  <button
    ref="elRef"
    role="tab"
    type="button"
    :id="triggerId"
    :aria-controls="panelId"
    :aria-selected="selected"
    :tabindex="selected ? 0 : -1"
    :disabled="disabled"
    :class="['sisyphos-tabs-trigger', selected && 'active']"
    @click="activate"
  >
    <slot />
  </button>
</template>
