import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@sisyphos-ui/button";
import { Alert } from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "radio", options: ["contained", "outlined", "soft"] },
    color: { control: "radio", options: ["primary", "success", "error", "warning", "info"] },
  },
  args: {
    color: "info",
    variant: "soft",
    title: "Heads up",
    description: "You can still change this later from the settings page.",
  },
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {};

export const WithClose: Story = {
  args: { onClose: () => alert("closed") },
};

export const AllColors: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      {(["primary", "success", "error", "warning", "info"] as const).map((c) => (
        <Alert key={c} {...args} color={c} title={`${c} alert`} description={`Short ${c} description.`} />
      ))}
    </div>
  ),
};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <Alert {...args} variant="contained" color="primary" />
      <Alert {...args} variant="outlined" color="primary" />
      <Alert {...args} variant="soft" color="primary" />
    </div>
  ),
};

export const WithActions: Story = {
  args: {
    color: "warning",
    title: "Storage almost full",
    description: "Upgrade your plan or clean up old files.",
    actions: (
      <>
        <Button size="sm" color="warning">Upgrade</Button>
        <Button size="sm" variant="outlined" color="warning">Manage files</Button>
      </>
    ),
  },
};

export const DescriptionOnly: Story = {
  args: { title: undefined, description: "Just a small note." },
};
