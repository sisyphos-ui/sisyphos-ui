import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Carousel } from "./Carousel";

const meta: Meta<typeof Carousel> = {
  title: "Components/Carousel",
  component: Carousel,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Carousel>;

const Slide: React.FC<{ bg: string; label: string }> = ({ bg, label }) => (
  <div style={{ background: bg, height: 200, display: "grid", placeItems: "center", color: "#fff", fontSize: 32 }}>
    {label}
  </div>
);

export const Default: Story = {
  render: () => (
    <Carousel>
      <Slide bg="#ff7022" label="One" />
      <Slide bg="#22c55e" label="Two" />
      <Slide bg="#00b8d9" label="Three" />
    </Carousel>
  ),
};

export const AutoPlay: Story = {
  render: () => (
    <Carousel autoPlay autoPlayInterval={2000}>
      <Slide bg="#ff7022" label="One" />
      <Slide bg="#22c55e" label="Two" />
      <Slide bg="#00b8d9" label="Three" />
    </Carousel>
  ),
};

export const NoLoop: Story = {
  render: () => (
    <Carousel loop={false}>
      <Slide bg="#ff7022" label="One" />
      <Slide bg="#22c55e" label="Two" />
      <Slide bg="#00b8d9" label="Three" />
    </Carousel>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [i, setI] = useState(0);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Carousel index={i} onIndexChange={setI}>
          <Slide bg="#ff7022" label="A" />
          <Slide bg="#22c55e" label="B" />
          <Slide bg="#00b8d9" label="C" />
        </Carousel>
        <div>Current: {i}</div>
      </div>
    );
  },
};
