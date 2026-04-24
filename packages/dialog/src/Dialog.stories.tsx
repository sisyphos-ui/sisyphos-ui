import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@sisyphos-ui/button";
import { Dialog } from "./Dialog";

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg", "xl", "full"] },
  },
  args: { size: "md" },
};
export default meta;

type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog {...args} open={open} onOpenChange={setOpen}>
          <Dialog.Header>
            <Dialog.Title>Confirm action</Dialog.Title>
            <Dialog.Close />
          </Dialog.Header>
          <Dialog.Body>
            <Dialog.Description>This action cannot be undone. Please confirm.</Dialog.Description>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button color="error" onClick={() => setOpen(false)}>
              Confirm
            </Button>
          </Dialog.Footer>
        </Dialog>
      </>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [size, setSize] = useState<"sm" | "md" | "lg" | "xl" | "full" | null>(null);
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {(["sm", "md", "lg", "xl", "full"] as const).map((s) => (
          <Button key={s} variant="outlined" onClick={() => setSize(s)}>
            {s}
          </Button>
        ))}
        <Dialog open={size !== null} onOpenChange={() => setSize(null)} size={size ?? "md"}>
          <Dialog.Header>
            <Dialog.Title>Size: {size}</Dialog.Title>
            <Dialog.Close />
          </Dialog.Header>
          <Dialog.Body>Content for {size} dialog.</Dialog.Body>
          <Dialog.Footer>
            <Button onClick={() => setSize(null)}>OK</Button>
          </Dialog.Footer>
        </Dialog>
      </div>
    );
  },
};

export const WithForm: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Edit profile</Button>
        <Dialog open={open} onOpenChange={setOpen} size="md">
          <Dialog.Header>
            <Dialog.Title>Edit profile</Dialog.Title>
            <Dialog.Close />
          </Dialog.Header>
          <Dialog.Body>
            <form id="profile-form" style={{ display: "grid", gap: 12 }}>
              <label>
                Name
                <br />
                <input
                  style={{
                    width: "100%",
                    padding: 8,
                    border: "1px solid #c4cdd5",
                    borderRadius: 6,
                  }}
                  defaultValue="Volkan Günay"
                />
              </label>
              <label>
                Email
                <br />
                <input
                  style={{
                    width: "100%",
                    padding: 8,
                    border: "1px solid #c4cdd5",
                    borderRadius: 6,
                  }}
                  defaultValue="me@example.com"
                />
              </label>
            </form>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button form="profile-form" type="submit">
              Save
            </Button>
          </Dialog.Footer>
        </Dialog>
      </>
    );
  },
};
