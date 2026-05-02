<script setup lang="ts">
import { computed } from "vue";
import { useTabs } from "./context";

interface Props {
  value: string;
}

const props = defineProps<Props>();

const tabs = useTabs();
const selected = computed(() => tabs.value.value === props.value);
const triggerId = computed(() => `${tabs.baseId}-trigger-${props.value}`);
const panelId = computed(() => `${tabs.baseId}-panel-${props.value}`);
</script>

<template>
  <div
    v-if="selected"
    role="tabpanel"
    :id="panelId"
    :aria-labelledby="triggerId"
    :tabindex="0"
    class="sisyphos-tabs-panel"
  >
    <slot />
  </div>
</template>
