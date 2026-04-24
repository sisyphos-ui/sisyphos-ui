import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@sisyphos-ui/button";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    placement: {
      control: "radio",
      options: [
        "top",
        "bottom",
        "left",
        "right",
        "top-start",
        "top-end",
        "bottom-start",
        "bottom-end",
      ],
    },
  },
  args: { content: "I'm a tooltip", placement: "top", arrow: true },
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: (args) => (
    <div style={{ padding: 80 }}>
      <Tooltip {...args}>
        <Button>Hover me</Button>
      </Tooltip>
    </div>
  ),
};

export const AllPlacements: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, padding: 80 }}>
      {(["top", "bottom", "left", "right"] as const).map((p) => (
        <Tooltip key={p} placement={p} content={`placement = ${p}`}>
          <Button variant="outlined">{p}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const RichContent: Story = {
  render: (args) => (
    <div style={{ padding: 80 }}>
      <Tooltip
        {...args}
        content={
          <>
            <strong>Shortcut:</strong> ⌘K
          </>
        }
      >
        <Button variant="soft">Search</Button>
      </Tooltip>
    </div>
  ),
};

export const NoArrow: Story = {
  args: { arrow: false },
  render: (args) => (
    <div style={{ padding: 80 }}>
      <Tooltip {...args}>
        <Button>Hover</Button>
      </Tooltip>
    </div>
  ),
};

export const InToolbar: Story = {
  render: () => (
    <div style={{ padding: 80, display: "flex", gap: 4 }}>
      {(["Bold", "Italic", "Underline", "Strikethrough"] as const).map((label) => (
        <Tooltip key={label} content={label} placement="top">
          <Button variant="text" size="sm">
            {label[0]}
          </Button>
        </Tooltip>
      ))}
    </div>
  ),
};
