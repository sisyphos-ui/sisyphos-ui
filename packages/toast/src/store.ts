import type { ReactNode } from "react";

export type ToastType = "default" | "success" | "error" | "warning" | "info";

export interface ToastOptions {
  /** Short summary. */
  title?: ReactNode;
  /** Longer explanation. */
  description?: ReactNode;
  /** Override default icon. Pass `null` to hide. */
  icon?: ReactNode | null;
  /** Auto-dismiss delay (ms). Pass Infinity to persist. Defaults to 4000. */
  duration?: number;
  /** Action element (button) rendered on the right. */
  action?: ReactNode;
  /** Show the X close button. Defaults to true. */
  dismissible?: boolean;
  /** Fired when the toast is removed for any reason. */
  onDismiss?: (id: string) => void;
  /** Override/provide id for update/dedup. */
  id?: string;
}

export interface ToastRecord extends Required<Omit<ToastOptions, "icon" | "title" | "description" | "action" | "onDismiss">> {
  id: string;
  type: ToastType;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode | null;
  action?: ReactNode;
  onDismiss?: (id: string) => void;
  createdAt: number;
}

type Listener = (toasts: ToastRecord[]) => void;

let counter = 0;
const listeners = new Set<Listener>();
let state: ToastRecord[] = [];

function emit() {
  for (const l of listeners) l([...state]);
}

function add(type: ToastType, messageOrOptions: ReactNode | ToastOptions, maybeOpts?: ToastOptions): string {
  const opts: ToastOptions =
    typeof messageOrOptions === "object" && messageOrOptions !== null && "title" in (messageOrOptions as object)
      ? (messageOrOptions as ToastOptions)
      : { title: messageOrOptions as ReactNode, ...(maybeOpts ?? {}) };
  const id = opts.id ?? `t${Date.now()}-${++counter}`;
  const record: ToastRecord = {
    id,
    type,
    title: opts.title,
    description: opts.description,
    icon: opts.icon,
    action: opts.action,
    onDismiss: opts.onDismiss,
    duration: opts.duration ?? 4000,
    dismissible: opts.dismissible ?? true,
    createdAt: Date.now(),
  };
  // Replace any existing toast with the same id (used by `update`-style flows).
  const idx = state.findIndex((t) => t.id === id);
  if (idx >= 0) {
    state = state.map((t, i) => (i === idx ? record : t));
  } else {
    state = [...state, record];
  }
  emit();
  return id;
}

export const toastStore = {
  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    fn([...state]);
    return () => {
      listeners.delete(fn);
    };
  },
  dismiss(id: string) {
    const found = state.find((t) => t.id === id);
    state = state.filter((t) => t.id !== id);
    emit();
    found?.onDismiss?.(id);
  },
  clear() {
    const prev = state;
    state = [];
    emit();
    for (const t of prev) t.onDismiss?.(t.id);
  },
};

export type ToastFn = {
  (title: ReactNode, options?: ToastOptions): string;
  success: (title: ReactNode, options?: ToastOptions) => string;
  error: (title: ReactNode, options?: ToastOptions) => string;
  warning: (title: ReactNode, options?: ToastOptions) => string;
  info: (title: ReactNode, options?: ToastOptions) => string;
  custom: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

const toastFn: ToastFn = (title, options) => add("default", title, options);
toastFn.success = (title, options) => add("success", title, options);
toastFn.error = (title, options) => add("error", title, options);
toastFn.warning = (title, options) => add("warning", title, options);
toastFn.info = (title, options) => add("info", title, options);
toastFn.custom = (options) => add("default", options);
toastFn.dismiss = (id) => toastStore.dismiss(id);
toastFn.clear = () => toastStore.clear();

export const toast = toastFn;
