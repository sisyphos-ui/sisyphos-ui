import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Projects", href: "/projects" },
      { label: "Sisyphos UI", href: "/projects/sisyphos" },
      { label: "Issues" },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {};

export const CustomSeparator: Story = {
  args: { separator: <span>›</span> },
};

export const Collapsed: Story = {
  args: {
    maxItems: 3,
    items: [
      { label: "Home", href: "/" },
      { label: "Workspace", href: "/w" },
      { label: "Team", href: "/w/team" },
      { label: "Projects", href: "/w/team/projects" },
      { label: "Sisyphos" },
    ],
  },
};

export const WithButton: Story = {
  args: {
    items: [
      { label: "Back", onClick: () => alert("back") },
      { label: "Current" },
    ],
  },
};
