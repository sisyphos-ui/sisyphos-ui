import type { Meta, StoryObj } from "@storybook/react";
import { Chip } from "./Chip";

const meta: Meta<typeof Chip> = {
  title: "Components/Chip",
  component: Chip,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "radio", options: ["contained", "outlined", "soft"] },
    color: { control: "radio", options: ["primary", "success", "error", "warning", "info"] },
    size: { control: "radio", options: ["xs", "sm", "md", "lg", "xl"] },
    radius: { control: "radio", options: ["xxs", "xs", "sm", "md", "lg", "xl", "full"] },
  },
  args: {
    children: "Label",
    variant: "soft",
    color: "primary",
    size: "md",
    radius: "full",
  },
};
export default meta;

type Story = StoryObj<typeof Chip>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Chip {...args} variant="contained">contained</Chip>
      <Chip {...args} variant="outlined">outlined</Chip>
      <Chip {...args} variant="soft">soft</Chip>
    </div>
  ),
};

export const AllColors: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {(["primary", "success", "error", "warning", "info"] as const).map((c) => (
        <Chip key={c} {...args} color={c}>{c}</Chip>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
        <Chip key={s} {...args} size={s}>{s}</Chip>
      ))}
    </div>
  ),
};

export const WithAvatar: Story = {
  args: {
    avatar: <span style={{ background: "#eee", width: "100%", height: "100%" }}>A</span>,
    children: "John Doe",
  },
};

export const Deletable: Story = {
  args: {
    children: "Removable",
    onDelete: () => alert("deleted"),
  },
};

export const Clickable: Story = {
  args: {
    children: "Click me",
    clickable: true,
    onClick: () => alert("clicked"),
  },
};

export const Disabled: Story = {
  args: { disabled: true, onDelete: () => {} },
};
