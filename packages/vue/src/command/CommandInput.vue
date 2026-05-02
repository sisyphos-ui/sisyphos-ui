<script setup lang="ts">
import { useCommand } from "./context";

const props = withDefaults(defineProps<{ placeholder?: string; ariaLabel?: string }>(), {
  placeholder: "Type a command…",
});

const command = useCommand();

function onInput(e: Event) {
  command.setQuery((e.target as HTMLInputElement).value);
}
</script>

<template>
  <input
    type="text"
    role="searchbox"
    :placeholder="placeholder"
    :aria-label="ariaLabel"
    :value="command.query.value"
    class="sisyphos-command-input"
    @input="onInput"
  />
</template>
