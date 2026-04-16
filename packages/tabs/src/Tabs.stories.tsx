import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "radio", options: ["horizontal", "vertical"] },
    variant: { control: "radio", options: ["underline", "pill", "soft"] },
    size: { control: "radio", options: ["sm", "md", "lg"] },
  },
  args: { defaultValue: "overview", orientation: "horizontal", variant: "underline" },
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: (args) => (
    <Tabs {...args}>
      <Tabs.List>
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        <Tabs.Trigger value="logs" disabled>Logs</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      <Tabs.Panel value="settings">Settings content</Tabs.Panel>
      <Tabs.Panel value="logs">Logs content</Tabs.Panel>
    </Tabs>
  ),
};

export const Pill: Story = { args: { variant: "pill" }, render: Default.render };
export const Soft: Story = { args: { variant: "soft" }, render: Default.render };
export const Vertical: Story = { args: { orientation: "vertical" }, render: Default.render };
export const FullWidth: Story = { args: { fullWidth: true }, render: Default.render };
