import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DatePicker } from "./DatePicker";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  argTypes: {
    locale: { control: "radio", options: ["tr", "en"] },
    size: { control: "radio", options: ["sm", "md", "lg"] },
  },
  args: { label: "Tarih", allowClear: true, locale: "tr" },
};
export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: (args) => {
    const [v, setV] = useState<Date | null>(null);
    return <DatePicker {...args} value={v} onChange={setV} />;
  },
};

export const WithTime: Story = {
  render: (args) => {
    const [v, setV] = useState<Date | null>(null);
    return <DatePicker {...args} showTime value={v} onChange={setV} />;
  },
};

export const Range: Story = {
  render: (args) => {
    const [v, setV] = useState<[Date | null, Date | null]>([null, null]);
    return <DatePicker {...args} isRange value={v} onChange={setV} />;
  },
};

export const RangeWithTime: Story = {
  render: (args) => {
    const [v, setV] = useState<[Date | null, Date | null]>([null, null]);
    return <DatePicker {...args} isRange showTime value={v} onChange={setV} />;
  },
};

export const EnglishLocale: Story = {
  args: { locale: "en", label: "Date", placeholder: "Pick a date" },
  render: (args) => {
    const [v, setV] = useState<Date | null>(null);
    return <DatePicker {...args} value={v} onChange={setV} />;
  },
};

export const MinMax: Story = {
  render: (args) => {
    const [v, setV] = useState<Date | null>(null);
    const today = new Date();
    const min = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    const max = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    return (
      <DatePicker
        {...args}
        label="Within 2 weeks"
        value={v}
        onChange={setV}
        minDate={min}
        maxDate={max}
      />
    );
  },
};
