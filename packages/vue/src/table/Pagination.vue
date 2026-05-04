<script setup lang="ts">
import { computed } from "vue";

interface Props {
  page: number;
  pageCount: number;
  siblings?: number;
  boundaries?: number;
  size?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  siblings: 1,
  boundaries: 1,
  size: "md",
});

const emit = defineEmits<{
  (e: "change", page: number): void;
}>();

const items = computed(() => {
  const { page, pageCount, siblings, boundaries } = props;
  if (pageCount <= 1) return [1];
  const totalNumbers = boundaries * 2 + siblings * 2 + 3;
  if (totalNumbers >= pageCount) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  const left = Math.max(page - siblings, boundaries + 2);
  const right = Math.min(page + siblings, pageCount - boundaries - 1);
  const result: Array<number | "ellipsis"> = [];
  for (let i = 1; i <= boundaries; i++) result.push(i);
  if (left > boundaries + 1) result.push("ellipsis");
  for (let i = left; i <= right; i++) result.push(i);
  if (right < pageCount - boundaries) result.push("ellipsis");
  for (let i = pageCount - boundaries + 1; i <= pageCount; i++) result.push(i);
  return result;
});
</script>

<template>
  <nav :class="['sisyphos-pagination', size]" aria-label="Pagination">
    <button
      type="button"
      class="sisyphos-pagination-arrow"
      :disabled="page <= 1"
      aria-label="Previous page"
      @click="emit('change', page - 1)"
    >
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path d="M10 4l-4 4 4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <ul class="sisyphos-pagination-list">
      <template v-for="(it, i) in items" :key="i">
        <li v-if="it === 'ellipsis'" class="sisyphos-pagination-ellipsis" aria-hidden="true">…</li>
        <li v-else>
          <button
            type="button"
            :class="['sisyphos-pagination-page', it === page && 'active']"
            :aria-current="it === page ? 'page' : undefined"
            @click="emit('change', it as number)"
          >{{ it }}</button>
        </li>
      </template>
    </ul>
    <button
      type="button"
      class="sisyphos-pagination-arrow"
      :disabled="page >= pageCount"
      aria-label="Next page"
      @click="emit('change', page + 1)"
    >
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </nav>
</template>
