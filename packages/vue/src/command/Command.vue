<script setup lang="ts">
/**
 * Command — Vue 3 binding. Keyboard-first command palette / filterable
 * menu with substring matching. Compound: `<Command>` provides shared
 * state; `<CommandInput>` types the query, `<CommandItem>` registers
 * itself and renders only when its text matches.
 */
import { computed, provide, ref } from "vue";
import { CommandKey, type CommandItemRegistration } from "./context";

interface Props {
  modelValue?: string;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "select", value: string): void;
}>();

const query = ref<string>("");
const active = ref<string>(props.modelValue ?? "");
const items = new Map<string, CommandItemRegistration>();
const itemVersion = ref(0);

function register(item: CommandItemRegistration): () => void {
  items.set(item.value, item);
  itemVersion.value++;
  return () => {
    items.delete(item.value);
    itemVersion.value++;
  };
}

function matches(text: string, value: string): boolean {
  const q = query.value.trim().toLowerCase();
  if (!q) return true;
  return text.toLowerCase().includes(q) || value.toLowerCase().includes(q);
}

const visibleValues = computed<string[]>(() => {
  // Reading the version counter forces re-evaluation when items register/unregister.
  void itemVersion.value;
  return Array.from(items.values())
    .filter((i) => !i.disabled && matches(i.text, i.value))
    .map((i) => i.value);
});

function setActive(v: string) {
  active.value = v;
}
function setQuery(q: string) {
  query.value = q;
  // Re-anchor active to the first visible item when query changes.
  const first = visibleValues.value[0];
  if (first && !visibleValues.value.includes(active.value)) active.value = first;
}

function selectActive() {
  if (!active.value) return;
  emit("update:modelValue", active.value);
  emit("select", active.value);
}

provide(CommandKey, {
  query,
  setQuery,
  active,
  setActive,
  register,
  visibleValues,
  matches,
  selectActive,
});

function handleKeyDown(e: KeyboardEvent) {
  const all = visibleValues.value;
  if (all.length === 0) return;
  const idx = all.indexOf(active.value);
  if (e.key === "ArrowDown") {
    e.preventDefault();
    setActive(all[(idx + 1) % all.length]);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    setActive(all[(idx - 1 + all.length) % all.length]);
  } else if (e.key === "Home") {
    e.preventDefault();
    setActive(all[0]);
  } else if (e.key === "End") {
    e.preventDefault();
    setActive(all[all.length - 1]);
  } else if (e.key === "Enter") {
    e.preventDefault();
    selectActive();
  }
}
</script>

<template>
  <div class="sisyphos-command" role="combobox" :aria-label="label" @keydown="handleKeyDown">
    <slot />
  </div>
</template>

<style src="./Command.scss"></style>
