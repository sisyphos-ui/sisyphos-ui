import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders title and description", () => {
    render(<Alert title="Hi" description="World" />);
    expect(screen.getByText("Hi")).toBeInTheDocument();
    expect(screen.getByText("World")).toBeInTheDocument();
  });

  it("uses role=alert for error color", () => {
    render(<Alert color="error" title="Oops" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("uses role=status for non-error", () => {
    render(<Alert color="success" title="Done" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("close button fires onClose", async () => {
    const onClose = vi.fn();
    render(<Alert title="x" onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("icon=null hides default icon", () => {
    const { container } = render(<Alert color="success" title="x" icon={null} />);
    expect(container.querySelector(".sisyphos-alert-icon")).toBeNull();
  });

  describe("autoCloseDuration", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("fires onClose after the duration elapses", () => {
      const onClose = vi.fn();
      render(<Alert title="x" onClose={onClose} autoCloseDuration={1000} />);
      expect(onClose).not.toHaveBeenCalled();
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("no-op when onClose is missing", () => {
      // Should just render without scheduling a timer — no crash.
      render(<Alert title="x" autoCloseDuration={500} />);
      act(() => {
        vi.advanceTimersByTime(500);
      });
      // If we got here without throwing, the effect correctly short-circuited.
      expect(screen.getByText("x")).toBeInTheDocument();
    });
  });
});
