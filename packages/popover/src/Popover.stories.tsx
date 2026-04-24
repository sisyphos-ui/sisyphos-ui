import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@sisyphos-ui/button";
import { Popover } from "./Popover";

const meta: Meta<typeof Popover> = {
  title: "Components/Popover",
  component: Popover,
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
    trigger: { control: "radio", options: ["click", "hover", "manual"] },
  },
  args: {
    placement: "bottom",
    trigger: "click",
    arrow: true,
    content: (
      <div style={{ maxWidth: 260 }}>
        <h4 style={{ margin: "0 0 8px", fontSize: 16 }}>Quick help</h4>
        <p style={{ margin: 0, color: "#637381" }}>
          Popovers host rich, interactive content — text, links, even forms.
        </p>
      </div>
    ),
  },
};
export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: (args) => (
    <div style={{ padding: 80 }}>
      <Popover {...args}>
        <Button>Open popover</Button>
      </Popover>
    </div>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: 80, display: "flex", gap: 12, alignItems: "center" }}>
        <Popover {...args} open={open} onOpenChange={setOpen}>
          <Button color={open ? "success" : "primary"}>{open ? "Close" : "Open"}</Button>
        </Popover>
        <Button variant="outlined" onClick={() => setOpen((o) => !o)}>
          External toggle
        </Button>
      </div>
    );
  },
};

export const Hover: Story = {
  args: { trigger: "hover" },
  render: (args) => (
    <div style={{ padding: 80 }}>
      <Popover {...args}>
        <Button variant="outlined">Hover me</Button>
      </Popover>
    </div>
  ),
};

export const Placements: Story = {
  render: (args) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, padding: 80 }}>
      {(["top", "bottom", "left", "right"] as const).map((p) => (
        <Popover key={p} {...args} placement={p}>
          <Button variant="soft">{p}</Button>
        </Popover>
      ))}
    </div>
  ),
};
