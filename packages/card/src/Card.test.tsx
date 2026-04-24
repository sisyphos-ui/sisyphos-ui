import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Card } from "./Card";

describe("Card", () => {
  it("renders compound slots", () => {
    render(
      <Card>
        <Card.Header>H</Card.Header>
        <Card.Body>B</Card.Body>
        <Card.Footer>F</Card.Footer>
      </Card>
    );
    expect(screen.getByText("H")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("F")).toBeInTheDocument();
  });

  it("interactive adds role=button + tabIndex 0", () => {
    render(
      <Card interactive>
        <Card.Body>x</Card.Body>
      </Card>
    );
    expect(screen.getByRole("button")).toHaveAttribute("tabIndex", "0");
  });

  it("non-interactive has no role=button", () => {
    const { container } = render(
      <Card>
        <Card.Body>x</Card.Body>
      </Card>
    );
    expect(container.querySelector('[role="button"]')).toBeNull();
  });

  it("interactive fires onClick", async () => {
    const onClick = vi.fn();
    render(
      <Card interactive onClick={onClick}>
        <Card.Body>x</Card.Body>
      </Card>
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalled();
  });
});
