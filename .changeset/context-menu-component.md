---
"@sisyphos-ui/context-menu": minor
"@sisyphos-ui/ui": minor
---

Added `<ContextMenu>` — a right-click menu anchored at the pointer. Portal-mounted, viewport-clamped so it never opens off-screen, keyboard-navigable (Arrow/Home/End/Enter/Space/Escape), same item shape as `<DropdownMenu>` (actions, separators, labels, destructive variants, shortcut slot). Pairs with `<Table>`'s new `onRowContextMenu`. No runtime dependencies beyond React and `@sisyphos-ui/portal`.
