import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "./Spinner";
import { LoadingOverlay } from "./LoadingOverlay";

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

  it("applies thickness via border-width", () => {
    render(<Spinner thickness={5} />);
    expect(screen.getByRole("status")).toHaveStyle({ borderWidth: "5px" });
  });
});

describe("LoadingOverlay", () => {
  it("renders text", () => {
    render(<LoadingOverlay variant="inline" text="Saving" />);
    expect(screen.getByText("Saving")).toBeInTheDocument();
  });

  it("returns null when closed", () => {
    const { container } = render(<LoadingOverlay open={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("replaces default spinner with custom icon", () => {
    render(<LoadingOverlay variant="inline" icon={<div data-testid="brand" />} />);
    expect(screen.getByTestId("brand")).toBeInTheDocument();
  });
});
