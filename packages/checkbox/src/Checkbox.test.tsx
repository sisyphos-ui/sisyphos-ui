import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders an unchecked checkbox by default", () => {
    render(<Checkbox checked={false} label="Accept terms" />);
    const input = screen.getByLabelText("Accept terms") as HTMLInputElement;
    expect(input).not.toBeChecked();
  });

  it("reflects the checked prop", () => {
    render(<Checkbox checked label="On" />);
    expect(screen.getByLabelText("On")).toBeChecked();
  });

  it("fires onChange with the next boolean value when toggled", async () => {
    const onChange = vi.fn();
    render(<Checkbox checked={false} label="Toggle me" onChange={onChange} />);
    await userEvent.click(screen.getByLabelText("Toggle me"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("does not fire onChange when disabled", async () => {
    const onChange = vi.fn();
    render(<Checkbox checked={false} label="x" disabled onChange={onChange} />);
    await userEvent.click(screen.getByLabelText("x"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("forwards the ref to the underlying <input>", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Checkbox checked={false} label="x" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe("checkbox");
  });

  it("links the label and input via id/htmlFor", () => {
    render(<Checkbox checked={false} label="Linked" id="terms" />);
    const input = screen.getByLabelText("Linked");
    expect(input).toHaveAttribute("id", "terms");
  });
});
