<script setup lang="ts">
/**
 * TreeSelect — Vue 3 binding. Hierarchical multi-select with cascade,
 * partial state, search, and tag overflow.
 */
import { computed, ref, useId } from "vue";
import { useEscapeKey, useOutsideClick } from "../composables";
import { descendantIds, filterTree, findNode } from "./utils";
import TreeNodeRow from "./TreeNodeRow.vue";
import type { TreeNode, TreeNodeId } from "./types";

interface Props {
  nodes: TreeNode[];
  modelValue?: TreeNodeId[];
  label?: string;
  placeholder?: string;
  triggerLabel?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  cascade?: boolean;
  maxTagCount?: number;
  clearable?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  searchable: true,
  searchPlaceholder: "Search…",
  cascade: true,
  maxTagCount: 3,
  clearable: false,
  size: "md",
  error: false,
  disabled: false,
  required: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", ids: TreeNodeId[]): void;
}>();

const baseId = `sisyphos-tree-select-${useId()}`;
const triggerRef = ref<HTMLDivElement | null>(null);
const dropdownRef = ref<HTMLDivElement | null>(null);
const open = ref(false);
const search = ref("");
const expanded = ref<Record<string, boolean>>({});

useEscapeKey(() => (open.value = false), open);
useOutsideClick([triggerRef, dropdownRef], () => (open.value = false), open);

const selectedSet = computed(() => new Set(props.modelValue.map(String)));
const selectedItems = computed(() =>
  props.modelValue.map((id) => findNode(props.nodes, id)).filter((n): n is TreeNode => Boolean(n))
);
const filtered = computed(() => filterTree(props.nodes, search.value));

function toggleNode(node: TreeNode) {
  if (node.disabled) return;
  const set = new Set(props.modelValue.map(String));
  if (props.cascade) {
    const ids = descendantIds(node).map(String);
    const allIn = ids.every((id) => set.has(id));
    if (allIn) ids.forEach((id) => set.delete(id));
    else ids.forEach((id) => set.add(id));
  } else {
    const k = String(node.id);
    if (set.has(k)) set.delete(k);
    else set.add(k);
  }
  emit("update:modelValue", Array.from(set));
}

function isOpenNode(node: TreeNode) {
  return search.value ? true : Boolean(expanded.value[String(node.id)]);
}
function toggleExpand(node: TreeNode) {
  expanded.value = { ...expanded.value, [String(node.id)]: !expanded.value[String(node.id)] };
}

function clearAll() {
  emit("update:modelValue", []);
  search.value = "";
}

const tags = computed(() => selectedItems.value.slice(0, props.maxTagCount));
const overflow = computed(() => Math.max(0, selectedItems.value.length - tags.value.length));

const containerClasses = computed(() => [
  "sisyphos-tree-select",
  props.size,
  props.error && "error",
  props.disabled && "disabled",
  props.fullWidth && "full-width",
]);
</script>

<template>
  <div :class="containerClasses">
    <label v-if="label" class="sisyphos-tree-select-label">{{ label }}</label>
    <div
      ref="triggerRef"
      role="combobox"
      :aria-expanded="open"
      aria-haspopup="tree"
      :tabindex="disabled ? -1 : 0"
      :class="['sisyphos-tree-select-trigger', open && 'open']"
      @click="!disabled && (open = !open)"
    >
      <div class="sisyphos-tree-select-value">
        <span v-if="selectedItems.length === 0" class="sisyphos-tree-select-placeholder">
          {{ placeholder ?? triggerLabel ?? "Select…" }}
        </span>
        <div v-else class="sisyphos-tree-select-tags">
          <span
            v-for="t in tags"
            :key="String(t.id)"
            class="sisyphos-tree-select-tag"
            :title="t.label"
          >
            {{ t.label }}
          </span>
          <span v-if="overflow > 0" class="sisyphos-tree-select-tag more">+{{ overflow }}</span>
        </div>
      </div>
      <button
        v-if="clearable && selectedItems.length > 0 && !disabled"
        type="button"
        class="sisyphos-tree-select-clear"
        aria-label="Clear all"
        @click.stop="clearAll"
      >
        ✕
      </button>
      <span class="sisyphos-tree-select-chevron" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path d="M7 10l5 5 5-5z" fill="currentColor" />
        </svg>
      </span>
    </div>
    <Teleport to="body">
      <div
        v-if="open"
        ref="dropdownRef"
        :id="`${baseId}-dropdown`"
        class="sisyphos-tree-select-dropdown"
      >
        <div v-if="searchable" class="sisyphos-tree-select-search">
          <input
            v-model="search"
            type="search"
            :placeholder="searchPlaceholder"
          />
        </div>
        <div v-if="filtered.length === 0" class="sisyphos-tree-select-empty">No results</div>
        <div v-else role="tree" class="sisyphos-tree-select-content">
          <TreeNodeRow
            v-for="node in filtered"
            :key="String(node.id)"
            :node="node"
            :level="0"
            :selected-set="selectedSet"
            :is-open-node="isOpenNode"
            :on-toggle="toggleNode"
            :on-toggle-expand="toggleExpand"
          />
        </div>
      </div>
    </Teleport>
    <span v-if="error && errorMessage" class="sisyphos-tree-select-error" role="alert">
      {{ errorMessage }}
    </span>
  </div>
</template>

<style src="./TreeSelect.scss"></style>
