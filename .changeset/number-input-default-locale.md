---
"@sisyphos-ui/number-input": minor
"@sisyphos-ui/ui": minor
---

`<NumberInput>`'s `locale` prop now defaults to `undefined` instead of `"tr-TR"`. The picker formats and parses values against the runtime's default locale unless you pass an explicit BCP 47 tag. This makes `<NumberInput>` work correctly out of the box for international consumers — pass `locale="tr-TR"` (or any other tag) to lock in a specific format that matches a fixed visual design.

Behavior is otherwise identical: explicit `locale` values pass straight through to `Intl.NumberFormat`, and the parser still derives the decimal separator from the active locale.
