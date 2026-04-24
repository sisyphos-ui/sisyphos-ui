import type { Meta, StoryObj } from "@storybook/react";
import { Input, type InputProps } from "./Input";

const meta = {
  title: "Components/Input",
  component: Input as any,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Input component with label, error states, variants, and password toggle.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["standard", "outlined", "underline"],
      description: "Visual variant",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Size of the input",
    },
    radius: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Border radius override",
    },
    type: {
      control: "select",
      options: ["text", "password", "email", "number"],
      description: "Input type",
    },
    disabled: {
      control: "boolean",
    },
    readOnly: {
      control: "boolean",
    },
    error: {
      control: "boolean",
    },
    fullWidth: {
      control: "boolean",
    },
    required: {
      control: "boolean",
    },
    maxLength: {
      control: { type: "number", min: 1, max: 500 },
      description: "Max character limit. Required for showCharacterCount.",
    },
    showCharacterCount: {
      control: "boolean",
      description: "Show character count (requires maxLength)",
    },
  },
} satisfies Meta<InputProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **Playground** - Tüm prop kombinasyonlarını test edin.
 */
export const Playground: Story = {
  args: {
    label: "Label",
    placeholder: "Placeholder",
    variant: "standard",
    size: "md",
    disabled: false,
    error: false,
    fullWidth: false,
    maxLength: 100,
    showCharacterCount: true,
  },
};
