<script setup lang="ts">
/**
 * Input — Vue 3 binding. v-model, three variants, label + error,
 * start/end icon slots, character count, password toggle, and the mask
 * system from `./mask.ts` (mirrors the React mask helper exactly).
 */
import { computed, nextTick, ref, useId, watch } from "vue";
import { applyMask, getMaskPrefixLength, unmask } from "./mask";

interface Props {
  modelValue?: string;
  variant?: "standard" | "outlined" | "underline";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  radius?: "xs" | "sm" | "md" | "lg" | "xl";
  type?: string;
  label?: string;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
  fullWidth?: boolean;
  /** Mask pattern. Use `#` (digit), `A` (letter), `*` (alphanumeric). Presets: `tel-tr`, `tel`, `card`, `date`. */
  mask?: string;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "standard",
  size: "md",
  type: "text",
  error: false,
  disabled: false,
  readonly: false,
  required: false,
  showCharacterCount: false,
  fullWidth: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "unmaskedChange", value: string): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const reactId = useId();
const inputId = computed(() => props.id ?? `sisyphos-input-${reactId}`);
const focused = ref(false);
const showPassword = ref(false);
const isPassword = computed(() => props.type === "password");
const inputType = computed(() => (isPassword.value && showPassword.value ? "text" : props.type));

const displayValue = computed(() => {
  const v = props.modelValue ?? "";
  return props.mask ? applyMask(v, props.mask) : v;
});

const prefixLength = computed(() => (props.mask ? getMaskPrefixLength(props.mask) : 0));

function protectMaskPrefix() {
  if (!props.mask || prefixLength.value === 0) return;
  const node = inputRef.value;
  if (!node) return;
  const start = node.selectionStart ?? 0;
  const end = node.selectionEnd ?? 0;
  if (start < prefixLength.value && start === end) {
    try {
      node.setSelectionRange(prefixLength.value, prefixLength.value);
    } catch {
      /* non-text input types — ignore */
    }
  }
}

function onInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value;
  const next = props.mask ? applyMask(raw, props.mask) : raw;
  emit("update:modelValue", next);
  if (props.mask) emit("unmaskedChange", unmask(next, props.mask));
  if (props.mask && prefixLength.value > 0) nextTick(protectMaskPrefix);
}

function onClick() {
  if (props.mask && prefixLength.value > 0) protectMaskPrefix();
}

function onKeyUp() {
  if (props.mask && prefixLength.value > 0) protectMaskPrefix();
}

watch(
  () => displayValue.value,
  (v) => {
    if (inputRef.value && inputRef.value.value !== v) inputRef.value.value = v;
  }
);

const containerClasses = computed(() => [
  "sisyphos-input-container",
  focused.value && "focused",
  props.error && "error",
  props.disabled && "disabled",
  props.readonly && "read-only",
  props.fullWidth && "full-width",
]);

const inputClasses = computed(() => [
  "sisyphos-input",
  props.variant,
  props.size,
  props.radius && `radius-${props.radius}`,
  focused.value && "focused",
  props.error && "error",
]);

const showCount = computed(() => Boolean(props.maxLength && props.showCharacterCount));
</script>

<template>
  <div :class="containerClasses">
    <label
      v-if="label"
      :for="inputId"
      :class="[
        'sisyphos-input-label',
        focused && 'focused',
        error && 'error',
        disabled && 'disabled',
        readonly && 'read-only',
        required && 'required',
      ]"
    >
      <span class="sisyphos-input-label-text">{{ label }}</span>
    </label>
    <div class="sisyphos-input-wrapper">
      <span v-if="$slots.startIcon" class="sisyphos-input-start-icon">
        <slot name="startIcon" />
      </span>
      <input
        :id="inputId"
        ref="inputRef"
        :type="inputType"
        :class="inputClasses"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :maxlength="maxLength"
        :aria-invalid="error || undefined"
        @input="onInput"
        @click="onClick"
        @keyup="onKeyUp"
        @focus="focused = true"
        @blur="focused = false"
      />
      <button
        v-if="isPassword"
        type="button"
        class="sisyphos-input-password-toggle"
        :tabindex="-1"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        @click="showPassword = !showPassword"
      >
        {{ showPassword ? "🙈" : "👁" }}
      </button>
      <span v-if="$slots.endIcon && !isPassword" class="sisyphos-input-end-icon">
        <slot name="endIcon" />
      </span>
    </div>
    <span v-if="error && errorMessage" class="sisyphos-input-error" role="alert">
      {{ errorMessage }}
    </span>
    <span v-else-if="showCount" class="sisyphos-input-character-count">
      {{ displayValue.length }} / {{ maxLength }}
    </span>
  </div>
</template>

<style src="./Input.scss"></style>
