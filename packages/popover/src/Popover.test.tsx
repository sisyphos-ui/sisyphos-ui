import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popover } from "./Popover";

describe("Popover", () => {
  it("opens on click and closes on toggle", async () => {
    render(
      <Popover content="Panel">
        <button>Open</button>
      </Popover>
    );
    const btn = screen.getByRole("button", { name: "Open" });
    await userEvent.click(btn);
    expect(screen.getByRole("dialog")).toHaveTextContent("Panel");
    await userEvent.click(btn);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("sets aria-expanded + aria-controls on trigger", async () => {
    render(
      <Popover content="x">
        <button>Open</button>
      </Popover>
    );
    const btn = screen.getByRole("button", { name: "Open" });
    await userEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    expect(btn).toHaveAttribute("aria-controls");
  });

  it("closes on outside click", async () => {
    render(
      <div>
        <Popover content="Panel">
          <button>Open</button>
        </Popover>
        <div data-testid="outside">outside</div>
      </div>
    );
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("outside"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("controlled mode", async () => {
    const onOpenChange = vi.fn();
    render(
      <Popover content="Panel" open={true} onOpenChange={onOpenChange}>
        <button>X</button>
      </Popover>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "X" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("disabled does not open", async () => {
    render(
      <Popover content="x" disabled>
        <button>Open</button>
      </Popover>
    );
    await userEvent.click(screen.getByRole("button"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
