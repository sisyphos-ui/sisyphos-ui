import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Kbd } from "./Kbd";

describe("Kbd", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders children inside a single <kbd> when no keys/shortcut", () => {
    render(<Kbd>Esc</Kbd>);
    const el = screen.getByText("Esc");
    expect(el.tagName).toBe("KBD");
  });

  it("renders each key in its own <kbd> when `keys` is provided", () => {
    const { container } = render(<Kbd keys={["cmd", "k"]} />);
    const keys = container.querySelectorAll("kbd");
    expect(keys).toHaveLength(2);
    expect(keys[0].textContent).toBe("⌘");
    expect(keys[1].textContent).toBe("K");
  });

  it("parses `shortcut` on `+` and whitespace", () => {
    const { container } = render(<Kbd shortcut="ctrl+shift+p" />);
    const keys = container.querySelectorAll("kbd");
    expect(keys).toHaveLength(3);
    expect(keys[0].textContent).toBe("⌃");
    expect(keys[1].textContent).toBe("⇧");
    expect(keys[2].textContent).toBe("P");
  });

  it("resolves `mod` to ⌘ on mac and ⌃ elsewhere", () => {
    vi.stubGlobal("navigator", { platform: "MacIntel" });
    const mac = render(<Kbd shortcut="mod+s" />);
    expect(mac.container.querySelector("kbd")?.textContent).toBe("⌘");
    mac.unmount();

    vi.stubGlobal("navigator", { platform: "Win32" });
    const win = render(<Kbd shortcut="mod+s" />);
    expect(win.container.querySelector("kbd")?.textContent).toBe("⌃");
  });

  it("wraps multi-key render with role=group", () => {
    render(<Kbd keys={["cmd", "k"]} aria-label="Open command menu" />);
    expect(screen.getByRole("group", { name: "Open command menu" })).toBeInTheDocument();
  });

  it("renders separator node between keys when provided", () => {
    const { container } = render(<Kbd keys={["cmd", "k"]} separator="+" />);
    const sep = container.querySelector(".sisyphos-kbd-separator");
    expect(sep?.textContent).toBe("+");
  });

  it("omits separator when not provided", () => {
    const { container } = render(<Kbd keys={["cmd", "k"]} />);
    expect(container.querySelector(".sisyphos-kbd-separator")).toBeNull();
  });

  it("uppercases single-letter keys, preserves unknown multi-char tokens", () => {
    const { container } = render(<Kbd keys={["a", "F1", "Fn"]} />);
    const keys = container.querySelectorAll("kbd");
    expect(keys[0].textContent).toBe("A");
    expect(keys[1].textContent).toBe("F1");
    expect(keys[2].textContent).toBe("Fn");
  });

  it("resolves multi-char aliases (Home, pageup) to glyphs", () => {
    const { container } = render(<Kbd keys={["Home", "pageup"]} />);
    const keys = container.querySelectorAll("kbd");
    expect(keys[0].textContent).toBe("↖");
    expect(keys[1].textContent).toBe("⇞");
  });
});
