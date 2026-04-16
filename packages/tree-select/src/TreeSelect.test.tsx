import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TreeSelect } from "./TreeSelect";
import { nodeState } from "./utils";
import type { TreeNode } from "./types";

const sample: TreeNode[] = [
  {
    id: "a",
    label: "Group A",
    children: [
      { id: "a1", label: "Item A1" },
      { id: "a2", label: "Item A2" },
    ],
  },
  { id: "b", label: "Item B" },
];

describe("nodeState", () => {
  it("returns checked / partial / unchecked correctly", () => {
    const sel = new Set(["a1"]);
    expect(nodeState(sample[0], sel)).toBe("partial");
    sel.add("a2");
    expect(nodeState(sample[0], sel)).toBe("checked");
    sel.clear();
    expect(nodeState(sample[0], sel)).toBe("unchecked");
  });
});

describe("TreeSelect", () => {
  it("opens on click", async () => {
    render(<TreeSelect nodes={sample} label="x" />);
    await userEvent.click(screen.getByRole("combobox"));
    expect(await screen.findByRole("tree")).toBeInTheDocument();
  });

  it("cascade selects all descendants when toggling parent", async () => {
    const onChange = vi.fn();
    render(<TreeSelect nodes={sample} label="x" onChange={onChange} />);
    await userEvent.click(screen.getByRole("combobox"));
    const toggleA = await screen.findByRole("checkbox", { name: /Group A/ });
    await userEvent.click(toggleA);
    expect(onChange).toHaveBeenCalledWith(expect.arrayContaining(["a", "a1", "a2"]));
  });

  it("non-cascade selects only the node itself", async () => {
    const onChange = vi.fn();
    render(<TreeSelect nodes={sample} label="x" cascade={false} onChange={onChange} />);
    await userEvent.click(screen.getByRole("combobox"));
    const toggleA = await screen.findByRole("checkbox", { name: /Group A/ });
    await userEvent.click(toggleA);
    expect(onChange).toHaveBeenCalledWith(["a"]);
  });

  it("expand chevron toggles children visibility", async () => {
    render(<TreeSelect nodes={sample} label="x" />);
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.queryByRole("checkbox", { name: /Item A1/ })).not.toBeInTheDocument();
    await userEvent.click(await screen.findByRole("button", { name: "Expand" }));
    expect(await screen.findByRole("checkbox", { name: /Item A1/ })).toBeInTheDocument();
  });

  it("search filters nodes", async () => {
    render(<TreeSelect nodes={sample} label="x" />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.type(await screen.findByPlaceholderText("Search…"), "B");
    expect(screen.getByRole("checkbox", { name: /Item B/ })).toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: /Group A/ })).not.toBeInTheDocument();
  });

  it("clear button resets value", async () => {
    const onChange = vi.fn();
    render(<TreeSelect nodes={sample} label="x" clearable value={["b"]} onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Clear all" }));
    expect(onChange).toHaveBeenCalledWith([]);
  });
});
