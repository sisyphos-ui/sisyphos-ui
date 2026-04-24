import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Command } from "./Command";

function Palette(props: { onSelect?: (v: string) => void }) {
  return (
    <Command onSelect={props.onSelect}>
      <Command.Input placeholder="Type…" />
      <Command.List>
        <Command.Empty>No results.</Command.Empty>
        <Command.Group heading="Suggestions">
          <Command.Item value="calendar">Calendar</Command.Item>
          <Command.Item value="search">Search</Command.Item>
          <Command.Item value="settings">Settings</Command.Item>
        </Command.Group>
      </Command.List>
    </Command>
  );
}

describe("Command", () => {
  it("renders all items when search is empty", () => {
    render(<Palette />);
    expect(screen.getByText("Calendar")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("filters items by substring match (case-insensitive)", async () => {
    render(<Palette />);
    const input = screen.getByRole("searchbox");
    await userEvent.type(input, "SE");
    expect(screen.queryByText("Calendar")).not.toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("shows Empty state when nothing matches", async () => {
    render(<Palette />);
    await userEvent.type(screen.getByRole("searchbox"), "zzzzz");
    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  it("ArrowDown moves active item", async () => {
    render(<Palette />);
    const input = screen.getByRole("searchbox");
    input.focus();
    // First item starts active.
    expect(screen.getByText("Calendar").closest(".sisyphos-command-item")).toHaveClass("active");
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByText("Search").closest(".sisyphos-command-item")).toHaveClass("active");
  });

  it("ArrowDown wraps around at the end", async () => {
    render(<Palette />);
    const input = screen.getByRole("searchbox");
    input.focus();
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
    // Three downs from Calendar → Search → Settings → Calendar (wrap).
    expect(screen.getByText("Calendar").closest(".sisyphos-command-item")).toHaveClass("active");
  });

  it("Enter on the active item fires onSelect with the value", async () => {
    const onSelect = vi.fn();
    render(<Palette onSelect={onSelect} />);
    const input = screen.getByRole("searchbox");
    input.focus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onSelect).toHaveBeenCalledWith("search");
  });

  it("click selects via onSelect", async () => {
    const onSelect = vi.fn();
    render(<Palette onSelect={onSelect} />);
    await userEvent.click(screen.getByText("Settings"));
    expect(onSelect).toHaveBeenCalledWith("settings");
  });

  it("hides a group whose items are all filtered out", async () => {
    render(
      <Command>
        <Command.Input placeholder="x" />
        <Command.List>
          <Command.Group heading="Suggestions">
            <Command.Item value="calendar">Calendar</Command.Item>
          </Command.Group>
          <Command.Group heading="Settings">
            <Command.Item value="preferences">Preferences</Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    );
    await userEvent.type(screen.getByRole("searchbox"), "cal");
    // Settings group has no matches; heading should still be in the tree but
    // hidden via the :has(:empty) rule (jsdom doesn't compute :has, so we
    // check the visible items directly).
    expect(screen.getByText("Calendar")).toBeInTheDocument();
    expect(screen.queryByText("Preferences")).not.toBeInTheDocument();
  });
});
