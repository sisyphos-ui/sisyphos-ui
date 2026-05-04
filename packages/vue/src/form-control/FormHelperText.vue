<script setup lang="ts">
/**
 * FormHelperText — supplemental description rendered below the input.
 * Hides itself when the surrounding `<FormControl>` is in `error` state so
 * `<FormErrorText>` can take its place.
 */
import { computed } from "vue";
import { useFormControl } from "./context";

const props = defineProps<{
  /** Override the inherited helper id. */
  id?: string;
}>();

const ctx = useFormControl();
const helperId = computed(() => props.id ?? ctx?.value.helperId);
const visible = computed(() => !(ctx?.value.error ?? false));
</script>

<template>
  <p v-if="visible" :id="helperId" class="sisyphos-form-helper-text">
    <slot />
  </p>
</template>
