<script setup lang="ts">
/**
 * RadioGroup — Vue 3 binding. Provides shared name + value + onChange to
 * nested `<Radio>` children via Vue's provide/inject. Mirrors the React
 * RadioGroup API surface, including `options` quick-form and the four
 * `variant` styles.
 */
import { computed, provide, useId } from "vue";
import { RadioGroupKey } from "./context";
import Radio from "./Radio.vue";

export interface RadioOption {
  value: string | number;
  label?: string;
  description?: string;
  icon?: unknown;
  disabled?: boolean;
}

interface Props {
  /** Shared `name` for the underlying inputs. Auto-generated when omitted. */
  name?: string;
  /** Selected value (controlled). */
  value?: string | number;
  disabled?: boolean;
  required?: boolean;
  /** Group label rendered above the options. */
  label?: string;
  /** Marks the group as invalid for styling and ARIA. */
  error?: boolean;
  /** Message rendered below the group when `error` is true. */
  errorMessage?: string;
  /** Layout direction for the options. */
  direction?: "horizontal" | "vertical";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "primary" | "success" | "error" | "warning" | "info";
  variant?: "standard" | "card" | "list";
  /** Flat option array — convenience alternative to slot composition. */
  options?: RadioOption[];
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  error: false,
  direction: "vertical",
  size: "md",
  color: "primary",
  variant: "standard",
});

const emit = defineEmits<{
  (e: "update:value", value: string | number): void;
  (e: "change", value: string | number): void;
}>();

const autoName = `sisyphos-radio-${useId()}`;
const name = computed(() => props.name ?? autoName);

provide(RadioGroupKey, {
  get name() {
    return name.value;
  },
  get value() {
    return props.value;
  },
  onChange: (next: string | number) => {
    emit("update:value", next);
    emit("change", next);
  },
  get disabled() {
    return props.disabled;
  },
  get size() {
    return props.size;
  },
  get color() {
    return props.color;
  },
  get variant() {
    return props.variant;
  },
} as never);
</script>

<template>
  <div class="sisyphos-radio-group">
    <div
      v-if="label"
      :class="['sisyphos-radio-group-label', error && 'error', required && 'required']"
    >
      {{ label }}
    </div>
    <div
      role="radiogroup"
      :aria-label="label"
      :aria-required="required || undefined"
      :aria-invalid="error || undefined"
      :class="['sisyphos-radio-options', direction]"
    >
      <slot>
        <Radio
          v-for="o in options"
          :key="String(o.value)"
          :value="o.value"
          :label="o.label"
          :description="o.description"
          :icon="o.icon"
          :disabled="o.disabled"
        />
      </slot>
    </div>
    <span v-if="error && errorMessage" class="sisyphos-radio-group-error" role="alert">
      {{ errorMessage }}
    </span>
  </div>
</template>
