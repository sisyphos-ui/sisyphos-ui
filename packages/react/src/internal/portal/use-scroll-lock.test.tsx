import { describe, it, expect, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { useScrollLock } from "./use-scroll-lock";

function Harness({ active = true }: { active?: boolean }) {
  useScrollLock(active);
  return null;
}

describe("useScrollLock", () => {
  afterEach(() => {
    // Reset inline styles between tests so a failing test doesn't cascade.
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  });

  it("locks body overflow while mounted", () => {
    const { unmount } = render(<Harness />);
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("does not lock when `active` is false", () => {
    const { unmount } = render(<Harness active={false} />);
    expect(document.body.style.overflow).toBe("");
    unmount();
  });

  it("reference-counts nested locks so the innermost unmount doesn't unlock", () => {
    const outer = render(<Harness />);
    const inner = render(<Harness />);
    expect(document.body.style.overflow).toBe("hidden");
    inner.unmount();
    expect(document.body.style.overflow).toBe("hidden");
    outer.unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
