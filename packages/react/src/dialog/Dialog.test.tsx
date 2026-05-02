import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dialog } from "./Dialog";

describe("Dialog", () => {
  it("renders only when open=true", () => {
    const { rerender } = render(
      <Dialog open={false} onOpenChange={() => {}}>
        <Dialog.Header>
          <Dialog.Title>x</Dialog.Title>
        </Dialog.Header>
      </Dialog>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    rerender(
      <Dialog open={true} onOpenChange={() => {}}>
        <Dialog.Header>
          <Dialog.Title>x</Dialog.Title>
        </Dialog.Header>
      </Dialog>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("Close button calls onOpenChange(false)", async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange}>
        <Dialog.Header>
          <Dialog.Title>x</Dialog.Title>
          <Dialog.Close />
        </Dialog.Header>
      </Dialog>
    );
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("Escape closes when closeOnEscape is true (default)", async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange}>
        <Dialog.Header>
          <Dialog.Title>x</Dialog.Title>
        </Dialog.Header>
      </Dialog>
    );
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("Escape does NOT close when closeOnEscape=false", async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open onOpenChange={onOpenChange} closeOnEscape={false}>
        <Dialog.Header>
          <Dialog.Title>x</Dialog.Title>
        </Dialog.Header>
      </Dialog>
    );
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("aria-labelledby points to the Title id", () => {
    render(
      <Dialog open onOpenChange={() => {}}>
        <Dialog.Header>
          <Dialog.Title>Hello</Dialog.Title>
        </Dialog.Header>
      </Dialog>
    );
    const dialog = screen.getByRole("dialog");
    const labelledBy = dialog.getAttribute("aria-labelledby");
    const title = screen.getByText("Hello");
    expect(labelledBy).toBe(title.getAttribute("id"));
  });

  it("showCloseButton renders a close button without manual Dialog.Close", async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog open showCloseButton onOpenChange={onOpenChange}>
        <Dialog.Header>
          <Dialog.Title>x</Dialog.Title>
        </Dialog.Header>
      </Dialog>
    );
    const btn = screen.getByRole("button", { name: "Close" });
    await userEvent.click(btn);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("showCloseButton is off by default (no close button rendered)", () => {
    render(
      <Dialog open onOpenChange={() => {}}>
        <Dialog.Header>
          <Dialog.Title>x</Dialog.Title>
        </Dialog.Header>
      </Dialog>
    );
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });

  it("closeButtonLabel customizes the aria-label of the auto close", () => {
    render(
      <Dialog open showCloseButton closeButtonLabel="Kapat" onOpenChange={() => {}}>
        <Dialog.Header>
          <Dialog.Title>x</Dialog.Title>
        </Dialog.Header>
      </Dialog>
    );
    expect(screen.getByRole("button", { name: "Kapat" })).toBeInTheDocument();
  });

  it("nested dialogs close one layer at a time on Escape", async () => {
    const outer = vi.fn();
    const inner = vi.fn();
    render(
      <Dialog open onOpenChange={outer}>
        <Dialog.Header>
          <Dialog.Title>Outer</Dialog.Title>
        </Dialog.Header>
        <Dialog open onOpenChange={inner}>
          <Dialog.Header>
            <Dialog.Title>Inner</Dialog.Title>
          </Dialog.Header>
        </Dialog>
      </Dialog>
    );
    await userEvent.keyboard("{Escape}");
    // The most recently opened (inner) Dialog handles the keystroke; the
    // outer one stays open so the user can dismiss layers progressively.
    expect(inner).toHaveBeenCalledWith(false);
    expect(outer).not.toHaveBeenCalled();
  });
});
