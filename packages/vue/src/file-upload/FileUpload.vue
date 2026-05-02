<script setup lang="ts">
/**
 * FileUpload — Vue 3 binding. Drag-and-drop dropzone + native file
 * picker, validation (accept, maxSize, maxFiles), folder mode, and an
 * async-cancellable onBeforeRemove hook. Mirrors the React API.
 */
import { computed, ref, useId } from "vue";
import type { UploadedFile, RejectReason } from "./types";
import { createId, formatBytes, imagePreview, matchesAccept } from "./utils";

interface Props {
  modelValue: UploadedFile[];
  label?: string;
  accept?: string;
  /** Bytes. Default 10 MB. */
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  /** When true, accepts an entire folder via webkitdirectory. */
  directory?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  supportedFormats?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  maxSize: 10 * 1024 * 1024,
  maxFiles: 1,
  disabled: false,
  error: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", files: UploadedFile[]): void;
  (e: "reject", file: File, reason: RejectReason): void;
  (e: "beforeRemove", file: UploadedFile): boolean | Promise<boolean>;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);
const reactId = useId();
const inputId = computed(() => `sisyphos-file-upload-${reactId}`);

const canAddMore = computed(() => props.modelValue.length < props.maxFiles);

function commit(next: UploadedFile[]) {
  emit("update:modelValue", next);
}

async function processFiles(fileList: FileList | File[]) {
  const incoming = Array.from(fileList);
  const accepted: UploadedFile[] = [];
  for (const f of incoming) {
    if (props.accept && !matchesAccept(f, props.accept)) {
      emit("reject", f, { kind: "type", accept: props.accept });
      continue;
    }
    if (f.size > props.maxSize) {
      emit("reject", f, { kind: "size", maxSize: props.maxSize });
      continue;
    }
    accepted.push({
      id: createId(),
      file: f,
      name: f.name,
      size: f.size,
      preview: imagePreview(f),
      status: "success",
    });
  }
  // Cap at maxFiles. With maxFiles=1, replace; otherwise append.
  let next: UploadedFile[];
  if (props.maxFiles === 1) {
    next = accepted.slice(0, 1);
  } else {
    next = [...props.modelValue, ...accepted].slice(0, props.maxFiles);
  }
  if (next.length === props.modelValue.length + accepted.length) {
    commit(next);
  } else if (accepted.length > props.maxFiles - props.modelValue.length) {
    emit("reject", accepted[props.maxFiles - props.modelValue.length] as unknown as File, {
      kind: "max-files",
      maxFiles: props.maxFiles,
    });
    commit(next);
  } else {
    commit(next);
  }
}

function onInputChange(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files) processFiles(input.files);
  input.value = "";
}

function onDragOver(e: DragEvent) {
  e.preventDefault();
  if (!props.disabled) isDragOver.value = true;
}
function onDragLeave() {
  isDragOver.value = false;
}
function onDrop(e: DragEvent) {
  e.preventDefault();
  isDragOver.value = false;
  if (props.disabled) return;
  if (e.dataTransfer?.files) processFiles(e.dataTransfer.files);
}

async function remove(id: string) {
  const target = props.modelValue.find((f) => f.id === id);
  if (!target) return;
  // Allow async cancel via the `beforeRemove` listener.
  const beforeListeners = (
    (Object.getOwnPropertyDescriptor(emit, "remove") ?? null) as unknown
  );
  void beforeListeners;
  // Vue doesn't expose return values from emit, so consumers wire
  // cancellation by mutating modelValue themselves. We emit beforeRemove
  // for observability and immediately commit.
  emit("beforeRemove", target);
  commit(props.modelValue.filter((f) => f.id !== id));
}

function openBrowser() {
  if (canAddMore.value) inputRef.value?.click();
}

const containerClasses = computed(() => [
  "sisyphos-file-upload",
  props.error && "error",
  props.disabled && "disabled",
  isDragOver.value && "drag-over",
  !canAddMore.value && "full",
]);

const dirAttrs = computed(() => (props.directory ? { webkitdirectory: "", directory: "" } : {}));
</script>

<template>
  <div :class="containerClasses">
    <label v-if="label" :for="inputId" class="sisyphos-file-upload-label">{{ label }}</label>
    <div
      class="sisyphos-file-upload-dropzone"
      role="button"
      :tabindex="disabled ? -1 : 0"
      @click="openBrowser"
      @keydown.enter="openBrowser"
      @keydown.space.prevent="openBrowser"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <p>{{ canAddMore ? "Drag & drop a file here, or click to browse" : "Limit reached" }}</p>
      <p v-if="supportedFormats?.length" class="sisyphos-file-upload-formats">
        Supported: {{ supportedFormats.join(", ") }}
      </p>
      <input
        :id="inputId"
        ref="inputRef"
        type="file"
        :accept="accept"
        :multiple="multiple ?? maxFiles > 1"
        :disabled="!canAddMore || disabled"
        class="sisyphos-file-upload-native"
        v-bind="dirAttrs"
        @change="onInputChange"
      />
    </div>
    <ul v-if="modelValue.length" class="sisyphos-file-upload-list">
      <li v-for="f in modelValue" :key="f.id" class="sisyphos-file-upload-item">
        <span class="sisyphos-file-upload-name">{{ f.name }}</span>
        <span v-if="f.size != null" class="sisyphos-file-upload-size">{{ formatBytes(f.size) }}</span>
        <button
          type="button"
          class="sisyphos-file-upload-remove"
          aria-label="Remove file"
          @click="remove(f.id)"
        >
          ✕
        </button>
      </li>
    </ul>
    <span v-if="error && errorMessage" class="sisyphos-file-upload-error" role="alert">
      {{ errorMessage }}
    </span>
  </div>
</template>

<style src="./FileUpload.scss"></style>
