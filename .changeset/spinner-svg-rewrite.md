---
"@sisyphos-ui/spinner": patch
---

Re-rendered Spinner as an inline SVG instead of a styled `<span>` with `border-radius: 50%` + transparent borders. Firefox no longer shows the antialiasing seam on thin rings. The public API (`size`, `color`, `thickness`, `variant`, `label`) is unchanged. `thickness` now drives stroke-width via a `--sisyphos-spinner-thickness` custom property; previous inline `border-width` is gone.
