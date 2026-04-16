import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Select } from "./Select";
import type { SelectValue } from "./types";

const countries = [
  { value: "tr", label: "Türkiye" },
  { value: "us", label: "United States" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "es", label: "Spain" },
  { value: "it", label: "Italy" },
  { value: "gb", label: "United Kingdom" },
  { value: "nl", label: "Netherlands" },
  { value: "se", label: "Sweden" },
  { value: "jp", label: "Japan" },
];

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "radio", options: ["xs", "sm", "md", "lg", "xl"] },
  },
  args: {
    label: "Country",
    placeholder: "Select a country",
    options: countries,
    clearable: true,
  },
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {};

export const Searchable: Story = {
  args: { searchable: true },
};

export const MultipleWithSearch: Story = {
  render: (args) => {
    const [v, setV] = useState<SelectValue[]>([]);
    return (
      <Select
        {...args}
        multiple
        searchable
        label="Countries"
        value={v}
        onChange={setV}
      />
    );
  },
};

export const Creatable: Story = {
  render: (args) => {
    const [v, setV] = useState<SelectValue[]>([]);
    return <Select {...args} multiple creatable label="Tags" value={v} onChange={setV} options={[]} />;
  },
};

export const Error: Story = {
  args: { error: true, errorMessage: "Please choose a country" },
};

export const InfiniteScroll: Story = {
  render: (args) => {
    const [opts, setOpts] = useState(countries);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    return (
      <Select
        {...args}
        searchable
        options={opts}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={() => {
          if (loading) return;
          setLoading(true);
          setTimeout(() => {
            const next = Array.from({ length: 10 }).map((_, i) => ({
              value: `c${opts.length + i}`,
              label: `Country ${opts.length + i + 1}`,
            }));
            setOpts((o) => [...o, ...next]);
            setLoading(false);
            if (opts.length > 40) setHasMore(false);
          }, 500);
        }}
      />
    );
  },
};
