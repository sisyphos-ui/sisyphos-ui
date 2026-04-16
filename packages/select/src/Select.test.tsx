import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "./Select";

const opts = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
  { value: "c", label: "Gamma" },
];

describe("Select (single)", () => {
  it("opens on click and selects an option", async () => {
    const onChange = vi.fn();
    render(<Select options={opts} label="x" onChange={onChange} />);
    const combo = screen.getByRole("combobox");
    await userEvent.click(combo);
    const option = await screen.findByRole("option", { name: /Beta/ });
    await userEvent.click(option);
    expect(onChange).toHaveBeenCalledWith("b");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("filters options when searchable", async () => {
    render(<Select options={opts} label="x" searchable />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.type(await screen.findByPlaceholderText("Search…"), "gam");
    expect(await screen.findByRole("option", { name: /Gamma/ })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Alpha/ })).not.toBeInTheDocument();
  });

  it("clear button resets value", async () => {
    const onChange = vi.fn();
    render(<Select options={opts} clearable value="a" onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Clear selection" }));
    expect(onChange).toHaveBeenCalledWith(null);
  });
});

describe("Select (multiple)", () => {
  it("toggles multiple values", async () => {
    const onChange = vi.fn();
    render(<Select multiple options={opts} onChange={onChange} />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(await screen.findByRole("option", { name: /Alpha/ }));
    expect(onChange).toHaveBeenLastCalledWith(["a"]);
    await userEvent.click(await screen.findByRole("option", { name: /Beta/ }));
    expect(onChange).toHaveBeenLastCalledWith(["a", "b"]);
  });

  it("creatable adds typed value on Enter", async () => {
    const onChange = vi.fn();
    render(<Select multiple creatable options={[]} onChange={onChange} />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.type(await screen.findByPlaceholderText("Type to add…"), "urgent{Enter}");
    expect(onChange).toHaveBeenLastCalledWith(["urgent"]);
  });
});
