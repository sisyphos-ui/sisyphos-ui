# Changesets

Bu klasör Changesets tarafından kullanılır. Her değişiklik için bir changeset oluşturmanız gerekir.

## Changeset Oluşturma

```bash
pnpm changeset
```

Bu komut size şunları soracak:
1. Hangi paketler değişti?
2. Değişiklik türü nedir? (major, minor, patch)

## Changeset Türleri

- **major**: Breaking changes (API değişiklikleri)
- **minor**: Yeni özellikler (geriye uyumlu)
- **patch**: Bug fixler (geriye uyumlu)

## Örnek Changeset

```markdown
---
"@sisyphos-ui/button": patch
---

Button component'ine yeni size prop'u eklendi
```

