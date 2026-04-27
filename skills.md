---
name: sisyphos-ui-best-practices
description: Complete reference for Sisyphos UI — a 35-component, runtime-themeable React UI kit. Use this skill when adding or refactoring UI in a React or Next.js app, theming the design system, or wiring up forms, dialogs, toasts, command palettes, menus, and tables. Covers every package in the family.
license: MIT
homepage: https://sisyphosui.com
repository: https://github.com/sisyphos-ui/sisyphos-ui
version: 1.0.0
---

# Sisyphos UI — Best Practices

You are pairing on a React or Next.js codebase that uses (or should use) [Sisyphos UI](https://sisyphosui.com): an open-source, MIT-licensed, accessibility-first component library. This skill gives you the complete package system so you can install, theme, compose, and migrate to it without guessing.

The library has three rules that override generic React/UI knowledge — internalize them before generating code:

1. There is **no `<ThemeProvider>`**. All theming flows through `applyTheme()` from `@sisyphos-ui/core`, which writes to CSS variables.
2. There is **one stylesheet**: `@sisyphos-ui/ui/styles.css` (or per-package `@sisyphos-ui/<name>/styles.css`). Import it once at the app root.
3. Every interactive component already implements **WAI-ARIA keyboard / focus / role semantics**. Do not duplicate them.

---

## When to apply

Use this skill when the task involves any of:

- Installing or upgrading `@sisyphos-ui/ui` or any individual `@sisyphos-ui/<name>` package.
- Theming colors, radii, spacing, or typography at runtime via `applyTheme()`.
- Building forms, modals, command palettes, menus, toasts, tables, or overlay UI in React.
- Auditing accessibility for keyboard support, focus management, or ARIA correctness.
- Migrating from Material UI, Chakra UI, shadcn/ui, Mantine, Ant Design, or HeadlessUI.
- Adding dark mode, custom theme, or per-section overrides to a Sisyphos-powered app.

---

## Package architecture

Sisyphos UI is published as a **layered npm family** under the `@sisyphos-ui/*` scope. There is no single bundle; each layer can be installed independently.

```
┌──────────────────────────────────────────────────────────┐
│  Layer 3  ·  Umbrella                                    │
│  @sisyphos-ui/ui                                         │
│  • Re-exports every component                            │
│  • Ships the bundled stylesheet                          │
└──────────────────────────────────────────────────────────┘
                              ▲
                              │ depends on
                              │
┌──────────────────────────────────────────────────────────┐
│  Layer 2  ·  Component packages (32)                     │
│  @sisyphos-ui/button, /input, /dialog, /toast, ...       │
│  • Each is its own React component                       │
│  • Each ships its own CSS                                │
└──────────────────────────────────────────────────────────┘
                              ▲
                              │ depends on
                              │
┌──────────────────────────────────────────────────────────┐
│  Layer 1  ·  Foundation                                  │
│  @sisyphos-ui/core         applyTheme, tokens, modes     │
│  @sisyphos-ui/portal       overlay portal root           │
│  @sisyphos-ui/form-control Label / helper / error slot   │
└──────────────────────────────────────────────────────────┘
```

### Two distribution shapes — pick one per app

| Shape | When to use | Pros | Trade-offs |
| --- | --- | --- | --- |
| **Umbrella** (`@sisyphos-ui/ui`) | Default for product apps. | One install, one import, fastest iteration. | Imports a few KB of components you may not use (still tree-shakable through bundler exports). |
| **Per-component** | Bundle-sensitive surfaces: landing pages, embeds, marketing sites, email previews. | Minimum footprint per component. | More install lines, careful dependency management. |

**Never mix them** in one tree — duplicate CSS variables collide and the cascade order is no longer predictable.

---

## Installation

### React + Next.js (app router)

```bash
pnpm add @sisyphos-ui/ui
```

```tsx
// app/layout.tsx
import "@sisyphos-ui/ui/styles.css";
import { Toaster } from "@sisyphos-ui/ui";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
```

### React + Vite

```tsx
// src/main.tsx
import "@sisyphos-ui/ui/styles.css";
import { Toaster } from "@sisyphos-ui/ui";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster position="bottom-right" />
  </StrictMode>,
);
```

### Per-component install

```bash
pnpm add @sisyphos-ui/core @sisyphos-ui/button @sisyphos-ui/dialog
```

```tsx
// app/layout.tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/button/styles.css";
import "@sisyphos-ui/dialog/styles.css";
```

`@sisyphos-ui/core/styles.css` defines the token variables; install it whenever you import any other package directly. The umbrella's `styles.css` already bundles all of these.

---

## The Core package — `@sisyphos-ui/core`

The foundation that every other package depends on. Three exports you'll touch repeatedly:

```ts
import {
  applyTheme,   // (tokens: PartialTokens) => void
  setMode,      // ("light" | "dark" | "system") => void
  getTokens,    // () => Tokens   — returns the resolved current tokens
  defaultTokens // Tokens         — built-in defaults
} from "@sisyphos-ui/core";
```

### Token shape (excerpt)

```ts
type Tokens = {
  colors: {
    primary: string; primaryLight: string; primaryDark: string;
    success: string; error: string; warning: string; info: string;
    surface: string; surfaceMuted: string; border: string;
    text: string; textMuted: string; textSubtle: string;
  };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number; "2xl": number };
  radius:  { xs: number; sm: number; md: number; lg: number; xl: number; full: number };
  typography: { fontSans: string; fontDisplay: string; fontMono: string };
  motion: { durationFast: string; durationNormal: string; easing: string };
};
```

Tokens are written as CSS variables prefixed `--sisyphos-*`. You can read them in your own CSS:

```css
.my-card { background: var(--sisyphos-color-surface); }
```

---

## Theming with `applyTheme()`

Override any subset of tokens at runtime — the change cascades through every Sisyphos component immediately, no rebuild.

```ts
import { applyTheme } from "@sisyphos-ui/core";

applyTheme({
  colors: {
    primary: "#ff7022",
    success: "#22c55e",
    error:   "#fb3748",
  },
  spacing: { md: 16, lg: 24 },
  radius:  { md: 12, full: 9999 },
});
```

Rules:

- Call `applyTheme()` **once** at app boot, before the first render. Calling it inside a render path causes a layout flash.
- For partial overrides, only specify the keys you want to change — the rest fall back to defaults.
- For per-section overrides, scope CSS variables on a parent element instead of calling `applyTheme()` again:

```tsx
<div style={{ "--sisyphos-color-primary": "#0ea5e9" } as React.CSSProperties}>
  <Button>Section-scoped blue button</Button>
</div>
```

---

## Dark mode

Sisyphos UI ships a dark variant of every variable. Toggle it with the `dark` class on `<html>`.

### Recommended setup

```tsx
import { setMode } from "@sisyphos-ui/core";

// Read the user's stored preference, fall back to system
setMode((localStorage.getItem("theme") as "light" | "dark" | null) ?? "system");
```

`setMode("system")` listens to `prefers-color-scheme` and updates the class as the OS changes. `setMode("light" | "dark")` pins it.

### Anti-flash inline script (Next.js / SSR)

Put this in `<head>` before hydration to avoid the white flash:

```html
<script>
  (function () {
    var s = localStorage.getItem("theme");
    var prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
    var dark = s === "dark" || (s !== "light" && prefersDark);
    if (dark) document.documentElement.classList.add("dark");
  })();
</script>
```

Do **not** call `applyTheme()` separately for light/dark. The stylesheet already swaps both surface and brand variables under `.dark`.

---

## Component reference

35 components, four families. Pick the one that matches the user intent — do not compose primitives when one already exists.

### Inputs (12)

| Package | Component | Purpose |
| --- | --- | --- |
| `@sisyphos-ui/button` | `Button` | 4 variants × 5 sizes, loading state, optional split-button dropdown, polymorphic via `href`. |
| `@sisyphos-ui/input` | `Input` | Text input with adornments, validation state, helper text. |
| `@sisyphos-ui/textarea` | `Textarea` | Auto-resize multiline, char count. |
| `@sisyphos-ui/checkbox` | `Checkbox` | Tri-state (checked / unchecked / indeterminate). |
| `@sisyphos-ui/switch` | `Switch` | On/off toggle. |
| `@sisyphos-ui/radio` | `Radio`, `RadioGroup` | Single-choice with roving tabindex. |
| `@sisyphos-ui/select` | `Select` | Dropdown with search, multi-select, virtualization-ready. |
| `@sisyphos-ui/tree-select` | `TreeSelect` | Hierarchical picker with cascading. |
| `@sisyphos-ui/number-input` | `NumberInput` | Stepper, precision, locale-aware. |
| `@sisyphos-ui/slider` | `Slider` | Single or dual-thumb, marks, snapping. |
| `@sisyphos-ui/datepicker` | `DatePicker` | Calendar, range, disabled dates. |
| `@sisyphos-ui/file-upload` | `FileUpload` | Drag-and-drop, preview, progress. |

### Display (13)

| Package | Component | Purpose |
| --- | --- | --- |
| `@sisyphos-ui/chip` | `Chip` | Tags, filters, removable badges. |
| `@sisyphos-ui/avatar` | `Avatar`, `AvatarGroup` | Image / initials / status dot. |
| `@sisyphos-ui/spinner` | `Spinner` | Loading indicator, reduced-motion aware. |
| `@sisyphos-ui/skeleton` | `Skeleton` | Content placeholder with shimmer. |
| `@sisyphos-ui/empty-state` | `EmptyState` | Standardized "no results" UI. |
| `@sisyphos-ui/alert` | `Alert` | Inline message with semantic colors. |
| `@sisyphos-ui/breadcrumb` | `Breadcrumb` | Hierarchical nav trail. |
| `@sisyphos-ui/card` | `Card` | Compound surface (Header / Body / Footer). |
| `@sisyphos-ui/accordion` | `Accordion` | Collapsible panels, single or multi-expand. |
| `@sisyphos-ui/tabs` | `Tabs` | Compound, roving tabindex, h/v. |
| `@sisyphos-ui/table` | `Table` | Sorting, selection, sticky headers, density. |
| `@sisyphos-ui/carousel` | `Carousel` | Touch, autoplay, indicators. |
| `@sisyphos-ui/kbd` | `Kbd` | Platform-aware keyboard hint (`shortcut="cmd+k"`). |

### Overlay (7)

| Package | Component | Purpose |
| --- | --- | --- |
| `@sisyphos-ui/tooltip` | `Tooltip` | 12 placements, `aria-describedby`. |
| `@sisyphos-ui/popover` | `Popover` | `role="dialog"` floating panel. |
| `@sisyphos-ui/dropdown-menu` | `DropdownMenu` | `role="menu"` with submenu, type-ahead. |
| `@sisyphos-ui/dialog` | `Dialog` | Modal with focus trap, scroll lock. |
| `@sisyphos-ui/toast` | `toast`, `Toaster` | Imperative API, polite/assertive distinction. |
| `@sisyphos-ui/context-menu` | `ContextMenu` | Right-click menu, viewport-clamped. |
| `@sisyphos-ui/command` | `Command` | Filterable command palette / combobox. |

### Foundation (3)

| Package | Component | Purpose |
| --- | --- | --- |
| `@sisyphos-ui/core` | `applyTheme`, `setMode`, tokens | Theme engine + design tokens. |
| `@sisyphos-ui/portal` | `Portal` | Renders children into the document body. |
| `@sisyphos-ui/form-control` | `FormControl` | Label / helper / error wrapper for any input. |

---

## Form patterns

Always wrap form inputs in `FormControl` so labels, helper text, and error messages are wired up via `aria-describedby` / `aria-invalid` automatically.

```tsx
<FormControl
  label="Email"
  helperText="We'll never share it."
  errorText={errors.email}
  required
>
  <Input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</FormControl>
```

Rules:

- Pass `errorText` (truthy) to flip the input into the error state — do not toggle a class manually.
- For checkbox / radio groups, wrap the whole group in one `FormControl`, not each item.
- For multi-step forms, render `FormControl` per field — there is no `<Form>` provider.

---

## Toast patterns — `@sisyphos-ui/toast`

The toast API is **imperative**. There is no React context.

```tsx
import { toast, Toaster } from "@sisyphos-ui/ui";

// 1. Mount once at the app root
<Toaster position="bottom-right" duration={4000} />

// 2. Call from anywhere
toast.success("Saved");
toast.error("Network error");
toast.info("Coming soon");

// 3. Promise lifecycle
await toast.promise(saveUser(data), {
  loading: "Saving…",
  success: "Saved.",
  error:   (err) => err.message,
});

// 4. Dismiss programmatically
const id = toast.success("Will dismiss in 1s");
setTimeout(() => toast.dismiss(id), 1000);
```

Roles:

- `toast.success` / `toast.info` / `toast` → `role="status"` (polite, doesn't interrupt).
- `toast.error` → `role="alert"` (assertive, screen reader announces immediately).

Match the urgency. **Do not** promote routine confirmations to `error`.

---

## Dialog patterns — `@sisyphos-ui/dialog`

Compound API. Focus trap, scroll lock, Esc-to-close, and focus restoration are automatic.

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Trigger asChild>
    <Button>Open</Button>
  </Dialog.Trigger>
  <Dialog.Content size="md">
    <Dialog.Header>
      <Dialog.Title>Delete project?</Dialog.Title>
      <Dialog.Description>This cannot be undone.</Dialog.Description>
    </Dialog.Header>
    <Dialog.Body>
      All members will lose access immediately.
    </Dialog.Body>
    <Dialog.Footer>
      <Dialog.Close asChild>
        <Button variant="outlined">Cancel</Button>
      </Dialog.Close>
      <Button color="error" onClick={confirm}>Delete</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>
```

- Always drive open state through `open` + `onOpenChange`. Bypassing them disables the focus trap.
- Use `Dialog.Close` for the cancel button so focus returns to the trigger.
- For non-modal floating panels (calendars, dropdowns), use `Popover` instead.

---

## Command palette — `@sisyphos-ui/command`

Keyboard-first filterable menu. Combobox + listbox semantics. Use it for `⌘K`-style global search.

```tsx
<Command>
  <Command.Input placeholder="Search…" />
  <Command.List>
    <Command.Empty>No results.</Command.Empty>
    <Command.Group heading="Actions">
      <Command.Item value="new file" onSelect={create}>
        New file
      </Command.Item>
      <Command.Item value="open settings" onSelect={openSettings}>
        Open settings
      </Command.Item>
    </Command.Group>
  </Command.List>
</Command>
```

Filtering is case-insensitive substring matching against `value`. Render labels however you like — the filter only looks at `value`.

---

## Context menu — `@sisyphos-ui/context-menu`

Right-click menu, anchored to the cursor, viewport-clamped, keyboard-navigable.

```tsx
<ContextMenu
  items={[
    { type: "item", label: "Rename", onSelect: rename },
    { type: "item", label: "Duplicate", onSelect: duplicate },
    { type: "separator" },
    { type: "item", label: "Delete", danger: true, onSelect: del },
  ]}
>
  <FileRow file={file} />
</ContextMenu>
```

The trigger child must be a single React element that can receive `onContextMenu`.

---

## Dropdown menu — `@sisyphos-ui/dropdown-menu`

```tsx
<DropdownMenu>
  <DropdownMenu.Trigger asChild>
    <Button variant="outlined">More</Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Item onSelect={share}>Share</DropdownMenu.Item>
    <DropdownMenu.Item onSelect={archive}>Archive</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger>Move to…</DropdownMenu.SubTrigger>
      <DropdownMenu.SubContent>
        <DropdownMenu.Item>Inbox</DropdownMenu.Item>
        <DropdownMenu.Item>Archive</DropdownMenu.Item>
      </DropdownMenu.SubContent>
    </DropdownMenu.Sub>
  </DropdownMenu.Content>
</DropdownMenu>
```

Type-ahead, arrow keys, submenu navigation are all wired.

---

## Tooltip & Popover

```tsx
<Tooltip content="Save changes" placement="top">
  <Button>Save</Button>
</Tooltip>

<Popover>
  <Popover.Trigger asChild>
    <Button variant="outlined">Filter</Button>
  </Popover.Trigger>
  <Popover.Content>
    {/* arbitrary UI here */}
  </Popover.Content>
</Popover>
```

---

## Tabs — `@sisyphos-ui/tabs`

```tsx
<Tabs defaultValue="overview" orientation="horizontal">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="overview">…</Tabs.Content>
  <Tabs.Content value="settings">…</Tabs.Content>
</Tabs>
```

Activation mode defaults to **automatic** (focus changes activate). Pass `activationMode="manual"` if Tab content is heavy and you want explicit Enter/Space activation.

---

## Table — `@sisyphos-ui/table`

```tsx
<Table density="comfortable" striped>
  <Table.Header sticky>
    <Table.Row>
      <Table.Head sortable sortDirection={sort} onSort={setSort}>
        Name
      </Table.Head>
      <Table.Head>Email</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {users.map((u) => (
      <Table.Row key={u.id}>
        <Table.Cell>{u.name}</Table.Cell>
        <Table.Cell>{u.email}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
```

For row selection, use `<Table.Row selected onSelectedChange>` with a `<Checkbox />` in the leading cell.

---

## TypeScript

- Every prop is typed; the codebase has zero `any`.
- Polymorphic primitives (`Button`, `Card`) accept `as` or `href` — TypeScript narrows the rest of the props accordingly.
- Discriminated unions are used heavily (`DropdownMenuItem` vs `DropdownMenuSeparator`) — exhaustive `switch` works.
- Re-export the type alongside the component when extending it; don't redeclare:

```ts
import type { ButtonProps } from "@sisyphos-ui/button";

type MyButtonProps = ButtonProps & { trackingId: string };
```

---

## Accessibility guarantees

Every interactive component already ships with:

- Keyboard support per the **WAI-ARIA Authoring Practices**.
- Focus management — trap on dialogs, restore on close, roving tabindex on radio / tabs / menus.
- `prefers-reduced-motion` honored on Spinner, Skeleton, Carousel.
- Correct semantic roles: `menuitem`, `option`, `dialog`, `alert` vs `status`, `combobox` + `listbox`.
- Color contrast: defaults pass WCAG AA at the documented theme.

You should **not**:

- Re-implement keyboard handling on top of these primitives.
- Add `tabIndex`, `role`, or `aria-*` props that duplicate what the component already sets.
- Wrap a `Button` in another `<button>` — use `href` or compose directly.

---

## Anti-patterns

- ❌ **`<ThemeProvider value={...}>`** — there is none. Use `applyTheme()`.
- ❌ **Per-component stylesheet imports** when using the umbrella. Import `@sisyphos-ui/ui/styles.css` once.
- ❌ **Mixing umbrella + individual packages** — duplicate CSS variables, broken cascade.
- ❌ **Driving `Dialog` open state outside its props** — focus trap won't engage.
- ❌ **Calling `applyTheme()` inside a render** — causes layout flash.
- ❌ **Using Tailwind / `emotion` to recolor a Sisyphos component** — override the underlying `--sisyphos-*` variable instead.
- ❌ **Adding `role="button"` to a `<div>` for interactivity** — use `<Button>`.
- ❌ **Toggling the `dark` class manually** — use `setMode()`.

---

## Migration cheatsheet

### From Material UI (MUI)

| MUI | Sisyphos UI |
| --- | --- |
| `<ThemeProvider theme={createTheme(...)}>` | `applyTheme({ colors, spacing, radius })` once at boot |
| `sx={{ p: 2 }}` | CSS variables / utility class on the wrapper |
| `<Dialog open onClose>` | `<Dialog open onOpenChange>` (compound API) |
| `enqueueSnackbar` (notistack) | `toast.success/.error/.promise` |
| `useMediaQuery` | Native `matchMedia` — no equivalent needed |

### From shadcn/ui

| shadcn/ui | Sisyphos UI |
| --- | --- |
| Copy components into your repo | `pnpm add @sisyphos-ui/ui` (it's already a versioned package) |
| `cn` util / `tailwind-merge` | Not needed — components self-style. Use class names for layout only. |
| `<Toaster />` from `sonner` | `<Toaster />` from `@sisyphos-ui/toast` (similar API) |
| `<Dialog>` (Radix) | `<Dialog>` — same compound shape |

### From Chakra UI

| Chakra | Sisyphos UI |
| --- | --- |
| `<ChakraProvider theme={...}>` | `applyTheme(...)` |
| `useColorMode` | `setMode()` + `dark` class |
| `<HStack>` / `<VStack>` | Plain `flex` containers |
| `useToast()` | `import { toast }` (imperative) |

### From HeadlessUI

You'll generally swap component-by-component. The compound-API shape (`Dialog.Trigger`, `Dialog.Content`, etc.) maps directly. Sisyphos ships visual styles by default — drop your manual classNames.

---

## References

- Live docs: https://sisyphosui.com/docs
- Components catalog: https://sisyphosui.com/docs/components
- Theming guide: https://sisyphosui.com/docs/theming
- Accessibility guide: https://sisyphosui.com/docs/accessibility
- Dark mode guide: https://sisyphosui.com/docs/dark-mode
- Source: https://github.com/sisyphos-ui/sisyphos-ui
- npm scope: https://www.npmjs.com/org/sisyphos-ui
- Discussions: https://github.com/sisyphos-ui/sisyphos-ui/discussions
