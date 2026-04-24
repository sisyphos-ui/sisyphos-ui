import type { Meta, StoryObj } from "@storybook/react";
import { Command } from "./Command";

const meta: Meta<typeof Command> = {
  title: "Components/Command",
  component: Command,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Command>;

export const Default: Story = {
  render: () => (
    <Command onSelect={(v) => console.log("selected:", v)}>
      <Command.Input placeholder="Type a command or search…" />
      <Command.List>
        <Command.Empty>No results.</Command.Empty>
        <Command.Group heading="Suggestions">
          <Command.Item value="calendar">Calendar</Command.Item>
          <Command.Item value="search emojis">Search Emojis</Command.Item>
          <Command.Item value="calculator">Calculator</Command.Item>
        </Command.Group>
        <Command.Separator />
        <Command.Group heading="Settings">
          <Command.Item value="profile">Profile</Command.Item>
          <Command.Item value="billing">Billing</Command.Item>
          <Command.Item value="preferences">Preferences</Command.Item>
        </Command.Group>
      </Command.List>
    </Command>
  ),
};

export const WithDisabled: Story = {
  render: () => (
    <Command>
      <Command.Input />
      <Command.List>
        <Command.Item value="edit">Edit</Command.Item>
        <Command.Item value="copy" disabled>
          Copy (disabled)
        </Command.Item>
        <Command.Item value="paste">Paste</Command.Item>
      </Command.List>
    </Command>
  ),
};
