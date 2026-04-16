import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@sisyphos-ui/button";
import { applyTheme, themes, setThemeMode, ThemeConfig } from "@sisyphos-ui/core";
import { useEffect, useState } from "react";

const meta = {
  title: "Foundation/Theme System",
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ==================== Zero Config ====================
export const ZeroConfig: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
      <h3>Zero Config - Default Theme</h3>
      <p>Hiçbir şey yapmadan çalışır!</p>
      <div style={{ display: "flex", gap: "8px" }}>
        <Button color="primary">Primary</Button>
        <Button color="success">Success</Button>
        <Button color="error">Error</Button>
        <Button color="warning">Warning</Button>
        <Button color="info">Info</Button>
      </div>
    </div>
  ),
};

// ==================== Brand Color Only ====================
export const BrandColorOnly: Story = {
  render: () => {
    useEffect(() => {
      applyTheme({
        colors: {
          primary: "#007bff", // Sadece brand color
        },
      });
    }, []);

    return (
      <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
        <h3>Brand Color Only (Minimal)</h3>
        <p>Sadece primary color override - %80 use case</p>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button color="primary">Primary (Blue)</Button>
          <Button color="success">Success (Default)</Button>
          <Button color="error">Error (Default)</Button>
        </div>
      </div>
    );
  },
};

// ==================== Semantic Colors ====================
export const SemanticColors: Story = {
  render: () => {
    useEffect(() => {
      applyTheme({
        colors: {
          primary: "#7c3aed", // Purple
          success: "#10b981", // Emerald
          error: "#ef4444", // Red
          warning: "#f59e0b", // Amber
          info: "#3b82f6", // Blue
        },
      });
    }, []);

    return (
      <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
        <h3>Semantic Colors</h3>
        <p>Tüm semantic color'ları override</p>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button color="primary">Primary</Button>
          <Button color="success">Success</Button>
          <Button color="error">Error</Button>
          <Button color="warning">Warning</Button>
          <Button color="info">Info</Button>
        </div>
      </div>
    );
  },
};

// ==================== Preset Themes ====================
export const PresetThemes: Story = {
  render: () => {
    const [currentTheme, setCurrentTheme] = useState<keyof typeof themes>("default");

    useEffect(() => {
      applyTheme(themes[currentTheme]);
    }, [currentTheme]);

    return (
      <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
        <h3>Preset Themes</h3>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setCurrentTheme("default")}>Default</button>
          <button onClick={() => setCurrentTheme("blue")}>Blue</button>
          <button onClick={() => setCurrentTheme("purple")}>Purple</button>
          <button onClick={() => setCurrentTheme("green")}>Green</button>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button color="primary">Primary</Button>
          <Button color="success">Success</Button>
          <Button color="error">Error</Button>
          <Button color="warning">Warning</Button>
          <Button color="info">Info</Button>
        </div>
      </div>
    );
  },
};

// ==================== Dark Mode ====================
export const DarkMode: Story = {
  render: () => {
    const [isDark, setIsDark] = useState(false);

    const toggleMode = () => {
      const newMode = isDark ? "light" : "dark";
      setThemeMode(newMode);
      setIsDark(!isDark);
    };

    return (
      <div style={{ display: "flex", gap: "16px", flexDirection: "column" }}>
        <h3>Dark Mode Toggle</h3>
        <Button onClick={toggleMode}>{isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}</Button>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button color="primary">Primary</Button>
          <Button color="success">Success</Button>
          <Button color="error">Error</Button>
        </div>
      </div>
    );
  },
};

// ==================== Full Customization ====================
export const FullCustomization: Story = {
  render: () => {
    useEffect(() => {
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
        spacing: {
          md: 20, // Default 16px
          lg: 30, // Default 24px
        },
        typography: {
          fontFamily: "Poppins, sans-serif",
          sizes: {
            base: 15, // Default 16px
          },
        },
        borderRadius: {
          md: 8, // Default 12px
        },
      };

      applyTheme(customTheme);
    }, []);

    return (
      <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
        <h3>Full Customization</h3>
        <p>Colors, spacing, typography, border radius</p>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button color="primary">Primary</Button>
          <Button color="success">Success</Button>
          <Button color="error">Error</Button>
        </div>
      </div>
    );
  },
};

// ==================== Angular Design ====================
export const AngularDesign: Story = {
  render: () => {
    useEffect(() => {
      applyTheme({
        colors: {
          primary: "#000000",
        },
        borderRadius: {
          xxs: 0,
          xs: 0,
          s: 2,
          md: 4,
          lg: 8,
        },
      });
    }, []);

    return (
      <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
        <h3>Angular Design (Nike-style)</h3>
        <p>Keskin köşeler, minimal radius</p>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button color="primary">Shop Now</Button>
          <Button color="primary" variant="outlined">
            Learn More
          </Button>
        </div>
      </div>
    );
  },
};

// ==================== Rounded Design ====================
export const RoundedDesign: Story = {
  render: () => {
    useEffect(() => {
      applyTheme({
        colors: {
          primary: "#ff6b6b",
        },
        borderRadius: {
          xxs: 8,
          xs: 12,
          s: 16,
          md: 20,
          lg: 32,
        },
      });
    }, []);

    return (
      <div style={{ display: "flex", gap: "12px", flexDirection: "column" }}>
        <h3>Rounded Design (Modern)</h3>
        <p>Yuvarlaklı köşeler, friendly feel</p>
        <div style={{ display: "flex", gap: "8px" }}>
          <Button color="primary">Get Started</Button>
          <Button color="primary" variant="outlined">
            Try Free
          </Button>
        </div>
      </div>
    );
  },
};

