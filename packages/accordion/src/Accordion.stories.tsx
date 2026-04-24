import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "radio", options: ["outlined", "ghost"] },
  },
  args: { variant: "outlined" },
};
export default meta;

type Story = StoryObj<typeof Accordion>;

const items = [
  {
    value: "1",
    title: "What is Sisyphos UI?",
    body: "A modern, framework-agnostic React design system.",
  },
  {
    value: "2",
    title: "How is it themed?",
    body: "Through CSS variables, with optional SCSS tokens.",
  },
  { value: "3", title: "Is it accessible?", body: "Yes — ARIA-compliant, keyboard operable." },
];

export const Default: Story = {
  render: (args) => (
    <Accordion {...args} defaultValue="1">
      {items.map((i) => (
        <Accordion.Item key={i.value} value={i.value}>
          <Accordion.Trigger>{i.title}</Accordion.Trigger>
          <Accordion.Content>{i.body}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: (args) => (
    <Accordion {...args} multiple defaultValue={["1", "3"]}>
      {items.map((i) => (
        <Accordion.Item key={i.value} value={i.value}>
          <Accordion.Trigger>{i.title}</Accordion.Trigger>
          <Accordion.Content>{i.body}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  ),
};

export const Ghost: Story = { args: { variant: "ghost" }, render: Default.render };
