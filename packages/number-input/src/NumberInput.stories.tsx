import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { NumberInput } from "./NumberInput";

const meta: Meta<typeof NumberInput> = {
  title: "Components/NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "radio", options: ["standard", "outlined", "underline"] },
    size: { control: "radio", options: ["sm", "md", "lg"] },
  },
  args: { label: "Quantity", step: 1, min: 0 },
};
export default meta;

type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {
  render: (args) => {
    const [v, setV] = useState<number | null>(0);
    return <NumberInput {...args} value={v} onChange={setV} />;
  },
};

export const Currency: Story = {
  render: (args) => {
    const [v, setV] = useState<number | null>(1000);
    return <NumberInput {...args} label="Amount" suffix="₺" step={100} value={v} onChange={setV} />;
  },
};

export const WithDecimals: Story = {
  render: (args) => {
    const [v, setV] = useState<number | null>(0);
    return (
      <NumberInput
        {...args}
        label="Price"
        precision={2}
        step={0.5}
        suffix="USD"
        locale="en-US"
        value={v}
        onChange={setV}
      />
    );
  },
};

export const NoStepper: Story = {
  args: { withStepper: false, label: "Just a number" },
};

export const MinMax: Story = {
  args: { label: "0–10", min: 0, max: 10 },
};

export const Error: Story = {
  args: { error: true, errorMessage: "Required" },
};
