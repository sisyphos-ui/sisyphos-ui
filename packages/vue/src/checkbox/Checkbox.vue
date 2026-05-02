<script setup lang="ts">
/**
 * Checkbox — Vue 3 binding.
 *
 * Always controlled via `v-model:checked`. Defers transition logic to the
 * framework-agnostic `nextCheckboxStateAfterToggle` helper from
 * @sisyphos-ui/core, so the indeterminate-promotion rule and disabled
 * gating match the React and (later) Angular bindings exactly.
 */
import { computed, onMounted, ref, useId, watch } from "vue";
import { nextCheckboxStateAfterToggle } from "@sisyphos-ui/core";

interface Props {
  /** Current checked state. */
  checked: boolean;
  /** Tristate indicator. Activating an indeterminate box promotes to checked=true. */
  indeterminate?: boolean;
  disabled?: boolean;
  /** Optional label rendered next to the box. */
  label?: string;
  /** Semantic color used when checked or indeterminate. */
  color?: "neutral" | "primary" | "success" | "error" | "warning" | "info";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Custom id used to link the label. */
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  indeterminate: false,
  disabled: false,
  color: "primary",
  size: "md",
});

const emit = defineEmits<{
  (e: "update:checked", checked: boolean): void;
  (e: "change", checked: boolean): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const autoId = useId();
const inputId = computed(() => props.id ?? autoId);

// The DOM `indeterminate` flag isn't reflected through HTML attributes,
// so we set it imperatively. `onMounted` covers the first paint and the
// watcher covers prop updates.
function syncIndeterminate() {
  if (inputRef.value) inputRef.value.indeterminate = props.indeterminate;
}
onMounted(syncIndeterminate);
watch(() => props.indeterminate, syncIndeterminate);

function handleNativeChange() {
  if (props.disabled) return;
  const next = nextCheckboxStateAfterToggle({
    checked: props.checked,
    indeterminate: props.indeterminate,
    disabled: props.disabled,
  });
  emit("update:checked", next.checked);
  emit("change", next.checked);
}

const rootClasses = computed(() => [
  "sisyphos-checkbox",
  props.indeterminate && "indeterminate",
  props.disabled && "disabled",
]);

const inputClasses = computed(() => [
  "sisyphos-checkbox-input",
  props.color,
  props.size,
  props.disabled && "disabled",
]);

const ariaChecked = computed(() => (props.indeterminate ? "mixed" : props.checked ? "true" : "false"));
</script>

<template>
  <div :class="rootClasses">
    <label class="sisyphos-checkbox-label" :for="inputId">
      <span class="sisyphos-checkbox-box">
        <input
          :id="inputId"
          ref="inputRef"
          type="checkbox"
          :class="inputClasses"
          :checked="checked"
          :disabled="disabled"
          :aria-checked="ariaChecked"
          :aria-disabled="disabled || undefined"
          @change="handleNativeChange"
        />
        <span class="sisyphos-checkbox-mark" aria-hidden="true">
          <svg v-if="indeterminate" viewBox="0 0 16 16" width="100%" height="100%" fill="none">
            <path d="M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <svg v-else viewBox="0 0 16 16" width="100%" height="100%" fill="none">
            <path
              d="M13 4L6 11L3 8"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </span>
      <span v-if="label" class="sisyphos-checkbox-label-text">{{ label }}</span>
    </label>
  </div>
</template>

<style src="./Checkbox.scss"></style>
