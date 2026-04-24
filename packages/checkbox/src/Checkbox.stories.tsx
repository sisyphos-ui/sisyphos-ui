import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Checkbox, type CheckboxProps } from "./Checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox as any,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Checkbox with optional label, semantic colors and sizes. Controlled only: pass checked and onChange.",
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
    checked: {
      control: "boolean",
      description: "Checked state. Use parent state (e.g. useState) for default value.",
      table: {
        type: { summary: "boolean" },
      },
    },
    label: {
      control: "text",
      description: "Label text or node",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    color: {
      control: "select",
      options: ["neutral", "primary", "success", "error", "warning", "info"],
      description: "Semantic color when checked",
      table: {
        type: { summary: '"neutral" | "primary" | "success" | "error" | "warning" | "info"' },
        defaultValue: { summary: '"primary"' },
      },
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Size of the checkbox box",
      table: {
        type: { summary: '"xs" | "sm" | "md" | "lg" | "xl"' },
        defaultValue: { summary: '"md"' },
      },
    },
    radius: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Border radius of the box",
      table: {
        type: { summary: '"xs" | "sm" | "md" | "lg" | "xl"' },
        defaultValue: { summary: '"sm"' },
      },
    },
    disabled: {
      control: "boolean",
      description: "Whether the checkbox is disabled",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    onChange: {
      action: "changed",
      description: "Callback when checked state changes",
      table: {
        type: { summary: "(checked: boolean) => void" },
      },
    },
  },
} satisfies Meta<CheckboxProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Playground — drive every prop from the Controls panel. The `checked` state
 * is owned by `useState` here; the `checked` arg sets the initial value.
 */
export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked ?? false);
    return <Checkbox {...args} checked={checked} onChange={(v) => setChecked(v)} />;
  },
  args: {
    color: "primary",
    size: "md",
    radius: "sm",
    checked: false,
    label: "Label",
    disabled: false,
  },
};
