<script setup lang="ts">
/**
 * Radio — Vue 3 binding. Single radio option. Must be rendered inside a
 * `<RadioGroup>` to coordinate selection, name, size, color, and variant.
 */
import { computed } from "vue";
import { useRadioGroup } from "./context";

interface Props {
  value: string | number;
  label?: string;
  description?: string;
  icon?: unknown;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), { disabled: false });

const group = useRadioGroup();

const checked = computed(() => group.value === props.value);
const disabled = computed(() => props.disabled || group.disabled);

const wrapperClasses = computed(() => [
  "sisyphos-radio",
  group.variant,
  group.size,
  group.color,
  checked.value && "checked",
  disabled.value && "disabled",
]);

function onChange() {
  if (disabled.value) return;
  group.onChange(props.value);
}
</script>

<template>
  <label :class="wrapperClasses">
    <span class="sisyphos-radio-row">
      <input
        type="radio"
        :name="group.name"
        :value="value"
        :checked="checked"
        :disabled="disabled"
        class="sisyphos-radio-input"
        @change="onChange"
      />
      <span class="sisyphos-radio-control" aria-hidden="true">
        <span class="sisyphos-radio-inner" />
      </span>
      <span v-if="label || description || $slots.icon" class="sisyphos-radio-content">
        <span v-if="$slots.icon" class="sisyphos-radio-icon">
          <slot name="icon" />
        </span>
        <span class="sisyphos-radio-text">
          <span v-if="label" class="sisyphos-radio-label">{{ label }}</span>
          <span v-if="description" class="sisyphos-radio-description">{{ description }}</span>
        </span>
      </span>
    </span>
    <span v-if="checked && $slots.default" class="sisyphos-radio-nested" @click.stop>
      <slot />
    </span>
  </label>
</template>
