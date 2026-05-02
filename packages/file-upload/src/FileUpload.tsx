/**
 * FileUpload — drag-and-drop file picker with client-side validation
 * (`accept`, `maxSize`, `maxFiles`), per-file progress/status, and a
 * customizable file preview.
 *
 * Always controlled: parent owns the list of files via `value`/`onChange`.
 */
import type React from "react";
import { useCallback, useId, useRef, useState } from "react";
import { cx } from "@sisyphos-ui/core/internal";
import type { UploadedFile, RejectReason } from "./types";
import { createId, formatBytes, imagePreview, matchesAccept } from "./utils";
import "./FileUpload.scss";

export interface FileUploadLabels {
  placeholder?: string;
  selectButton?: string;
  supportedFormats?: string;
  maxSize?: (sizeBytes: number) => string;
  uploading?: string;
  completed?: string;
  remove?: string;
}

export interface FileUploadProps {
  value: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  label?: string;
  accept?: string;
  /** Bytes. Default 10 MB. */
  maxSize?: number;
  /** 1 by default. Set higher for multi-upload. */
  maxFiles?: number;
  /** Allow the native input to accept multiple files at once. Default derived from `maxFiles > 1`. */
  multiple?: boolean;
  /**
   * When true, the picker accepts an entire folder via `webkitdirectory`
   * (Chromium / WebKit). The relative path is preserved in `File.webkitRelativePath`
   * if the consumer needs it.
   */
  directory?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  /** List of human-friendly formats shown below the dropzone (e.g. ["PDF", "DOCX"]). */
  supportedFormats?: string[];
  /** Fired when a file is dropped/selected but rejected by validation. */
  onReject?: (file: File, reason: RejectReason) => void;
  /**
   * Called before a file is removed. Return `false` (or a Promise resolving
   * to `false`) to cancel the removal — useful when the parent has to
   * confirm with the user or revoke a server-side resource first. When
   * omitted, removal is unconditional.
   */
  onBeforeRemove?: (file: UploadedFile) => boolean | Promise<boolean>;
  /** Custom renderer for a single file row. Return null to hide. */
  renderFile?: (file: UploadedFile, handlers: { remove: () => void }) => React.ReactNode;
  labels?: FileUploadLabels;
  className?: string;
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

const UploadIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="32"
    height="32"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const FileGeneric = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const RemoveIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path
      d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
      fill="currentColor"
    />
  </svg>
);

export const FileUpload: React.FC<FileUploadProps> = ({
  value,
  onChange,
  label,
  accept,
  maxSize = 10 * 1024 * 1024,
  maxFiles = 1,
  multiple,
  directory = false,
  disabled = false,
  error = false,
  errorMessage,
  supportedFormats,
  onReject,
  onBeforeRemove,
  renderFile,
  labels,
  className,
}) => {
  const L = { ...DEFAULT_LABELS, ...(labels ?? {}) };
  const reactId = useId();
  const inputId = `sisyphos-file-upload-${reactId}`;

  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // `maxFiles=1` always allows replacement; multi-mode gates on remaining slots.
  const canAddMore = !disabled && (maxFiles === 1 || value.length < maxFiles);

  const commit = useCallback((next: UploadedFile[]) => onChange(next), [onChange]);

  const processFiles = useCallback(
    (fileList: FileList | File[]) => {
      const incoming = Array.from(fileList);
      const accepted: UploadedFile[] = [];

      // In single-file mode the new selection always replaces the existing one,
      // so existing items don't count against the slot limit.
      const baseCount = maxFiles === 1 ? 0 : value.length;

      for (const file of incoming) {
        if (baseCount + accepted.length >= maxFiles) {
          onReject?.(file, { kind: "max-files", maxFiles });
          break;
        }
        if (!matchesAccept(file, accept)) {
          onReject?.(file, { kind: "type", accept: accept ?? "*" });
          continue;
        }
        if (file.size > maxSize) {
          onReject?.(file, { kind: "size", maxSize });
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
        if (maxFiles === 1) {
          commit(accepted);
        } else {
          commit([...value, ...accepted]);
        }
      }
    },
    [value, maxFiles, maxSize, accept, onReject, commit]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (canAddMore) setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!canAddMore) return;
    if (e.dataTransfer.files?.length) processFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    processFiles(e.target.files);
    e.target.value = "";
  };

  const openBrowser = () => {
    if (canAddMore) inputRef.current?.click();
  };

  const remove = async (id: string) => {
    const target = value.find((f) => f.id === id);
    if (!target) return;
    if (onBeforeRemove) {
      const allowed = await Promise.resolve(onBeforeRemove(target));
      if (allowed === false) return;
    }
    const next = value.filter((f) => f.id !== id);
    commit(next);
  };

  return (
    <div
      className={cx("sisyphos-file-upload", error && "error", disabled && "disabled", className)}
    >
      {label && (
        <label className="sisyphos-file-upload-label" htmlFor={inputId}>
          {label}
        </label>
      )}

      <div
        className={cx(
          "sisyphos-file-upload-dropzone",
          isDragOver && "drag-over",
          !canAddMore && "disabled"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openBrowser}
        role="button"
        tabIndex={canAddMore ? 0 : -1}
        aria-disabled={!canAddMore || undefined}
        onKeyDown={(e) => {
          if (!canAddMore) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openBrowser();
          }
        }}
      >
        <div className="sisyphos-file-upload-dropzone-icon" aria-hidden="true">
          <UploadIcon />
        </div>
        <div className="sisyphos-file-upload-dropzone-text">
          <p>{L.placeholder}</p>
          <button type="button" className="sisyphos-file-upload-browse" tabIndex={-1}>
            {L.selectButton}
          </button>
        </div>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple ?? maxFiles > 1}
          disabled={!canAddMore}
          onChange={handleInputChange}
          className="sisyphos-file-upload-native"
          // `webkitdirectory` is non-standard but supported on every modern
          // browser. React doesn't know about it as a typed attribute, so
          // we spread it in via a string-key object.
          {...(directory ? { webkitdirectory: "", directory: "" } : {})}
        />
      </div>

      {(supportedFormats?.length || maxSize) && (
        <div className="sisyphos-file-upload-hints">
          {supportedFormats?.length ? (
            <span>
              <strong>{L.supportedFormats}</strong> {supportedFormats.join(", ")}
            </span>
          ) : null}
          <span>{L.maxSize(maxSize)}</span>
        </div>
      )}

      {value.length > 0 && (
        <ul className="sisyphos-file-upload-list">
          {value.map((f) => {
            if (renderFile)
              return <li key={f.id}>{renderFile(f, { remove: () => remove(f.id) })}</li>;
            const uploading = f.status === "uploading";
            const success = f.status === "success";
            const err = f.status === "error";
            return (
              <li key={f.id} className={cx("sisyphos-file-upload-item", err && "error")}>
                <div className="sisyphos-file-upload-item-main">
                  <div className="sisyphos-file-upload-item-icon">
                    {f.preview ? <img src={f.preview} alt="" /> : <FileGeneric />}
                  </div>
                  <div className="sisyphos-file-upload-item-info">
                    <span className="sisyphos-file-upload-item-name" title={f.name}>
                      {f.name}
                    </span>
                    <span className="sisyphos-file-upload-item-meta">
                      {f.size ? formatBytes(f.size) : null}
                      {uploading && f.progress !== undefined
                        ? ` · ${L.uploading} ${f.progress}%`
                        : null}
                      {success ? ` · ${L.completed}` : null}
                      {err ? ` · ${f.error ?? "Upload failed"}` : null}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="sisyphos-file-upload-remove"
                    aria-label={L.remove}
                    onClick={() => remove(f.id)}
                    disabled={disabled}
                  >
                    <RemoveIcon />
                  </button>
                </div>
                {uploading && f.progress !== undefined && (
                  <div className="sisyphos-file-upload-progress">
                    <div
                      className="sisyphos-file-upload-progress-bar"
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {error && errorMessage && (
        <span className="sisyphos-file-upload-error" role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
};
