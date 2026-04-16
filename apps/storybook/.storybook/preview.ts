import type { Preview } from "@storybook/react";
import "@sisyphos-ui/core/styles.scss";

/**
 * Custom viewports — gives every story a top-toolbar dropdown to test
 * mobile / tablet / desktop layouts without leaving the canvas.
 */
const viewports = {
  mobile: {
    name: "Mobile (360)",
    styles: { width: "360px", height: "640px" },
    type: "mobile" as const,
  },
  mobileLarge: {
    name: "Mobile (414)",
    styles: { width: "414px", height: "896px" },
    type: "mobile" as const,
  },
  tablet: {
    name: "Tablet (768)",
    styles: { width: "768px", height: "1024px" },
    type: "tablet" as const,
  },
  laptop: {
    name: "Laptop (1280)",
    styles: { width: "1280px", height: "800px" },
    type: "desktop" as const,
  },
  desktop: {
    name: "Desktop (1440)",
    styles: { width: "1440px", height: "900px" },
    type: "desktop" as const,
  },
  desktopWide: {
    name: "Desktop wide (1920)",
    styles: { width: "1920px", height: "1080px" },
    type: "desktop" as const,
  },
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },
    layout: "padded",
    backgrounds: {
      default: "surface",
      values: [
        { name: "surface", value: "#ffffff" },
        { name: "muted", value: "#f9fafb" },
        { name: "dark", value: "#111827" },
      ],
    },
    viewport: {
      viewports,
      defaultViewport: "responsive",
    },
    a11y: {
      element: "#storybook-root",
      manual: false,
    },
    docs: {
      toc: true,
    },
    options: {
      storySort: {
        order: [
          "Foundation",
          [
            "Introduction",
            "Design Tokens",
            "Theme System",
            "Core Package",
            "Color Palette",
            "UI Package",
            "Best Practices",
            "Real-World Examples",
            "Component Structure",
            "Troubleshooting",
          ],
          "Components",
        ],
      },
    },
  },
};

export default preview;
