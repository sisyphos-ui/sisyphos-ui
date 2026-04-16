import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

describe("Input", () => {
  it("renders with a linked label", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("fires onChange while typing", async () => {
    const onChange = vi.fn();
    render(<Input label="Email" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText("Email"), "hi");
    expect(onChange).toHaveBeenCalled();
  });

  it("renders the error message and sets aria-invalid", () => {
    render(<Input label="Email" error errorMessage="Required" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });

  it("password toggle reveals the value", async () => {
    render(<Input label="Password" type="password" defaultValue="secret" />);
    const input = screen.getByLabelText("Password") as HTMLInputElement;
    expect(input.type).toBe("password");
    await userEvent.click(screen.getByRole("button", { name: /show password/i }));
    expect(input.type).toBe("text");
  });

  it("respects disabled and readOnly", async () => {
    const onChange = vi.fn();
    render(<Input label="x" disabled onChange={onChange} />);
    expect(screen.getByLabelText("x")).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders the character count when maxLength + showCharacterCount", () => {
    render(
      <Input label="Bio" maxLength={20} showCharacterCount defaultValue="hello" />
    );
    expect(screen.getByText("5 / 20")).toBeInTheDocument();
  });
});
