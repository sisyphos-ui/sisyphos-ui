import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContextMenu } from "./ContextMenu";

const items = [
  { label: "Edit", onSelect: vi.fn() },
  { type: "separator" as const },
  { label: "Delete", destructive: true, onSelect: vi.fn() },
];

describe("ContextMenu", () => {
  it("renders the trigger but not the menu until right-click", () => {
    render(
      <ContextMenu items={items}>
        <div data-testid="target">hello</div>
      </ContextMenu>
    );
    expect(screen.getByTestId("target")).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens menu on contextmenu event and positions at pointer", async () => {
    render(
      <ContextMenu items={items}>
        <div data-testid="target">hello</div>
      </ContextMenu>
    );
    const user = userEvent.setup();
    await user.pointer({ keys: "[MouseRight]", target: screen.getByTestId("target") });
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("selecting an item fires onSelect and closes the menu", async () => {
    const onSelect = vi.fn();
    render(
      <ContextMenu items={[{ label: "Edit", onSelect }]}>
        <div data-testid="target">hello</div>
      </ContextMenu>
    );
    const user = userEvent.setup();
    await user.pointer({ keys: "[MouseRight]", target: screen.getByTestId("target") });
    await user.click(await screen.findByText("Edit"));
    expect(onSelect).toHaveBeenCalled();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("Escape closes the menu", async () => {
    render(
      <ContextMenu items={items}>
        <div data-testid="target">hello</div>
      </ContextMenu>
    );
    const user = userEvent.setup();
    await user.pointer({ keys: "[MouseRight]", target: screen.getByTestId("target") });
    await screen.findByRole("menu");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("separator renders as role=separator", async () => {
    render(
      <ContextMenu items={items}>
        <div data-testid="target">hello</div>
      </ContextMenu>
    );
    const user = userEvent.setup();
    await user.pointer({ keys: "[MouseRight]", target: screen.getByTestId("target") });
    await screen.findByRole("menu");
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("emptyState renders when items is empty", async () => {
    render(
      <ContextMenu items={[]} emptyState="Nothing to do">
        <div data-testid="target">hello</div>
      </ContextMenu>
    );
    const user = userEvent.setup();
    await user.pointer({ keys: "[MouseRight]", target: screen.getByTestId("target") });
    expect(await screen.findByText("Nothing to do")).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("disabled prevents the menu from opening", async () => {
    render(
      <ContextMenu items={items} disabled>
        <div data-testid="target">hello</div>
      </ContextMenu>
    );
    const user = userEvent.setup();
    await user.pointer({ keys: "[MouseRight]", target: screen.getByTestId("target") });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
