# @sisyphos-ui/card

Surface container with compound `Card.Header` / `Card.Body` / `Card.Footer` slots, three variants, and four padding presets.

## Usage

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/card/styles.css";
import { Card } from "@sisyphos-ui/card";

<Card>
  <Card.Header>Project</Card.Header>
  <Card.Body>Project description…</Card.Body>
  <Card.Footer>
    <Button variant="outlined">Cancel</Button>
    <Button style={{ marginLeft: "auto" }}>Save</Button>
  </Card.Footer>
</Card>

{/* Click the whole card */}
<Card interactive onClick={open}>
  <Card.Body>Open detail</Card.Body>
</Card>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `variant` | `"elevated" \| "outlined" \| "filled"` | `"elevated"` |
| `padding` | `"none" \| "sm" \| "md" \| "lg"` | `"md"` |
| `interactive` | `boolean` (focusable + role=button + hover) | `false` |
