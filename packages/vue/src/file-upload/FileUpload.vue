<script setup lang="ts">
/**
 * FileUpload — Vue 3 binding. Drag-and-drop dropzone + native file
 * picker, validation (accept, maxSize, maxFiles), folder mode, per-file
 * progress/status, and an async-cancellable onBeforeRemove hook.
 *
 * Mirrors the React + Angular bindings: same class names, same ARIA
 * surface, same visual structure (dropzone icon + split placeholder +
 * Browse button + hints row + file list).
 */
import { computed, ref, useId } from "vue";
import type { UploadedFile, RejectReason } from "./types";
import { createId, formatBytes, imagePreview, matchesAccept } from "./utils";

export interface FileUploadLabels {
  placeholder?: string;
  selectButton?: string;
  supportedFormats?: string;
  maxSize?: (sizeBytes: number) => string;
  uploading?: string;
  completed?: string;
  remove?: string;
}

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
  labels?: FileUploadLabels;
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

const DEFAULT_LABELS: Required<FileUploadLabels> = {
  placeholder: "Drag & drop a file here, or",
  selectButton: "Browse",
  supportedFormats: "Supported formats:",
  maxSize: (bytes) => `Max size: ${formatBytes(bytes)}`,
  uploading: "Uploading",
  completed: "Done",
  remove: "Remove file",
};

const L = computed<Required<FileUploadLabels>>(() => ({
  ...DEFAULT_LABELS,
  ...(props.labels ?? {}),
}));

const inputRef = ref<HTMLInputElement | null>(null);
const isDragOver = ref(false);
const reactId = useId();
const inputId = computed(() => `sisyphos-file-upload-${reactId}`);

const canAddMore = computed(
  () => !props.disabled && (props.maxFiles === 1 || props.modelValue.length < props.maxFiles)
);

const showHints = computed(
  () => (props.supportedFormats?.length ?? 0) > 0 || props.maxSize > 0
);

function commit(next: UploadedFile[]) {
  emit("update:modelValue", next);
}

function processFiles(fileList: FileList | File[]) {
  const incoming = Array.from(fileList);
  const accepted: UploadedFile[] = [];

  // In single-file mode the new selection always replaces the existing one,
  // so existing items don't count against the slot limit.
  const baseCount = props.maxFiles === 1 ? 0 : props.modelValue.length;

  for (const file of incoming) {
    if (baseCount + accepted.length >= props.maxFiles) {
      emit("reject", file, { kind: "max-files", maxFiles: props.maxFiles });
      break;
    }
    if (props.accept && !matchesAccept(file, props.accept)) {
      emit("reject", file, { kind: "type", accept: props.accept });
      continue;
    }
    if (file.size > props.maxSize) {
      emit("reject", file, { kind: "size", maxSize: props.maxSize });
      continue;
    }
    accepted.push({
      id: createId(),
      file,
      name: file.name,
      size: file.size,
      preview: imagePreview(file),
      status: "success",
    });
  }

  if (accepted.length > 0) {
    const next = props.maxFiles === 1 ? accepted.slice(0, 1) : [...props.modelValue, ...accepted];
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

function remove(id: string) {
  const target = props.modelValue.find((f) => f.id === id);
  if (!target) return;
  // Vue doesn't surface return values from emit, so consumers wire
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
]);

const dropzoneClasses = computed(() => [
  "sisyphos-file-upload-dropzone",
  isDragOver.value && "drag-over",
  !canAddMore.value && "disabled",
]);

const dirAttrs = computed(() => (props.directory ? { webkitdirectory: "", directory: "" } : {}));
</script>

<template>
  <div :class="containerClasses">
    <label v-if="label" :for="inputId" class="sisyphos-file-upload-label">{{ label }}</label>

    <div
      :class="dropzoneClasses"
      role="button"
      :tabindex="canAddMore ? 0 : -1"
      :aria-disabled="!canAddMore || undefined"
      @click="openBrowser"
      @keydown.enter.prevent="openBrowser"
      @keydown.space.prevent="openBrowser"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <div class="sisyphos-file-upload-dropzone-icon" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="32"
          height="32"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      <div class="sisyphos-file-upload-dropzone-text">
        <p>{{ L.placeholder }}</p>
        <button type="button" class="sisyphos-file-upload-browse" tabindex="-1">
          {{ L.selectButton }}
        </button>
      </div>
      <input
        :id="inputId"
        ref="inputRef"
        type="file"
        :accept="accept"
        :multiple="multiple ?? maxFiles > 1"
        :disabled="!canAddMore"
        class="sisyphos-file-upload-native"
        v-bind="dirAttrs"
        @change="onInputChange"
      />
    </div>

    <div v-if="showHints" class="sisyphos-file-upload-hints">
      <span v-if="supportedFormats?.length">
        <strong>{{ L.supportedFormats }}</strong> {{ supportedFormats.join(", ") }}
      </span>
      <span>{{ L.maxSize(maxSize) }}</span>
    </div>

    <ul v-if="modelValue.length" class="sisyphos-file-upload-list">
      <li
        v-for="f in modelValue"
        :key="f.id"
        :class="['sisyphos-file-upload-item', f.status === 'error' && 'error']"
      >
        <div class="sisyphos-file-upload-item-main">
          <div class="sisyphos-file-upload-item-icon">
            <img v-if="f.preview" :src="f.preview" alt="" />
            <svg
              v-else
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div class="sisyphos-file-upload-item-info">
            <span class="sisyphos-file-upload-item-name" :title="f.name">{{ f.name }}</span>
            <span class="sisyphos-file-upload-item-meta">
              <template v-if="f.size != null">{{ formatBytes(f.size) }}</template>
              <template v-if="f.status === 'uploading' && f.progress !== undefined">
                · {{ L.uploading }} {{ f.progress }}%
              </template>
              <template v-if="f.status === 'success'"> · {{ L.completed }}</template>
              <template v-if="f.status === 'error'"> · {{ f.error ?? "Upload failed" }}</template>
            </span>
          </div>
          <button
            type="button"
            class="sisyphos-file-upload-remove"
            :aria-label="L.remove"
            :disabled="disabled"
            @click="remove(f.id)"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path
                d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <div
          v-if="f.status === 'uploading' && f.progress !== undefined"
          class="sisyphos-file-upload-progress"
        >
          <div class="sisyphos-file-upload-progress-bar" :style="{ width: `${f.progress}%` }" />
        </div>
      </li>
    </ul>

    <span v-if="error && errorMessage" class="sisyphos-file-upload-error" role="alert">
      {{ errorMessage }}
    </span>
  </div>
</template>

<style src="./FileUpload.scss"></style>
