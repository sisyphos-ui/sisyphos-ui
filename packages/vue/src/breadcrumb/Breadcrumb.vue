<script setup lang="ts">
/**
 * Breadcrumb — Vue 3 binding. Navigation trail with optional middle-collapse
 * via `maxItems` and a customizable separator slot.
 */
import { computed } from "vue";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: (event: MouseEvent) => void;
  icon?: unknown;
  key?: string;
}

interface Props {
  items: BreadcrumbItem[];
  /** Items kept before the ellipsis when collapsing. */
  itemsBeforeCollapse?: number;
  /** Items kept after the ellipsis when collapsing. */
  itemsAfterCollapse?: number;
  /** When set, collapses middle items into a `…` when total exceeds this count. */
  maxItems?: number;
  /** Plain string separator. Use the `separator` slot for richer content. */
  separator?: string;
}

const props = withDefaults(defineProps<Props>(), {
  itemsBeforeCollapse: 1,
  itemsAfterCollapse: 1,
});

interface EllipsisNode {
  ellipsis: true;
}

const rendered = computed<Array<BreadcrumbItem | EllipsisNode>>(() => {
  if (typeof props.maxItems !== "number" || props.items.length <= props.maxItems) {
    return props.items;
  }
  return [
    ...props.items.slice(0, props.itemsBeforeCollapse),
    { ellipsis: true },
    ...props.items.slice(props.items.length - props.itemsAfterCollapse),
  ];
});
</script>

<template>
  <nav aria-label="breadcrumb" class="sisyphos-breadcrumb">
    <ol class="sisyphos-breadcrumb-list">
      <template v-for="(node, idx) in rendered" :key="(node as BreadcrumbItem).key ?? idx">
        <li v-if="'ellipsis' in node" class="sisyphos-breadcrumb-ellipsis" aria-hidden="true">
          …
        </li>
        <li v-else class="sisyphos-breadcrumb-item">
          <span
            v-if="idx === rendered.length - 1"
            class="sisyphos-breadcrumb-current"
            aria-current="page"
          >
            <span v-if="node.icon" class="sisyphos-breadcrumb-icon"><slot name="icon" :item="node" /></span>
            <span>{{ node.label }}</span>
          </span>
          <a
            v-else-if="node.href"
            class="sisyphos-breadcrumb-link"
            :href="node.href"
            @click="node.onClick"
          >
            <span v-if="node.icon" class="sisyphos-breadcrumb-icon"><slot name="icon" :item="node" /></span>
            <span>{{ node.label }}</span>
          </a>
          <button
            v-else-if="node.onClick"
            type="button"
            class="sisyphos-breadcrumb-link as-button"
            @click="node.onClick"
          >
            <span v-if="node.icon" class="sisyphos-breadcrumb-icon"><slot name="icon" :item="node" /></span>
            <span>{{ node.label }}</span>
          </button>
          <span v-else class="sisyphos-breadcrumb-text">
            <span v-if="node.icon" class="sisyphos-breadcrumb-icon"><slot name="icon" :item="node" /></span>
            <span>{{ node.label }}</span>
          </span>
        </li>
        <li
          v-if="idx < rendered.length - 1"
          aria-hidden="true"
          class="sisyphos-breadcrumb-separator"
        >
          <slot name="separator">{{ separator ?? "/" }}</slot>
        </li>
      </template>
    </ol>
  </nav>
</template>

<style src="./Breadcrumb.scss"></style>
