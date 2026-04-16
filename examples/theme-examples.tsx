/**
 * Theme Examples - Real World Use Cases
 */

import { applyTheme, ThemeConfig, themes, setThemeMode } from "@sisyphos-ui/core";

// ==================== Example 1: Zero Config ====================
// Hiçbir şey yapma, default theme çalışır

export function Example1_ZeroConfig() {
  // No theme config needed!
  return <Button color="primary">Default Theme</Button>;
}

// ==================== Example 2: Brand Color Only ====================
// Sadece brand color'ı override et - %80 use case

export function Example2_BrandColorOnly() {
  // App initialization'da bir kere çağır
  applyTheme({
    colors: {
      primary: "#007bff", // HRSync blue
    },
  });

  return <Button color="primary">HRSync Button</Button>;
}

// ==================== Example 3: Semantic Colors ====================
// Tüm semantic color'ları override et

export function Example3_SemanticColors() {
  applyTheme({
    colors: {
      primary: "#007bff",
      success: "#28a745",
      error: "#dc3545",
      warning: "#ffc107",
      info: "#17a2b8",
    },
  });

  return (
    <>
      <Button color="primary">Primary</Button>
      <Button color="success">Success</Button>
      <Button color="error">Error</Button>
      <Button color="warning">Warning</Button>
      <Button color="info">Info</Button>
    </>
  );
}

// ==================== Example 4: Color Shades ====================
// Her semantic color için shade'ler

export function Example4_ColorShades() {
  applyTheme({
    colors: {
      primary: {
        main: "#007bff",
        light: "#3395ff", // Hover state
        lighter: "#b3d7ff", // Background
        dark: "#0056b3", // Pressed state
        darker: "#003d80", // Border
        contained: "#004085", // Contained button
      },
      // Diğerleri basit string
      success: "#28a745",
      error: "#dc3545",
    },
  });

  return <Button color="primary">Button with Shades</Button>;
}

// ==================== Example 5: Spacing Scale ====================
// Farklı spacing scale (8px grid vs 10px grid)

export function Example5_SpacingScale() {
  applyTheme({
    spacing: {
      xxs: 2, // 2px (çok sıkı)
      xs: 4, // 4px
      s: 8, // 8px (8px grid)
      md: 16, // 16px
      lg: 24, // 24px
      xl: 32, // 32px
      "2xl": 48, // 48px
      "3xl": 64, // 64px
    },
  });

  return <Button>Tight Spacing</Button>;
}

// ==================== Example 6: Typography ====================
// Custom font ve type scale

export function Example6_Typography() {
  applyTheme({
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
      sizes: {
        base: 15, // 15px (default 16px)
        lg: 19, // 19px (default 18px)
        h1: 36, // 36px (default 40px)
      },
      weights: {
        medium: 550, // Variable font
        bold: 750, // Variable font
      },
    },
  });

  return <Button>Custom Typography</Button>;
}

// ==================== Example 7: Border Radius ====================
// Angular (keskin) vs Rounded (yuvarlaklı)

export function Example7_AngularDesign() {
  applyTheme({
    borderRadius: {
      xxs: 0,
      xs: 0,
      s: 2,
      md: 4,
      lg: 8,
      full: 9999,
    },
  });

  return <Button>Angular Design</Button>;
}

export function Example7_RoundedDesign() {
  applyTheme({
    borderRadius: {
      xxs: 8,
      xs: 12,
      s: 16,
      md: 20,
      lg: 32,
      full: 9999,
    },
  });

  return <Button>Rounded Design</Button>;
}

// ==================== Example 8: Full Customization ====================
// Her şeyi override et

export function Example8_FullCustomization() {
  const customTheme: ThemeConfig = {
    colors: {
      primary: {
        main: "#7c3aed",
        light: "#9f67ff",
        dark: "#5b21b6",
      },
      success: "#10b981",
      error: "#ef4444",
    },
    neutral: {
      main: "#f5f5f5",
      dark: "#333333",
    },
    spacing: {
      md: 20,
      lg: 30,
    },
    typography: {
      fontFamily: "Poppins, sans-serif",
      sizes: {
        base: 15,
        h1: 38,
      },
      weights: {
        bold: 800,
      },
    },
    borderRadius: {
      md: 8,
      lg: 16,
    },
    opacity: {
      xs: 0.5,
      md: 0.2,
    },
    duration: {
      s: "200ms",
      m: "400ms",
    },
  };

  applyTheme(customTheme);

  return <Button>Fully Custom</Button>;
}

// ==================== Example 9: Preset Themes ====================
// Hazır tema kullan

export function Example9_PresetThemes() {
  // Blue preset
  applyTheme(themes.blue);

  // Purple preset
  applyTheme(themes.purple);

  // Green preset
  applyTheme(themes.green);

  // Default preset
  applyTheme(themes.default);

  return <Button>Preset Theme</Button>;
}

// ==================== Example 10: Dark Mode ====================
// Light/Dark mode toggle

export function Example10_DarkMode() {
  const [isDark, setIsDark] = useState(false);

  const toggleMode = () => {
    const newMode = isDark ? "light" : "dark";
    setThemeMode(newMode);
    setIsDark(!isDark);
  };

  return (
    <Button onClick={toggleMode}>
      {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </Button>
  );
}

// ==================== Example 11: Multi-Brand (E-commerce) ====================
// URL'e göre brand theme yükle

export function Example11_MultiBrand() {
  const brandThemes = {
    nike: { colors: { primary: "#000000" }, borderRadius: { md: 0 } },
    adidas: { colors: { primary: "#000000" }, borderRadius: { md: 4 } },
    puma: { colors: { primary: "#e53935" } },
  } satisfies Record<string, ThemeConfig>;

  const currentBrand = useSearchParams().get("brand") || "nike";

  useEffect(() => {
    applyTheme(brandThemes[currentBrand as keyof typeof brandThemes]);
  }, [currentBrand]);

  return <Button>Multi-Brand</Button>;
}

// ==================== Example 12: User Customization (SaaS) ====================
// Backend'den user theme yükle

export function Example12_UserCustomization() {
  const { data: user } = useQuery("user");

  useEffect(() => {
    if (user?.theme) {
      applyTheme({
        colors: {
          primary: user.theme.brandColor, // "#ff6b6b"
        },
        borderRadius: {
          md: user.theme.borderRadius, // 12
        },
      });
    }
  }, [user]);

  return <Button>User Custom Theme</Button>;
}

// ==================== Example 13: CSS Override (Alternative) ====================
// TypeScript yerine CSS kullan

/*
// src/theme.css
:root {
  --sisyphos-color-primary: #007bff;
  --sisyphos-color-success: #28a745;
  --sisyphos-spacing-md: 20px;
  --sisyphos-font-family: "Inter", sans-serif;
}
*/

// main.tsx
import "@sisyphos-ui/core/styles.scss";
import "./theme.css"; // CSS override

// ==================== Example 14: Theme Config Dosyası ====================
// theme/index.ts

export const myAppTheme: ThemeConfig = {
  colors: {
    primary: "#0066cc", // Brand color
    success: "#28a745",
    error: "#dc3545",
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
  },
  spacing: {
    md: 20, // Slightly larger
  },
  borderRadius: {
    md: 8, // Less rounded
  },
};

// main.tsx
import { applyTheme } from "@sisyphos-ui/core";
import { myAppTheme } from "./theme";

applyTheme(myAppTheme);

// ==================== Example 15: Runtime Theme Switch ====================
// Kullanıcı runtime'da theme değiştirebilir

export function Example15_RuntimeThemeSwitch() {
  const themeOptions = [
    { name: "Default", theme: themes.default },
    { name: "Blue", theme: themes.blue },
    { name: "Purple", theme: themes.purple },
    { name: "Green", theme: themes.green },
  ];

  const [selectedTheme, setSelectedTheme] = useState("Default");

  const handleThemeChange = (themeName: string) => {
    const theme = themeOptions.find((t) => t.name === themeName)?.theme;
    if (theme) {
      applyTheme(theme);
      setSelectedTheme(themeName);
    }
  };

  return (
    <Select value={selectedTheme} onChange={(e) => handleThemeChange(e.target.value)}>
      {themeOptions.map((opt) => (
        <option key={opt.name} value={opt.name}>
          {opt.name}
        </option>
      ))}
    </Select>
  );
}

