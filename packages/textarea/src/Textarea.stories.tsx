import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "radio", options: ["standard", "outlined", "underline"] },
    size: { control: "radio", options: ["xs", "sm", "md", "lg", "xl"] },
    resize: { control: "radio", options: ["none", "vertical", "horizontal", "both"] },
  },
  args: {
    label: "Description",
    placeholder: "Write something…",
    variant: "outlined",
    size: "md",
    minRows: 3,
  },
};
export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};

export const WithCharacterCount: Story = {
  args: { maxLength: 200, showCharacterCount: true },
};

export const Error: Story = {
  args: { error: true, errorMessage: "Required field" },
};

export const AutoResize: Story = {
  render: (args) => {
    const [v, setV] = useState("");
    return (
      <Textarea
        {...args}
        autoResize
        minRows={2}
        maxRows={8}
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="Type to see the textarea grow…"
      />
    );
  },
};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <Textarea {...args} variant="standard" label="Standard" />
      <Textarea {...args} variant="outlined" label="Outlined" />
      <Textarea {...args} variant="underline" label="Underline" />
    </div>
  ),
};
