<script setup lang="ts">
/**
 * FormControl — compound wrapper that coordinates id/ARIA wiring between
 * `<FormLabel>`, the input element, `<FormHelperText>`, and `<FormErrorText>`.
 *
 * @example
 *   <FormControl required :error="!!err">
 *     <FormLabel>Email</FormLabel>
 *     <input v-model="email" type="email" />
 *     <FormHelperText>We'll never share it.</FormHelperText>
 *     <FormErrorText>{{ err }}</FormErrorText>
 *   </FormControl>
 */
import { computed, provide, useId } from "vue";
import { FormControlInjectionKey } from "./context";

const props = withDefaults(
  defineProps<{
    /** Stable id for the input element. Auto-generated when omitted. */
    id?: string;
    disabled?: boolean;
    required?: boolean;
    readOnly?: boolean;
    error?: boolean;
    fullWidth?: boolean;
  }>(),
  {
    disabled: false,
    required: false,
    readOnly: false,
    error: false,
    fullWidth: false,
  }
);

const generatedId = `sisyphos-field-${useId()}`;
const fieldId = computed(() => props.id ?? generatedId);

const ctx = computed(() => {
  const id = fieldId.value;
  return {
    id,
    labelId: `${id}-label`,
    helperId: `${id}-helper`,
    errorId: `${id}-error`,
    disabled: props.disabled,
    required: props.required,
    readOnly: props.readOnly,
    error: props.error,
    describedBy: props.error ? `${id}-error` : `${id}-helper`,
  };
});

provide(FormControlInjectionKey, ctx);

const rootClasses = computed(() => [
  "sisyphos-form-control",
  props.error && "error",
  props.disabled && "disabled",
  props.fullWidth && "full-width",
]);
</script>

<template>
  <div :class="rootClasses">
    <slot />
  </div>
</template>

<style src="./FormControl.scss"></style>
