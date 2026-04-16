import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Switch, type SwitchProps } from "./Switch";

const meta = {
  title: "Components/Switch",
  component: Switch as any,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Toggle switch with semantic colors and sizes. Used for binary on/off states.",
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
      description: "Size of the switch",
      table: {
        type: { summary: '"xs" | "sm" | "md" | "lg" | "xl"' },
        defaultValue: { summary: '"md"' },
      },
    },
    disabled: {
      control: "boolean",
      description: "Whether the switch is disabled",
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
    "aria-label": {
      control: "text",
      description: "Required for accessibility (screen readers)",
      table: {
        type: { summary: "string" },
      },
    },
  },
} satisfies Meta<SwitchProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Playground — drive every prop from the Controls panel. The `checked` state
 * is owned by `useState` here; the `checked` arg sets the initial value.
 */
export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked ?? false);
    return (
      <Switch
        {...args}
        checked={checked}
        onChange={(v) => setChecked(v)}
      />
    );
  },
  args: {
    color: "primary",
    size: "md",
    checked: false,
    disabled: false,
    "aria-label": "Toggle switch",
  },
};
