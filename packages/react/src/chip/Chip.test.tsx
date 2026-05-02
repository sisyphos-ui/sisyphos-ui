import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Chip } from "./Chip";

describe("Chip", () => {
  it("renders label", () => {
    render(<Chip>Hello</Chip>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders delete button with aria-label when onDelete is provided", async () => {
    const onDelete = vi.fn();
    render(<Chip onDelete={onDelete}>x</Chip>);
    const btn = screen.getByRole("button", { name: "Remove" });
    await userEvent.click(btn);
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("delete click does not bubble to chip onClick", async () => {
    const onClick = vi.fn();
    const onDelete = vi.fn();
    render(
      <Chip clickable onClick={onClick} onDelete={onDelete}>
        x
      </Chip>
    );
    await userEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(onDelete).toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("clickable chip is keyboard operable", async () => {
    const onClick = vi.fn();
    render(
      <Chip clickable onClick={onClick}>
        k
      </Chip>
    );
    const chip = screen.getByRole("button", { name: "k" });
    chip.focus();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("disabled chip does not fire onDelete", async () => {
    const onDelete = vi.fn();
    render(
      <Chip disabled onDelete={onDelete}>
        x
      </Chip>
    );
    const btn = screen.getByRole("button", { name: "Remove" });
    expect(btn).toBeDisabled();
  });

  it("non-interactive chip has no button role", () => {
    render(<Chip>plain</Chip>);
    expect(screen.queryByRole("button", { name: "plain" })).not.toBeInTheDocument();
  });
});
