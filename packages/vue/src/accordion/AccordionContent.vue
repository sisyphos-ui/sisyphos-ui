<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useAccordion, useAccordionItem } from "./context";

interface Props {
  /** Keep content mounted when closed so CSS can animate it. Default true. */
  forceMount?: boolean;
}

const props = withDefaults(defineProps<Props>(), { forceMount: true });

const accordion = useAccordion();
const item = useAccordionItem();
const open = computed(() => accordion.isOpen(item.value));

const innerRef = ref<HTMLDivElement | null>(null);
const contentHeight = ref<number | null>(null);
let observer: ResizeObserver | null = null;

function measure() {
  const el = innerRef.value;
  if (el) contentHeight.value = el.scrollHeight;
}

watch(
  innerRef,
  (el) => {
    observer?.disconnect();
    observer = null;
    if (!el) return;
    measure();
    if (typeof ResizeObserver === "undefined") return;
    observer = new ResizeObserver(() => measure());
    observer.observe(el);
  },
  { flush: "post" }
);

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});

const shouldRender = computed(() => open.value || props.forceMount);

const contentStyle = computed(() =>
  contentHeight.value !== null
    ? { ["--sisyphos-accordion-content-height" as string]: `${contentHeight.value}px` }
    : undefined
);
</script>

<template>
  <div
    v-if="shouldRender"
    :id="item.contentId"
    :aria-labelledby="item.triggerId"
    :aria-hidden="!open"
    :data-state="open ? 'open' : 'closed'"
    :data-initialized="contentHeight !== null ? '' : undefined"
    role="region"
    class="sisyphos-accordion-content"
    :style="contentStyle"
  >
    <div ref="innerRef" class="sisyphos-accordion-content-inner">
      <slot />
    </div>
  </div>
</template>
