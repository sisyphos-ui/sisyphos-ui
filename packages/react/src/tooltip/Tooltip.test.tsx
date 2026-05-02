import { describe, it, expect } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("shows on hover and hides on leave", async () => {
    render(
      <Tooltip content="Hi" openDelay={0} closeDelay={0}>
        <button>Target</button>
      </Tooltip>
    );
    const btn = screen.getByRole("button", { name: "Target" });

    await userEvent.hover(btn);
    await waitFor(() => expect(screen.getByRole("tooltip")).toBeInTheDocument());
    expect(screen.getByRole("tooltip")).toHaveTextContent("Hi");

    await userEvent.unhover(btn);
    await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
  });

  it("sets aria-describedby on trigger when open", async () => {
    render(
      <Tooltip content="Hi" openDelay={0}>
        <button>Target</button>
      </Tooltip>
    );
    const btn = screen.getByRole("button");
    await userEvent.hover(btn);
    await waitFor(() => expect(btn).toHaveAttribute("aria-describedby"));
  });

  it("respects disabled", async () => {
    render(
      <Tooltip content="Hi" openDelay={0} disabled>
        <button>Target</button>
      </Tooltip>
    );
    await userEvent.hover(screen.getByRole("button"));
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("controlled open prop renders the tooltip", () => {
    render(
      <Tooltip content="Fixed" open>
        <button>Target</button>
      </Tooltip>
    );
    expect(screen.getByRole("tooltip")).toHaveTextContent("Fixed");
  });

  it("hides when content is empty", () => {
    render(
      <Tooltip content="" open>
        <button>Target</button>
      </Tooltip>
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
