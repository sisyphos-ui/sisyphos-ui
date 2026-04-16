import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Avatar } from "./Avatar";
import { AvatarGroup } from "./AvatarGroup";
import { getInitials } from "./initials";

describe("getInitials", () => {
  it("handles empty", () => {
    expect(getInitials(undefined)).toBe("");
    expect(getInitials("")).toBe("");
    expect(getInitials("   ")).toBe("");
  });
  it("uppercases first letters up to max", () => {
    expect(getInitials("Volkan Günay")).toBe("VG");
    expect(getInitials("john")).toBe("J");
    expect(getInitials("a b c d", 3)).toBe("ABC");
  });
});

describe("Avatar", () => {
  it("renders initials from name when no src", () => {
    render(<Avatar name="Volkan Günay" />);
    expect(screen.getByText("VG")).toBeInTheDocument();
  });

  it("renders image when src is provided", () => {
    render(<Avatar src="/a.png" alt="user" name="X" />);
    expect(screen.getByRole("img", { name: "user" })).toBeInTheDocument();
  });

  it("falls back to initials on image error", () => {
    render(<Avatar src="/broken.png" name="Alan Turing" />);
    const img = screen.getByRole("img");
    fireEvent.error(img);
    expect(screen.getByText("AT")).toBeInTheDocument();
  });

  it("respects custom fallback", () => {
    render(<Avatar fallback={<span>🧑</span>} />);
    expect(screen.getByText("🧑")).toBeInTheDocument();
  });
});

describe("AvatarGroup", () => {
  it("renders all when under max", () => {
    render(
      <AvatarGroup max={5}>
        <Avatar name="A A" />
        <Avatar name="B B" />
      </AvatarGroup>
    );
    expect(screen.getByText("AA")).toBeInTheDocument();
    expect(screen.getByText("BB")).toBeInTheDocument();
  });

  it("collapses overflow into +N chip", () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="A A" />
        <Avatar name="B B" />
        <Avatar name="C C" />
        <Avatar name="D D" />
      </AvatarGroup>
    );
    expect(screen.getByText("+2")).toBeInTheDocument();
    expect(screen.queryByText("CC")).not.toBeInTheDocument();
  });
});
