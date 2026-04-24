---
"@sisyphos-ui/dialog": minor
---

Added `showCloseButton` and `closeButtonLabel` props to `<Dialog>`. When `showCloseButton` is true, a `Dialog.Close` is auto-rendered in the top-right of the dialog — no manual `<Dialog.Close />` composition needed. Default is `false` to preserve existing behavior for callers who compose the close button themselves (e.g. inside a custom header).
