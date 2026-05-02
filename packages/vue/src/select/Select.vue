<script setup lang="ts">
/**
 * Select — Vue 3 binding. Combobox-style picker with single or multi
 * value, optional search filter, clearable, keyboard navigation.
 */
import { computed, ref, useId, watch } from "vue";
import { useEscapeKey, useOutsideClick } from "../composables";
import type { SelectOption, SelectValue } from "./types";

interface Props {
  options: SelectOption[];
  modelValue?: SelectValue | SelectValue[] | null;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  multiple?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Select…",
  searchPlaceholder: "Search…",
  multiple: false,
  searchable: false,
  clearable: false,
  disabled: false,
  fullWidth: false,
  error: false,
  size: "md",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: SelectValue | SelectValue[] | null): void;
}>();

const baseId = `sisyphos-select-${useId()}`;
const triggerRef = ref<HTMLDivElement | null>(null);
const dropdownRef = ref<HTMLDivElement | null>(null);
const searchRef = ref<HTMLInputElement | null>(null);
const open = ref(false);
const search = ref("");
const activeIndex = ref(-1);

useEscapeKey(() => (open.value = false), open);
useOutsideClick([triggerRef, dropdownRef], () => (open.value = false), open);

const filtered = computed(() => {
  if (!props.searchable || !search.value) return props.options;
  const q = search.value.toLowerCase();
  return props.options.filter((o) => o.label.toLowerCase().includes(q));
});

const selectedValues = computed<SelectValue[]>(() => {
  if (props.multiple) return Array.isArray(props.modelValue) ? (props.modelValue as SelectValue[]) : [];
  const v = props.modelValue;
  return v == null ? [] : [v as SelectValue];
});

const selectedLabel = computed(() => {
  if (props.multiple) return "";
  const v = props.modelValue;
  if (v == null) return "";
  return props.options.find((o) => o.value === v)?.label ?? "";
});

const isSelected = (v: SelectValue) =>
  selectedValues.value.some((x) => x === v);

function pick(opt: SelectOption) {
  if (opt.disabled) return;
  if (props.multiple) {
    const set = new Set(selectedValues.value);
    if (set.has(opt.value)) set.delete(opt.value);
    else set.add(opt.value);
    emit("update:modelValue", Array.from(set));
  } else {
    emit("update:modelValue", opt.value);
    open.value = false;
  }
}

function clear() {
  emit("update:modelValue", props.multiple ? [] : null);
  search.value = "";
}

function handleKeyDown(e: KeyboardEvent) {
  if (!open.value) return;
  const all = filtered.value;
  if (all.length === 0) return;
  if (e.key === "ArrowDown") {
    e.preventDefault();
    activeIndex.value = (activeIndex.value + 1) % all.length;
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    activeIndex.value = (activeIndex.value - 1 + all.length) % all.length;
  } else if (e.key === "Enter" && activeIndex.value >= 0) {
    e.preventDefault();
    pick(all[activeIndex.value]);
  }
}

watch(open, (v) => {
  if (v && props.searchable) {
    setTimeout(() => searchRef.value?.focus(), 0);
  }
  if (!v) {
    search.value = "";
    activeIndex.value = -1;
  }
});

const containerClasses = computed(() => [
  "sisyphos-select",
  props.size,
  props.error && "error",
  props.disabled && "disabled",
  props.fullWidth && "full-width",
]);

const showClear = computed(
  () => props.clearable && !props.disabled && (props.multiple ? selectedValues.value.length > 0 : props.modelValue != null)
);
</script>

<template>
  <div :class="containerClasses">
    <label v-if="label" class="sisyphos-select-label">{{ label }}</label>
    <div
      ref="triggerRef"
      role="combobox"
      :aria-expanded="open"
      :aria-haspopup="searchable ? 'listbox' : 'listbox'"
      :tabindex="disabled ? -1 : 0"
      class="sisyphos-select-trigger"
      @click="!disabled && (open = !open)"
      @keydown="handleKeyDown"
    >
      <template v-if="multiple">
        <template v-if="selectedValues.length === 0">
          <span class="sisyphos-select-placeholder">{{ placeholder }}</span>
        </template>
        <span
          v-for="v in selectedValues"
          :key="String(v)"
          class="sisyphos-select-tag"
        >
          {{ options.find((o) => o.value === v)?.label ?? v }}
        </span>
      </template>
      <template v-else>
        <template v-if="!selectedLabel">
          <span class="sisyphos-select-placeholder">{{ placeholder }}</span>
        </template>
        <span v-else class="sisyphos-select-value">{{ selectedLabel }}</span>
      </template>
      <button
        v-if="showClear"
        type="button"
        class="sisyphos-select-clear"
        aria-label="Clear"
        @click.stop="clear"
      >
        ✕
      </button>
    </div>
    <Teleport to="body">
      <div
        v-if="open"
        ref="dropdownRef"
        :id="`${baseId}-dropdown`"
        role="listbox"
        class="sisyphos-select-dropdown"
        @keydown="handleKeyDown"
      >
        <input
          v-if="searchable"
          ref="searchRef"
          v-model="search"
          type="search"
          class="sisyphos-select-search"
          :placeholder="searchPlaceholder"
        />
        <div class="sisyphos-select-list">
          <button
            v-for="(opt, idx) in filtered"
            :key="String(opt.value)"
            type="button"
            role="option"
            :aria-selected="isSelected(opt.value)"
            :class="[
              'sisyphos-select-option',
              opt.disabled && 'disabled',
              isSelected(opt.value) && 'selected',
              idx === activeIndex && 'active',
            ]"
            :disabled="opt.disabled"
            @click="pick(opt)"
          >
            <span v-if="opt.icon" class="sisyphos-select-option-icon">
              <slot name="icon" :option="opt" />
            </span>
            <span class="sisyphos-select-option-label">{{ opt.label }}</span>
            <span v-if="opt.description" class="sisyphos-select-option-description">
              {{ opt.description }}
            </span>
          </button>
          <div v-if="filtered.length === 0" class="sisyphos-select-empty">No results</div>
        </div>
      </div>
    </Teleport>
    <span v-if="error && errorMessage" class="sisyphos-select-error" role="alert">
      {{ errorMessage }}
    </span>
    <span v-else-if="helperText" class="sisyphos-select-helper">{{ helperText }}</span>
  </div>
</template>

<style src="./Select.scss"></style>
