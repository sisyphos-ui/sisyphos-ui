/**
 * Avatar tests — DOM-render coverage via the @Input setter+signal hybrid.
 * Mirrors the React/Vue suite: same name-input → initials, same fallback
 * order (slot → fallback prop → initials), same image-error → fallback flow.
 */
import { describe, it, expect } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Avatar } from "./avatar.component";
import { getInitials } from "./initials";

function setup(props: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(Avatar);
  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined) fixture.componentRef.setInput(key, value);
  }
  fixture.detectChanges();
  const root = fixture.nativeElement.querySelector(".sisyphos-avatar") as HTMLElement;
  const image = fixture.nativeElement.querySelector(".sisyphos-avatar-image") as HTMLImageElement | null;
  const fallback = fixture.nativeElement.querySelector(
    ".sisyphos-avatar-fallback"
  ) as HTMLElement | null;
  return { fixture, root, image, fallback };
}

describe("getInitials", () => {
  it("returns up to N uppercase initials", () => {
    expect(getInitials("Volkan Günay", 2)).toBe("VG");
    expect(getInitials("John", 2)).toBe("J");
    expect(getInitials("Ada Augusta Lovelace", 3)).toBe("AAL");
  });

  it("trims whitespace and ignores empty parts", () => {
    expect(getInitials("  spaced  out  ", 2)).toBe("SO");
    expect(getInitials("   ", 2)).toBe("");
    expect(getInitials("", 2)).toBe("");
  });

  it("handles nullish input", () => {
    expect(getInitials(undefined)).toBe("");
    expect(getInitials(null)).toBe("");
  });

  it("respects the max parameter", () => {
    expect(getInitials("Ada Augusta Lovelace", 1)).toBe("A");
    expect(getInitials("Ada Augusta Lovelace", 5)).toBe("AAL");
  });

  it("default max is 2", () => {
    expect(getInitials("Ada Augusta Lovelace")).toBe("AA");
  });
});

describe("Avatar (Angular)", () => {
  it("renders the root element with default classes", () => {
    const { root } = setup();
    expect(root).toBeTruthy();
    expect(root.className).toContain("md");
    expect(root.className).toContain("neutral");
    expect(root.className).toContain("circular");
  });

  it("falls back when no src is set, showing the fallback span", () => {
    const { image, fallback } = setup({ name: "Ada" });
    expect(image).toBeNull();
    expect(fallback).toBeTruthy();
    expect(fallback?.textContent?.trim()).toBe("A");
  });

  it("renders initials derived from name in the fallback", () => {
    const { fallback } = setup({ name: "Ada Lovelace" });
    expect(fallback?.textContent?.trim()).toBe("AL");
  });

  it("renders the explicit fallback prop over derived initials", () => {
    const { fallback } = setup({ name: "Ada Lovelace", fallback: "👩" });
    expect(fallback?.textContent?.trim()).toBe("👩");
  });

  it("renders <img> when src is provided", () => {
    const { image, fallback } = setup({ src: "https://example.com/x.png", name: "Ada" });
    expect(image).toBeTruthy();
    expect(image?.src).toBe("https://example.com/x.png");
    expect(fallback).toBeNull();
  });

  it("alt falls back to name when alt is omitted", () => {
    const { image } = setup({ src: "https://example.com/x.png", name: "Ada Lovelace" });
    expect(image?.alt).toBe("Ada Lovelace");
  });

  it("alt prefers explicit alt over name", () => {
    const { image } = setup({
      src: "https://example.com/x.png",
      name: "Ada",
      alt: "Avatar of Ada",
    });
    expect(image?.alt).toBe("Avatar of Ada");
  });

  it("on <img> error, falls back to the initials view", () => {
    const { fixture, image } = setup({ src: "https://example.com/x.png", name: "Ada" });
    image?.dispatchEvent(new Event("error"));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".sisyphos-avatar-image")).toBeNull();
    const fallback = fixture.nativeElement.querySelector(
      ".sisyphos-avatar-fallback"
    ) as HTMLElement;
    expect(fallback.textContent?.trim()).toBe("A");
  });

  it("applies size + color + shape classes to the root", () => {
    const { root } = setup({ size: "lg", color: "primary", shape: "rounded" });
    expect(root.className).toContain("lg");
    expect(root.className).toContain("primary");
    expect(root.className).toContain("rounded");
  });

  it("aria-label is set from alt or name on the fallback span", () => {
    const { fallback } = setup({ name: "Ada Lovelace" });
    expect(fallback?.getAttribute("aria-label")).toBe("Ada Lovelace");
  });
});
