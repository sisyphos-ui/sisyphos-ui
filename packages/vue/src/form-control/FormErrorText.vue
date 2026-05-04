<script setup lang="ts">
/**
 * FormErrorText — error message rendered below the input. Renders only when
 * the surrounding `<FormControl>` has `error`. Carries `role="alert"` so
 * screen readers announce it. Outside a `<FormControl>` it always renders.
 */
import { computed } from "vue";
import { useFormControl } from "./context";

const props = defineProps<{
  /** Override the inherited error id. */
  id?: string;
}>();

const ctx = useFormControl();
const errorId = computed(() => props.id ?? ctx?.value.errorId);
const visible = computed(() => !ctx || ctx.value.error);
</script>

<template>
  <p v-if="visible" :id="errorId" role="alert" class="sisyphos-form-error-text">
    <slot />
  </p>
</template>
