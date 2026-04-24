import type { Meta, StoryObj } from "@storybook/react";
import { Kbd } from "./Kbd";

const meta: Meta<typeof Kbd> = {
  title: "Components/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "radio", options: ["outlined", "soft"] },
    size: { control: "radio", options: ["xs", "sm", "md", "lg", "xl"] },
  },
  args: {
    variant: "outlined",
    size: "sm",
  },
};
export default meta;

type Story = StoryObj<typeof Kbd>;

export const Single: Story = {
  args: { children: "Esc" },
};

export const Shortcut: Story = {
  args: { shortcut: "cmd+k" },
};

export const WithSeparator: Story = {
  args: { shortcut: "ctrl+shift+p", separator: "+" },
};

export const Soft: Story = {
  args: { variant: "soft", shortcut: "cmd+k" },
};

export const PlatformMod: Story = {
  args: { shortcut: "mod+s" },
  parameters: {
    docs: { description: { story: "`mod` renders ⌘ on macOS and ⌃ elsewhere." } },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Kbd size="xs" shortcut="cmd+k" />
      <Kbd size="sm" shortcut="cmd+k" />
      <Kbd size="md" shortcut="cmd+k" />
      <Kbd size="lg" shortcut="cmd+k" />
      <Kbd size="xl" shortcut="cmd+k" />
    </div>
  ),
};

export const InSentence: Story = {
  render: () => (
    <p style={{ fontSize: 14 }}>
      Press <Kbd shortcut="cmd+k" /> to open the command menu.
    </p>
  ),
};
