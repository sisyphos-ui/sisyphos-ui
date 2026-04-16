# @sisyphos-ui/empty-state

Zero-data placeholder with icon, title, description, and actions slot.

## Usage

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/empty-state/styles.css";
import { EmptyState } from "@sisyphos-ui/empty-state";
import { Button } from "@sisyphos-ui/button";

<EmptyState
  icon={<InboxIcon />}
  title="No messages yet"
  description="Start a conversation to see it here."
  actions={<Button>New chat</Button>}
/>

<EmptyState size="sm" bordered title="No results" />
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `icon` | `ReactNode` | – |
| `title` | `ReactNode` | – |
| `description` | `ReactNode` | – |
| `actions` | `ReactNode` | – |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `bordered` | `boolean` | `false` |

Uses `role="status"` for polite screen reader announcement.
