# @sisyphos-ui/command

A keyboard-first command palette / filterable menu. Compound API, case-insensitive substring filtering, arrow-key navigation, no runtime dependencies beyond React.

## Install

```bash
pnpm add @sisyphos-ui/command
```

Included in `@sisyphos-ui/ui`.

## Usage

```tsx
import { Command } from "@sisyphos-ui/command";
import "@sisyphos-ui/command/styles.css";

<Command onSelect={(value) => run(value)}>
  <Command.Input placeholder="Type a command…" />
  <Command.List>
    <Command.Empty>No results.</Command.Empty>
    <Command.Group heading="Suggestions">
      <Command.Item value="calendar">Calendar</Command.Item>
      <Command.Item value="search">Search</Command.Item>
    </Command.Group>
    <Command.Separator />
    <Command.Group heading="Settings">
      <Command.Item value="profile">Profile</Command.Item>
      <Command.Item value="billing">Billing</Command.Item>
    </Command.Group>
  </Command.List>
</Command>
```

Wrap the `<Command>` in a `<Dialog>` for the classic `⌘K` command-menu experience.

## Composition

| Component            | Purpose                                                                                 |
| -------------------- | --------------------------------------------------------------------------------------- |
| `Command`            | Root; holds search state, registers items, emits `onSelect`.                            |
| `Command.Input`      | Text input wired to the search state. ArrowUp/Down/Enter handled here.                  |
| `Command.List`       | Scrollable listbox region.                                                              |
| `Command.Empty`      | Rendered when no items match.                                                           |
| `Command.Group`      | Optional section with a heading. Auto-hides when all its items filter out.              |
| `Command.Item`       | Selectable row. Filtered by `value` (falls back to the item's text).                    |
| `Command.Separator`  | Visual divider.                                                                         |

## Keyboard

| Key              | Behavior                           |
| ---------------- | ---------------------------------- |
| `ArrowUp`/`Down` | Move active item (wraps).          |
| `Home`/`End`     | First / last matching item.        |
| `Enter`          | Select active item.                |

## Accessibility

- Root exposes `role="combobox"` with `aria-controls` pointing at the list.
- Input has `role="searchbox"`, `aria-autocomplete="list"`, and `aria-activedescendant` tracking the active item.
- List is `role="listbox"`, items are `role="option"`.
