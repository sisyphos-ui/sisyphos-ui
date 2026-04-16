import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TreeSelect } from "./TreeSelect";
import type { TreeNodeId } from "./types";

const sample = [
  {
    id: "eng",
    label: "Engineering",
    children: [
      {
        id: "eng-fe",
        label: "Frontend",
        children: [
          { id: "u1", label: "Volkan" },
          { id: "u2", label: "Ada" },
        ],
      },
      {
        id: "eng-be",
        label: "Backend",
        children: [
          { id: "u3", label: "Alan" },
          { id: "u4", label: "Grace" },
        ],
      },
    ],
  },
  {
    id: "design",
    label: "Design",
    children: [
      { id: "u5", label: "Donald" },
      { id: "u6", label: "Margaret" },
    ],
  },
];

const meta: Meta<typeof TreeSelect> = {
  title: "Components/TreeSelect",
  component: TreeSelect,
  tags: ["autodocs"],
  args: {
    label: "Members",
    nodes: sample,
    clearable: true,
    searchable: true,
  },
};
export default meta;

type Story = StoryObj<typeof TreeSelect>;

export const Default: Story = {
  render: (args) => {
    const [v, setV] = useState<TreeNodeId[]>([]);
    return <TreeSelect {...args} value={v} onChange={setV} />;
  },
};

export const Cascade: Story = {
  args: { cascade: true },
  render: (args) => {
    const [v, setV] = useState<TreeNodeId[]>([]);
    return <TreeSelect {...args} value={v} onChange={setV} />;
  },
};

export const NoCascade: Story = {
  args: { cascade: false },
  render: (args) => {
    const [v, setV] = useState<TreeNodeId[]>([]);
    return <TreeSelect {...args} value={v} onChange={setV} />;
  },
};

export const Error: Story = {
  args: { error: true, errorMessage: "Pick at least one" },
};
