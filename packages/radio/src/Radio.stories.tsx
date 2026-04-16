import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Radio } from "./Radio";
import { RadioGroup } from "./RadioGroup";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/Radio",
  component: RadioGroup,
  tags: ["autodocs"],
  argTypes: {
    direction: { control: "radio", options: ["vertical", "horizontal"] },
    size: { control: "radio", options: ["xs", "sm", "md", "lg", "xl"] },
    color: { control: "radio", options: ["primary", "success", "error", "warning", "info"] },
    variant: { control: "radio", options: ["standard", "card"] },
  },
  args: { label: "Plan", defaultValue: "basic" },
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="basic" label="Basic" />
      <Radio value="pro" label="Pro" />
      <Radio value="enterprise" label="Enterprise" disabled />
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  args: { direction: "horizontal" },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="s" label="S" />
      <Radio value="m" label="M" />
      <Radio value="l" label="L" />
    </RadioGroup>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [v, setV] = useState<string | number>("b");
    return (
      <>
        <RadioGroup {...args} value={v} onChange={setV}>
          <Radio value="a" label="Option A" />
          <Radio value="b" label="Option B" />
          <Radio value="c" label="Option C" />
        </RadioGroup>
        <p>Selected: {String(v)}</p>
      </>
    );
  },
};

export const CardVariant: Story = {
  args: { variant: "card", label: "Billing cycle" },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="monthly" label="Monthly" description="$10 per month" />
      <Radio value="yearly" label="Yearly" description="$96 per year (save 20%)" />
    </RadioGroup>
  ),
};

export const WithError: Story = {
  args: { error: true, errorMessage: "Please pick a plan", required: true },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="basic" label="Basic" />
      <Radio value="pro" label="Pro" />
    </RadioGroup>
  ),
};
