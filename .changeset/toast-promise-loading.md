---
"@sisyphos-ui/toast": minor
---

Added `toast.loading(title)` and `toast.promise(promise, { loading, success, error })`. Loading toasts render with a neutral accent and an animated spinner icon, default to `duration: Infinity` and `dismissible: false`. `toast.promise` reuses a single id so the border and icon transition in place when the promise settles — the loading toast morphs into a success or error toast without popping a new one. `success`/`error` accept either a `ReactNode` or a function of the resolved value / thrown error.

Also fixed action and close-button vertical alignment: they now center against the full toast body (previously pinned to the title baseline, which left "Undo" looking top-aligned when a description was present).
