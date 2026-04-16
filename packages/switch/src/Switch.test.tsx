import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("renders with role=switch and the correct aria-checked", () => {
    render(<Switch checked aria-label="dark mode" />);
    const sw = screen.getByRole("switch", { name: "dark mode" });
    expect(sw).toHaveAttribute("aria-checked", "true");
  });

  it("toggles via mouse click", async () => {
    const onChange = vi.fn();
    render(<Switch checked={false} aria-label="x" onChange={onChange} />);
    await userEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("toggles via Space and Enter keys", async () => {
    const onChange = vi.fn();
    render(<Switch checked={false} aria-label="x" onChange={onChange} />);
    const sw = screen.getByRole("switch");
    sw.focus();
    await userEvent.keyboard(" ");
    expect(onChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard("{Enter}");
    expect(onChange).toHaveBeenLastCalledWith(true);
  });

  it("does not fire onChange when disabled", async () => {
    const onChange = vi.fn();
    render(<Switch checked={false} aria-label="x" disabled onChange={onChange} />);
    await userEvent.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("forwards the ref to the underlying <button>", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Switch checked aria-label="x" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
