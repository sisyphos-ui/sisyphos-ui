import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@sisyphos-ui/button";
import { DropdownMenu } from "./DropdownMenu";

const meta: Meta<typeof DropdownMenu> = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof DropdownMenu>;

const ChevronDown = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
    <path d="M7 10l5 5 5-5z" fill="currentColor" />
  </svg>
);

export const Default: Story = {
  render: () => (
    <div style={{ padding: 80 }}>
      <DropdownMenu
        items={[
          { label: "Edit", onSelect: () => alert("edit") },
          { label: "Duplicate", onSelect: () => alert("duplicate") },
          { type: "separator" },
          { label: "Move to archive", onSelect: () => alert("archive") },
          { type: "separator" },
          { label: "Delete", destructive: true, onSelect: () => alert("delete") },
        ]}
      >
        <Button endIcon={<ChevronDown />}>Actions</Button>
      </DropdownMenu>
    </div>
  ),
};

export const WithLabelsAndShortcuts: Story = {
  render: () => (
    <div style={{ padding: 80 }}>
      <DropdownMenu
        items={[
          { type: "label", label: "File" },
          { label: "New", shortcut: "⌘N", onSelect: () => {} },
          { label: "Open…", shortcut: "⌘O", onSelect: () => {} },
          { label: "Save", shortcut: "⌘S", onSelect: () => {} },
          { type: "separator" },
          { type: "label", label: "Edit" },
          { label: "Undo", shortcut: "⌘Z", onSelect: () => {} },
          { label: "Redo", shortcut: "⇧⌘Z", onSelect: () => {}, disabled: true },
        ]}
      >
        <Button variant="outlined" endIcon={<ChevronDown />}>Menu</Button>
      </DropdownMenu>
    </div>
  ),
};

export const InToolbar: Story = {
  render: () => (
    <div style={{ padding: 80, display: "flex", gap: 8, alignItems: "center" }}>
      <Button variant="outlined" size="sm">Save</Button>
      <Button variant="outlined" size="sm">Share</Button>
      <DropdownMenu
        items={[
          { label: "Export as PDF", onSelect: () => {} },
          { label: "Export as PNG", onSelect: () => {} },
          { type: "separator" },
          { label: "Print", shortcut: "⌘P", onSelect: () => {} },
        ]}
      >
        <Button variant="outlined" size="sm" endIcon={<ChevronDown />}>More</Button>
      </DropdownMenu>
    </div>
  ),
};
