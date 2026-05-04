import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Portal } from "./Portal";

describe("Portal", () => {
  it("mounts children into document.body by default", () => {
    const { queryByTestId } = render(
      <div>
        <Portal>
          <span data-testid="child">hello</span>
        </Portal>
      </div>
    );
    const child = queryByTestId("child");
    expect(child).toBeInTheDocument();
    // Portals attach under document.body, not the test container.
    expect(child?.closest("body")).toBe(document.body);
  });

  it("mounts into a specific element container", () => {
    const host = document.createElement("div");
    host.setAttribute("data-host", "1");
    document.body.appendChild(host);
    const { queryByTestId } = render(
      <Portal container={host}>
        <span data-testid="child">inside host</span>
      </Portal>
    );
    expect(host.contains(queryByTestId("child"))).toBe(true);
    document.body.removeChild(host);
  });

  it("mounts into a selector container", () => {
    const host = document.createElement("div");
    host.id = "my-host";
    document.body.appendChild(host);
    const { queryByTestId } = render(
      <Portal container="#my-host">
        <span data-testid="child">via selector</span>
      </Portal>
    );
    expect(host.contains(queryByTestId("child"))).toBe(true);
    document.body.removeChild(host);
  });

  it("renders null when the selector matches nothing (no crash)", () => {
    const { queryByTestId } = render(
      <Portal container="#does-not-exist">
        <span data-testid="child">nope</span>
      </Portal>
    );
    expect(queryByTestId("child")).not.toBeInTheDocument();
  });
});
