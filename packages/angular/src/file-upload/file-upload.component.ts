/**
 * FileUpload — Angular 18 standalone drag-and-drop file picker.
 *
 * Always controlled — `[(value)]` owns the file list. Client-side validation
 * via `accept`, `maxSize`, `maxFiles`. Per-file progress + status. Mirrors
 * the React/Vue versions exactly.
 *
 * @example
 *   <sui-file-upload
 *     [(value)]="files"
 *     accept="image/*,.pdf"
 *     [maxSize]="5 * 1024 * 1024"
 *     [maxFiles]="3"
 *     [supportedFormats]="['JPG', 'PNG', 'PDF']"
 *     (reject)="onReject($event)"
 *   />
 */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input as NgInput,
  Output,
  ViewChild,
  computed,
  signal,
} from "@angular/core";
import { createId, formatBytes, imagePreview, matchesAccept } from "./utils";
import type { RejectReason, UploadedFile } from "./types";

let fileUploadCounter = 0;

interface FileUploadLabels {
  placeholder?: string;
  selectButton?: string;
  supportedFormats?: string;
  maxSize?: (bytes: number) => string;
  uploading?: string;
  completed?: string;
  remove?: string;
}

const DEFAULT_LABELS: Required<FileUploadLabels> = {
  placeholder: "Drag & drop a file here, or",
  selectButton: "Browse",
  supportedFormats: "Supported formats:",
  maxSize: (bytes) => `Max size: ${formatBytes(bytes)}`,
  uploading: "Uploading",
  completed: "Done",
  remove: "Remove file",
};

@Component({
  selector: "sui-file-upload",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="rootClasses()">
      @if (label()) {
        <label class="sisyphos-file-upload-label" [attr.for]="inputId">{{ label() }}</label>
      }
      <div
        [class]="dropzoneClasses()"
        role="button"
        [tabindex]="canAddMore() ? 0 : -1"
        [attr.aria-disabled]="!canAddMore() || null"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="openBrowser()"
        (keydown)="onKeydown($event)"
      >
        <div class="sisyphos-file-upload-dropzone-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <div class="sisyphos-file-upload-dropzone-text">
          <p>{{ effectiveLabels().placeholder }}</p>
          <button type="button" class="sisyphos-file-upload-browse" [tabindex]="-1">
            {{ effectiveLabels().selectButton }}
          </button>
        </div>
        <input
          #fileInput
          [id]="inputId"
          type="file"
          [attr.accept]="accept() || null"
          [attr.multiple]="effectiveMultiple() || null"
          [attr.webkitdirectory]="directory() ? '' : null"
          [attr.directory]="directory() ? '' : null"
          [disabled]="!canAddMore()"
          (change)="onInputChange($event)"
          class="sisyphos-file-upload-native"
        />
      </div>

      @if (showHints()) {
        <div class="sisyphos-file-upload-hints">
          @if (supportedFormats()?.length) {
            <span>
              <strong>{{ effectiveLabels().supportedFormats }}</strong>
              {{ supportedFormats()!.join(", ") }}
            </span>
          }
          <span>{{ effectiveLabels().maxSize(maxSize()) }}</span>
        </div>
      }

      @if (value().length > 0) {
        <ul class="sisyphos-file-upload-list">
          @for (f of value(); track f.id) {
            <li [class]="itemClasses(f)">
              <div class="sisyphos-file-upload-item-main">
                <div class="sisyphos-file-upload-item-icon">
                  @if (f.preview) {
                    <img [src]="f.preview" alt="" />
                  } @else {
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  }
                </div>
                <div class="sisyphos-file-upload-item-info">
                  <span class="sisyphos-file-upload-item-name" [title]="f.name">{{ f.name }}</span>
                  <span class="sisyphos-file-upload-item-meta">{{ metaFor(f) }}</span>
                </div>
                <button
                  type="button"
                  class="sisyphos-file-upload-remove"
                  [attr.aria-label]="effectiveLabels().remove"
                  [disabled]="disabled()"
                  (click)="remove(f.id)"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
                  </svg>
                </button>
              </div>
              @if (f.status === 'uploading' && f.progress !== undefined) {
                <div class="sisyphos-file-upload-progress">
                  <div class="sisyphos-file-upload-progress-bar" [style.width.%]="f.progress"></div>
                </div>
              }
            </li>
          }
        </ul>
      }

      @if (error() && errorMessage()) {
        <span class="sisyphos-file-upload-error" role="alert">{{ errorMessage() }}</span>
      }
    </div>
  `,
})
export class FileUpload {
  readonly inputId = `sisyphos-file-upload-${++fileUploadCounter}`;

  private readonly _value = signal<UploadedFile[]>([]);
  private readonly _label = signal<string | undefined>(undefined);
  private readonly _accept = signal<string | undefined>(undefined);
  private readonly _maxSize = signal<number>(10 * 1024 * 1024);
  private readonly _maxFiles = signal<number>(1);
  private readonly _multiple = signal<boolean | undefined>(undefined);
  private readonly _directory = signal(false);
  private readonly _disabled = signal(false);
  private readonly _error = signal(false);
  private readonly _errorMessage = signal<string | undefined>(undefined);
  private readonly _supportedFormats = signal<string[] | undefined>(undefined);
  private readonly _labels = signal<FileUploadLabels | undefined>(undefined);

  private readonly _isDragOver = signal(false);

  readonly value = this._value.asReadonly();
  readonly label = this._label.asReadonly();
  readonly accept = this._accept.asReadonly();
  readonly maxSize = this._maxSize.asReadonly();
  readonly directory = this._directory.asReadonly();
  readonly disabled = this._disabled.asReadonly();
  readonly error = this._error.asReadonly();
  readonly errorMessage = this._errorMessage.asReadonly();
  readonly supportedFormats = this._supportedFormats.asReadonly();

  @NgInput("value") set valueInput(v: UploadedFile[] | undefined) {
    this._value.set(v ?? []);
  }
  @NgInput("label") set labelInput(v: string | undefined) { this._label.set(v); }
  @NgInput("accept") set acceptInput(v: string | undefined) { this._accept.set(v); }
  @NgInput("maxSize") set maxSizeInput(v: number) { this._maxSize.set(v); }
  @NgInput("maxFiles") set maxFilesInput(v: number) { this._maxFiles.set(v); }
  @NgInput("multiple") set multipleInput(v: boolean | undefined) { this._multiple.set(v); }
  @NgInput("directory") set directoryInput(v: boolean) { this._directory.set(v); }
  @NgInput("disabled") set disabledInput(v: boolean) { this._disabled.set(v); }
  @NgInput("error") set errorInput(v: boolean) { this._error.set(v); }
  @NgInput("errorMessage") set errorMessageInput(v: string | undefined) {
    this._errorMessage.set(v);
  }
  @NgInput("supportedFormats") set supportedFormatsInput(v: string[] | undefined) {
    this._supportedFormats.set(v);
  }
  @NgInput("labels") set labelsInput(v: FileUploadLabels | undefined) { this._labels.set(v); }

  /** Two-way `[(value)]` for the file list. */
  @Output() readonly valueChange = new EventEmitter<UploadedFile[]>();
  /** Fired when a dropped/selected file fails validation. */
  @Output() readonly reject = new EventEmitter<{ file: File; reason: RejectReason }>();
  /** Returning `false` (or a Promise<false>) cancels removal. */
  @NgInput("onBeforeRemove") onBeforeRemove?: (file: UploadedFile) => boolean | Promise<boolean>;

  @ViewChild("fileInput") fileInputRef?: ElementRef<HTMLInputElement>;

  readonly canAddMore = computed(
    () => !this._disabled() && (this._maxFiles() === 1 || this._value().length < this._maxFiles())
  );

  readonly effectiveMultiple = computed(
    () => this._multiple() ?? this._maxFiles() > 1
  );

  readonly showHints = computed(
    () => Boolean((this._supportedFormats()?.length ?? 0) > 0 || this._maxSize())
  );

  readonly effectiveLabels = computed<Required<FileUploadLabels>>(() => ({
    ...DEFAULT_LABELS,
    ...(this._labels() ?? {}),
  }));

  readonly rootClasses = computed(() =>
    [
      "sisyphos-file-upload",
      this._error() && "error",
      this._disabled() && "disabled",
    ]
      .filter(Boolean)
      .join(" ")
  );

  readonly dropzoneClasses = computed(() =>
    [
      "sisyphos-file-upload-dropzone",
      this._isDragOver() && "drag-over",
      !this.canAddMore() && "disabled",
    ]
      .filter(Boolean)
      .join(" ")
  );

  itemClasses(f: UploadedFile): string {
    return ["sisyphos-file-upload-item", f.status === "error" && "error"]
      .filter(Boolean)
      .join(" ");
  }

  metaFor(f: UploadedFile): string {
    const parts: string[] = [];
    if (f.size) parts.push(formatBytes(f.size));
    const labels = this.effectiveLabels();
    if (f.status === "uploading" && f.progress !== undefined) {
      parts.push(`${labels.uploading} ${f.progress}%`);
    } else if (f.status === "success") {
      parts.push(labels.completed);
    } else if (f.status === "error") {
      parts.push(f.error ?? "Upload failed");
    }
    return parts.join(" · ");
  }

  // ── Event handlers ────────────────────────────────────────────────────

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (this.canAddMore()) this._isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this._isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this._isDragOver.set(false);
    if (!this.canAddMore()) return;
    if (event.dataTransfer?.files?.length) this.processFiles(event.dataTransfer.files);
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.processFiles(input.files);
    input.value = "";
  }

  openBrowser(): void {
    if (this.canAddMore()) this.fileInputRef?.nativeElement.click();
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.canAddMore()) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.openBrowser();
    }
  }

  async remove(id: string): Promise<void> {
    const target = this._value().find((f) => f.id === id);
    if (!target) return;
    if (this.onBeforeRemove) {
      const allowed = await Promise.resolve(this.onBeforeRemove(target));
      if (allowed === false) return;
    }
    const next = this._value().filter((f) => f.id !== id);
    this._value.set(next);
    this.valueChange.emit(next);
  }

  private processFiles(fileList: FileList | File[]): void {
    const incoming = Array.from(fileList);
    const accepted: UploadedFile[] = [];
    const baseCount = this._maxFiles() === 1 ? 0 : this._value().length;

    for (const file of incoming) {
      if (baseCount + accepted.length >= this._maxFiles()) {
        this.reject.emit({ file, reason: { kind: "max-files", maxFiles: this._maxFiles() } });
        break;
      }
      if (!matchesAccept(file, this._accept())) {
        this.reject.emit({ file, reason: { kind: "type", accept: this._accept() ?? "*" } });
        continue;
      }
      if (file.size > this._maxSize()) {
        this.reject.emit({ file, reason: { kind: "size", maxSize: this._maxSize() } });
        continue;
      }
      accepted.push({
        id: createId(),
        file,
        name: file.name,
        size: file.size,
        preview: imagePreview(file),
        status: "pending",
      });
    }

    if (accepted.length > 0) {
      const next = this._maxFiles() === 1 ? accepted : [...this._value(), ...accepted];
      this._value.set(next);
      this.valueChange.emit(next);
    }
  }
}
