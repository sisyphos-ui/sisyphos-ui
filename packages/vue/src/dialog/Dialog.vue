<script setup lang="ts">
/**
 * Dialog — Vue 3 binding. Modal surface with backdrop, escape close,
 * scroll lock, and focus restoration. Compound API rendered as
 * `<Dialog>` + `<DialogHeader>` + `<DialogTitle>` + `<DialogBody>` +
 * `<DialogFooter>` + `<DialogClose>`.
 */
import { computed, nextTick, onBeforeUnmount, provide, ref, useId, watch } from "vue";
import { useEscapeKey } from "../composables";
import { DialogKey } from "./context";

interface Props {
  open: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  /** Show the auto-rendered close button in the corner. */
  showCloseButton?: boolean;
  /** aria-label for the auto close button. */
  closeButtonLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  closeOnBackdropClick: true,
  closeOnEscape: true,
  showCloseButton: false,
  closeButtonLabel: "Close",
});

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

const baseId = `sisyphos-dialog-${useId()}`;
const titleId = `${baseId}-title`;
const dialogRef = ref<HTMLDivElement | null>(null);
let restoreFocusEl: HTMLElement | null = null;
let prevOverflow = "";

function close() {
  emit("update:open", false);
}

useEscapeKey(
  () => {
    if (props.closeOnEscape) close();
  },
  computed(() => props.open)
);

watch(
  () => props.open,
  async (v) => {
    if (v) {
      restoreFocusEl = (document.activeElement as HTMLElement) ?? null;
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      await nextTick();
      const target = (dialogRef.value?.querySelector(
        '[autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) ?? dialogRef.value) as HTMLElement | null;
      target?.focus?.();
    } else {
      document.body.style.overflow = prevOverflow;
      restoreFocusEl?.focus?.();
    }
  }
);

onBeforeUnmount(() => {
  if (props.open) document.body.style.overflow = prevOverflow;
});

function onBackdropClick() {
  if (props.closeOnBackdropClick) close();
}

const dialogClasses = computed(() => ["sisyphos-dialog", props.size]);

provide(DialogKey, {
  get titleId() {
    return titleId;
  },
  close,
});
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="sisyphos-dialog-backdrop" @mousedown.self="onBackdropClick">
      <div
        ref="dialogRef"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        :class="dialogClasses"
        tabindex="-1"
      >
        <slot />
        <button
          v-if="showCloseButton"
          type="button"
          class="sisyphos-dialog-close-auto"
          :aria-label="closeButtonLabel"
          @click="close"
        >
          <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
            <path
              d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style src="./Dialog.scss"></style>
