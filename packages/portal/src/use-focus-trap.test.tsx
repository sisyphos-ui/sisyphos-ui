import { describe, it, expect } from "vitest";
import { useRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFocusTrap } from "./use-focus-trap";

function Trap({ active = true }: { active?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, active);
  return (
    <div ref={ref} tabIndex={-1}>
      <button>first</button>
      <button>middle</button>
      <button>last</button>
    </div>
  );
}

describe("useFocusTrap", () => {
  it("focuses the first focusable child on activation", () => {
    render(<Trap />);
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "first" }));
  });

  it("cycles Tab from last → first", async () => {
    render(<Trap />);
    const first = screen.getByRole("button", { name: "first" });
    const last = screen.getByRole("button", { name: "last" });
    last.focus();
    await userEvent.tab();
    expect(document.activeElement).toBe(first);
  });

  it("cycles Shift+Tab from first → last", async () => {
    render(<Trap />);
    const first = screen.getByRole("button", { name: "first" });
    const last = screen.getByRole("button", { name: "last" });
    first.focus();
    await userEvent.tab({ shift: true });
    expect(document.activeElement).toBe(last);
  });

  it("does nothing when disabled", () => {
    const outside = document.createElement("button");
    outside.textContent = "outside";
    document.body.appendChild(outside);
    outside.focus();
    render(<Trap active={false} />);
    // Outside focus is preserved.
    expect(document.activeElement).toBe(outside);
    document.body.removeChild(outside);
  });
});
