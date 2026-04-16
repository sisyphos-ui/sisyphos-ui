import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NumberInput } from "./NumberInput";

describe("NumberInput", () => {
  it("renders label and initial value", () => {
    render(<NumberInput label="Q" defaultValue={5} />);
    expect(screen.getByLabelText("Q")).toHaveValue("5");
  });

  it("increments via stepper", async () => {
    const onChange = vi.fn();
    render(<NumberInput label="Q" value={3} onChange={onChange} step={2} />);
    await userEvent.click(screen.getByRole("button", { name: "Increment" }));
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it("decrements with min boundary", async () => {
    const onChange = vi.fn();
    render(<NumberInput label="Q" value={1} onChange={onChange} min={1} />);
    const dec = screen.getByRole("button", { name: "Decrement" });
    expect(dec).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("clamps to max on input", async () => {
    const onChange = vi.fn();
    render(<NumberInput label="Q" value={0} onChange={onChange} max={100} />);
    const input = screen.getByLabelText("Q");
    await userEvent.clear(input);
    await userEvent.type(input, "999");
    expect(onChange).toHaveBeenLastCalledWith(100);
  });

  it("formats value on blur using locale", async () => {
    const onChange = vi.fn();
    render(<NumberInput label="Q" value={1234} onChange={onChange} locale="tr-TR" />);
    const input = screen.getByLabelText("Q") as HTMLInputElement;
    expect(input.value).toBe("1.234");
  });

  it("renders suffix slot", () => {
    render(<NumberInput label="Amount" defaultValue={0} suffix="₺" />);
    expect(screen.getByText("₺")).toBeInTheDocument();
  });

  it("withStepper=false hides buttons", () => {
    render(<NumberInput label="Q" defaultValue={0} withStepper={false} />);
    expect(screen.queryByRole("button", { name: "Increment" })).not.toBeInTheDocument();
  });
});
