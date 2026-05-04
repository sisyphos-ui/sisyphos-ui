export type UploadedFileStatus = "pending" | "uploading" | "success" | "error";

export interface UploadedFile {
  /** Stable identifier. */
  id: string;
  /** The underlying File (omit for pre-uploaded URLs). */
  file?: File;
  /** Display name. */
  name: string;
  /** Size in bytes. */
  size?: number;
  /** Remote URL when already uploaded. */
  url?: string;
  /** Optional image preview URL (data: or remote). */
  preview?: string;
  status?: UploadedFileStatus;
  /** 0–100. */
  progress?: number;
  /** Human-readable error when `status === "error"`. */
  error?: string;
}

export type RejectReason =
  | { kind: "type"; accept: string }
  | { kind: "size"; maxSize: number }
  | { kind: "max-files"; maxFiles: number };
