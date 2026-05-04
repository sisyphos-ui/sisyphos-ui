import { describe, it, expect } from "vitest";
import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { Kbd } from "./kbd.component";
import { normalizeKey, parseShortcut } from "./glyphs";

describe("Kbd helpers", () => {
  it("parseShortcut splits on + and whitespace", () => {
    expect(parseShortcut("cmd+k")).toEqual(["cmd", "k"]);
    expect(parseShortcut("ctrl shift p")).toEqual(["ctrl", "shift", "p"]);
    expect(parseShortcut("cmd + shift + p")).toEqual(["cmd", "shift", "p"]);
  });

  it("normalizeKey maps aliases to glyphs", () => {
    expect(normalizeKey("cmd", true)).toBe("⌘");
    expect(normalizeKey("ctrl", false)).toBe("⌃");
    expect(normalizeKey("shift", false)).toBe("⇧");
    expect(normalizeKey("enter", false)).toBe("↵");
  });

  it("normalizeKey resolves mod by platform", () => {
    expect(normalizeKey("mod", true)).toBe("⌘");
    expect(normalizeKey("mod", false)).toBe("⌃");
  });

  it("uppercases single letters", () => {
    expect(normalizeKey("k", false)).toBe("K");
  });

  it("preserves multi-char tokens like F1 / Home", () => {
    expect(normalizeKey("F1", false)).toBe("F1");
    expect(normalizeKey("PageUp", false)).toBe("⇞"); // alias matches case-insensitively
  });
});

describe("Kbd (Angular)", () => {
  function setup(props: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Kbd);
    for (const [key, value] of Object.entries(props)) {
      if (value !== undefined) fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    return fixture;
  }

  it("renders a single <kbd> with default classes when no keys provided", () => {
    const fixture = setup();
    const root = fixture.nativeElement.querySelector("kbd") as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.className).toContain("sisyphos-kbd");
    expect(root.className).toContain("outlined");
    expect(root.className).toContain("sm");
  });

  it("keys array renders one <kbd> per key inside a group", () => {
    const fixture = setup({ keys: ["cmd", "k"] });
    const group = fixture.nativeElement.querySelector("[role=group]") as HTMLElement;
    expect(group).toBeTruthy();
    const kbds = group.querySelectorAll(".sisyphos-kbd-key");
    expect(kbds.length).toBe(2);
  });

  it("shortcut string is parsed into keys", () => {
    const fixture = setup({ shortcut: "ctrl+shift+p" });
    const kbds = fixture.nativeElement.querySelectorAll(".sisyphos-kbd-key");
    expect(kbds.length).toBe(3);
  });

  it("renders separator between keys when provided", () => {
    const fixture = setup({ keys: ["cmd", "k"], separator: "+" });
    const seps = fixture.nativeElement.querySelectorAll(".sisyphos-kbd-separator");
    expect(seps.length).toBe(1); // only between the two keys
    expect(seps[0].textContent).toBe("+");
  });

  it("no separator by default — keys render visually joined", () => {
    const fixture = setup({ keys: ["cmd", "k"] });
    const seps = fixture.nativeElement.querySelectorAll(".sisyphos-kbd-separator");
    expect(seps.length).toBe(0);
  });

  it("applies size + variant on the root", () => {
    const fixture = setup({ keys: ["cmd"], size: "lg", variant: "soft" });
    const root = fixture.nativeElement.querySelector("[role=group]") as HTMLElement;
    expect(root.className).toContain("lg");
    expect(root.className).toContain("soft");
  });

  it("free-form children render in a single <kbd>", () => {
    @Component({
      standalone: true,
      imports: [Kbd],
      template: `<sui-kbd>FREE</sui-kbd>`,
    })
    class Host {}
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const kbd = fixture.nativeElement.querySelector("kbd") as HTMLElement;
    expect(kbd.textContent?.trim()).toBe("FREE");
  });
});
