/**
 * Toaster — host for the toast queue.
 *
 * Mount once near the app root. Subscribes to the toast store and renders the
 * active queue inside a portal with auto-dismiss, pause-on-hover, and stacking.
 */
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Portal } from "@sisyphos-ui/portal";
import { cx } from "@sisyphos-ui/core/internal";
import { toastStore, type ToastRecord } from "./store";
import { DEFAULT_ICONS } from "./icons";
import "./Toast.scss";

export type ToasterPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToasterProps {
  position?: ToasterPosition;
  /** Max toasts visible at once. Excess remain queued in state. */
  max?: number;
  /** Gap between toasts in px. */
  gap?: number;
  className?: string;
}

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
    <path
      d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
      fill="currentColor"
    />
  </svg>
);

function ToastItem({
  record,
  onDismiss,
}: {
  record: ToastRecord;
  onDismiss: (id: string) => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (record.duration === Infinity) return;
    if (paused) return;
    timerRef.current = setTimeout(() => onDismiss(record.id), record.duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [record.id, record.duration, onDismiss, paused]);

  const icon = record.icon === null ? null : (record.icon ?? DEFAULT_ICONS[record.type]);

  return (
    <div
      className={cx("sisyphos-toast", record.type)}
      role={record.type === "error" ? "alert" : "status"}
      aria-live={record.type === "error" ? "assertive" : "polite"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {icon && <div className="sisyphos-toast-icon">{icon}</div>}
      <div className="sisyphos-toast-body">
        {record.title && <div className="sisyphos-toast-title">{record.title}</div>}
        {record.description && (
          <div className="sisyphos-toast-description">{record.description}</div>
        )}
      </div>
      {record.action && <div className="sisyphos-toast-action">{record.action}</div>}
      {record.dismissible && (
        <button
          type="button"
          className="sisyphos-toast-close"
          onClick={() => onDismiss(record.id)}
          aria-label="Dismiss notification"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
}

export const Toaster: React.FC<ToasterProps> = ({
  position = "bottom-right",
  max = 5,
  gap = 8,
  className,
}) => {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);

  useEffect(() => toastStore.subscribe(setToasts), []);

  const visible = useMemo(() => toasts.slice(-max), [toasts, max]);
  const isTop = position.startsWith("top");

  return (
    <Portal>
      <div
        className={cx("sisyphos-toaster", position, className)}
        style={{ gap, flexDirection: isTop ? "column" : "column-reverse" }}
      >
        {visible.map((record) => (
          <ToastItem key={record.id} record={record} onDismiss={toastStore.dismiss} />
        ))}
      </div>
    </Portal>
  );
};
