import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster } from "./Toaster";
import { toast, toastStore } from "./store";

describe("toast store + Toaster", () => {
  beforeEach(() => {
    toastStore.clear();
  });
  afterEach(() => {
    toastStore.clear();
  });

  it("renders a queued toast", async () => {
    render(<Toaster />);
    act(() => {
      toast("Hello world");
    });
    expect(await screen.findByText("Hello world")).toBeInTheDocument();
  });

  it("renders success variant with role=status", async () => {
    render(<Toaster />);
    act(() => {
      toast.success("Saved");
    });
    await screen.findByText("Saved");
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("error uses role=alert + aria-live=assertive", async () => {
    render(<Toaster />);
    act(() => {
      toast.error("Boom");
    });
    await screen.findByText("Boom");
    const el = screen.getByRole("alert");
    expect(el).toHaveAttribute("aria-live", "assertive");
  });

  it("dismiss button removes toast", async () => {
    render(<Toaster />);
    act(() => {
      toast("x");
    });
    await screen.findByText("x");
    await userEvent.click(screen.getByRole("button", { name: "Dismiss notification" }));
    await waitFor(() => expect(screen.queryByText("x")).not.toBeInTheDocument());
  });

  it("auto-dismisses after duration", async () => {
    render(<Toaster />);
    act(() => {
      toast("auto", { duration: 100 });
    });
    await screen.findByText("auto");
    await waitFor(
      () => expect(screen.queryByText("auto")).not.toBeInTheDocument(),
      { timeout: 1500 }
    );
  });

  it("toast.dismiss(id) removes by id and fires onDismiss", () => {
    render(<Toaster />);
    const onDismiss = vi.fn();
    let id = "";
    act(() => {
      id = toast("x", { onDismiss });
    });
    act(() => {
      toast.dismiss(id);
    });
    expect(onDismiss).toHaveBeenCalledWith(id);
  });

  it("max limits visible toasts", async () => {
    render(<Toaster max={2} />);
    act(() => {
      toast("a", { duration: Infinity });
      toast("b", { duration: Infinity });
      toast("c", { duration: Infinity });
    });
    await screen.findByText("c");
    expect(screen.getByText("b")).toBeInTheDocument();
    expect(screen.queryByText("a")).not.toBeInTheDocument();
  });
});
