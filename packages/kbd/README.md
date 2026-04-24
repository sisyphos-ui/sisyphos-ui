# @sisyphos-ui/kbd

A tiny `<Kbd>` for keyboard keys and shortcut combinations. Platform-aware (`mod` → ⌘ on macOS, ⌃ elsewhere), with built-in glyphs for modifier keys, arrows, Enter/Tab/Esc, etc.

## Install

```bash
pnpm add @sisyphos-ui/kbd
```

If you're already using `@sisyphos-ui/ui`, `Kbd` is re-exported there — no separate install needed.

## Usage

```tsx
import { Kbd } from "@sisyphos-ui/kbd";
import "@sisyphos-ui/kbd/styles.css";

// Free-form single key
<Kbd>Esc</Kbd>

// Shortcut string — parsed on "+" or whitespace
<Kbd shortcut="cmd+k" />          // ⌘ K
<Kbd shortcut="ctrl+shift+p" />   // ⌃ ⇧ P

// Explicit keys array
<Kbd keys={["cmd", "k"]} />

// Platform-aware: ⌘ on macOS, ⌃ elsewhere
<Kbd shortcut="mod+s" />

// Visible separator
<Kbd shortcut="cmd+k" separator="+" />
```

## Props

| Prop        | Type                              | Default      | Description                                                      |
| ----------- | --------------------------------- | ------------ | ---------------------------------------------------------------- |
| `variant`   | `"outlined" \| "soft"`            | `"outlined"` | Chip style.                                                      |
| `size`      | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"sm"`  | Size scale.                                                      |
| `children`  | `ReactNode`                       | —            | Free-form content; rendered inside a single `<kbd>`.             |
| `keys`      | `string[]`                        | —            | Explicit list of keys. Aliases normalized to glyphs.             |
| `shortcut`  | `string`                          | —            | Shortcut string; split on `+` and whitespace.                    |
| `separator` | `ReactNode`                       | —            | Node rendered between keys. Omit to join visually.               |

Pick one of `children`, `keys`, or `shortcut`.

### Supported aliases

`cmd`, `command`, `meta` → ⌘ · `ctrl`, `control` → ⌃ · `alt`, `option`, `opt` → ⌥ · `shift` → ⇧ · `enter`, `return` → ↵ · `tab` → ⇥ · `backspace` → ⌫ · `delete` → ⌦ · `esc`, `escape` → ⎋ · `space` → ␣ · `up`/`down`/`left`/`right` → ↑↓←→ · `pageup`/`pagedown` → ⇞⇟ · `home`/`end` → ↖↘ · `mod` → ⌘ on macOS, ⌃ elsewhere.

Single letters are uppercased for display; unknown multi-character tokens (`F1`, `Fn`, …) are preserved as-is.

## Accessibility

- Single-key mode renders a real `<kbd>` element.
- Multi-key mode wraps the keys in a `<span role="group">`, so an `aria-label` reads as one unit to screen readers.
