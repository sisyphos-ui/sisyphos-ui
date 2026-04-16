# @sisyphos-ui/avatar

Avatar + AvatarGroup with image → initials fallback, semantic colors, and three shapes.

## Install

```bash
pnpm add @sisyphos-ui/avatar
```

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/avatar/styles.css";
import { Avatar, AvatarGroup } from "@sisyphos-ui/avatar";
```

## Usage

```tsx
<Avatar src={user.photo} alt={user.name} name={user.name} />
<Avatar name="Volkan Günay" color="primary" />   {/* → "VG" */}
<Avatar fallback={<UserIcon />} shape="rounded" />

<AvatarGroup max={3} size="md">
  {members.map((m) => <Avatar key={m.id} src={m.photo} name={m.name} />)}
</AvatarGroup>
```

## `<Avatar>` props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | – | Image URL |
| `alt` | `string` | – | Required when `src` is set |
| `name` | `string` | – | Derives initials when no image |
| `initialsMax` | `number` | `2` | Max initials to derive |
| `fallback` | `ReactNode` | – | Override derived initials |
| `size` | `Scale` | `"md"` | `xs` (24) / `sm` (32) / `md` (40) / `lg` (56) / `xl` (72) |
| `color` | `"primary" \| "success" \| "error" \| "warning" \| "info" \| "neutral"` | `"neutral"` | Fallback background |
| `shape` | `"circular" \| "rounded" \| "square"` | `"circular"` | |

If the image fails to load, the component automatically falls back to `fallback` → `children` → initials → empty.

## `<AvatarGroup>` props

| Prop | Type | Default |
|------|------|---------|
| `max` | `number` | – |
| `renderOverflow` | `(hidden: number) => ReactNode` | defaults to `+N` |
| `size` | `Scale` | `"md"` (passed down unless child overrides) |
| `shape` | `AvatarShape` | `"circular"` (passed down) |
| `overflowColor` | `AvatarColor` | `"neutral"` |
