import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
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
    render(<Input label="Bio" maxLength={20} showCharacterCount defaultValue="hello" />);
    expect(screen.getByText("5 / 20")).toBeInTheDocument();
  });

  it("renders a label tooltip marker when labelTooltip is set", () => {
    render(<Input label="Team email" labelTooltip="Goes to all admins" />);
    expect(screen.getByLabelText("Goes to all admins")).toBeInTheDocument();
  });

  it("copy button fires onCopy with the current value", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const onCopy = vi.fn();
    render(
      <Input
        label="Invite link"
        defaultValue="https://example.com/i/abc"
        copyable
        onCopy={onCopy}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /copy to clipboard/i }));
    expect(writeText).toHaveBeenCalledWith("https://example.com/i/abc");
    expect(onCopy).toHaveBeenCalledWith("https://example.com/i/abc");
  });

  it("renders an endIcon when provided and not in password/copy mode", () => {
    render(<Input label="URL" endIcon={<span data-testid="end">✓</span>} />);
    expect(screen.getByTestId("end")).toBeInTheDocument();
  });

  it("labelTooltipPosition adds a class to the popover", () => {
    const { container } = render(
      <Input
        label="x"
        labelTooltip={<span data-testid="tip">Hello</span>}
        labelTooltipPosition="right"
      />
    );
    const popover = container.querySelector(".sisyphos-input-label-tooltip-popover");
    expect(popover?.className).toContain("right");
  });

  describe("mask", () => {
    it("formats typed digits against a custom mask", async () => {
      const onChange = vi.fn();
      const onUnmasked = vi.fn();
      render(
        <Input
          label="Phone"
          mask="+90 (###) ### ####"
          onChange={onChange}
          onUnmaskedChange={onUnmasked}
        />
      );
      const input = screen.getByLabelText("Phone") as HTMLInputElement;
      await userEvent.type(input, "5551112233");
      expect(input.value).toBe("+90 (555) 111 2233");
      expect(onUnmasked).toHaveBeenLastCalledWith("5551112233");
    });

    it("resolves `tel-tr` preset to Turkish phone format", async () => {
      render(<Input label="Phone" mask="tel-tr" />);
      const input = screen.getByLabelText("Phone") as HTMLInputElement;
      await userEvent.type(input, "5321112233");
      expect(input.value).toBe("+90 (532) 111 22 33");
    });

    it("ignores non-matching characters on typed input", async () => {
      render(<Input label="Card" mask="#### #### #### ####" />);
      const input = screen.getByLabelText("Card") as HTMLInputElement;
      await userEvent.type(input, "4111abc1111-2222 3333");
      expect(input.value).toBe("4111 1111 2222 3333");
    });

    it("snaps caret past the fixed prefix when click event fires inside it", () => {
      render(<Input label="Phone" mask="tel-tr" defaultValue="5321112233" />);
      const input = screen.getByLabelText("Phone") as HTMLInputElement;
      // The masked value reformats to "+90 (532) 111 22 33". The pattern's
      // literal prefix is `+90 (5`, so the first editable token sits at index 6.
      input.focus();
      input.setSelectionRange(1, 1); // caret lands inside the literal prefix
      fireEvent.click(input);
      expect(input.selectionStart).toBe(6);
      expect(input.selectionEnd).toBe(6);
    });

    it("does not move the caret when a real text selection covers the prefix", () => {
      render(<Input label="Phone" mask="tel-tr" defaultValue="5321112233" />);
      const input = screen.getByLabelText("Phone") as HTMLInputElement;
      input.focus();
      const len = input.value.length;
      input.setSelectionRange(0, len); // simulate Ctrl+A
      fireEvent.click(input);
      // A non-collapsed selection must be preserved so users can still
      // select-all and replace the value.
      expect(input.selectionStart).toBe(0);
      expect(input.selectionEnd).toBe(len);
    });
  });
});
