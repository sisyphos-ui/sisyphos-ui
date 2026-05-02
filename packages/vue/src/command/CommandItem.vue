<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from "vue";
import { useCommand } from "./context";

interface Props {
  value: string;
  disabled?: boolean;
  /** Text used for filtering. Defaults to the slot textContent at mount time. */
  text?: string;
}

const props = withDefaults(defineProps<Props>(), { disabled: false });

const command = useCommand();
const elRef = ref<HTMLElement | null>(null);
const visible = computed(() => {
  const text = props.text ?? elRef.value?.textContent ?? props.value;
  return command.matches(text, props.value);
});
const isActive = computed(() => command.active.value === props.value);

let unregister: (() => void) | null = null;
onMounted(() => {
  unregister = command.register({
    value: props.value,
    text: props.text ?? elRef.value?.textContent ?? props.value,
    disabled: props.disabled,
    ref: elRef,
  });
});
watch(
  () => [props.value, props.disabled, props.text] as const,
  () => {
    unregister?.();
    unregister = command.register({
      value: props.value,
      text: props.text ?? elRef.value?.textContent ?? props.value,
      disabled: props.disabled,
      ref: elRef,
    });
  }
);
onBeforeUnmount(() => unregister?.());

function onClick() {
  if (props.disabled) return;
  command.setActive(props.value);
  command.selectActive();
}
</script>

<template>
  <button
    v-if="visible"
    ref="elRef"
    type="button"
    role="option"
    :aria-selected="isActive"
    :aria-disabled="disabled || undefined"
    :class="['sisyphos-command-item', isActive && 'active', disabled && 'disabled']"
    @mouseenter="command.setActive(props.value)"
    @click="onClick"
  >
    <slot />
  </button>
</template>
