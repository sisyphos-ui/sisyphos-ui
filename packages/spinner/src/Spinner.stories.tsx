import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./Spinner";
import { LoadingOverlay } from "./LoadingOverlay";

const meta: Meta<typeof Spinner> = {
  title: "Components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "radio", options: ["xs", "sm", "md", "lg", "xl"] },
    color: {
      control: "radio",
      options: ["primary", "success", "error", "warning", "info", "neutral", "inherit"],
    },
  },
  args: { size: "md", color: "primary" },
};
export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
        <Spinner key={s} {...args} size={s} />
      ))}
    </div>
  ),
};

export const AllColors: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      {(["primary", "success", "error", "warning", "info", "neutral"] as const).map((c) => (
        <Spinner key={c} {...args} color={c} />
      ))}
    </div>
  ),
};

export const Overlay_Inline: StoryObj<typeof LoadingOverlay> = {
  render: () => (
    <div style={{ height: 200, border: "1px dashed #ccc" }}>
      <LoadingOverlay variant="inline" text="Loading items…" />
    </div>
  ),
};

export const Overlay_Container: StoryObj<typeof LoadingOverlay> = {
  render: () => (
    <div style={{ height: 240, position: "relative", border: "1px solid #eee", padding: 16 }}>
      <p>Content beneath overlay.</p>
      <LoadingOverlay variant="overlay" text="Saving…" />
    </div>
  ),
};
