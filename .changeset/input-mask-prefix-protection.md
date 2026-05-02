---
"@sisyphos-ui/input": minor
"@sisyphos-ui/ui": minor
---

`<Input>` now locks the caret past a mask's fixed prefix. When you click, focus, or arrow-key into the literal portion of a pattern (e.g. `+90 (5` in the `tel-tr` preset), the collapsed caret snaps to the first editable token so users can't accidentally type inside the prefix. Real text selections (Ctrl+A) are left alone so select-all-then-replace still works.

Exports a new helper, `getMaskPrefixLength(maskSpec)`, for callers that want to compute the same lock position outside of the component.
