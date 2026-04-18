import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { mergeRefs } from "./merge-refs";

describe("mergeRefs", () => {
  it("forwards the node to both refs", () => {
    const internal = { current: null as HTMLDivElement | null };
    const external = createRef<HTMLDivElement>();
    const el = document.createElement("div");

    mergeRefs(internal, external)(el);

    expect(internal.current).toBe(el);
    expect(external.current).toBe(el);
  });

  it("supports a callback ref as the forwarded ref", () => {
    const internal = { current: null as HTMLDivElement | null };
    const external = vi.fn();
    const el = document.createElement("div");

    mergeRefs(internal, external)(el);

    expect(internal.current).toBe(el);
    expect(external).toHaveBeenCalledWith(el);
  });

  it("tolerates a null forwarded ref", () => {
    const internal = { current: null as HTMLDivElement | null };
    const el = document.createElement("div");
    expect(() => mergeRefs(internal, null)(el)).not.toThrow();
    expect(internal.current).toBe(el);
  });
});
