import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(<EmptyState title="Nope" description="Try again" />);
    expect(screen.getByRole("heading", { name: "Nope" })).toBeInTheDocument();
    expect(screen.getByText("Try again")).toBeInTheDocument();
  });

  it("renders icon slot aria-hidden", () => {
    const { container } = render(
      <EmptyState icon={<svg data-testid="i" />} title="x" />
    );
    const iconWrap = container.querySelector(".sisyphos-empty-state-icon");
    expect(iconWrap).toHaveAttribute("aria-hidden", "true");
  });

  it("renders actions", () => {
    render(
      <EmptyState
        title="x"
        actions={<button>Reset</button>}
      />
    );
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  });

  it("has role=status", () => {
    render(<EmptyState title="Empty" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
