# @sisyphos-ui/dialog

Accessible modal dialog with portal, focus trap, scroll lock, and compound slots.

## Usage

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/dialog/styles.css";
import { Dialog } from "@sisyphos-ui/dialog";

const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen} size="md">
  <Dialog.Header>
    <Dialog.Title>Delete project?</Dialog.Title>
    <Dialog.Close />
  </Dialog.Header>
  <Dialog.Body>
    <Dialog.Description>This cannot be undone.</Dialog.Description>
  </Dialog.Body>
  <Dialog.Footer>
    <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
    <Button color="error" onClick={confirmDelete}>Delete</Button>
  </Dialog.Footer>
</Dialog>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `open` | `boolean` | – |
| `onOpenChange` | `(open: boolean) => void` | – |
| `size` | `"sm" \| "md" \| "lg" \| "xl" \| "full"` | `"md"` |
| `closeOnBackdropClick` | `boolean` | `true` |
| `closeOnEscape` | `boolean` | `true` |
| `backdrop` | `boolean` | `true` |
| `initialFocus` | `RefObject<HTMLElement>` | first focusable inside |

## Compound slots

| Component | Notes |
|-----------|-------|
| `Dialog.Header` | Container above the body. |
| `Dialog.Title` | Auto-linked via `aria-labelledby`. |
| `Dialog.Description` | Auto-linked via `aria-describedby`. |
| `Dialog.Body` | Scrollable content area. |
| `Dialog.Footer` | Right-aligned action area. |
| `Dialog.Close` | Calls `onOpenChange(false)`; default `aria-label="Close"`, X icon. |

## Behavior

- Portal-mounted (`@sisyphos-ui/portal`).
- Focus trap activated while open; previously focused element restored on close.
- Body scroll locked while open (reference-counted — multiple stacked dialogs work).
- Backdrop click / Escape close (configurable).
