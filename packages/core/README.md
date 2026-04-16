# @sisyphos-ui/core

Core design system package containing theme system, design tokens, and SCSS utilities.

## Installation

```bash
pnpm add @sisyphos-ui/core
```

## What's Included

### 🎨 Theme System
- Runtime theme customization with `applyTheme()`
- CSS Variables-based theming
- Dark/Light mode support
- Preset themes
- Type-safe theme configuration

### 🧩 Design Tokens
- SCSS variables and mixins
- CSS custom properties
- Semantic color system
- Spacing scale
- Typography scale
- Border radius scale


## Usage

### Basic (Minimal)

```tsx
import '@sisyphos-ui/core/styles';
import { applyTheme } from '@sisyphos-ui/core';

// Apply your brand color
applyTheme({
  colors: { primary: '#007bff' }
});
```


### Using SCSS Tokens in Components

```scss
@use "@sisyphos-ui/core/tokens/variables" as *;
@use "@sisyphos-ui/core/tokens/mixins" as *;

.my-component {
  padding: $spacing-md;
  border-radius: $radius-s;
  color: var(--sisyphos-color-primary);
}
```

## Exports

### JavaScript/TypeScript

```typescript
// Theme functions
import { applyTheme, createTheme, mergeThemes, generateThemeCSS } from '@sisyphos-ui/core';

// Theme mode
import { setThemeMode, toggleThemeMode, getThemeMode } from '@sisyphos-ui/core';


// Preset themes
import { themes } from '@sisyphos-ui/core';

// Types
import type { ThemeConfig, ColorShades, SemanticColors } from '@sisyphos-ui/core';
```

### SCSS

```scss
// All styles (includes theme + tokens)
@use "@sisyphos-ui/core/styles";

// Just theme (CSS variables)
@use "@sisyphos-ui/core/theme";

// Just tokens
@use "@sisyphos-ui/core/tokens";

// Specific token files
@use "@sisyphos-ui/core/tokens/variables" as *;
@use "@sisyphos-ui/core/tokens/mixins" as *;

// Colors are defined as CSS variables in default-theme.scss
// Use CSS variables directly: var(--sisyphos-color-primary)
```

## API

### applyTheme(config)

Apply theme configuration at runtime.

```typescript
applyTheme({
  colors: {
    primary: '#007bff',
    success: '#28a745',
  },
  spacing: {
    md: 20,
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});
```

### createTheme(config)

Create a type-safe theme configuration.

```typescript
const myTheme = createTheme({
  colors: { primary: '#007bff' },
});
```

### mergeThemes(...themes)

Merge multiple theme configurations.

```typescript
const customTheme = mergeThemes(
  themes.blue,
  { colors: { primary: '#custom' } }
);
```

### setThemeMode(mode)

Set color mode (light/dark).

```typescript
setThemeMode('dark');
setThemeMode('light');
```

## Design Tokens

### Colors

```scss
--sisyphos-color-primary
--sisyphos-color-success
--sisyphos-color-error
--sisyphos-color-warning
--sisyphos-color-info
--sisyphos-color-neutral
```

Each color has shades: `-light`, `-lighter`, `-dark`, `-darker`, `-contained`

### Spacing

```scss
$spacing-xxs  // 4px
$spacing-xs   // 8px
$spacing-s    // 10px
$spacing-md   // 16px
$spacing-lg   // 24px
$spacing-xl   // 32px
$spacing-2xl  // 40px
$spacing-3xl  // 64px
```

### Typography

```scss
$font-weight-regular   // 400
$font-weight-medium    // 500
$font-weight-semibold  // 600
$font-weight-bold      // 700

$size-xs    // 10px
$size-sm    // 12px
$size-md    // 14px
$base-size  // 16px
$size-lg    // 18px
$size-xl    // 32px
```

### Border Radius

```scss
$radius-xxs   // 4px
$radius-xs    // 6px
$radius-s     // 8px
$radius-md    // 12px
$radius-lg    // 24px
$radius-full  // 9999px
```

## License

MIT
