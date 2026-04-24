---
"@sisyphos-ui/accordion": patch
"@sisyphos-ui/input": patch
---

Polished a couple of spacing rough edges:

- Accordion trigger vertical padding reduced from `$spacing-md` (16px) to `$spacing-s` (10px) so collapsed items read as a tighter list instead of feeling airy.
- Input's `startIcon` / `endIcon` wrappers now clamp any direct `<svg>` / `<img>` child to `1.15em`. Consumers were passing 24×24 Lucide defaults which blew out small/xs inputs and pushed the icon off the text baseline.
