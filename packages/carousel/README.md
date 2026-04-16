# @sisyphos-ui/carousel

Carousel/slideshow with optional autoplay (paused on hover & focus), arrows, dot indicators, and keyboard ArrowKey navigation.

## Usage

```tsx
import "@sisyphos-ui/core/styles.css";
import "@sisyphos-ui/carousel/styles.css";
import { Carousel } from "@sisyphos-ui/carousel";

<Carousel autoPlay autoPlayInterval={4000}>
  <img src="/banner-1.jpg" alt="" />
  <img src="/banner-2.jpg" alt="" />
  <img src="/banner-3.jpg" alt="" />
</Carousel>

{/* Controlled */}
<Carousel index={i} onIndexChange={setI} loop={false}>
  <Slide />
  <Slide />
</Carousel>
```

## Props

| Prop | Type | Default |
|------|------|---------|
| `index` / `defaultIndex` / `onIndexChange` | controlled / uncontrolled | `0` |
| `autoPlay` | `boolean` | `false` |
| `autoPlayInterval` | `number` (ms) | `5000` |
| `loop` | `boolean` | `true` |
| `showArrows` | `boolean` | `true` |
| `showDots` | `boolean` | `true` |
| `pauseOnHover` | `boolean` | `true` |
| `ariaLabel` | `string` (`aria-roledescription`) | `"carousel"` |

## Accessibility

- Container has `role="region"` + `aria-roledescription`.
- Each slide is `role="group"` + `aria-roledescription="slide"` + `1 of N` aria-label.
- Inactive slides set `aria-hidden`.
- Dots are a `tablist` of `tab`s with `aria-selected`.
- ArrowLeft / ArrowRight while focused on the region.
