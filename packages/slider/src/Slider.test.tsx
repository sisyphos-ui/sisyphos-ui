import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Slider } from "./Slider";

describe("Slider (single)", () => {
  it("renders thumb with role=slider", () => {
    render(<Slider value={30} ariaLabel="Volume" />);
    expect(screen.getByRole("slider", { name: "Volume" })).toHaveAttribute("aria-valuenow", "30");
  });

  it("ArrowRight increments by step", async () => {
    const onChange = vi.fn();
    render(<Slider value={30} step={5} onChange={onChange} ariaLabel="V" />);
    const thumb = screen.getByRole("slider");
    thumb.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith(35);
  });

  it("Home/End jump to bounds", async () => {
    const onChange = vi.fn();
    render(<Slider value={50} min={0} max={100} onChange={onChange} ariaLabel="V" />);
    const thumb = screen.getByRole("slider");
    thumb.focus();
    await userEvent.keyboard("{Home}");
    expect(onChange).toHaveBeenCalledWith(0);
    await userEvent.keyboard("{End}");
    expect(onChange).toHaveBeenLastCalledWith(100);
  });

  it("disabled has tabIndex -1", () => {
    render(<Slider value={50} disabled ariaLabel="V" />);
    expect(screen.getByRole("slider")).toHaveAttribute("tabindex", "-1");
  });
});

describe("Slider (range)", () => {
  it("renders two thumbs with correct labels", () => {
    render(<Slider range value={[10, 70]} ariaLabel={["From", "To"]} />);
    expect(screen.getByRole("slider", { name: "From" })).toHaveAttribute("aria-valuenow", "10");
    expect(screen.getByRole("slider", { name: "To" })).toHaveAttribute("aria-valuenow", "70");
  });

  it("respects minGap when moving thumbs", async () => {
    const onChange = vi.fn();
    render(
      <Slider range value={[40, 50]} minGap={10} step={1} onChange={onChange} ariaLabel={["A", "B"]} />
    );
    const left = screen.getByRole("slider", { name: "A" });
    left.focus();
    await userEvent.keyboard("{ArrowRight}");
    // Tries 41, but maxAllowed = 50 - 10 = 40 → no change
    expect(onChange).not.toHaveBeenCalled();
  });
});
