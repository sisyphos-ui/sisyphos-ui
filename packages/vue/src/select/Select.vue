<script setup lang="ts">
/**
 * Select — Vue 3 binding. Combobox-style picker with single/multi value,
 * search filter, clearable, keyboard navigation, async loading state,
 * and a portal-mounted dropdown.
 *
 * Class names, ARIA, and visual structure mirror the React + Angular
 * bindings: control (with chevron + clear), value wrapper (with tags
 * for multi-select), and a dropdown list with search row + loading +
 * empty states.
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
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;
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
  loading: false,
  loadingText: "Loading…",
  emptyText: "No options",
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

const singleLabel = computed(() => {
  if (props.multiple) return "";
  const v = props.modelValue;
  if (v == null) return "";
  return props.options.find((o) => o.value === v)?.label ?? "";
});

const hasValue = computed(() =>
  props.multiple ? selectedValues.value.length > 0 : props.modelValue != null
);

const isSelected = (v: SelectValue) => selectedValues.value.some((x) => x === v);

const labelOf = (v: SelectValue) => props.options.find((o) => o.value === v)?.label ?? String(v);

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

function removeTag(v: SelectValue) {
  if (!props.multiple) return;
  emit(
    "update:modelValue",
    selectedValues.value.filter((x) => x !== v)
  );
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

const controlClasses = computed(() => [
  "sisyphos-select-control",
  open.value && "open",
  hasValue.value && "has-value",
]);

const showClear = computed(() => props.clearable && !props.disabled && hasValue.value);
</script>

<template>
  <div :class="containerClasses">
    <label v-if="label" :class="['sisyphos-select-label', error && 'error']">{{ label }}</label>
    <div
      ref="triggerRef"
      role="combobox"
      :aria-expanded="open"
      aria-haspopup="listbox"
      :tabindex="disabled ? -1 : 0"
      :class="controlClasses"
      @click="!disabled && (open = !open)"
      @keydown="handleKeyDown"
    >
      <div class="sisyphos-select-value">
        <template v-if="multiple">
          <span v-if="selectedValues.length === 0" class="sisyphos-select-placeholder">
            {{ placeholder }}
          </span>
          <div v-else class="sisyphos-select-tags">
            <span
              v-for="v in selectedValues"
              :key="String(v)"
              class="sisyphos-select-tag"
              :title="labelOf(v)"
            >
              {{ labelOf(v) }}
              <button
                type="button"
                class="sisyphos-select-tag-delete"
                aria-label="Remove"
                @click.stop="removeTag(v)"
              >
                ✕
              </button>
            </span>
          </div>
        </template>
        <template v-else>
          <span v-if="!singleLabel" class="sisyphos-select-placeholder">{{ placeholder }}</span>
          <span v-else class="sisyphos-select-single">{{ singleLabel }}</span>
        </template>
      </div>
      <button
        v-if="showClear"
        type="button"
        class="sisyphos-select-clear"
        aria-label="Clear"
        @click.stop="clear"
      >
        ✕
      </button>
      <span class="sisyphos-select-chevron" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path d="M7 10l5 5 5-5z" fill="currentColor" />
        </svg>
      </span>
    </div>
    <Teleport to="body">
      <ul
        v-if="open"
        ref="dropdownRef"
        :id="`${baseId}-list`"
        role="listbox"
        class="sisyphos-select-list"
        @keydown="handleKeyDown"
      >
        <li v-if="searchable" class="sisyphos-select-search-row">
          <input
            ref="searchRef"
            v-model="search"
            type="search"
            class="sisyphos-select-search"
            :placeholder="searchPlaceholder"
          />
        </li>
        <li v-if="loading" class="sisyphos-select-loading">
          <span class="sisyphos-select-loading-spinner" aria-hidden="true" />
          {{ loadingText }}
        </li>
        <li v-else-if="filtered.length === 0" class="sisyphos-select-empty">{{ emptyText }}</li>
        <template v-else>
          <li
            v-for="(opt, idx) in filtered"
            :key="String(opt.value)"
            role="option"
            :aria-selected="isSelected(opt.value)"
            :aria-disabled="opt.disabled || undefined"
            :class="[
              'sisyphos-select-option',
              opt.disabled && 'disabled',
              isSelected(opt.value) && 'selected',
              idx === activeIndex && 'active',
            ]"
            @click="pick(opt)"
            @mouseenter="activeIndex = idx"
          >
            <span v-if="multiple" class="sisyphos-select-option-check" aria-hidden="true">
              {{ isSelected(opt.value) ? "✓" : "" }}
            </span>
            <span v-if="opt.icon" class="sisyphos-select-option-icon">
              <slot name="icon" :option="opt" />
            </span>
            <span class="sisyphos-select-option-body">
              <span class="sisyphos-select-option-label">{{ opt.label }}</span>
              <span v-if="opt.description" class="sisyphos-select-option-description">
                {{ opt.description }}
              </span>
            </span>
          </li>
        </template>
      </ul>
    </Teleport>
    <span v-if="error && errorMessage" class="sisyphos-select-error" role="alert">
      {{ errorMessage }}
    </span>
    <span v-else-if="helperText" class="sisyphos-select-helper">{{ helperText }}</span>
  </div>
</template>

<style src="./Select.scss"></style>
