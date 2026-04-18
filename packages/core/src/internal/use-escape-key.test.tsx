import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEscapeKey } from "./use-escape-key";

function Harness({
  onEscape,
  enabled = true,
}: {
  onEscape: (e: KeyboardEvent) => void;
  enabled?: boolean;
}) {
  useEscapeKey(onEscape, enabled);
  return null;
}

describe("useEscapeKey", () => {
  it("calls the handler when Escape is pressed", async () => {
    const fn = vi.fn();
    render(<Harness onEscape={fn} />);
    await userEvent.keyboard("{Escape}");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("does not call the handler for other keys", async () => {
    const fn = vi.fn();
    render(<Harness onEscape={fn} />);
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("a");
    expect(fn).not.toHaveBeenCalled();
  });

  it("does not subscribe when `enabled` is false", async () => {
    const fn = vi.fn();
    render(<Harness onEscape={fn} enabled={false} />);
    await userEvent.keyboard("{Escape}");
    expect(fn).not.toHaveBeenCalled();
  });

  it("unsubscribes on unmount", async () => {
    const fn = vi.fn();
    const { unmount } = render(<Harness onEscape={fn} />);
    unmount();
    await userEvent.keyboard("{Escape}");
    expect(fn).not.toHaveBeenCalled();
  });
});
