<script setup lang="ts">
/**
 * Textarea — Vue 3 binding. v-model + label + error + character count +
 * autosize. Mirrors the React Textarea API surface.
 */
import { computed, nextTick, ref, useId, watch } from "vue";

interface Props {
  modelValue?: string;
  variant?: "standard" | "outlined" | "underline";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  radius?: "xs" | "sm" | "md" | "lg" | "xl";
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
  /** When true, the textarea grows with content between minRows and maxRows. */
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
  /** CSS resize behavior. Defaults to "vertical" — set "none" to lock when autoResize is on. */
  resize?: "none" | "vertical" | "horizontal" | "both";
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "standard",
  size: "md",
  error: false,
  disabled: false,
  readonly: false,
  required: false,
  showCharacterCount: false,
  fullWidth: false,
  autoResize: false,
  minRows: 3,
  maxRows: 12,
  resize: "vertical",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const reactId = useId();
const inputId = computed(() => props.id ?? `sisyphos-textarea-${reactId}`);
const focused = ref(false);
const value = computed(() => props.modelValue ?? "");

function autosize() {
  if (!props.autoResize) return;
  const node = textareaRef.value;
  if (!node) return;
  node.style.height = "auto";
  const lineHeight = parseFloat(getComputedStyle(node).lineHeight || "16");
  const min = lineHeight * props.minRows;
  const max = lineHeight * props.maxRows;
  const next = Math.max(min, Math.min(max, node.scrollHeight));
  node.style.height = `${next}px`;
  node.style.overflowY = node.scrollHeight > max ? "auto" : "hidden";
}

watch(value, () => nextTick(autosize), { immediate: true });

function onInput(e: Event) {
  emit("update:modelValue", (e.target as HTMLTextAreaElement).value);
}

const containerClasses = computed(() => [
  "sisyphos-textarea-container",
  focused.value && "focused",
  props.error && "error",
  props.disabled && "disabled",
  props.fullWidth && "full-width",
]);

const textareaClasses = computed(() => [
  "sisyphos-textarea",
  props.variant,
  props.size,
  props.radius && `radius-${props.radius}`,
  focused.value && "focused",
  props.error && "error",
]);

const showCount = computed(() => Boolean(props.maxLength && props.showCharacterCount));
const textareaStyle = computed(() => ({ resize: props.resize }));
</script>

<template>
  <div :class="containerClasses">
    <label v-if="label" :for="inputId" class="sisyphos-textarea-label">
      {{ label }}
    </label>
    <textarea
      :id="inputId"
      ref="textareaRef"
      :class="textareaClasses"
      :style="textareaStyle"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :maxlength="maxLength"
      :rows="autoResize ? minRows : undefined"
      :aria-invalid="error || undefined"
      @input="onInput"
      @focus="focused = true"
      @blur="focused = false"
    />
    <span v-if="error && errorMessage" class="sisyphos-textarea-error" role="alert">
      {{ errorMessage }}
    </span>
    <span v-else-if="showCount" class="sisyphos-textarea-character-count">
      {{ value.length }} / {{ maxLength }}
    </span>
  </div>
</template>

<style src="./Textarea.scss"></style>
