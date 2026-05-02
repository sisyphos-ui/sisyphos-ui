<script setup lang="ts">
/**
 * NumberInput — Vue 3 binding. Stepper buttons, min/max/step constraints,
 * locale-aware formatting via `Intl.NumberFormat`. Defaults to the runtime
 * locale (matches the React binding's behavior).
 */
import { computed, ref, useId, watch } from "vue";

interface Props {
  modelValue?: number | null;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  /** BCP 47 locale tag. Defaults to the runtime locale. */
  locale?: string;
  numberFormatOptions?: Intl.NumberFormatOptions;
  withStepper?: boolean;
  prefix?: string;
  suffix?: string;
  variant?: "standard" | "outlined" | "underline";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  label?: string;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  step: 1,
  precision: 0,
  withStepper: true,
  variant: "outlined",
  size: "md",
  placeholder: "0",
  error: false,
  required: false,
  fullWidth: false,
  disabled: false,
  readonly: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: number | null): void;
}>();

const reactId = useId();
const inputId = computed(() => props.id ?? `sisyphos-number-${reactId}`);
const focused = ref(false);

const formatter = computed(
  () =>
    new Intl.NumberFormat(
      props.locale,
      props.numberFormatOptions ?? {
        minimumFractionDigits: props.precision,
        maximumFractionDigits: props.precision,
      }
    )
);

function clamp(n: number) {
  let v = n;
  if (props.min !== undefined && v < props.min) v = props.min;
  if (props.max !== undefined && v > props.max) v = props.max;
  return v;
}

function parseLocaleNumber(input: string): number | null {
  if (input == null || input === "") return null;
  const example = (1234.5).toLocaleString(props.locale);
  const decimalSeparator = example.charAt(example.length - 2);
  const cleaned = input
    .replace(new RegExp(`[^\\d\\-${decimalSeparator === "." ? "." : ","}]`, "g"), "")
    .replace(decimalSeparator, ".");
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

const draft = ref<string>(
  props.modelValue == null ? "" : formatter.value.format(props.modelValue)
);

watch(
  () => props.modelValue,
  (v) => {
    if (!focused.value) draft.value = v == null ? "" : formatter.value.format(v);
  }
);

function emitValue(v: number | null) {
  emit("update:modelValue", v);
}

function onInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value;
  draft.value = raw;
  const parsed = parseLocaleNumber(raw);
  if (parsed === null) emitValue(null);
  else emitValue(clamp(parsed));
}

function onBlur() {
  focused.value = false;
  if (props.modelValue != null) draft.value = formatter.value.format(props.modelValue);
}

function step(direction: 1 | -1) {
  const current = props.modelValue ?? 0;
  const next = clamp(current + direction * props.step);
  emitValue(next);
  draft.value = formatter.value.format(next);
}

const containerClasses = computed(() => [
  "sisyphos-number-input-container",
  focused.value && "focused",
  props.error && "error",
  props.disabled && "disabled",
  props.fullWidth && "full-width",
]);

const inputClasses = computed(() => [
  "sisyphos-number-input",
  props.variant,
  props.size,
  focused.value && "focused",
]);
</script>

<template>
  <div :class="containerClasses">
    <label v-if="label" :for="inputId" class="sisyphos-number-input-label">{{ label }}</label>
    <div class="sisyphos-number-input-wrapper">
      <span v-if="prefix" class="sisyphos-number-input-prefix">{{ prefix }}</span>
      <input
        :id="inputId"
        :class="inputClasses"
        type="text"
        inputmode="decimal"
        :value="draft"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-invalid="error || undefined"
        @input="onInput"
        @focus="focused = true"
        @blur="onBlur"
      />
      <span v-if="suffix" class="sisyphos-number-input-suffix">{{ suffix }}</span>
      <div v-if="withStepper" class="sisyphos-number-input-stepper">
        <button
          type="button"
          class="sisyphos-number-input-step up"
          aria-label="Increment"
          :disabled="disabled || (max !== undefined && (modelValue ?? 0) >= max)"
          :tabindex="-1"
          @click="step(1)"
        >
          ▲
        </button>
        <button
          type="button"
          class="sisyphos-number-input-step down"
          aria-label="Decrement"
          :disabled="disabled || (min !== undefined && (modelValue ?? 0) <= min)"
          :tabindex="-1"
          @click="step(-1)"
        >
          ▼
        </button>
      </div>
    </div>
    <span v-if="error && errorMessage" class="sisyphos-number-input-error" role="alert">
      {{ errorMessage }}
    </span>
  </div>
</template>

<style src="./NumberInput.scss"></style>
