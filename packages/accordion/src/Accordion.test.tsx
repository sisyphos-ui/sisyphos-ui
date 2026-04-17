import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from "./Accordion";

function setup(overrides: { multiple?: boolean } = {}) {
  if (overrides.multiple) {
    return render(
      <Accordion defaultValue={["a"]} multiple>
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

  return render(
    <Accordion defaultValue="a">
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

  it("exposes open/closed state on content for animations", async () => {
    setup();

    const contentA = screen
      .getByText("Body A")
      .closest(".sisyphos-accordion-content") as HTMLElement;
    const contentB = screen
      .getByText("Body B")
      .closest(".sisyphos-accordion-content") as HTMLElement;

    expect(contentA).toHaveAttribute("data-state", "open");
    expect(contentA).toHaveAttribute("aria-hidden", "false");
    expect(contentB).toHaveAttribute("data-state", "closed");
    expect(contentB).toHaveAttribute("aria-hidden", "true");

    await userEvent.click(screen.getByRole("button", { name: "B" }));

    expect(contentA).toHaveAttribute("data-state", "closed");
    expect(contentA).toHaveAttribute("aria-hidden", "true");
    expect(contentB).toHaveAttribute("data-state", "open");
    expect(contentB).toHaveAttribute("aria-hidden", "false");
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

describe("Accordion.Content", () => {
  it("unmounts closed content when forceMount is false", async () => {
    render(
      <Accordion>
        <Accordion.Item value="a">
          <Accordion.Trigger>A</Accordion.Trigger>
          <Accordion.Content forceMount={false}>Body A</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    );

    expect(screen.queryByText("Body A")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "A" }));
    expect(screen.getByText("Body A")).toBeInTheDocument();
  });

  it("keeps closed content mounted when forceMount is true (default)", () => {
    render(
      <Accordion>
        <Accordion.Item value="a">
          <Accordion.Trigger>A</Accordion.Trigger>
          <Accordion.Content>Body A</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    );

    // No defaultValue → item is closed, but content stays in the DOM
    expect(screen.getByText("Body A")).toBeInTheDocument();
    const content = screen.getByText("Body A").closest(".sisyphos-accordion-content")!;
    expect(content).toHaveAttribute("data-state", "closed");
  });

  it("aria-expanded on trigger stays in sync with data-state on content", async () => {
    setup();
    const trigger = screen.getByRole("button", { name: "B" });
    const content = screen.getByText("Body B").closest(".sisyphos-accordion-content")!;

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(content).toHaveAttribute("data-state", "closed");

    await userEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(content).toHaveAttribute("data-state", "open");
  });
});
