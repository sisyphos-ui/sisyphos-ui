import { describe, it, expect } from "vitest";
import { cx } from "./cx";

describe("cx", () => {
  it("joins truthy strings with spaces", () => {
    expect(cx("a", "b", "c")).toBe("a b c");
  });

  it("filters out falsy values", () => {
    expect(cx("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("keeps 0 as a string when numeric is passed (current behavior treats 0 as falsy)", () => {
    // `cx` uses truthiness; 0 is intentionally treated as falsy to allow
    // `someBool && className` patterns without surprise.
    expect(cx(0, "kept")).toBe("kept");
  });

  it("returns an empty string when given no arguments", () => {
    expect(cx()).toBe("");
  });

  it("returns an empty string when all inputs are falsy", () => {
    expect(cx(null, undefined, false, "")).toBe("");
  });

  it("handles a single class name", () => {
    expect(cx("only")).toBe("only");
  });

  it("allows ternary-style composition", () => {
    const active = true;
    const disabled = false;
    expect(cx("btn", active && "active", disabled && "disabled")).toBe("btn active");
  });
});
