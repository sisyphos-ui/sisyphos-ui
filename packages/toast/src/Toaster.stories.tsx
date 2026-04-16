import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@sisyphos-ui/button";
import { Toaster } from "./Toaster";
import { toast } from "./store";

const meta: Meta<typeof Toaster> = {
  title: "Components/Toast",
  component: Toaster,
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "radio",
      options: [
        "top-left", "top-center", "top-right",
        "bottom-left", "bottom-center", "bottom-right",
      ],
    },
  },
  args: { position: "bottom-right" },
};
export default meta;

type Story = StoryObj<typeof Toaster>;

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 12,
  maxWidth: 720,
};

export const Default: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Toaster {...args} />
      <p style={{ margin: 0, color: "#637381" }}>
        Trigger any toast type below — the active <code>position</code> control updates instantly.
      </p>
      <div style={grid}>
        <Button onClick={() => toast("Default notification")}>Default</Button>
        <Button color="success" onClick={() => toast.success("Saved successfully", { description: "Your changes have been persisted." })}>
          Success
        </Button>
        <Button color="error" onClick={() => toast.error("Save failed", { description: "Network error. Try again.", duration: 6000 })}>
          Error
        </Button>
        <Button color="warning" onClick={() => toast.warning("Storage almost full")}>
          Warning
        </Button>
        <Button color="info" onClick={() => toast.info("Update available", {
          action: <Button size="sm" variant="outlined" color="info" onClick={() => alert("reload")}>Reload</Button>,
        })}>
          Info w/ action
        </Button>
        <Button variant="outlined" onClick={() => toast.clear()}>Clear all</Button>
      </div>
    </div>
  ),
};

export const Persistent: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Toaster {...args} />
      <Button onClick={() => toast("This stays until dismissed", { duration: Infinity })}>
        Show persistent toast
      </Button>
    </div>
  ),
};

export const StackingLimit: Story = {
  args: { max: 3 },
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Toaster {...args} />
      <p style={{ margin: 0, color: "#637381" }}>
        With <code>max=3</code>, toasts beyond the limit drop off the stack automatically.
      </p>
      <Button onClick={() => {
        for (let i = 1; i <= 5; i++) toast(`Toast #${i}`);
      }}>
        Fire 5 toasts
      </Button>
    </div>
  ),
};
