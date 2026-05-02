import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("has role=status and default aria-label", () => {
    render(<Spinner />);
    const s = screen.getByRole("status");
    expect(s).toHaveAccessibleName("Loading");
  });

  it("accepts custom label", () => {
    render(<Spinner label="Please wait" />);
    expect(screen.getByRole("status")).toHaveAccessibleName("Please wait");
  });

  it("exposes thickness as a CSS custom property", () => {
    render(<Spinner thickness={5} />);
    const style = screen.getByRole("status").getAttribute("style") ?? "";
    expect(style).toContain("--sisyphos-spinner-thickness: 5px");
  });

  it("renders an inline SVG arc (not a bordered div)", () => {
    render(<Spinner />);
    const el = screen.getByRole("status");
    expect(el.querySelector("svg")).not.toBeNull();
    expect(el.querySelector("circle")).not.toBeNull();
  });

  it("double variant renders two SVGs", () => {
    render(<Spinner variant="double" />);
    const el = screen.getByRole("status");
    expect(el.querySelectorAll("svg")).toHaveLength(2);
  });
});
