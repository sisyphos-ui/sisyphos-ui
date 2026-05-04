<script setup lang="ts">
/**
 * FormLabel — `<label>` that auto-wires its `for` attribute and `id` to the
 * surrounding `<FormControl>`. Renders a required indicator when the parent
 * `FormControl` has `required`.
 *
 * Falls back to a plain `<label>` when used standalone — both `for` and `id`
 * can be passed explicitly to override the inherited ids.
 */
import { computed } from "vue";
import { useFormControl } from "./context";

const props = defineProps<{
  /** Override the inherited `for` attribute. */
  for?: string;
  /** Override the inherited `id`. */
  id?: string;
}>();

const ctx = useFormControl();

const labelId = computed(() => props.id ?? ctx?.value.labelId);
const htmlFor = computed(() => props.for ?? ctx?.value.id);
const isRequired = computed(() => ctx?.value.required ?? false);
const isDisabled = computed(() => ctx?.value.disabled ?? false);
const labelClasses = computed(() => ["sisyphos-form-label", isDisabled.value && "disabled"]);
</script>

<template>
  <label :id="labelId" :for="htmlFor" :class="labelClasses">
    <slot />
    <span v-if="isRequired" class="sisyphos-form-label-required" aria-hidden="true">*</span>
  </label>
</template>
