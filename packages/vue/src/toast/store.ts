/**
 * Toast store — framework-agnostic queue with subscribe/dismiss/clear.
 *
 * Mirrors the React store at @sisyphos-ui/react's `toastStore` exactly,
 * minus the React-specific `ReactNode` type. Frameworks render whatever
 * the host treats as a renderable (string in templates, VNode in Vue).
 */

export type ToastType = "default" | "success" | "error" | "warning" | "info" | "loading";

export interface ToastOptions {
  title?: string;
  description?: string;
  icon?: unknown;
  /** Auto-dismiss delay (ms). Pass Infinity to persist. Defaults to 4000. */
  duration?: number;
  /** Show the X close button. Defaults to true. */
  dismissible?: boolean;
  onDismiss?: (id: string) => void;
  id?: string;
}

export interface ToastRecord {
  id: string;
  type: ToastType;
  title?: string;
  description?: string;
  icon?: unknown;
  duration: number;
  dismissible: boolean;
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

function add(type: ToastType, msgOrOpts: string | ToastOptions, maybeOpts?: ToastOptions): string {
  const opts: ToastOptions =
    typeof msgOrOpts === "object" && msgOrOpts !== null
      ? (msgOrOpts as ToastOptions)
      : { title: msgOrOpts as string, ...(maybeOpts ?? {}) };
  const id = opts.id ?? `t${Date.now()}-${++counter}`;
  const record: ToastRecord = {
    id,
    type,
    title: opts.title,
    description: opts.description,
    icon: opts.icon,
    onDismiss: opts.onDismiss,
    duration: opts.duration ?? 4000,
    dismissible: opts.dismissible ?? true,
    createdAt: Date.now(),
  };
  const idx = state.findIndex((t) => t.id === id);
  if (idx >= 0) state = state.map((t, i) => (i === idx ? record : t));
  else state = [...state, record];
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

export interface ToastFn {
  (message: string, opts?: ToastOptions): string;
  (opts: ToastOptions): string;
  default: (message: string, opts?: ToastOptions) => string;
  success: (message: string, opts?: ToastOptions) => string;
  error: (message: string, opts?: ToastOptions) => string;
  warning: (message: string, opts?: ToastOptions) => string;
  info: (message: string, opts?: ToastOptions) => string;
  loading: (message: string, opts?: ToastOptions) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

const baseFn = ((m: string | ToastOptions, opts?: ToastOptions) =>
  add("default", m, opts)) as ToastFn;
baseFn.default = (m, opts) => add("default", m, opts);
baseFn.success = (m, opts) => add("success", m, opts);
baseFn.error = (m, opts) => add("error", m, opts);
baseFn.warning = (m, opts) => add("warning", m, opts);
baseFn.info = (m, opts) => add("info", m, opts);
baseFn.loading = (m, opts) => add("loading", m, opts);
baseFn.dismiss = (id) => toastStore.dismiss(id);
baseFn.clear = () => toastStore.clear();

export const toast: ToastFn = baseFn;
