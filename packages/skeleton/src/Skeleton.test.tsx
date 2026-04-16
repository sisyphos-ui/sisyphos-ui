import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "./Skeleton";
import { SkeletonText } from "./SkeletonText";

describe("Skeleton", () => {
  it("renders with aria-hidden", () => {
    render(<Skeleton width={100} height={20} />);
    const el = screen.getByTestId("sisyphos-skeleton");
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("applies width/height", () => {
    render(<Skeleton width={123} height={45} />);
    expect(screen.getByTestId("sisyphos-skeleton")).toHaveStyle({
      width: "123px",
      height: "45px",
    });
  });

  it("circular shape gets 50% radius", () => {
    render(<Skeleton shape="circular" width={40} height={40} />);
    expect(screen.getByTestId("sisyphos-skeleton")).toHaveStyle({ borderRadius: "50%" });
  });
});

describe("SkeletonText", () => {
  it("renders the requested number of lines", () => {
    render(<SkeletonText lines={4} data-testid="st" />);
    expect(screen.getAllByTestId("sisyphos-skeleton")).toHaveLength(4);
  });

  it("narrows the last line by default", () => {
    render(<SkeletonText lines={2} />);
    const lines = screen.getAllByTestId("sisyphos-skeleton");
    expect(lines[1]).toHaveStyle({ width: "60%" });
  });
});
