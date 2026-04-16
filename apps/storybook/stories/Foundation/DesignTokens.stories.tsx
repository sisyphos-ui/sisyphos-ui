import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";

const meta = {
  title: "Foundation/Design Tokens",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Design tokens showcase - Colors, Spacing, Typography, Border Radius, and more.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ==================== Colors - Main Semantic Colors ====================
export const Colors: Story = {
  render: () => {
    const colors = [
      { name: "Primary", var: "--sisyphos-color-primary", value: "#ff7022", description: "Brand color, main actions" },
      { name: "Success", var: "--sisyphos-color-success", value: "#22c55e", description: "Success states, positive actions" },
      { name: "Error", var: "--sisyphos-color-error", value: "#fb3748", description: "Error states, destructive actions" },
      { name: "Warning", var: "--sisyphos-color-warning", value: "#ffab00", description: "Warning states, caution actions" },
      { name: "Info", var: "--sisyphos-color-info", value: "#00b8d9", description: "Info states, informational messages" },
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div>
          <h2>Semantic Colors (Main)</h2>
          <p style={{ color: "var(--sisyphos-color-neutral-dark, #212b36)", marginTop: "8px" }}>
            These are the main semantic colors used throughout the design system. Each color has additional shades (light, lighter, dark, darker, contained) that can be used for different states and variants.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {colors.map((color) => (
            <div
              key={color.name}
              style={{
                border: "1px solid var(--sisyphos-color-neutral-darker, #919eab33)",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100px",
                  background: `var(${color.var}, ${color.value})`,
                }}
              />
              <div style={{ padding: "12px" }}>
                <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                  {color.name}
                </div>
                <div style={{ fontSize: "12px", color: "var(--sisyphos-color-neutral-dark, #212b36)", marginBottom: "8px", opacity: 0.8 }}>
                  {color.description}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--sisyphos-color-neutral-dark, #212b36)",
                    fontFamily: "monospace",
                    marginBottom: "4px",
                  }}
                >
                  {color.var}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--sisyphos-color-neutral-dark, #212b36)",
                    fontFamily: "monospace",
                  }}
                >
                  {color.value}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "16px", padding: "16px", background: "var(--sisyphos-color-neutral-light, #f3f4f6)", borderRadius: "8px" }}>
          <h3 style={{ marginBottom: "8px" }}>Usage Example</h3>
          <pre style={{ 
            background: "var(--sisyphos-color-neutral-lighter, #fff)", 
            padding: "12px", 
            borderRadius: "4px",
            fontSize: "12px",
            overflow: "auto"
          }}>
{`/* CSS Variables */
color: var(--sisyphos-color-primary);
background: var(--sisyphos-color-primary-light);

/* SCSS - Use CSS variables */
.my-component {
  color: var(--sisyphos-color-primary);
  background: var(--sisyphos-color-primary-lighter);
}`}
          </pre>
        </div>
      </div>
    );
  },
};

// ==================== Color Shades ====================
export const ColorShades: Story = {
  render: () => {
    const colorShades = [
      {
        name: "Primary",
        shades: [
          { name: "Main", var: "--sisyphos-color-primary", value: "#ff7022", usage: "Brand color, main actions" },
          { name: "Light", var: "--sisyphos-color-primary-light", value: "#ff8637", usage: "Hover states" },
          { name: "Lighter", var: "--sisyphos-color-primary-lighter", value: "#ffede0", usage: "Backgrounds, soft variant" },
          { name: "Dark", var: "--sisyphos-color-primary-dark", value: "#e5631c", usage: "Pressed states" },
          { name: "Darker", var: "--sisyphos-color-primary-darker", value: "#b84d16", usage: "Borders, dividers" },
          { name: "Contained", var: "--sisyphos-color-primary-contained", value: "#f04906", usage: "Contained button background" },
        ],
      },
      {
        name: "Success",
        shades: [
          { name: "Main", var: "--sisyphos-color-success", value: "#22c55e", usage: "Success states" },
          { name: "Light", var: "--sisyphos-color-success-light", value: "#4ade80", usage: "Hover states" },
          { name: "Lighter", var: "--sisyphos-color-success-lighter", value: "#dcfce7", usage: "Backgrounds, soft variant" },
          { name: "Dark", var: "--sisyphos-color-success-dark", value: "#16a34a", usage: "Pressed states" },
          { name: "Darker", var: "--sisyphos-color-success-darker", value: "#15803d", usage: "Borders, dividers" },
          { name: "Contained", var: "--sisyphos-color-success-contained", value: "#16a34a", usage: "Contained button background" },
        ],
      },
      {
        name: "Error",
        shades: [
          { name: "Main", var: "--sisyphos-color-error", value: "#fb3748", usage: "Error states" },
          { name: "Light", var: "--sisyphos-color-error-light", value: "#fc5a67", usage: "Hover states" },
          { name: "Lighter", var: "--sisyphos-color-error-lighter", value: "#fee2e2", usage: "Backgrounds, soft variant" },
          { name: "Dark", var: "--sisyphos-color-error-dark", value: "#dc2626", usage: "Pressed states" },
          { name: "Darker", var: "--sisyphos-color-error-darker", value: "#b91c1c", usage: "Borders, dividers" },
          { name: "Contained", var: "--sisyphos-color-error-contained", value: "#dc2626", usage: "Contained button background" },
        ],
      },
      {
        name: "Warning",
        shades: [
          { name: "Main", var: "--sisyphos-color-warning", value: "#ffab00", usage: "Warning states" },
          { name: "Light", var: "--sisyphos-color-warning-light", value: "#ffc107", usage: "Hover states" },
          { name: "Lighter", var: "--sisyphos-color-warning-lighter", value: "#fef3c7", usage: "Backgrounds, soft variant" },
          { name: "Dark", var: "--sisyphos-color-warning-dark", value: "#f59e0b", usage: "Pressed states" },
          { name: "Darker", var: "--sisyphos-color-warning-darker", value: "#d97706", usage: "Borders, dividers" },
          { name: "Contained", var: "--sisyphos-color-warning-contained", value: "#f59e0b", usage: "Contained button background" },
        ],
      },
      {
        name: "Info",
        shades: [
          { name: "Main", var: "--sisyphos-color-info", value: "#00b8d9", usage: "Info states" },
          { name: "Light", var: "--sisyphos-color-info-light", value: "#06b6d4", usage: "Hover states" },
          { name: "Lighter", var: "--sisyphos-color-info-lighter", value: "#cffafe", usage: "Backgrounds, soft variant" },
          { name: "Dark", var: "--sisyphos-color-info-dark", value: "#0891b2", usage: "Pressed states" },
          { name: "Darker", var: "--sisyphos-color-info-darker", value: "#0e7490", usage: "Borders, dividers" },
          { name: "Contained", var: "--sisyphos-color-info-contained", value: "#0891b2", usage: "Contained button background" },
        ],
      },
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        <div>
          <h2>Color Shades - Complete Palette</h2>
          <p style={{ color: "var(--sisyphos-color-neutral-dark, #212b36)", marginTop: "8px" }}>
            Each semantic color has multiple shades for different use cases. These shades are automatically available as CSS variables and can be customized via <code>applyTheme()</code>.
          </p>
        </div>
        
        {colorShades.map((color) => (
          <div key={color.name} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ marginBottom: "8px" }}>{color.name} Color Shades</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
              }}
            >
              {color.shades.map((shade) => (
                <div
                  key={shade.name}
                  style={{
                    border: "1px solid var(--sisyphos-color-neutral-darker, #919eab33)",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "80px",
                      background: `var(${shade.var}, ${shade.value})`,
                      border: shade.name === "Lighter" ? "1px solid var(--sisyphos-color-neutral-darker, #919eab33)" : "none",
                    }}
                  />
                  <div style={{ padding: "12px" }}>
                    <div style={{ fontWeight: 600, marginBottom: "4px", fontSize: "14px" }}>
                      {shade.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--sisyphos-color-neutral-dark, #212b36)", marginBottom: "8px", opacity: 0.7 }}>
                      {shade.usage}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--sisyphos-color-neutral-dark, #212b36)",
                        fontFamily: "monospace",
                        marginBottom: "4px",
                        wordBreak: "break-all",
                      }}
                    >
                      {shade.var}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--sisyphos-color-neutral-dark, #212b36)",
                        fontFamily: "monospace",
                      }}
                    >
                      {shade.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ marginTop: "16px", padding: "16px", background: "var(--sisyphos-color-neutral-light, #f3f4f6)", borderRadius: "8px" }}>
          <h3 style={{ marginBottom: "8px" }}>How to Use Color Shades</h3>
          <pre style={{ 
            background: "var(--sisyphos-color-neutral-lighter, #fff)", 
            padding: "12px", 
            borderRadius: "4px",
            fontSize: "12px",
            overflow: "auto"
          }}>
{`/* CSS Variables - Use directly */
.my-button {
  background: var(--sisyphos-color-primary);        /* Main */
  color: var(--sisyphos-color-neutral-lighter);     /* Text on primary */
}

.my-button:hover {
  background: var(--sisyphos-color-primary-light);  /* Hover state */
}

.my-button:active {
  background: var(--sisyphos-color-primary-dark);   /* Pressed state */
}

/* Soft variant */
.my-soft-button {
  background: var(--sisyphos-color-primary-lighter); /* Soft background */
  color: var(--sisyphos-color-primary);              /* Primary text */
  border: 1px solid var(--sisyphos-color-primary-darker); /* Border */
}

/* Contained variant */
.my-contained-button {
  background: var(--sisyphos-color-primary-contained); /* Contained bg */
  color: var(--sisyphos-color-neutral-lighter);        /* White text */
}`}
          </pre>
        </div>
      </div>
    );
  },
};

// ==================== Spacing ====================
export const Spacing: Story = {
  render: () => {
    const spacings = [
      { name: "xxs", var: "--sisyphos-spacing-xxs", value: "4px" },
      { name: "xs", var: "--sisyphos-spacing-xs", value: "8px" },
      { name: "s", var: "--sisyphos-spacing-s", value: "10px" },
      { name: "md", var: "--sisyphos-spacing-md", value: "16px" },
      { name: "lg", var: "--sisyphos-spacing-lg", value: "24px" },
      { name: "xl", var: "--sisyphos-spacing-xl", value: "32px" },
      { name: "2xl", var: "--sisyphos-spacing-2xl", value: "40px" },
      { name: "3xl", var: "--sisyphos-spacing-3xl", value: "64px" },
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <h2>Spacing Scale</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {spacings.map((spacing) => {
            const size = parseInt(spacing.value);
            return (
              <div
                key={spacing.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    minWidth: "60px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {spacing.name}
                </div>
                <div
                  style={{
                    height: "40px",
                    width: `${size}px`,
                    background: "var(--sisyphos-color-primary, #ff7022)",
                    borderRadius: "4px",
                  }}
                />
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--sisyphos-color-neutral-dark, #212b36)",
                    fontFamily: "monospace",
                    minWidth: "200px",
                  }}
                >
                  {spacing.var}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--sisyphos-color-neutral-dark, #212b36)",
                    fontFamily: "monospace",
                  }}
                >
                  {spacing.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
};

// ==================== Typography ====================
export const Typography: Story = {
  render: () => {
    const typography = [
      {
        name: "Hero XL",
        var: "--sisyphos-font-size-hero-xl",
        value: "64px",
        weight: "bold",
      },
      {
        name: "Hero",
        var: "--sisyphos-font-size-hero",
        value: "48px",
        weight: "bold",
      },
      { name: "H1", var: "--sisyphos-font-size-h1", value: "40px", weight: "bold" },
      { name: "H2", var: "--sisyphos-font-size-h2", value: "32px", weight: "bold" },
      { name: "H3", var: "--sisyphos-font-size-h3", value: "24px", weight: "bold" },
      { name: "H4", var: "--sisyphos-font-size-h4", value: "20px", weight: "bold" },
      { name: "H5", var: "--sisyphos-font-size-h5", value: "18px", weight: "bold" },
      { name: "H6", var: "--sisyphos-font-size-h6", value: "16px", weight: "bold" },
      {
        name: "Base",
        var: "--sisyphos-font-size-base",
        value: "16px",
        weight: "regular",
      },
      {
        name: "Medium",
        var: "--sisyphos-font-size-md",
        value: "14px",
        weight: "regular",
      },
      {
        name: "Small",
        var: "--sisyphos-font-size-sm",
        value: "12px",
        weight: "regular",
      },
      {
        name: "XS",
        var: "--sisyphos-font-size-xs",
        value: "10px",
        weight: "regular",
      },
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <h2>Typography Scale</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {typography.map((type) => (
            <div
              key={type.name}
              style={{
                borderBottom: "1px solid var(--sisyphos-color-neutral-darker, #919eab33)",
                paddingBottom: "16px",
              }}
            >
              <div
                style={{
                  fontSize: `var(${type.var}, ${type.value})`,
                  fontWeight: type.weight === "bold" ? 700 : 400,
                  fontFamily: "var(--sisyphos-font-family, 'Manrope', sans-serif)",
                  color: "var(--sisyphos-color-neutral-dark, #212b36)",
                  marginBottom: "8px",
                }}
              >
                {type.name} - The quick brown fox jumps over the lazy dog
              </div>
              <div style={{ display: "flex", gap: "16px", fontSize: "12px" }}>
                <div
                  style={{
                    color: "var(--sisyphos-color-neutral-dark, #212b36)",
                    fontFamily: "monospace",
                  }}
                >
                  {type.var}
                </div>
                <div
                  style={{
                    color: "var(--sisyphos-color-neutral-dark, #212b36)",
                    fontFamily: "monospace",
                  }}
                >
                  {type.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

// ==================== Border Radius ====================
export const BorderRadius: Story = {
  render: () => {
    const radiuses = [
      { name: "xxs", var: "--sisyphos-radius-xxs", value: "4px" },
      { name: "xs", var: "--sisyphos-radius-xs", value: "6px" },
      { name: "s", var: "--sisyphos-radius-s", value: "8px" },
      { name: "md", var: "--sisyphos-radius-md", value: "12px" },
      { name: "lg", var: "--sisyphos-radius-lg", value: "16px" },
      { name: "full", var: "--sisyphos-radius-full", value: "9999px" },
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <h2>Border Radius Scale</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "24px",
          }}
        >
          {radiuses.map((radius) => (
            <div
              key={radius.name}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  background: "var(--sisyphos-color-primary, #ff7022)",
                  borderRadius: `var(${radius.var}, ${radius.value})`,
                }}
              />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                  {radius.name}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--sisyphos-color-neutral-dark, #212b36)",
                    fontFamily: "monospace",
                  }}
                >
                  {radius.var}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--sisyphos-color-neutral-dark, #212b36)",
                    fontFamily: "monospace",
                    marginTop: "4px",
                  }}
                >
                  {radius.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

// ==================== Neutral Colors ====================
export const NeutralColors: Story = {
  render: () => {
    const neutrals = [
      {
        name: "Lighter",
        var: "--sisyphos-color-neutral-lighter",
        value: "#ffffff",
        usage: "White, card backgrounds, paper surfaces",
      },
      { 
        name: "Light", 
        var: "--sisyphos-color-neutral-light", 
        value: "#f3f4f6",
        usage: "Subtle backgrounds, hover states",
      },
      { 
        name: "Main", 
        var: "--sisyphos-color-neutral", 
        value: "#f9fafb",
        usage: "Light gray background, default surface",
      },
      { 
        name: "Dark", 
        var: "--sisyphos-color-neutral-dark", 
        value: "#212b36",
        usage: "Text color, headings, primary text",
      },
      {
        name: "Darker",
        var: "--sisyphos-color-neutral-darker",
        value: "rgba(145, 158, 171, 0.2)",
        usage: "Borders, dividers (20% opacity)",
      },
    ];

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div>
          <h2>Neutral Colors</h2>
          <p style={{ color: "var(--sisyphos-color-neutral-dark, #212b36)", marginTop: "8px" }}>
            Neutral colors are used for backgrounds, borders, text, and dividers. They provide contrast and structure to the UI. In dark mode, neutral colors automatically adapt.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {neutrals.map((neutral) => (
            <div
              key={neutral.name}
              style={{
                border: "1px solid var(--sisyphos-color-neutral-darker, #919eab33)",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100px",
                  background: `var(${neutral.var}, ${neutral.value})`,
                  border:
                    neutral.name === "Lighter"
                      ? "1px solid var(--sisyphos-color-neutral-darker, #919eab33)"
                      : "none",
                }}
              />
              <div style={{ padding: "12px" }}>
                <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                  {neutral.name}
                </div>
                <div style={{ fontSize: "11px", color: "var(--sisyphos-color-neutral-dark, #212b36)", marginBottom: "8px", opacity: 0.7 }}>
                  {neutral.usage}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--sisyphos-color-neutral-dark, #212b36)",
                    fontFamily: "monospace",
                    marginBottom: "4px",
                    wordBreak: "break-all",
                  }}
                >
                  {neutral.var}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--sisyphos-color-neutral-dark, #212b36)",
                    fontFamily: "monospace",
                  }}
                >
                  {neutral.value}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: "16px", padding: "16px", background: "var(--sisyphos-color-neutral-light, #f3f4f6)", borderRadius: "8px" }}>
          <h3 style={{ marginBottom: "8px" }}>Neutral Colors Usage</h3>
          <pre style={{ 
            background: "var(--sisyphos-color-neutral-lighter, #fff)", 
            padding: "12px", 
            borderRadius: "4px",
            fontSize: "12px",
            overflow: "auto"
          }}>
{`/* Backgrounds */
.card {
  background: var(--sisyphos-color-neutral-lighter); /* White */
}

.section {
  background: var(--sisyphos-color-neutral);         /* Light gray */
}

.hover-state:hover {
  background: var(--sisyphos-color-neutral-light);   /* Subtle hover */
}

/* Text */
.heading {
  color: var(--sisyphos-color-neutral-dark);         /* Dark text */
}

/* Borders & Dividers */
.border {
  border: 1px solid var(--sisyphos-color-neutral-darker); /* Subtle border */
}`}
          </pre>
          <div style={{ marginTop: "16px", padding: "12px", background: "var(--sisyphos-color-primary-lighter, #ffede0)", borderRadius: "4px" }}>
            <strong>Why Neutral Colors?</strong>
            <p style={{ fontSize: "14px", marginTop: "8px", marginBottom: 0 }}>
              Neutral colors are essential for creating contrast, readability, and visual hierarchy. They're used for backgrounds, text, borders, and dividers. In dark mode, only neutral colors change (semantic colors stay the same for consistency).
            </p>
          </div>
        </div>
      </div>
    );
  },
};
