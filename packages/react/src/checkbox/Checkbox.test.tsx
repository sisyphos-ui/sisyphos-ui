import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Checkbox } from "./Checkbox";

describe("Checkbox (React binding over @sisyphos-ui/core controller)", () => {
  it("renders unchecked by default", () => {
    render(<Checkbox checked={false} label="Accept terms" />);
    const input = screen.getByLabelText("Accept terms") as HTMLInputElement;
    expect(input).not.toBeChecked();
  });

  it("reflects the checked prop", () => {
    render(<Checkbox checked label="On" />);
    expect(screen.getByLabelText("On")).toBeChecked();
  });

  it("indeterminate exposes aria-checked='mixed' and the DOM flag", () => {
    render(<Checkbox checked={false} indeterminate label="All" />);
    const input = screen.getByLabelText("All") as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    expect(input).toHaveAttribute("aria-checked", "mixed");
  });

  it("toggle promotes indeterminate to checked=true via the controller", async () => {
    function Wrap() {
      const [v, setV] = useState(false);
      return <Checkbox checked={v} indeterminate={!v} label="All" onChange={setV} />;
    }
    render(<Wrap />);
    const input = screen.getByLabelText("All") as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    await userEvent.click(input);
    expect(input).toBeChecked();
    expect(input.indeterminate).toBe(false);
  });

  it("does not fire onChange when disabled", async () => {
    const onChange = vi.fn();
    render(<Checkbox checked={false} disabled label="x" onChange={onChange} />);
    await userEvent.click(screen.getByLabelText("x"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("forwards the ref to the underlying <input>", () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Checkbox checked={false} label="x" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.type).toBe("checkbox");
  });
});
