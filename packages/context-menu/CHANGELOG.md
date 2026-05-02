# @sisyphos-ui/context-menu

## 0.2.1

### Patch Changes

- 5dadf8c: Nested overlays now close one layer at a time when the user presses Escape. Previously every active `useEscapeKey` subscription received the keystroke and collapsed every layer at once — a Popover opened inside a Dialog would close both, a DatePicker opened inside a Dialog would close both, and so on. The internal hook is now backed by a stack so only the topmost (most recently opened) overlay handles the event, which matches WAI-ARIA expectations and how every native browser dialog behaves.

  This is a transparent improvement for callers — `useEscapeKey`'s signature is unchanged. Re-renders no longer churn the stack thanks to a stable wrapper that always points at the latest callback via a ref.

- Updated dependencies [5dadf8c]
  - @sisyphos-ui/core@0.3.0
  - @sisyphos-ui/portal@0.2.1

## 0.2.0

### Minor Changes

- de95a9a: Added `<ContextMenu>` — a right-click menu anchored at the pointer. Portal-mounted, viewport-clamped so it never opens off-screen, keyboard-navigable (Arrow/Home/End/Enter/Space/Escape), same item shape as `<DropdownMenu>` (actions, separators, labels, destructive variants, shortcut slot). Pairs with `<Table>`'s new `onRowContextMenu`. No runtime dependencies beyond React and `@sisyphos-ui/portal`.
