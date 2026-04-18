import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormControl, FormLabel, FormHelperText, FormErrorText } from "./index";

describe("FormControl", () => {
  it("links label → input via htmlFor and auto-generated id", () => {
    render(
      <FormControl>
        <FormLabel>Email</FormLabel>
        <input type="email" />
        <FormHelperText>We won&apos;t share it.</FormHelperText>
      </FormControl>
    );
    const label = screen.getByText("Email") as HTMLLabelElement;
    expect(label.htmlFor).toBeTruthy();
    expect(label.htmlFor.startsWith("sisyphos-field-")).toBe(true);
  });

  it("respects a user-provided id", () => {
    render(
      <FormControl id="my-field">
        <FormLabel>Email</FormLabel>
      </FormControl>
    );
    const label = screen.getByText("Email") as HTMLLabelElement;
    expect(label.htmlFor).toBe("my-field");
  });

  it("renders the required indicator when `required`", () => {
    const { container } = render(
      <FormControl required>
        <FormLabel>Display name</FormLabel>
      </FormControl>
    );
    const indicator = container.querySelector(".sisyphos-form-label-required");
    expect(indicator).not.toBeNull();
  });

  it("shows FormHelperText when no error is set", () => {
    render(
      <FormControl>
        <FormLabel>Email</FormLabel>
        <FormHelperText>Used for confirmation only.</FormHelperText>
        <FormErrorText>This field is required.</FormErrorText>
      </FormControl>
    );
    expect(screen.getByText("Used for confirmation only.")).toBeInTheDocument();
    expect(screen.queryByText("This field is required.")).not.toBeInTheDocument();
  });

  it("hides helper and shows error when `error` is true", () => {
    render(
      <FormControl error>
        <FormLabel>Email</FormLabel>
        <FormHelperText>Used for confirmation only.</FormHelperText>
        <FormErrorText>This field is required.</FormErrorText>
      </FormControl>
    );
    expect(screen.queryByText("Used for confirmation only.")).not.toBeInTheDocument();
    const err = screen.getByText("This field is required.");
    expect(err).toBeInTheDocument();
    expect(err).toHaveAttribute("role", "alert");
  });

  it("applies error/disabled/full-width className on the root", () => {
    const { container } = render(
      <FormControl error disabled fullWidth>
        <FormLabel>X</FormLabel>
      </FormControl>
    );
    const root = container.querySelector(".sisyphos-form-control");
    expect(root?.className).toContain("error");
    expect(root?.className).toContain("disabled");
    expect(root?.className).toContain("full-width");
  });
});
