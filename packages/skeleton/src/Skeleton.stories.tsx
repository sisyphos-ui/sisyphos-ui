import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "./Skeleton";
import { SkeletonText } from "./SkeletonText";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    shape: { control: "radio", options: ["rectangular", "circular", "text"] },
    animation: { control: "radio", options: ["shimmer", "pulse", "none"] },
  },
  args: { width: 240, height: 24, shape: "rectangular", animation: "shimmer" },
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {};

export const Circular: Story = { args: { shape: "circular", width: 48, height: 48 } };

export const Animations: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16 }}>
      <Skeleton {...args} animation="shimmer" />
      <Skeleton {...args} animation="pulse" />
      <Skeleton {...args} animation="none" />
    </div>
  ),
};

export const ComposedCard: StoryObj<typeof Skeleton> = {
  render: () => (
    <div style={{ width: 320, padding: 16, border: "1px solid #eee", borderRadius: 12 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <Skeleton shape="circular" width={48} height={48} />
        <div style={{ flex: 1 }}>
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={12} style={{ marginTop: 8 }} />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  ),
};
