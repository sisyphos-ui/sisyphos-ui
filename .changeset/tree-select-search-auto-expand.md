---
"@sisyphos-ui/tree-select": patch
"@sisyphos-ui/ui": patch
---

`<TreeSelect>` now auto-expands matched ancestors while a search term is active. The recursive filter already returned only the matched paths, but collapsed parents kept hiding the very rows the user typed to find — confusing for deep trees. While `search` is non-empty every visible node is treated as expanded; clearing the search restores the user's manual expand/collapse state intact.
