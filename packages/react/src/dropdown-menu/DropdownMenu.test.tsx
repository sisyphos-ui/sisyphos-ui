import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DropdownMenu } from "./DropdownMenu";

describe("DropdownMenu", () => {
  it("opens on click and renders items", async () => {
    render(
      <DropdownMenu
        items={[
          { label: "Edit", onSelect: () => {} },
          { type: "separator" },
          { label: "Delete", destructive: true, onSelect: () => {} },
        ]}
      >
        <button>Open</button>
      </DropdownMenu>
    );
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(await screen.findByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
  });

  it("fires onSelect on click and closes menu", async () => {
    const onSelect = vi.fn();
    render(
      <DropdownMenu items={[{ label: "Go", onSelect }]}>
        <button>Open</button>
      </DropdownMenu>
    );
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    await userEvent.click(await screen.findByRole("menuitem", { name: "Go" }));
    expect(onSelect).toHaveBeenCalled();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("skips disabled items on arrow navigation", async () => {
    const enabled = vi.fn();
    const disabled = vi.fn();
    render(
      <DropdownMenu
        items={[
          { label: "A", onSelect: enabled },
          { label: "B", onSelect: disabled, disabled: true },
          { label: "C", onSelect: enabled },
        ]}
      >
        <button>Open</button>
      </DropdownMenu>
    );
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    await screen.findByRole("menu");
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(enabled).toHaveBeenCalled();
    expect(disabled).not.toHaveBeenCalled();
  });

  it("aria-expanded toggles on trigger", async () => {
    render(
      <DropdownMenu items={[{ label: "x", onSelect: () => {} }]}>
        <button>Open</button>
      </DropdownMenu>
    );
    const btn = screen.getByRole("button", { name: "Open" });
    expect(btn).not.toHaveAttribute("aria-expanded", "true");
    await userEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
  });

  it("Escape closes menu", async () => {
    render(
      <DropdownMenu items={[{ label: "x", onSelect: () => {} }]}>
        <button>Open</button>
      </DropdownMenu>
    );
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
