<script setup lang="ts">
import type { PropType } from "vue";
import type { TreeNode } from "./types";
import { nodeState } from "./utils";

defineOptions({ name: "TreeNodeRow" });

const props = defineProps({
  node: { type: Object as PropType<TreeNode>, required: true },
  level: { type: Number, required: true },
  selectedSet: { type: Object as PropType<Set<string>>, required: true },
  isOpenNode: { type: Function as PropType<(n: TreeNode) => boolean>, required: true },
  onToggle: { type: Function as PropType<(n: TreeNode) => void>, required: true },
  onToggleExpand: { type: Function as PropType<(n: TreeNode) => void>, required: true },
});

import { computed } from "vue";
const hasChildren = computed(() => Boolean(props.node.children?.length));
const isOpen = computed(() => props.isOpenNode(props.node));
const state = computed(() => nodeState(props.node, props.selectedSet));
const ariaChecked = computed(() =>
  state.value === "checked" ? "true" : state.value === "partial" ? "mixed" : "false"
);
</script>

<template>
  <div class="sisyphos-tree-select-node">
    <div :class="['sisyphos-tree-select-row', state, `level-${level}`]">
      <button
        v-if="hasChildren"
        type="button"
        class="sisyphos-tree-select-expand"
        :aria-label="isOpen ? 'Collapse' : 'Expand'"
        @click="onToggleExpand(node)"
      >
        {{ isOpen ? "▾" : "▸" }}
      </button>
      <span v-else class="sisyphos-tree-select-expand-spacer" />
      <button
        type="button"
        class="sisyphos-tree-select-toggle"
        role="checkbox"
        :aria-checked="ariaChecked"
        :disabled="node.disabled"
        @click="onToggle(node)"
      >
        <span :class="['sisyphos-tree-select-checkbox', state]" />
        <span class="sisyphos-tree-select-label">{{ node.label }}</span>
      </button>
    </div>
    <div v-if="hasChildren && isOpen" class="sisyphos-tree-select-children">
      <TreeNodeRow
        v-for="c in node.children"
        :key="String(c.id)"
        :node="c"
        :level="level + 1"
        :selected-set="selectedSet"
        :is-open-node="isOpenNode"
        :on-toggle="onToggle"
        :on-toggle-expand="onToggleExpand"
      />
    </div>
  </div>
</template>
