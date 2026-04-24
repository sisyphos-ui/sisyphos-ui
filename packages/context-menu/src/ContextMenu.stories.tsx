import type { Meta, StoryObj } from "@storybook/react";
import { ContextMenu } from "./ContextMenu";

const meta: Meta<typeof ContextMenu> = {
  title: "Components/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof ContextMenu>;

const items = [
  { label: "Edit", onSelect: () => console.log("edit") },
  { label: "Duplicate", onSelect: () => console.log("duplicate") },
  { type: "separator" as const },
  { label: "Copy link", onSelect: () => console.log("copy") },
  { type: "separator" as const },
  { label: "Delete", destructive: true, onSelect: () => console.log("delete") },
];

export const Default: Story = {
  render: () => (
    <ContextMenu items={items}>
      <div
        style={{
          width: 300,
          height: 200,
          border: "2px dashed #e5e7eb",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
          color: "#6b7280",
        }}
      >
        Right-click anywhere in this area
      </div>
    </ContextMenu>
  ),
};

export const WithLabels: Story = {
  render: () => (
    <ContextMenu
      items={[
        { type: "label", label: "Actions" },
        { label: "Rename", onSelect: () => {} },
        { label: "Move", onSelect: () => {} },
        { type: "separator" },
        { type: "label", label: "Danger" },
        { label: "Archive", onSelect: () => {} },
        { label: "Delete", destructive: true, onSelect: () => {} },
      ]}
    >
      <div style={{ padding: 24, background: "#f9fafb", borderRadius: 8 }}>Right-click me</div>
    </ContextMenu>
  ),
};
