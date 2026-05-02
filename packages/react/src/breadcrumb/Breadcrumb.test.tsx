import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Breadcrumb } from "./Breadcrumb";

describe("Breadcrumb", () => {
  it("has nav with aria-label", () => {
    render(<Breadcrumb items={[{ label: "A" }, { label: "B" }]} />);
    expect(screen.getByRole("navigation", { name: "breadcrumb" })).toBeInTheDocument();
  });

  it("marks last item aria-current=page", () => {
    render(<Breadcrumb items={[{ label: "A", href: "/" }, { label: "B" }]} />);
    const items = screen.getAllByRole("listitem");
    expect(items[items.length - 1]).toHaveTextContent("B");
    expect(screen.getByText("B").closest("[aria-current=page]")).toBeTruthy();
  });

  it("renders links for href items", () => {
    render(<Breadcrumb items={[{ label: "Home", href: "/h" }, { label: "Now" }]} />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/h");
  });

  it("renders button for onClick items and fires on click", async () => {
    const onClick = vi.fn();
    render(<Breadcrumb items={[{ label: "Back", onClick }, { label: "Now" }]} />);
    await userEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(onClick).toHaveBeenCalled();
  });

  it("collapses middle items beyond maxItems", () => {
    render(
      <Breadcrumb
        maxItems={3}
        items={[{ label: "a" }, { label: "b" }, { label: "c" }, { label: "d" }, { label: "e" }]}
      />
    );
    expect(screen.getByText("…")).toBeInTheDocument();
    expect(screen.queryByText("b")).not.toBeInTheDocument();
  });
});
