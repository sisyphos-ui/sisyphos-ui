import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders title and description", () => {
    render(<Alert title="Hi" description="World" />);
    expect(screen.getByText("Hi")).toBeInTheDocument();
    expect(screen.getByText("World")).toBeInTheDocument();
  });

  it("uses role=alert for error color", () => {
    render(<Alert color="error" title="Oops" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("uses role=status for non-error", () => {
    render(<Alert color="success" title="Done" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("close button fires onClose", async () => {
    const onClose = vi.fn();
    render(<Alert title="x" onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("icon=null hides default icon", () => {
    const { container } = render(<Alert color="success" title="x" icon={null} />);
    expect(container.querySelector(".sisyphos-alert-icon")).toBeNull();
  });
});
