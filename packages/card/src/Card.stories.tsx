import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@sisyphos-ui/button";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "radio", options: ["elevated", "outlined", "filled"] },
    padding: { control: "radio", options: ["none", "sm", "md", "lg"] },
  },
  args: { variant: "elevated", padding: "md" },
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} style={{ maxWidth: 380 }}>
      <Card.Header>Project name</Card.Header>
      <Card.Body>
        Project description and key facts go here. Designed to fit any layout.
      </Card.Body>
      <Card.Footer>
        <Button variant="outlined">Cancel</Button>
        <Button style={{ marginLeft: "auto" }}>Save</Button>
      </Card.Footer>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      {(["elevated", "outlined", "filled"] as const).map((v) => (
        <Card key={v} variant={v} style={{ maxWidth: 380 }}>
          <Card.Header>{v}</Card.Header>
          <Card.Body>Variant: {v}</Card.Body>
          <Card.Footer>
            <Button size="sm" variant="text">Skip</Button>
            <Button size="sm" style={{ marginLeft: "auto" }}>Continue</Button>
          </Card.Footer>
        </Card>
      ))}
    </div>
  ),
};

export const Interactive: Story = {
  args: { interactive: true },
  render: (args) => (
    <Card {...args} style={{ maxWidth: 380 }} onClick={() => alert("clicked")}>
      <Card.Body>Click anywhere on this card.</Card.Body>
    </Card>
  ),
};

export const BodyOnly: Story = {
  render: () => (
    <Card style={{ maxWidth: 380 }}>
      <Card.Body>Just a body.</Card.Body>
    </Card>
  ),
};
