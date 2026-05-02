import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders label linked via htmlFor/id", () => {
    render(<Textarea label="Bio" />);
    const ta = screen.getByLabelText("Bio");
    expect(ta).toBeInTheDocument();
  });

  it("fires onChange in controlled mode", async () => {
    const onChange = vi.fn();
    render(<Textarea label="x" value="" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText("x"), "hi");
    expect(onChange).toHaveBeenCalled();
  });

  it("shows character count with maxLength", async () => {
    render(<Textarea label="x" maxLength={10} showCharacterCount defaultValue="abc" />);
    expect(screen.getByText("3 / 10")).toBeInTheDocument();
  });

  it("shows errorMessage + aria-invalid when error", () => {
    render(<Textarea label="x" error errorMessage="Nope" />);
    expect(screen.getByLabelText("x")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Nope");
  });

  it("disabled prevents typing", async () => {
    const onChange = vi.fn();
    render(<Textarea label="x" disabled onChange={onChange} />);
    const ta = screen.getByLabelText("x");
    expect(ta).toBeDisabled();
  });
});
