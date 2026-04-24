/**
 * Sisyphos UI theme system. Zero config works out of the box; pass a partial
 * `ThemeConfig` to override brand colors, spacing, typography, etc.
 */

export interface ColorShades {
  main?: string;
  light?: string;
  lighter?: string;
  dark?: string;
  darker?: string;
  contained?: string;
}

export interface SemanticColors {
  primary?: ColorShades | string;
  success?: ColorShades | string;
  error?: ColorShades | string;
  warning?: ColorShades | string;
  info?: ColorShades | string;
}

export interface NeutralColors {
  main?: string;
  lighter?: string;
  light?: string;
  dark?: string;
  darker?: string;
  /** Input/divider border color (default: #c4cdd5) */
  border?: string;
}

export interface SpacingScale {
  xxs?: number | string;
  xs?: number | string;
  s?: number | string;
  md?: number | string;
  lg?: number | string;
  xl?: number | string;
  "2xl"?: number | string;
  "3xl"?: number | string;
}

export interface TypographyScale {
  fontFamily?: string;
  sizes?: {
    xs?: number | string;
    sm?: number | string;
    md?: number | string;
    base?: number | string;
    lg?: number | string;
    xl?: number | string;
    h6?: number | string;
    h5?: number | string;
    h4?: number | string;
    h3?: number | string;
    h2?: number | string;
    h1?: number | string;
    hero?: number | string;
    heroXl?: number | string;
  };
  weights?: {
    regular?: number;
    medium?: number;
    semibold?: number;
    bold?: number;
  };
  lineHeights?: {
    xs?: number | string;
    sm?: number | string;
    base?: number | string;
  };
}

export interface BorderRadiusScale {
  xxs?: number | string;
  xs?: number | string;
  s?: number | string;
  md?: number | string;
  lg?: number | string;
  xl?: number | string;
  full?: number | string;
}

export interface ThemeConfig {
  colors?: SemanticColors;
  neutral?: NeutralColors;
  spacing?: SpacingScale;
  typography?: TypographyScale;
  borderRadius?: BorderRadiusScale;
  opacity?: {
    xs?: number;
    s?: number;
    md?: number;
    lg?: number;
  };
  duration?: {
    s?: number | string;
    m?: number | string;
  };
  zIndex?: {
    tooltip?: number;
    pickers?: number;
    overlay?: number;
  };
}

function setColorShades(prefix: string, color: ColorShades | string): void {
  const root = document.documentElement;

  if (typeof color === "string") {
    root.style.setProperty(`--sisyphos-color-${prefix}`, color);
  } else {
    if (color.main) root.style.setProperty(`--sisyphos-color-${prefix}`, color.main);
    if (color.light) root.style.setProperty(`--sisyphos-color-${prefix}-light`, color.light);
    if (color.lighter) root.style.setProperty(`--sisyphos-color-${prefix}-lighter`, color.lighter);
    if (color.dark) root.style.setProperty(`--sisyphos-color-${prefix}-dark`, color.dark);
    if (color.darker) root.style.setProperty(`--sisyphos-color-${prefix}-darker`, color.darker);
    if (color.contained)
      root.style.setProperty(`--sisyphos-color-${prefix}-contained`, color.contained);
  }
}

function setScale(prefix: string, scale: Record<string, number | string>): void {
  const root = document.documentElement;
  Object.entries(scale).forEach(([key, value]) => {
    const cssValue = typeof value === "number" ? `${value}px` : value;
    root.style.setProperty(`--sisyphos-${prefix}-${key}`, cssValue);
  });
}

/**
 * Apply a custom theme by writing the relevant CSS variables to `:root`.
 * @example
 * // Minimal - just brand color
 * applyTheme({ colors: { primary: "#007bff" } })
 *
 * // Full customization
 * applyTheme({
 *   colors: {
 *     primary: { main: "#007bff", light: "#3395ff", dark: "#0056b3" },
 *     success: "#28a745"
 *   },
 *   spacing: { md: 20 },
 *   typography: { fontFamily: "Inter, sans-serif" }
 * })
 */
export function applyTheme(config: ThemeConfig): void {
  if (config.colors) {
    if (config.colors.primary) setColorShades("primary", config.colors.primary);
    if (config.colors.success) setColorShades("success", config.colors.success);
    if (config.colors.error) setColorShades("error", config.colors.error);
    if (config.colors.warning) setColorShades("warning", config.colors.warning);
    if (config.colors.info) setColorShades("info", config.colors.info);
  }

  if (config.neutral) {
    const root = document.documentElement;
    if (config.neutral.main)
      root.style.setProperty("--sisyphos-color-neutral", config.neutral.main);
    if (config.neutral.lighter)
      root.style.setProperty("--sisyphos-color-neutral-lighter", config.neutral.lighter);
    if (config.neutral.light)
      root.style.setProperty("--sisyphos-color-neutral-light", config.neutral.light);
    if (config.neutral.dark)
      root.style.setProperty("--sisyphos-color-neutral-dark", config.neutral.dark);
    if (config.neutral.darker)
      root.style.setProperty("--sisyphos-color-neutral-darker", config.neutral.darker);
    if (config.neutral.border)
      root.style.setProperty("--sisyphos-color-border", config.neutral.border);
  }

  if (config.spacing) {
    setScale("spacing", config.spacing as Record<string, number | string>);
  }

  if (config.typography) {
    const root = document.documentElement;

    if (config.typography.fontFamily) {
      root.style.setProperty("--sisyphos-font-family", config.typography.fontFamily);
    }

    if (config.typography.sizes) {
      Object.entries(config.typography.sizes).forEach(([key, value]) => {
        const kebabKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        const cssValue = typeof value === "number" ? `${value}px` : value;
        root.style.setProperty(`--sisyphos-font-size-${kebabKey}`, cssValue);
      });
    }

    if (config.typography.weights) {
      Object.entries(config.typography.weights).forEach(([key, value]) => {
        root.style.setProperty(`--sisyphos-font-weight-${key}`, String(value));
      });
    }

    if (config.typography.lineHeights) {
      Object.entries(config.typography.lineHeights).forEach(([key, value]) => {
        const cssValue = typeof value === "number" ? `${value}px` : value;
        root.style.setProperty(
          `--sisyphos-line-height-${key === "base" ? "" : "-" + key}`.replace("--", ""),
          cssValue
        );
      });
    }
  }

  if (config.borderRadius) {
    setScale("radius", config.borderRadius as Record<string, number | string>);
  }

  if (config.opacity) {
    const root = document.documentElement;
    Object.entries(config.opacity).forEach(([key, value]) => {
      root.style.setProperty(`--sisyphos-opacity-${key}`, String(value));
    });
  }

  if (config.duration) {
    const root = document.documentElement;
    Object.entries(config.duration).forEach(([key, value]) => {
      const cssValue = typeof value === "number" ? `${value}ms` : value;
      root.style.setProperty(`--sisyphos-duration-${key}`, cssValue);
    });
  }

  if (config.zIndex) {
    const root = document.documentElement;
    Object.entries(config.zIndex).forEach(([key, value]) => {
      root.style.setProperty(`--sisyphos-z-index-${key}`, String(value));
    });
  }
}

/** Set the active theme mode by toggling the `sisyphos-theme-*` class on `<html>`. */
export function setThemeMode(mode: "light" | "dark"): void {
  const root = document.documentElement;
  root.classList.remove("sisyphos-theme-light", "sisyphos-theme-dark");
  root.classList.add(`sisyphos-theme-${mode}`);
}

/** Read the current theme mode from the `<html>` element. */
export function getThemeMode(): "light" | "dark" {
  return document.documentElement.classList.contains("sisyphos-theme-dark") ? "dark" : "light";
}

/** Flip between light and dark mode. */
export function toggleThemeMode(): void {
  setThemeMode(getThemeMode() === "dark" ? "light" : "dark");
}

export const themes = {
  default: {
    colors: {
      primary: "#ff7022",
      success: "#22c55e",
      error: "#fb3748",
      warning: "#ffab00",
      info: "#00b8d9",
    },
  },
  blue: {
    colors: {
      primary: "#007bff",
      success: "#28a745",
      error: "#dc3545",
      warning: "#ffc107",
      info: "#17a2b8",
    },
  },
  purple: {
    colors: {
      primary: "#7c3aed",
      success: "#10b981",
      error: "#ef4444",
      warning: "#f59e0b",
      info: "#3b82f6",
    },
  },
  green: {
    colors: {
      primary: "#22c55e",
      success: "#10b981",
      error: "#ef4444",
      warning: "#f59e0b",
      info: "#3b82f6",
    },
  },
} as const satisfies Record<string, ThemeConfig>;

/**
 * Identity helper that preserves the literal type of a theme config.
 * @example
 * const myTheme = createTheme({
 *   colors: { primary: "#007bff" }
 * });
 */
export function createTheme<T extends ThemeConfig>(config: T): T {
  return config;
}

/**
 * Merge multiple theme configurations; later configs override earlier ones.
 * @example
 * const mergedTheme = mergeThemes(themes.default, { colors: { primary: "#007bff" } });
 */
export function mergeThemes(...configs: ThemeConfig[]): ThemeConfig {
  return configs.reduce(
    (acc, config) => ({
      colors: { ...acc.colors, ...config.colors },
      neutral: { ...acc.neutral, ...config.neutral },
      spacing: { ...acc.spacing, ...config.spacing },
      typography: {
        ...acc.typography,
        ...config.typography,
        sizes: { ...acc.typography?.sizes, ...config.typography?.sizes },
        weights: { ...acc.typography?.weights, ...config.typography?.weights },
        lineHeights: { ...acc.typography?.lineHeights, ...config.typography?.lineHeights },
      },
      borderRadius: { ...acc.borderRadius, ...config.borderRadius },
      opacity: { ...acc.opacity, ...config.opacity },
      duration: { ...acc.duration, ...config.duration },
      zIndex: { ...acc.zIndex, ...config.zIndex },
    }),
    {}
  );
}

/**
 * Generate a CSS string from a theme config, useful for SSR or static injection.
 * @example
 * const cssString = generateThemeCSS({ colors: { primary: "#007bff" } });
 * // Returns: ":root { --sisyphos-color-primary: #007bff; }"
 */
export function generateThemeCSS(config: ThemeConfig): string {
  const cssVars: string[] = [];

  if (config.colors) {
    const colorKeys = ["primary", "success", "error", "warning", "info"] as const;
    colorKeys.forEach((key) => {
      const color = config.colors?.[key];
      if (!color) return;

      if (typeof color === "string") {
        cssVars.push(`--sisyphos-color-${key}: ${color};`);
      } else {
        if (color.main) cssVars.push(`--sisyphos-color-${key}: ${color.main};`);
        if (color.light) cssVars.push(`--sisyphos-color-${key}-light: ${color.light};`);
        if (color.lighter) cssVars.push(`--sisyphos-color-${key}-lighter: ${color.lighter};`);
        if (color.dark) cssVars.push(`--sisyphos-color-${key}-dark: ${color.dark};`);
        if (color.darker) cssVars.push(`--sisyphos-color-${key}-darker: ${color.darker};`);
        if (color.contained) cssVars.push(`--sisyphos-color-${key}-contained: ${color.contained};`);
      }
    });
  }

  if (config.neutral) {
    if (config.neutral.main) cssVars.push(`--sisyphos-color-neutral: ${config.neutral.main};`);
    if (config.neutral.lighter)
      cssVars.push(`--sisyphos-color-neutral-lighter: ${config.neutral.lighter};`);
    if (config.neutral.light)
      cssVars.push(`--sisyphos-color-neutral-light: ${config.neutral.light};`);
    if (config.neutral.dark) cssVars.push(`--sisyphos-color-neutral-dark: ${config.neutral.dark};`);
    if (config.neutral.darker)
      cssVars.push(`--sisyphos-color-neutral-darker: ${config.neutral.darker};`);
    if (config.neutral.border) cssVars.push(`--sisyphos-color-border: ${config.neutral.border};`);
  }

  if (config.spacing) {
    Object.entries(config.spacing).forEach(([key, value]) => {
      const cssValue = typeof value === "number" ? `${value}px` : value;
      cssVars.push(`--sisyphos-spacing-${key}: ${cssValue};`);
    });
  }

  if (config.typography) {
    if (config.typography.fontFamily) {
      cssVars.push(`--sisyphos-font-family: ${config.typography.fontFamily};`);
    }
    if (config.typography.sizes) {
      Object.entries(config.typography.sizes).forEach(([key, value]) => {
        const kebabKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        const cssValue = typeof value === "number" ? `${value}px` : value;
        cssVars.push(`--sisyphos-font-size-${kebabKey}: ${cssValue};`);
      });
    }
    if (config.typography.weights) {
      Object.entries(config.typography.weights).forEach(([key, value]) => {
        cssVars.push(`--sisyphos-font-weight-${key}: ${value};`);
      });
    }
  }

  if (config.borderRadius) {
    Object.entries(config.borderRadius).forEach(([key, value]) => {
      const cssValue = typeof value === "number" ? `${value}px` : value;
      cssVars.push(`--sisyphos-radius-${key}: ${cssValue};`);
    });
  }

  return `:root {\n  ${cssVars.join("\n  ")}\n}`;
}
