import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";
import { AvatarGroup } from "./AvatarGroup";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "radio", options: ["xs", "sm", "md", "lg", "xl"] },
    shape: { control: "radio", options: ["circular", "rounded", "square"] },
    color: {
      control: "radio",
      options: ["primary", "success", "error", "warning", "info", "neutral"],
    },
  },
  args: { name: "Volkan Günay", size: "md", color: "primary", shape: "circular" },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {};

export const WithImage: Story = {
  args: {
    src: "https://i.pravatar.cc/300?img=12",
    alt: "Avatar",
  },
};

export const FallbackOnBrokenImage: Story = {
  args: { src: "https://not-a-real-image.example/404.png", name: "Broken Link" },
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
        <Avatar key={s} {...args} size={s} />
      ))}
    </div>
  ),
};

export const AllShapes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12 }}>
      {(["circular", "rounded", "square"] as const).map((sh) => (
        <Avatar key={sh} {...args} shape={sh} />
      ))}
    </div>
  ),
};

export const AllColors: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {(["primary", "success", "error", "warning", "info", "neutral"] as const).map((c) => (
        <Avatar key={c} {...args} color={c} />
      ))}
    </div>
  ),
};

export const Group: StoryObj<typeof AvatarGroup> = {
  render: () => (
    <AvatarGroup max={3} size="md">
      <Avatar name="Volkan Günay" color="primary" />
      <Avatar name="Ada Lovelace" color="success" />
      <Avatar name="Alan Turing" color="info" />
      <Avatar name="Grace Hopper" color="warning" />
      <Avatar name="Donald Knuth" color="error" />
    </AvatarGroup>
  ),
};
