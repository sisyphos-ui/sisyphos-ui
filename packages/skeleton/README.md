# @sisyphos-ui/skeleton

Shape-agnostic Skeleton primitive + SkeletonText convenience. Shimmer / pulse / none animations.

## Usage

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/skeleton/styles.css";
import { Skeleton, SkeletonText } from "@sisyphos-ui/skeleton";

<Skeleton width={240} height={24} />
<Skeleton shape="circular" width={48} height={48} />
<SkeletonText lines={3} />

{/* Compose your own */}
<div>
  <Skeleton shape="circular" width={48} height={48} />
  <SkeletonText lines={2} />
</div>
```

## `<Skeleton>` props

| Prop | Type | Default |
|------|------|---------|
| `shape` | `"rectangular" \| "circular" \| "text"` | `"rectangular"` |
| `animation` | `"shimmer" \| "pulse" \| "none"` | `"shimmer"` |
| `width` | `number \| string` | – |
| `height` | `number \| string` | `1em` for `text` |
| `radius` | `number \| string` | – |
| `children` | `ReactNode` | measured via invisible ghost |

## `<SkeletonText>` props

| Prop | Type | Default |
|------|------|---------|
| `lines` | `number` | `3` |
| `lastNarrow` | `boolean` | `true` |
| `lineHeight` | `number \| string` | `"1em"` |
| `gap` | `number \| string` | `"0.5em"` |
