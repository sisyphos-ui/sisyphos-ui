# @sisyphos-ui/kbd

## 0.2.0

### Minor Changes

- 7ec8bc9: Added new `<Kbd>` component for rendering keyboard keys and shortcut combinations. Platform-aware (`mod` resolves to ⌘ on macOS, ⌃ elsewhere), with built-in glyphs for modifier keys, arrows, and Enter/Tab/Esc. Accepts free-form `children`, an explicit `keys` array, or a `shortcut` string parsed on `+` or whitespace. Useful in dropdown menus, tooltips, and command palette rows.
