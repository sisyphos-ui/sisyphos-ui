import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Slider } from "./Slider";

const meta: Meta<typeof Slider> = {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    color: { control: "radio", options: ["primary", "success", "error", "warning", "info"] },
  },
  args: { min: 0, max: 100, step: 1, showValue: true },
};
export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: (args) => {
    const [v, setV] = useState(40);
    return (
      <div style={{ width: 320 }}>
        <Slider {...args} value={v} onChange={setV} />
      </div>
    );
  },
};

export const Range: Story = {
  render: (args) => {
    const [v, setV] = useState<[number, number]>([20, 80]);
    return (
      <div style={{ width: 320 }}>
        <Slider {...args} range value={v} onChange={setV} />
      </div>
    );
  },
};

export const RangeMinGap: Story = {
  render: (args) => {
    const [v, setV] = useState<[number, number]>([10, 60]);
    return (
      <div style={{ width: 320 }}>
        <Slider {...args} range minGap={20} value={v} onChange={setV} />
      </div>
    );
  },
};

export const Steps: Story = {
  render: (args) => {
    const [v, setV] = useState(50);
    return (
      <div style={{ width: 320 }}>
        <Slider {...args} step={10} value={v} onChange={setV} />
      </div>
    );
  },
};

export const FormattedValue: Story = {
  render: (args) => {
    const [v, setV] = useState(42);
    return (
      <div style={{ width: 320 }}>
        <Slider {...args} formatValue={(n) => `${n}%`} value={v} onChange={setV} />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Slider {...args} value={30} />
    </div>
  ),
};
