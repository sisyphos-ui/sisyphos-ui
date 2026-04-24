import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "./Tabs";

function setup(extra: Partial<React.ComponentProps<typeof Tabs>> = {}) {
  return render(
    <Tabs defaultValue="a" {...extra}>
      <Tabs.List>
        <Tabs.Trigger value="a">A</Tabs.Trigger>
        <Tabs.Trigger value="b">B</Tabs.Trigger>
        <Tabs.Trigger value="c">C</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value="a">Panel A</Tabs.Panel>
      <Tabs.Panel value="b">Panel B</Tabs.Panel>
      <Tabs.Panel value="c">Panel C</Tabs.Panel>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("renders tablist with selected tab", () => {
    setup();
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "A", selected: true })).toBeInTheDocument();
  });

  it("clicking trigger switches selection", async () => {
    const onValueChange = vi.fn();
    setup({ onValueChange });
    await userEvent.click(screen.getByRole("tab", { name: "B" }));
    expect(onValueChange).toHaveBeenCalledWith("b");
    expect(screen.getByRole("tab", { name: "B", selected: true })).toBeInTheDocument();
  });

  it("ArrowRight moves selection", async () => {
    setup();
    screen.getByRole("tab", { name: "A" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "B", selected: true })).toBeInTheDocument();
  });

  it("ArrowLeft wraps", async () => {
    setup();
    screen.getByRole("tab", { name: "A" }).focus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "C", selected: true })).toBeInTheDocument();
  });

  it("Home/End jump to ends", async () => {
    setup();
    screen.getByRole("tab", { name: "A" }).focus();
    await userEvent.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "C", selected: true })).toBeInTheDocument();
    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "A", selected: true })).toBeInTheDocument();
  });

  it("hides inactive panels via hidden attribute", () => {
    setup();
    const panelA = screen.getByText("Panel A").closest("[role=tabpanel]")!;
    const panelB = screen.getByText("Panel B").closest("[role=tabpanel]")!;
    expect(panelA).not.toHaveAttribute("hidden");
    expect(panelB).toHaveAttribute("hidden");
  });

  it("disabled trigger is not selectable via click", async () => {
    const onValueChange = vi.fn();
    render(
      <Tabs defaultValue="a" onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Trigger value="a">A</Tabs.Trigger>
          <Tabs.Trigger value="b" disabled>
            B
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="a">Panel A</Tabs.Panel>
        <Tabs.Panel value="b">Panel B</Tabs.Panel>
      </Tabs>
    );
    await userEvent.click(screen.getByRole("tab", { name: "B" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
