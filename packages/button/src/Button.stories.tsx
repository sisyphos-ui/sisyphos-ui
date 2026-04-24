import type { Meta, StoryObj } from "@storybook/react";
import { Button, type ButtonProps } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button as any,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Button component with multiple variants and sizes. Used for primary actions throughout the application.",
      },
      source: {
        type: "dynamic",
      },
      canvas: {
        sourceState: "shown",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["contained", "outlined", "text", "soft"],
      description: "Visual style variant of the button",
      table: {
        type: { summary: '"contained" | "outlined" | "text" | "soft"' },
        defaultValue: { summary: '"contained"' },
      },
    },
    color: {
      control: "select",
      options: ["primary", "success", "error", "warning", "info"],
      description: "Semantic color of the button",
      table: {
        type: { summary: '"primary" | "success" | "error" | "warning" | "info"' },
        defaultValue: { summary: '"primary"' },
      },
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Size of the button",
      table: {
        type: { summary: '"xs" | "sm" | "md" | "lg" | "xl"' },
        defaultValue: { summary: '"md"' },
      },
    },
    radius: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Border radius override",
      table: {
        type: { summary: '"xs" | "sm" | "md" | "lg" | "xl"' },
        defaultValue: { summary: '"md"' },
      },
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    loading: {
      control: "boolean",
      description: "Shows loading spinner and disables interaction",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    loadingPosition: {
      control: "select",
      options: ["start", "center", "end"],
      description: "Position of loading indicator",
      table: {
        type: { summary: '"start" | "center" | "end"' },
        defaultValue: { summary: '"start"' },
      },
    },
    fullWidth: {
      control: "boolean",
      description: "Button takes full width of container",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    href: {
      control: "text",
      description: "Renders as anchor when provided (polymorphic)",
      table: {
        type: { summary: "string" },
      },
    },
    children: {
      control: "text",
      description: "Button content (text or React nodes)",
      table: {
        type: { summary: "React.ReactNode" },
      },
    },
    startIcon: {
      description: "Icon to display at the start of the button",
      table: {
        type: { summary: "React.ReactNode" },
      },
    },
    endIcon: {
      description: "Icon to display at the end of the button",
      table: {
        type: { summary: "React.ReactNode" },
      },
    },
    dropdownItems: {
      description: "Dropdown menu items",
      table: {
        type: { summary: "ButtonDropdownItem[]" },
      },
    },
    onClick: {
      action: "clicked",
      description: "Click event handler",
      table: {
        type: { summary: "(e: React.MouseEvent) => void" },
      },
    },
    "aria-label": {
      control: "text",
      description: "Required for icon-only buttons (accessibility)",
      table: {
        type: { summary: "string" },
      },
    },
  },
} satisfies Meta<ButtonProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Playground — drive every prop from the Controls panel.
 * Open the Docs tab for the full API and accessibility notes.
 */
export const Playground: Story = {
  args: {
    variant: "outlined",
    color: "primary",
    size: "md",
    children: "Button",
    disabled: false,
    loading: false,
    fullWidth: false,
  },
};
