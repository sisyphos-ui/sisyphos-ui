---
"@sisyphos-ui/core": minor
"@sisyphos-ui/dialog": patch
"@sisyphos-ui/popover": patch
"@sisyphos-ui/dropdown-menu": patch
"@sisyphos-ui/select": patch
"@sisyphos-ui/datepicker": patch
"@sisyphos-ui/tree-select": patch
"@sisyphos-ui/context-menu": patch
"@sisyphos-ui/button": patch
"@sisyphos-ui/ui": patch
---

Nested overlays now close one layer at a time when the user presses Escape. Previously every active `useEscapeKey` subscription received the keystroke and collapsed every layer at once — a Popover opened inside a Dialog would close both, a DatePicker opened inside a Dialog would close both, and so on. The internal hook is now backed by a stack so only the topmost (most recently opened) overlay handles the event, which matches WAI-ARIA expectations and how every native browser dialog behaves.

This is a transparent improvement for callers — `useEscapeKey`'s signature is unchanged. Re-renders no longer churn the stack thanks to a stable wrapper that always points at the latest callback via a ref.
