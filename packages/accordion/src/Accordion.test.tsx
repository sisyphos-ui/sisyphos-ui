import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from "./Accordion";

function setup(overrides: { multiple?: boolean } = {}) {
  return render(
    <Accordion
      defaultValue={overrides.multiple ? ["a"] : "a"}
      multiple={overrides.multiple as true}
    >
      <Accordion.Item value="a">
        <Accordion.Trigger>A</Accordion.Trigger>
        <Accordion.Content>Body A</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="b">
        <Accordion.Trigger>B</Accordion.Trigger>
        <Accordion.Content>Body B</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

describe("Accordion (single)", () => {
  it("renders triggers with aria-expanded", () => {
    setup();
    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "B" })).toHaveAttribute("aria-expanded", "false");
  });

  it("opens content when trigger clicked", async () => {
    setup();
    await userEvent.click(screen.getByRole("button", { name: "B" }));
    expect(screen.getByRole("button", { name: "B" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute("aria-expanded", "false");
  });

  it("clicking the open trigger collapses it", async () => {
    setup();
    await userEvent.click(screen.getByRole("button", { name: "A" }));
    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute("aria-expanded", "false");
  });
});

describe("Accordion (multiple)", () => {
  it("can expand multiple items independently", async () => {
    setup({ multiple: true });
    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(screen.getByRole("button", { name: "B" }));
    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "B" })).toHaveAttribute("aria-expanded", "true");
  });

  it("emits array on change", async () => {
    const onValueChange = vi.fn();
    render(
      <Accordion multiple defaultValue={[]} onValueChange={onValueChange}>
        <Accordion.Item value="a">
          <Accordion.Trigger>A</Accordion.Trigger>
          <Accordion.Content>Body A</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    );
    await userEvent.click(screen.getByRole("button", { name: "A" }));
    expect(onValueChange).toHaveBeenCalledWith(["a"]);
  });
});
