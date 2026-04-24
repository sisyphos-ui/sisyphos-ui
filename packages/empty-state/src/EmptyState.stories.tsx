import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@sisyphos-ui/button";
import { EmptyState } from "./EmptyState";

const InboxIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path
      d="M3 7h18M5 7l1-3h12l1 3M5 7v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7M9 11h6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path
      d="M12 5v14M5 12h14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
  },
  args: {
    icon: <InboxIcon />,
    title: "Nothing here yet",
    description: "Try adjusting your filters or create a new item to get started.",
    size: "md",
    bordered: true,
  },
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    actions: (
      <>
        <Button variant="outlined">Clear filters</Button>
        <Button startIcon={<PlusIcon />}>New item</Button>
      </>
    ),
  },
};

export const Minimal: Story = {
  args: { icon: undefined, description: undefined, bordered: false, title: "No results" },
};

export const Bare: Story = { args: { bordered: false } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16 }}>
      <EmptyState {...args} size="sm" />
      <EmptyState {...args} size="md" />
      <EmptyState {...args} size="lg" />
    </div>
  ),
};
